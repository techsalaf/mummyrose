import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Monitor, RefreshCw, Smartphone, Tablet, ExternalLink } from "lucide-react";

import { AdminHeader } from "@/components/admin/resource-manager";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  SEO_PAGES,
  resolvePageSeo,
  usePageSeoMap,
  useSiteConfig,
} from "@/lib/site-config";
import { SeoPreview } from "@/components/admin/settings-fields";

export const Route = createFileRoute("/admin/preview")({
  component: AdminPreview,
});

const DEVICES = [
  { id: "mobile", label: "Mobile", width: 390, icon: Smartphone },
  { id: "tablet", label: "Tablet", width: 834, icon: Tablet },
  { id: "desktop", label: "Desktop", width: 1280, icon: Monitor },
] as const;

function AdminPreview() {
  const [device, setDevice] = useState<(typeof DEVICES)[number]["id"]>("desktop");
  const [path, setPath] = useState(SEO_PAGES[0].path);
  const [nonce, setNonce] = useState(0);

  const { branding, seo } = useSiteConfig();
  const pageSeoMap = usePageSeoMap();
  const page = resolvePageSeo(pageSeoMap, path);

  const title = page.title?.trim() || String(seo.title ?? "");
  const description = page.description?.trim() || seo.description;
  const keywords = page.keywords?.trim() || seo.keywords;
  const ogImage = page.og_image?.trim() || seo.og_image;

  const checks = [
    { label: "Meta title set", ok: Boolean(title), detail: `${title.length} chars` },
    { label: "Title ≤ 60 chars", ok: title.length > 0 && title.length <= 60, detail: `${title.length}/60` },
    { label: "Meta description set", ok: Boolean(description), detail: `${description.length} chars` },
    {
      label: "Description ≤ 160 chars",
      ok: description.length > 0 && description.length <= 160,
      detail: `${description.length}/160`,
    },
    { label: "Social image set", ok: Boolean(ogImage), detail: ogImage ? "og:image ready" : "falls back to screenshot" },
    { label: "Keywords set", ok: Boolean(keywords), detail: keywords ? "custom" : "optional" },
    { label: "Favicon set", ok: Boolean(branding.favicon_url), detail: branding.favicon_url ? "custom" : "default" },
    { label: "Logo set", ok: Boolean(branding.logo_url), detail: branding.logo_url ? "custom" : "wordmark only" },
  ];

  const width = DEVICES.find((d) => d.id === device)!.width;

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Storefront preview & test mode"
        description="Check any page across devices and validate its meta tags, social card and branding before you publish changes."
        actions={
          <>
            <Button variant="outline" onClick={() => setNonce((n) => n + 1)}>
              <RefreshCw className="size-4" /> Reload
            </Button>
            <Button asChild variant="outline">
              <a href={path} target="_blank" rel="noreferrer">
                <ExternalLink className="size-4" /> Open page
              </a>
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-56">
          <Select value={path} onValueChange={setPath}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SEO_PAGES.map((p) => (
                <SelectItem key={p.path} value={p.path}>
                  {p.label} — {p.path}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-1.5">
          {DEVICES.map((d) => (
            <Button
              key={d.id}
              size="sm"
              variant={device === d.id ? "default" : "outline"}
              onClick={() => setDevice(d.id)}
            >
              <d.icon className="size-4" /> {d.label}
            </Button>
          ))}
        </div>
        <Badge variant="secondary">{width}px viewport</Badge>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-4">
          <div className="mx-auto" style={{ width, maxWidth: "100%" }}>
            <iframe
              key={`${path}-${device}-${nonce}`}
              src={path}
              title={`Preview of ${path}`}
              className="h-[70vh] w-full rounded-md border border-border bg-background"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Meta & SEO test</CardTitle>
          <CardDescription>
            These are the exact tags the storefront applies for {path}. Edit them in Settings → SEO &amp; meta.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2 sm:grid-cols-2">
            {checks.map((c) => (
              <div key={c.label} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                <span>{c.label}</span>
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  {c.detail}
                  <Badge variant={c.ok ? "secondary" : "destructive"}>{c.ok ? "Pass" : "Fix"}</Badge>
                </span>
              </div>
            ))}
          </div>
          <div className="grid gap-4">
            <SeoPreview
              url={path}
              title={title}
              description={description}
              image={ogImage || undefined}
              siteName={branding.name}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
