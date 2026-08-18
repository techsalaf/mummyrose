import type { CreatedOrder } from "./orders.server";
import { decryptSecret, encryptSecret } from "./secrets.server";

export type InitResult =
  | { kind: "redirect"; url: string; reference: string }
  | { kind: "manual"; instructions: Record<string, unknown> };

function money(amount: number) {
  return Math.round(amount * 100);
}

export function flutterwaveKey() {
  return process.env.FLUTTERWAVE_SECRET_KEY ?? "";
}

/**
 * Paystack credentials can be configured from the admin UI and are stored in the
 * `payments` site_settings row ENCRYPTED at rest (AES-256-GCM). The plaintext
 * secret is only ever held in this server module — never returned to the browser,
 * never rendered, and never written to audit logs.
 *
 * `PAYSTACK_SECRET_KEY` remains a bootstrap fallback for existing installations.
 */

export type PaystackStoredConfig = {
  enabled: boolean;
  mode: "test" | "live";
  public_key: string;
  secret_cipher: string | null;
};

export type PaystackPublicConfig = {
  enabled: boolean;
  mode: "test" | "live";
  public_key: string;
  has_secret: boolean;
};

export async function readPaystackStoredConfig(): Promise<PaystackPublicConfig> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("site_settings")
    .select("value")
    .eq("key", "payments")
    .maybeSingle();
  const raw = (data?.value ?? {}) as Record<string, unknown>;
  const cfg = (raw.paystack ?? {}) as Partial<PaystackStoredConfig>;
  return {
    enabled: cfg.enabled !== false,
    mode: cfg.mode === "live" ? "live" : "test",
    public_key: cfg.public_key ?? "",
    has_secret: Boolean(cfg.secret_cipher) || Boolean(process.env.PAYSTACK_SECRET_KEY),
  };
}

/** Resolves the effective Paystack secret: stored (encrypted) config first, then env fallback. */
export async function resolvePaystackSecret(): Promise<string> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("site_settings")
    .select("value")
    .eq("key", "payments")
    .maybeSingle();
  const raw = (data?.value ?? {}) as Record<string, unknown>;
  const cfg = (raw.paystack ?? {}) as Partial<PaystackStoredConfig>;
  if (cfg.secret_cipher) {
    try {
      return decryptSecret(cfg.secret_cipher);
    } catch {
      // fall through to env fallback rather than crashing checkout
    }
  }
  return process.env.PAYSTACK_SECRET_KEY ?? "";
}

/**
 * Persists the Paystack configuration from the admin UI. The secret key is
 * encrypted at rest and never returned in read responses. Passing an empty
 * `secret_key` keeps the currently stored (encrypted) secret.
 */
export async function savePaystackConfig(
  input: { enabled: boolean; mode: "test" | "live"; public_key?: string | null; secret_key?: string | null },
) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("site_settings")
    .select("value")
    .eq("key", "payments")
    .maybeSingle();
  if (error) throw new Error(error.message);
  const current = (data?.value ?? {}) as Record<string, unknown>;
  const currentCfg = (current.paystack ?? {}) as Partial<PaystackStoredConfig>;

  let secretCipher = currentCfg.secret_cipher ?? null;
  if (input.secret_key) {
    secretCipher = encryptSecret(input.secret_key);
    if (!secretCipher) throw new Error("Could not encrypt the Paystack secret key.");
  } else if (!secretCipher && !process.env.PAYSTACK_SECRET_KEY) {
    throw new Error("Enter a Paystack secret key, or leave it blank only when a secret is already configured.");
  }

  const next = {
    ...current,
    paystack_enabled: input.enabled,
    paystack: {
      enabled: input.enabled,
      mode: input.mode,
      public_key: (input.public_key ?? "").trim(),
      secret_cipher: secretCipher,
    },
  };
  const { error: updateError } = await supabaseAdmin
    .from("site_settings")
    .upsert({ key: "payments", value: next, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (updateError) throw new Error(updateError.message);
  return { configured: Boolean(secretCipher) };
}

/** Returns a human-readable connection check without ever exposing the secret. */
export async function testPaystackConnectionServer(): Promise<{ ok: boolean; message: string }> {
  const secret = await resolvePaystackSecret();
  if (!secret) return { ok: false, message: "No Paystack secret key configured." };
  try {
    const res = await fetch("https://api.paystack.co/balance", { headers: { Authorization: `Bearer ${secret}` } });
    const json = (await res.json()) as { status?: boolean; message?: string };
    if (res.ok && json.status) {
      return { ok: true, message: "Connection successful — Paystack verified your secret key." };
    }
    return { ok: false, message: json.message || "Paystack rejected the secret key." };
  } catch {
    return { ok: false, message: "Could not reach Paystack. Check your connection and try again." };
  }
}

async function logTransaction(order: CreatedOrder, provider: string, reference: string, status: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin
    .from("payment_transactions")
    .upsert(
      { order_id: order.id, provider, reference, amount: order.total, status },
      { onConflict: "reference" },
    );
  await supabaseAdmin.from("orders").update({ payment_reference: reference }).eq("id", order.id);
}

export async function initPaystack(order: CreatedOrder, email: string, origin: string): Promise<InitResult> {
  const key = await resolvePaystackSecret();
  if (!key) throw new Error("Paystack is not configured yet. Choose bank transfer or pay on delivery.");
  const reference = `${order.order_number}-${Date.now().toString(36)}`;
  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      amount: money(order.total),
      currency: "NGN",
      reference,
      callback_url: `${origin}/payment-callback?provider=paystack`,
      metadata: { order_number: order.order_number, order_id: order.id },
    }),
  });
  const json = (await res.json()) as { status?: boolean; message?: string; data?: { authorization_url?: string } };
  if (!res.ok || !json.status || !json.data?.authorization_url) {
    throw new Error(json.message || "Paystack could not start this payment.");
  }
  await logTransaction(order, "paystack", reference, "pending");
  return { kind: "redirect", url: json.data.authorization_url, reference };
}

