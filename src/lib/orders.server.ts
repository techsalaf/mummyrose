import { getRequestHeader } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import type { CheckoutInput } from "./schemas";
import { quoteShipping, type ShippingConfig } from "./shipping";

type Item = CheckoutInput["items"][number];

export function generateOrderNumber() {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `MR-${stamp}-${rand}`;
}

/** Resolves the signed-in user from the bearer token, if the checkout was authenticated. */
export async function resolveUserId(): Promise<string | null> {
  try {
    const header = getRequestHeader("authorization");
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return null;
    const url = (typeof process !== "undefined" ? process.env?.SUPABASE_URL || process.env?.VITE_SUPABASE_URL : undefined) || "https://dezgbfewaprhxfhnbtqp.supabase.co";
    const key = (typeof process !== "undefined" ? process.env?.SUPABASE_SERVICE_ROLE_KEY || process.env?.SUPABASE_PUBLISHABLE_KEY : undefined) || "sb_publishable_ABDiKOfAfzJYEaf9MAPtgw_ux8asbLh";
    const client = createClient(url, key, {

      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data } = await client.auth.getUser(token);
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

export async function getShippingConfig(): Promise<ShippingConfig> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("site_settings").select("value").eq("key", "shipping").maybeSingle();
  return (data?.value ?? {}) as ShippingConfig;
}

export type CreatedOrder = {
  id: string;
  order_number: string;
  subtotal: number;
  discount_amount: number;
  coupon_code: string | null;
  shipping_fee: number;
  shipping_zone: string;
  total: number;
  payment_provider: string;
  items: { product_name: string; variant: string | null; quantity: number; unit_price: number }[];
};


/** Creates the order server-side, pricing every line from the database. */
export async function createOrder(input: CheckoutInput, userId: string | null): Promise<CreatedOrder> {
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

  let discountPercent = 0;
  let wholesaleAccountId: string | null = null;
  if (input.order_type === "wholesale" && input.wholesale_account_id && userId) {
    const { data: account } = await supabaseAdmin
      .from("wholesale_accounts")
      .select("id,discount_percent,status,user_id")
      .eq("id", input.wholesale_account_id)
      .maybeSingle();
    if (account && account.status === "approved" && account.user_id === userId) {
      discountPercent = Number(account.discount_percent ?? 0);
      wholesaleAccountId = account.id;
    }
  }

  if (discountPercent > 0) {
    for (const line of lines) {
      line.unit_price = Number((line.unit_price * (1 - discountPercent / 100)).toFixed(2));
      line.line_total = Number((line.unit_price * line.quantity).toFixed(2));
    }
  }

  const subtotal = lines.reduce((sum, l) => sum + l.line_total, 0);
  const shippingConfig = await getShippingConfig();
  const quote = quoteShipping(shippingConfig, {
    subtotal,
    state: input.state,
    country: input.country,
  });

  // Coupons are re-validated here so a tampered client cannot invent a discount.
  let couponCode: string | null = null;
  let discountAmount = 0;
  if (input.coupon_code && input.order_type !== "wholesale") {
    const { validateCoupon } = await import("./coupons.server");
    const coupon = await validateCoupon(input.coupon_code, subtotal);
    couponCode = coupon.code;
    discountAmount = coupon.discount;
  }

  const total = Number(Math.max(0, subtotal - discountAmount + quote.fee).toFixed(2));

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
      shipping_fee: quote.fee,
      coupon_code: couponCode,
      discount_amount: discountAmount,
      total,
      payment_provider: input.payment_provider,
      payment_status: "unpaid",
      status: "pending",
      order_type: wholesaleAccountId ? "wholesale" : "retail",
      discount_percent: discountPercent,
      wholesale_account_id: wholesaleAccountId,
    })
    .select("id,order_number,total,subtotal,shipping_fee,discount_amount,coupon_code")
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

  if (couponCode) {
    const { redeemCoupon } = await import("./coupons.server");
    await redeemCoupon(couponCode);
  }

  const createdOrder = {
    id: order.id,
    order_number: order.order_number,
    subtotal: Number(order.subtotal),
    discount_amount: Number(order.discount_amount ?? 0),
    coupon_code: order.coupon_code ?? null,
    shipping_fee: Number(order.shipping_fee),
    shipping_zone: quote.zone,
    total: Number(order.total),
    payment_provider: input.payment_provider,
    items: lines.map((l) => ({
      product_name: l.product_name,
      variant: l.variant,
      quantity: l.quantity,
      unit_price: l.unit_price,
    })),
  };

  const fullAddress = `${input.address_line}, ${input.city}, ${input.state}, ${input.country}`;
  import("./email.server")
    .then(({ sendOrderNotificationEmails }) => {
      sendOrderNotificationEmails(createdOrder, input.customer_email, input.customer_name, fullAddress).catch(
        console.error,
      );
    })
    .catch(() => {});

  return createdOrder;
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
