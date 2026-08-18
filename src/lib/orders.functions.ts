import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { checkoutSchema } from "./schemas";
import { createOrder, lookupOrder, resolveUserId, getShippingConfig } from "./orders.server";
import { initPaystack, initFlutterwave } from "./payments.server";
import { quoteShipping } from "./shipping";

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => checkoutSchema.parse(data))
  .handler(async ({ data }) => {
    const userId = await resolveUserId();
    const order = await createOrder(data, userId);

    if (data.payment_provider === "paystack" || data.payment_provider === "flutterwave") {
      const origin = data.origin ?? "";
      const init =
        data.payment_provider === "paystack"
          ? await initPaystack(order, data.customer_email, origin)
          : await initFlutterwave(
              order,
              { email: data.customer_email, name: data.customer_name, phone: data.customer_phone },
              origin,
            );
      return { order, redirect_url: init.kind === "redirect" ? init.url : null };
    }

    return { order, redirect_url: null };
  });

export const trackOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ order_number: z.string().trim().min(4).max(40), email: z.string().trim().email() }).parse(data),
  )
  .handler(async ({ data }) => {
    return await lookupOrder(data.order_number, data.email);
  });

/**
 * Staff/admin order status updates with business-integrity rules. Prefer this
 * over a raw `orders` UPDATE from the browser so we can:
 *   - restore reserved stock automatically when an order is cancelled/failed,
 *   - require an Admin (and audit-log) any manual "paid"/"refunded" change,
 *   - record every status transition in the audit log.
 */
export const adminUpdateOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.string().trim().max(40).optional().nullable(),
        payment_status: z.string().trim().max(40).optional().nullable(),
        notes: z.string().trim().max(1000).optional().nullable(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { requirePermission, logAudit, restoreOrderStock } = await import("./orders.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const actor = await requirePermission("orders.update");
    const markingPaidOrRefunded = data.payment_status === "paid" || data.payment_status === "refunded";
    if (markingPaidOrRefunded) await requirePermission("payments.refund");

    const { data: existing, error: existingError } = await supabaseAdmin
      .from("orders")
      .select("id,order_number,status,payment_status,coupon_code")
      .eq("id", data.id)
      .maybeSingle();
    if (existingError || !existing) throw new Error(existingError?.message ?? "Order not found.");

    const updates: { status?: string; payment_status?: string; notes?: string } = {};
    if (typeof data.status === "string" && data.status !== existing.status) updates.status = data.status;
    if (typeof data.payment_status === "string" && data.payment_status !== existing.payment_status) {
      updates.payment_status = data.payment_status;
    }
    if (typeof data.notes === "string") updates.notes = data.notes;

    if (Object.keys(updates).length > 0) {
      const { error } = await supabaseAdmin.from("orders").update(updates as never).eq("id", data.id);
      if (error) throw new Error(error.message);
    }

    // Restore reserved stock when an unpaid order is cancelled or its payment fails.
    const becomingCancelled = updates.status === "cancelled";
    const becomingFailed = updates.payment_status === "failed";
    if ((becomingCancelled || becomingFailed) && existing.payment_status !== "paid") {
      await restoreOrderStock(data.id).catch(() => {});
    }

    // Coupon usage is billed on payment; so a late "cancel" of a paid order that
    // is later refunded will not over-charge (refund handling is a separate step).
    if (Object.keys(updates).length > 0) {
      await logAudit(actor, "order_status_change", "orders", data.id, {
        order_number: existing.order_number,
        previous: { status: existing.status, payment_status: existing.payment_status },
        next: updates,
      });
    }
    return { ok: true as const };
  });

export const quoteDelivery = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        subtotal: z.number().min(0).max(100000000),
        state: z.string().trim().max(120).default(""),
        country: z.string().trim().max(120).default("Nigeria"),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const config = await getShippingConfig();
    return quoteShipping(config, data);
  });
