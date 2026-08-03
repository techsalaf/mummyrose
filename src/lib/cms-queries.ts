import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type PageSection = { heading?: string; body?: string; image?: string };

export type PageRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  hero_image: string | null;
  sections: PageSection[];
  seo_title: string | null;
  seo_description: string | null;
};

const PAGE_FIELDS = "id,slug,title,subtitle,hero_image,sections,seo_title,seo_description";

export const pagesQuery = queryOptions({
  queryKey: ["pages"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("pages")
      .select(PAGE_FIELDS)
      .eq("is_published", true)
      .order("sort_order");
    if (error) throw error;
    return (data ?? []) as unknown as PageRow[];
  },
});

export function pageQuery(slug: string) {
  return queryOptions({
    queryKey: ["page", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pages")
        .select(PAGE_FIELDS)
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as unknown as PageRow | null;
    },
  });
}

export function productVariantsQuery(productId: string | undefined) {
  return queryOptions({
    queryKey: ["product_variants", productId ?? "none"],
    queryFn: async () => {
      if (!productId) return [];
      const { data, error } = await supabase
        .from("product_variants")
        .select("id,label,sku,price,discount_price,stock_quantity")
        .eq("product_id", productId)
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export const redirectsQuery = queryOptions({
  queryKey: ["redirects"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("redirects")
      .select("from_path,to_path")
      .eq("is_active", true);
    if (error) throw error;
    return data ?? [];
  },
});
