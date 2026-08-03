/** Server-only coupon validation and redemption. */

export type CouponResult = {
  code: string;
  discount: number;
  label: string;
};

/** Validates a code against the DB and returns the discount for a given subtotal. */
export async function validateCoupon(rawCode: string, subtotal: number): Promise<CouponResult> {
  const code = rawCode.trim().toUpperCase();
  if (!code) throw new Error("Enter a discount code.");

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("coupons")
    .select("code,discount_type,value,min_subtotal,max_uses,used_count,starts_at,expires_at,is_active")
    .eq("code", code)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data || !data.is_active) throw new Error("That discount code is not valid.");

  const now = Date.now();
  if (data.starts_at && new Date(data.starts_at).getTime() > now) {
    throw new Error("That discount code is not active yet.");
  }
  if (data.expires_at && new Date(data.expires_at).getTime() < now) {
    throw new Error("That discount code has expired.");
  }
  if (data.max_uses != null && Number(data.used_count ?? 0) >= Number(data.max_uses)) {
    throw new Error("That discount code has been fully redeemed.");
  }
  const min = Number(data.min_subtotal ?? 0);
  if (subtotal < min) {
    throw new Error(`Spend at least ₦${min.toLocaleString("en-NG")} to use this code.`);
  }

  const value = Number(data.value ?? 0);
  const raw = data.discount_type === "percent" ? (subtotal * value) / 100 : value;
  const discount = Number(Math.max(0, Math.min(raw, subtotal)).toFixed(2));

  return {
    code: data.code,
    discount,
    label: data.discount_type === "percent" ? `${value}% off` : `₦${value.toLocaleString("en-NG")} off`,
  };
}

/** Increments the redemption counter once an order using the code is created. */
export async function redeemCoupon(code: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("coupons").select("used_count").eq("code", code).maybeSingle();
  await supabaseAdmin
    .from("coupons")
    .update({ used_count: Number(data?.used_count ?? 0) + 1 })
    .eq("code", code);
}
