import { queryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const adminProductsQuery = queryOptions({
  queryKey: ["admin", "products"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(id,name,slug)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export const adminCategoriesQuery = queryOptions({
  queryKey: ["admin", "categories"],
  queryFn: async () => {
    const { data, error } = await supabase.from("categories").select("*").order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
});

export const adminOrdersQuery = queryOptions({
  queryKey: ["admin", "orders"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(id,product_name,variant,quantity,unit_price,line_total)")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;
    return data ?? [];
  },
});

export const adminPostsQuery = queryOptions({
  queryKey: ["admin", "posts"],
  queryFn: async () => {
    const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export const adminTestimonialsQuery = queryOptions({
  queryKey: ["admin", "testimonials"],
  queryFn: async () => {
    const { data, error } = await supabase.from("testimonials").select("*").order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
});

export const adminInquiriesQuery = queryOptions({
  queryKey: ["admin", "inquiries"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;
    return data ?? [];
  },
});

export const adminWholesaleQuery = queryOptions({
  queryKey: ["admin", "wholesale"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("wholesale_accounts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export const adminSubscribersQuery = queryOptions({
  queryKey: ["admin", "subscribers"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw error;
    return data ?? [];
  },
});

export const adminSettingsQuery = queryOptions({
  queryKey: ["admin", "settings"],
  queryFn: async () => {
    const { data, error } = await supabase.from("site_settings").select("key,value");
    if (error) throw error;
    const map: Record<string, Record<string, unknown>> = {};
    for (const row of data ?? []) map[row.key] = (row.value ?? {}) as Record<string, unknown>;
    return map;
  },
});

export const adminAnalyticsQuery = queryOptions({
  queryKey: ["admin", "analytics"],
  queryFn: async () => {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from("analytics_events")
      .select("name,path,value,created_at,product_id")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(5000);
    if (error) throw error;
    return data ?? [];
  },
});

export const adminInventoryLogsQuery = queryOptions({
  queryKey: ["admin", "inventory_logs"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("inventory_logs")
      .select("*, products(name)")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    return data ?? [];
  },
});

/** Subscribes to Postgres changes and invalidates the matching admin query keys. */
export function useAdminRealtime(tables: string[], keys: string[][]) {
  const queryClient = useQueryClient();
  const signature = tables.join(",");
  useEffect(() => {
    const channel = supabase.channel(`admin-${signature}`);
    for (const table of tables) {
      channel.on("postgres_changes", { event: "*", schema: "public", table }, () => {
        for (const key of keys) queryClient.invalidateQueries({ queryKey: key });
      });
    }
    channel.subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);
}
