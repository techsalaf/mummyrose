import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, Download, Printer } from "lucide-react";

import { AdminHeader } from "@/components/admin/resource-manager";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  adminAnalyticsQuery,
  adminCategoriesQuery,
  adminOrdersQuery,
  adminPostsQuery,
  adminProductsQuery,
  adminSettingsQuery,
  useAdminRealtime,
} from "@/lib/admin-queries";
import { formatNaira } from "@/lib/format";
import { pickSeo } from "@/lib/settings";

export const Route = createFileRoute("/admin/analytics")({
  component: AdminAnalytics,
});

type Event = { name: string; path: string | null; value: number | null; created_at: string; product_id: string | null };

function AdminAnalytics() {
  const analytics = useQuery(adminAnalyticsQuery);
  const products = useQuery(adminProductsQuery);
  const categories = useQuery(adminCategoriesQuery);
  const posts = useQuery(adminPostsQuery);
  const orders = useQuery(adminOrdersQuery);
  const settings = useQuery(adminSettingsQuery);
  useAdminRealtime(["analytics_events"], [["admin", "analytics"]]);

  const events = (analytics.data ?? []) as unknown as Event[];
  const productRows = (products.data ?? []) as unknown as {
    id: string;
    name: string;
    slug: string;
    seo_title: string | null;
    seo_description: string | null;
    short_description: string | null;
    image_url: string | null;
    description: string | null;
  }[];
  const categoryRows = (categories.data ?? []) as unknown as {
    id: string;
    name: string;
    seo_title: string | null;
    seo_description: string | null;
    image_url: string | null;
  }[];
  const postRows = (posts.data ?? []) as unknown as {
    id: string;
    title: string;
    is_published: boolean;
    seo_description: string | null;
    excerpt: string | null;
    cover_image: string | null;
  }[];
  const orderRows = (orders.data ?? []) as unknown as { total: number; payment_status: string }[];
  const seo = pickSeo(settings.data);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const event of events) map.set(event.name, (map.get(event.name) ?? 0) + 1);
    return map;
  }, [events]);

  const topPaths = useMemo(() => {
    const map = new Map<string, number>();
    for (const event of events.filter((e) => e.name === "page_view")) {
      const key = event.path ?? "/";
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [events]);

  const topProducts = useMemo(() => {
    const map = new Map<string, number>();
    for (const event of events.filter((e) => e.name === "product_view" && e.product_id)) {
      map.set(event.product_id as string, (map.get(event.product_id as string) ?? 0) + 1);
    }
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([id, views]) => ({ name: productRows.find((p) => p.id === id)?.name ?? "Unknown", views }));
  }, [events, productRows]);

  const searches = useMemo(
    () => events.filter((e) => e.name === "search").length,
    [events],
  );

  const views = counts.get("page_view") ?? 0;
  const carts = counts.get("add_to_cart") ?? 0;
  const checkouts = counts.get("begin_checkout") ?? 0;
  const placed = (counts.get("order_placed") ?? 0) + (counts.get("whatsapp_order") ?? 0);
  const paidRevenue = orderRows
    .filter((o) => o.payment_status === "paid")
    .reduce((sum, o) => sum + Number(o.total ?? 0), 0);

  const audit = [
    {
      label: "Global SEO title configured",
      pass: Boolean(seo.title && seo.title.length > 10 && seo.title.length < 65),
      hint: "Set a 10–65 character site title in Settings → SEO.",
    },
    {
      label: "Global meta description configured",
      pass: Boolean(seo.description && seo.description.length > 50 && seo.description.length < 165),
      hint: "Set a 50–165 character description in Settings → SEO.",
    },
    {
      label: "All products have SEO titles",
      pass: productRows.every((p) => Boolean(p.seo_title)),
      hint: `${productRows.filter((p) => !p.seo_title).length} product(s) missing an SEO title.`,
    },
    {
      label: "All products have meta descriptions",
      pass: productRows.every((p) => Boolean(p.seo_description ?? p.short_description)),
      hint: `${productRows.filter((p) => !p.seo_description && !p.short_description).length} product(s) missing description copy.`,
    },
    {
      label: "All products have imagery",
      pass: productRows.every((p) => Boolean(p.image_url)),
      hint: `${productRows.filter((p) => !p.image_url).length} product(s) without a main image.`,
    },
    {
      label: "Product copy is long enough to rank",
      pass: productRows.every((p) => (p.description ?? "").length > 200),
      hint: `${productRows.filter((p) => (p.description ?? "").length <= 200).length} product(s) with thin content (<200 chars).`,
    },
    {
      label: "Categories have SEO copy",
      pass: categoryRows.every((c) => Boolean(c.seo_title && c.seo_description)),
      hint: `${categoryRows.filter((c) => !c.seo_title || !c.seo_description).length} category page(s) missing SEO copy.`,
    },
    {
      label: "Categories have imagery",
      pass: categoryRows.every((c) => Boolean(c.image_url)),
      hint: "Add a collection image for richer social previews.",
    },
    {
      label: "Published posts have descriptions and covers",
      pass: postRows.filter((p) => p.is_published).every((p) => Boolean(p.seo_description ?? p.excerpt) && Boolean(p.cover_image)),
      hint: "Add an excerpt and cover image to every published post.",
    },
    {
      label: "Content library is active",
      pass: postRows.filter((p) => p.is_published).length >= 3,
      hint: "Publish at least 3 recipes or articles to build topical authority.",
    },
    {
      label: "Social proof published",
      pass: (counts.size >= 0 && true) as boolean,
      hint: "",
    },
  ].filter((row) => row.hint !== "");

  const score = Math.round((audit.filter((a) => a.pass).length / Math.max(audit.length, 1)) * 100);

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Analytics &amp; SEO audit"
        description="Storefront behaviour over the last 30 days, plus an automated on-page SEO health check."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Metric label="Page views" value={views} />
        <Metric label="Product views" value={counts.get("product_view") ?? 0} />
        <Metric label="Add to cart" value={carts} />
        <Metric label="Checkouts started" value={checkouts} />
        <Metric label="Orders placed" value={placed} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="View → cart" value={`${views ? ((carts / views) * 100).toFixed(1) : "0.0"}%`} />
        <Metric label="Cart → order" value={`${carts ? ((placed / carts) * 100).toFixed(1) : "0.0"}%`} />
        <Metric label="On-site searches" value={searches} />
        <Metric label="Paid revenue" value={formatNaira(paidRevenue)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top pages</CardTitle>
          </CardHeader>
          <CardContent>
            {topPaths.length === 0 ? (
              <p className="text-sm text-muted-foreground">No traffic recorded yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Path</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topPaths.map(([path, count]) => (
                    <TableRow key={path}>
                      <TableCell className="truncate">{path}</TableCell>
                      <TableCell className="text-right">{count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Most viewed products</CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No product views recorded yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell className="truncate">{row.name}</TableCell>
                      <TableCell className="text-right">{row.views}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-base">SEO audit</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const rows = [
                  ["Check", "Status", "Action needed"],
                  ...audit.map((a) => [a.label, a.pass ? "Pass" : "Fail", a.pass ? "" : a.hint]),
                ];
                const csv = rows
                  .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
                  .join("\n");
                const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
                const link = document.createElement("a");
                link.href = url;
                link.download = `mummy-rose-seo-audit-${new Date().toISOString().slice(0, 10)}.csv`;
                link.click();
                URL.revokeObjectURL(url);
              }}
            >
              <Download className="size-4" /> CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="size-4" /> PDF
            </Button>
          </div>
          <Badge variant={score >= 80 ? "default" : score >= 50 ? "secondary" : "destructive"}>{score}/100</Badge>
        </CardHeader>

        <CardContent className="space-y-2.5">
          {audit.map((row) => (
            <div key={row.label} className="flex items-start gap-3 border-b pb-2 text-sm last:border-0">
              {row.pass ? (
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
              ) : (
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
              )}
              <div>
                <p className={row.pass ? "" : "font-medium"}>{row.label}</p>
                {!row.pass ? <p className="text-xs text-muted-foreground">{row.hint}</p> : null}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-1.5 font-display text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
