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

export const adminPaymentsQuery = queryOptions({
  queryKey: ["admin", "payments"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("payment_transactions")
      .select("*, orders(order_number,customer_name,customer_email,total)")
      .order("created_at", { ascending: false })
      .limit(300);
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

export const adminFaqsQuery = queryOptions({
  queryKey: ["admin", "faqs"],
  queryFn: async () => {
    const { data, error } = await supabase.from("faqs").select("*").order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
});

export const adminNavQuery = queryOptions({
  queryKey: ["admin", "nav_links"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("nav_links")
      .select("*")
      .order("menu_group")
      .order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
});

export const adminCustomersQuery = queryOptions({
  queryKey: ["admin", "customers"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw error;
    return data ?? [];
  },
});

export const adminRolesQuery = queryOptions({
  queryKey: ["admin", "user_roles"],
  queryFn: async () => {
    const { data, error } = await supabase.from("user_roles").select("*");
    if (error) throw error;
    return data ?? [];
  },
});

export const adminPagesQuery = queryOptions({
  queryKey: ["admin", "pages"],
  queryFn: async () => {
    const { data, error } = await supabase.from("pages").select("*").order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
});

export const adminCouponsQuery = queryOptions({
  queryKey: ["admin", "coupons"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export const adminVariantsQuery = queryOptions({
  queryKey: ["admin", "product_variants"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("product_variants")
      .select("*, products(name,slug)")
      .order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
});

export const adminRedirectsQuery = queryOptions({
  queryKey: ["admin", "redirects"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("redirects")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});



export type AdminNotification = {
  id: string;
  title: string;
  body: string | null;
  href: string | null;
  kind: string;
  is_read: boolean;
  created_at: string;
};

export const adminNotificationsQuery = queryOptions({
  queryKey: ["admin", "notifications"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("admin_notifications")
      .select("id,title,body,href,kind,is_read,created_at")
      .order("created_at", { ascending: false })
      .limit(30);
    if (error) throw error;
    return (data ?? []) as unknown as AdminNotification[];
  },
});

export const adminReviewsQuery = queryOptions({
  queryKey: ["admin", "product_reviews"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("product_reviews")
      .select("*, products(name,slug)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export const adminBannersQuery = queryOptions({
  queryKey: ["admin", "banners"],
  queryFn: async () => {
    const { data, error } = await supabase.from("banners").select("*").order("sort_order");
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
