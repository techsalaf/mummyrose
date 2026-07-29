import type { CheckoutInput } from "./schemas";

type Item = CheckoutInput["items"][number];

export function generateOrderNumber() {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `MR-${stamp}-${rand}`;
}

export function shippingFeeFor(subtotal: number, config: { flat_fee?: number; free_over?: number }) {
  const flat = Number(config.flat_fee ?? 2500);
  const freeOver = Number(config.free_over ?? 50000);
  return subtotal >= freeOver ? 0 : flat;
}

/** Creates the order server-side, pricing every line from the database. */
export async function createOrder(input: CheckoutInput, userId: string | null) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const ids = [...new Set(input.items.map((i) => i.product_id))];
  const { data: products, error: productError } = await supabaseAdmin
    .from("products")
    .select("id,name,price,discount_price,stock_quantity,is_active")
    .in("id", ids);
  if (productError) throw new Error(productError.message);

  const byId = new Map((products ?? []).map((p) => [p.id, p]));
  const lines = input.items.map((item: Item) => {
    const product = byId.get(item.product_id);
    if (!product || !product.is_active) throw new Error("One of the products is no longer available.");
    if (product.stock_quantity < item.quantity) {
      throw new Error(`Only ${product.stock_quantity} units of ${product.name} are in stock.`);
    }
    const price = Number(product.price);
    const discount = product.discount_price == null ? null : Number(product.discount_price);
    const unit = discount != null && discount > 0 && discount < price ? discount : price;
    return {
      product_id: product.id,
      product_name: product.name,
      variant: item.variant ?? null,
      unit_price: unit,
      quantity: item.quantity,
      line_total: Number((unit * item.quantity).toFixed(2)),
      remaining: product.stock_quantity - item.quantity,
    };
  });

  const subtotal = lines.reduce((sum, l) => sum + l.line_total, 0);
  const { data: shippingSetting } = await supabaseAdmin
    .from("site_settings")
    .select("value")
    .eq("key", "shipping")
    .maybeSingle();
  const shipping = shippingFeeFor(subtotal, (shippingSetting?.value ?? {}) as Record<string, number>);

  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .insert({
      order_number: generateOrderNumber(),
      user_id: userId,
      customer_name: input.customer_name,
      customer_email: input.customer_email,
      customer_phone: input.customer_phone,
      address_line: input.address_line,
      city: input.city,
      state: input.state,
      country: input.country,
      postal_code: input.postal_code ?? null,
      notes: input.notes ?? null,
      subtotal,
      shipping_fee: shipping,
      total: subtotal + shipping,
      payment_provider: input.payment_provider,
      payment_status: "unpaid",
      status: "pending",
    })
    .select("id,order_number,total,subtotal,shipping_fee")
    .single();
  if (orderError || !order) throw new Error(orderError?.message ?? "Could not create order.");

  const { error: itemsError } = await supabaseAdmin.from("order_items").insert(
    lines.map((l) => ({
      order_id: order.id,
      product_id: l.product_id,
      product_name: l.product_name,
      variant: l.variant,
      unit_price: l.unit_price,
      quantity: l.quantity,
      line_total: l.line_total,
    })),
  );
  if (itemsError) throw new Error(itemsError.message);

  for (const line of lines) {
    await supabaseAdmin.from("products").update({ stock_quantity: line.remaining }).eq("id", line.product_id);
    await supabaseAdmin.from("inventory_logs").insert({
      product_id: line.product_id,
      change: -line.quantity,
      reason: `Order ${order.order_number}`,
    });
  }

  return {
    order_number: order.order_number,
    subtotal: Number(order.subtotal),
    shipping_fee: Number(order.shipping_fee),
    total: Number(order.total),
  };
}

export async function lookupOrder(orderNumber: string, email: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(
      "order_number,customer_name,customer_email,status,payment_status,payment_provider,subtotal,shipping_fee,total,created_at,address_line,city,state,country,order_items(product_name,variant,quantity,unit_price,line_total)",
    )
    .eq("order_number", orderNumber)
    .ilike("customer_email", email)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}
