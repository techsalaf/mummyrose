import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

const FALLBACK_BASE_URL = "https://mummyrose.com";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const STATIC_ENTRIES: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/products", changefreq: "daily", priority: "0.9" },
  { path: "/services", changefreq: "monthly", priority: "0.8" },
  { path: "/retail", changefreq: "monthly", priority: "0.8" },
  { path: "/wholesale", changefreq: "monthly", priority: "0.8" },
  { path: "/export", changefreq: "monthly", priority: "0.8" },
  { path: "/white-labelling", changefreq: "monthly", priority: "0.8" },
  { path: "/corporate-supply", changefreq: "monthly", priority: "0.8" },
  { path: "/custom-packaging", changefreq: "monthly", priority: "0.8" },
  { path: "/recipes", changefreq: "weekly", priority: "0.7" },
  { path: "/blog", changefreq: "weekly", priority: "0.7" },
  { path: "/about", changefreq: "yearly", priority: "0.6" },
  { path: "/contact", changefreq: "yearly", priority: "0.6" },
  { path: "/faq", changefreq: "monthly", priority: "0.5" },
  { path: "/track-order", changefreq: "yearly", priority: "0.4" },
  { path: "/shipping", changefreq: "monthly", priority: "0.4" },
  { path: "/refunds", changefreq: "monthly", priority: "0.4" },
  { path: "/privacy", changefreq: "yearly", priority: "0.2" },
  { path: "/terms", changefreq: "yearly", priority: "0.2" },

];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const supabaseUrl = process.env["SUPABASE_URL"] ?? process.env["VITE_SUPABASE_URL"];
        const supabaseKey =
          process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

        const entries: SitemapEntry[] = [...STATIC_ENTRIES];
        let baseUrl = FALLBACK_BASE_URL;

        if (supabaseUrl && supabaseKey) {
          const supabase = createClient(supabaseUrl, supabaseKey, {
            auth: { persistSession: false, autoRefreshToken: false },
          });

          const [products, categories, posts, pages, settings] = await Promise.all([
            supabase.from("products").select("slug").eq("is_active", true),
            supabase.from("categories").select("slug").eq("is_active", true),
            supabase.from("posts").select("slug,kind,updated_at").eq("is_published", true),
            supabase.from("pages").select("slug").eq("is_published", true),
            supabase.from("site_settings").select("value").eq("key", "seo").maybeSingle(),
          ]);

          const configured = (settings.data?.value as { site_url?: string } | null)?.site_url?.trim();
          if (configured) baseUrl = configured.replace(/\/$/, "");

          for (const row of categories.data ?? [])
            entries.push({ path: `/category/${row.slug}`, changefreq: "weekly", priority: "0.8" });
          for (const row of products.data ?? [])
            entries.push({ path: `/products/${row.slug}`, changefreq: "weekly", priority: "0.8" });
          for (const row of posts.data ?? [])
            entries.push({
              path: row.kind === "recipe" ? `/recipes/${row.slug}` : `/blog/${row.slug}`,
              changefreq: "monthly",
              priority: "0.6",
            });
          const known = new Set(STATIC_ENTRIES.map((e) => e.path));
          for (const row of pages.data ?? []) {
            const path = `/${row.slug}`;
            if (known.has(path)) continue;
            entries.push({ path, changefreq: "monthly", priority: "0.5" });
          }
        }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${baseUrl}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
