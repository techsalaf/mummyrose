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
