import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const PRODUCT_FIELDS =
  "id,slug,name,short_description,description,image_url,gallery,price,discount_price,sku,stock_quantity,ingredients,nutrition,weight_options,tags,is_featured,category_id,seo_title,seo_description,categories(id,name,slug)";

export const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("id,slug,name,description,image_url,sort_order")
      .order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
});

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_FIELDS)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export function productQuery(slug: string) {
  return queryOptions({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(PRODUCT_FIELDS)
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export const testimonialsQuery = queryOptions({
  queryKey: ["testimonials"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("id,author,role,quote,rating")
      .order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
});

export const postsQuery = queryOptions({
  queryKey: ["posts"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("id,slug,title,excerpt,cover_image,category,kind,author,published_at,is_featured")
      .order("published_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export function postQuery(slug: string) {
  return queryOptions({
    queryKey: ["post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export const settingsQuery = queryOptions({
  queryKey: ["site_settings"],
  queryFn: async () => {
    const { data, error } = await supabase.from("site_settings").select("key,value");
    if (error) throw error;
    const map: Record<string, Record<string, unknown>> = {};
    for (const row of data ?? []) map[row.key] = (row.value ?? {}) as Record<string, unknown>;
    return map;
  },
});

type Unwrap<T> = T extends Promise<infer U> ? U : T;
export type ProductRow = Unwrap<ReturnType<NonNullable<typeof productsQuery.queryFn>>>[number];

export const faqsQuery = queryOptions({
  queryKey: ["faqs"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("faqs")
      .select("id,question,answer,category,sort_order")
      .eq("is_published", true)
      .order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
});

export function navLinksQuery(group: string) {
  return queryOptions({
    queryKey: ["nav_links", group],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nav_links")
        .select("id,label,href,menu_group,sort_order")
        .eq("menu_group", group)
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function productReviewsQuery(productId: string | undefined) {
  return queryOptions({
    queryKey: ["product_reviews", productId ?? "none"],
    queryFn: async () => {
      if (!productId) return [];
      const { data, error } = await supabase
        .from("product_reviews")
        .select("id,author_name,rating,title,body,created_at,is_approved,user_id")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function bannersQuery(placement: string) {
  return queryOptions({
    queryKey: ["banners", placement],
    queryFn: async () => {
      const nowIso = new Date().toISOString();
      const { data, error } = await supabase
        .from("banners")
        .select("id,title,subtitle,body,image_url,cta_label,cta_href,theme,starts_at,expires_at")
        .eq("placement", placement)
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return (data ?? []).filter(
        (b) => (!b.starts_at || b.starts_at <= nowIso) && (!b.expires_at || b.expires_at >= nowIso),
      );
    },
  });
}

export function addressesQuery(userId: string | undefined) {
  return queryOptions({
    queryKey: ["customer_addresses", userId ?? "anon"],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("customer_addresses")
        .select("*")
        .eq("user_id", userId)
        .order("is_default", { ascending: false })
        .order("created_at");
      if (error) throw error;
      return data ?? [];
    },
  });
}