export async function initFlutterwave(
  order: CreatedOrder,
  customer: { email: string; name: string; phone: string },
  origin: string,
): Promise<InitResult> {
  const key = flutterwaveKey();
  if (!key) throw new Error("Flutterwave is not configured yet. Choose bank transfer or pay on delivery.");
  const reference = `${order.order_number}-${Date.now().toString(36)}`;
  const res = await fetch("https://api.flutterwave.com/v3/payments", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      tx_ref: reference,
      amount: order.total,
      currency: "NGN",
      redirect_url: `${origin}/payment-callback?provider=flutterwave`,
      customer: { email: customer.email, name: customer.name, phonenumber: customer.phone },
      customizations: { title: "Mummy Rose", description: `Order ${order.order_number}` },
      meta: { order_number: order.order_number, order_id: order.id },
    }),
  });
  const json = (await res.json()) as { status?: string; message?: string; data?: { link?: string } };
  if (!res.ok || json.status !== "success" || !json.data?.link) {
    throw new Error(json.message || "Flutterwave could not start this payment.");
  }
  await logTransaction(order, "flutterwave", reference, "pending");
  return { kind: "redirect", url: json.data.link, reference };
}

/**
 * Marks an order paid (idempotent) and reconciles the gateway-reported amount
 * against the order total before confirmation. An order is only ever marked
 * paid after this trusted verification passes.
 */
export async function markPaid(reference: string, provider: string, payload: Record<string, unknown>) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: tx } = await supabaseAdmin
    .from("payment_transactions")
    .select("id,order_id,amount,status")
    .eq("reference", reference)
    .maybeSingle();

  const orderId = tx?.order_id ?? null;
  if (!orderId) return { ok: false as const, reason: "unknown_reference" };

  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("id,order_number,total,status,payment_status,coupon_code")
    .eq("id", orderId)
    .maybeSingle();
  if (!order) return { ok: false as const, reason: "no_order" };

  // Idempotency: a repeated/duplicate webhook for an already-paid order must not
  // re-confirm, re-bill the coupon, or create any side effects.
  if (order.payment_status === "paid") {
    return { ok: true as const, order: { order_number: order.order_number, total: order.total, status: order.status, payment_status: order.payment_status } };
  }

  const data = (payload?.data ?? {}) as { amount?: number; currency?: string };
  if (data.amount != null) {
    // Paystack reports amount in kobo; Flutterwave reports it in the main unit.
    const paid = provider === "paystack" ? data.amount : Math.round(Number(data.amount) * 100);
    const expected = money(Number(order.total));
    if (Number(paid) !== expected) {
      await markFailed(reference);
      return {
        ok: false as const,
        reason: "amount_mismatch",
        paid: Number(paid),
        expected,
      };
    }
  }

  await supabaseAdmin
    .from("payment_transactions")
    .update({ status: "success", payload: payload as never })
    .eq("reference", reference);

  await supabaseAdmin
    .from("orders")
    .update({ payment_status: "paid", status: "confirmed", payment_provider: provider, payment_reference: reference })
    .eq("id", orderId);

  const { data: confirmed } = await supabaseAdmin
    .from("orders")
    .select("order_number,total,status,payment_status")
    .eq("id", orderId)
    .maybeSingle();

  // Coupons are only billed once the order is actually paid, never at order
  // creation — so a failed/abandoned payment does not burn the code's usage limit.
  if (order.coupon_code) {
    await import("./coupons.server")
      .then(({ redeemCoupon }) => redeemCoupon(order.coupon_code as string))
      .catch(() => {});
  }

  return { ok: true as const, order: confirmed };
}

