import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type WholesaleAccount = {
  id: string;
  user_id: string | null;
  company: string;
  contact_name: string;
  email: string;
  phone: string | null;
  country: string | null;
  monthly_volume: string | null;
  tier: string;
  discount_percent: number;
  status: string;
  notes: string | null;
  created_at: string;
};

export const TIER_LABELS: Record<string, string> = {
  bronze: "Starter",
  silver: "Trade",
  gold: "Distributor",
};

export function myWholesaleAccountQuery(userId: string | undefined) {
  return queryOptions({
    queryKey: ["wholesale", "me", userId ?? "anon"],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wholesale_accounts")
        .select("*")
        .eq("user_id", userId as string)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as WholesaleAccount | null;
    },
  });
}

export function myWholesaleOrdersQuery(userId: string | undefined) {
  return queryOptions({
    queryKey: ["wholesale", "orders", userId ?? "anon"],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(
          "id,order_number,status,payment_status,subtotal,shipping_fee,total,discount_percent,order_type,created_at,order_items(id,product_name,variant,quantity,unit_price,line_total)",
        )
        .eq("user_id", userId as string)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export const wholesaleTiersQuery = queryOptions({
  queryKey: ["settings", "wholesale"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "wholesale")
      .maybeSingle();
    if (error) throw error;
    return (data?.value ?? {}) as Record<string, unknown>;
  },
});
