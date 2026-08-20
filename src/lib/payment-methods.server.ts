/**
 * Payment configuration lives in the staff-only `payments` settings key, so the
 * storefront never reads it directly. These helpers expose the minimum needed:
 * which methods are enabled (public) and the bank transfer details (only for a
 * real order number).
 */

export type PaymentMethodFlags = {
  paystack_enabled: boolean;
  flutterwave_enabled: boolean;
  bank_transfer_enabled: boolean;
  pay_on_delivery_enabled: boolean;
};

export type BankDetails = { bank_name: string; account_name: string; account_number: string } | null;

async function readPaymentsSetting(): Promise<Record<string, unknown>> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("site_settings")
    .select("value")
    .eq("key", "payments")
    .maybeSingle();
  return (data?.value ?? {}) as Record<string, unknown>;
}

export async function readPaymentMethodFlags(): Promise<PaymentMethodFlags> {
  const value = await readPaymentsSetting();
  const on = (key: string) => value[key] !== false;

  // A gateway is only offered at checkout when the admin has actually configured
  // its credential. This prevents a dead-end "Paystack is not configured" error
  // for a store that hasn't added its key yet.
  const paystackCfg = (value.paystack ?? {}) as { enabled?: boolean; secret_cipher?: string | null };
  const paystackConfigured =
    Boolean(paystackCfg.secret_cipher) || Boolean(typeof process !== "undefined" && process.env?.PAYSTACK_SECRET_KEY);
  const flutterwaveConfigured = Boolean(typeof process !== "undefined" && process.env?.FLUTTERWAVE_SECRET_KEY);

  return {
    paystack_enabled: on("paystack_enabled") && paystackCfg.enabled !== false && paystackConfigured,
    flutterwave_enabled: on("flutterwave_enabled") && flutterwaveConfigured,
    bank_transfer_enabled: on("bank_transfer_enabled") && Boolean(String(value.account_number ?? "").trim()),
    pay_on_delivery_enabled: on("pay_on_delivery_enabled"),
  };
}

export async function readBankDetailsForOrder(orderNumber: string): Promise<BankDetails> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("id")
    .eq("order_number", orderNumber)
    .maybeSingle();
  if (!order) return null;

  const value = await readPaymentsSetting();
  const number = String(value.account_number ?? "");
  if (!number) return null;
  return {
    bank_name: String(value.bank_name ?? ""),
    account_name: String(value.account_name ?? ""),
    account_number: number,
  };
}