export async function markFailed(reference: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin.from("payment_transactions").update({ status: "failed" }).eq("reference", reference);
  const { data: tx } = await supabaseAdmin
    .from("payment_transactions")
    .select("order_id")
    .eq("reference", reference)
    .maybeSingle();
  if (!tx?.order_id) return;
  await supabaseAdmin.from("orders").update({ payment_status: "failed" }).eq("id", tx.order_id);
  // Free the stock that was reserved at order creation — idempotent, so a
  // duplicate/late webhook can never double-restore.
  await import("./orders.server").then(({ restoreOrderStock }) => restoreOrderStock(tx.order_id as string)).catch(() => {});
}

/**
 * Refunds a paid Paystack order via the Paystack API and flags it `refunded`.
 * Admin-gated. Does not auto-restock (the goods may already be in transit).
 * Idempotent: an already-refunded order is a no-op.
 */
export async function refundPaystackOrder(orderId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("id,order_number,payment_status,payment_provider,payment_reference,total")
    .eq("id", orderId)
    .maybeSingle();
  if (!order) throw new Error("Order not found.");
  if (order.payment_status === "refunded") return { ok: true as const, reason: "already_refunded" as const };
  if (order.payment_provider !== "paystack" || !order.payment_reference) {
    throw new Error("This order is not a Paystack card payment and cannot be auto-refunded.");
  }

  const secret = await resolvePaystackSecret();
  if (!secret) throw new Error("Paystack is not configured.");
  const reference = order.payment_reference as string;

  // Resolve the numeric Paystack transaction id from the reference.
  const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secret}` },
  });
  const verifyJson = (await verifyRes.json()) as { data?: { id?: number }; message?: string };
  const transactionId = verifyJson.data?.id;
  if (!transactionId) throw new Error(verifyJson.message || "Could not resolve the Paystack transaction.");

  const refundRes = await fetch(`https://api.paystack.co/transaction/${transactionId}/refund`, {
    method: "POST",
    headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
    body: JSON.stringify({ transaction: transactionId }),
  });
  const refundJson = (await refundRes.json()) as { status?: boolean; message?: string; data?: { status?: string } };
  if (!refundRes.ok || !refundJson.status) {
    throw new Error(refundJson.message || "Paystack could not process the refund.");
  }

  await supabaseAdmin
    .from("orders")
    .update({ payment_status: "refunded", payment_reference: reference })
    .eq("id", orderId);
  await supabaseAdmin.from("payment_transactions").update({ status: "refunded" }).eq("order_id", orderId);
  return { ok: true as const, reason: "refunded" as const };
}

export async function verifyPaystack(reference: string) {
  const key = await resolvePaystackSecret();
  if (!key) throw new Error("Paystack is not configured.");
  const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  const json = (await res.json()) as { data?: { status?: string } };
  if (json.data?.status === "success") return await markPaid(reference, "paystack", json as never);
  await markFailed(reference);
  return { ok: false as const, reason: "not_successful" };
}

export async function verifyFlutterwave(reference: string, transactionId?: string | null) {
  const key = flutterwaveKey();
  if (!key) throw new Error("Flutterwave is not configured.");
  const url = transactionId
    ? `https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transactionId)}/verify`
    : `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${encodeURIComponent(reference)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${key}` } });
  const json = (await res.json()) as { data?: { status?: string; tx_ref?: string } };
  if (json.data?.status === "successful") {
    return await markPaid(json.data.tx_ref ?? reference, "flutterwave", json as never);
  }
  await markFailed(reference);
  return { ok: false as const, reason: "not_successful" };
}
