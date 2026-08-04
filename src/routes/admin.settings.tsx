import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { AdminHeader } from "@/components/admin/resource-manager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminSettingsQuery } from "@/lib/admin-queries";
import { upsertRow } from "@/lib/admin-mutations";
import { DEFAULT_SHIPPING } from "@/lib/shipping";
import {
  DEFAULT_BRANDING,
  DEFAULT_THEME,
  DEFAULT_HOME,
  DEFAULT_FOOTER,
  DEFAULT_SEO_META,
  type HomePromise,
  type HomeSectionId,
  type PageSeo,
} from "@/lib/site-config";
import {
  ImageField,
  ColorField,
  FontField,
  PromisesEditor,
  SectionOrderEditor,
  PageSeoEditor,
  SeoPreview,
} from "@/components/admin/settings-fields";



export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

type Group = Record<string, unknown>;

function AdminSettings() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(adminSettingsQuery);
  const [store, setStore] = useState<Group>({});
  const [shipping, setShipping] = useState<Group>({});
  const [payments, setPayments] = useState<Group>({});
  const [whatsapp, setWhatsapp] = useState<Group>({});
  const [seo, setSeo] = useState<Group>({});
  const [branding, setBranding] = useState<Group>({});
  const [theme, setTheme] = useState<Group>({});
  const [home, setHome] = useState<Group>({});
  const [footer, setFooter] = useState<Group>({});
  const [pagesSeo, setPagesSeo] = useState<Record<string, Partial<PageSeo>>>({});
  const [zonesText, setZonesText] = useState("");


  useEffect(() => {
    if (!data) return;
    setStore(data.store ?? {});
    setShipping(data.shipping ?? {});
    setPayments(data.payments ?? {});
    setWhatsapp(data.whatsapp ?? {});
    setSeo({ ...DEFAULT_SEO_META, ...(data.seo ?? {}) });
    setBranding({ ...DEFAULT_BRANDING, ...(data.branding ?? {}) });
    setTheme({ ...DEFAULT_THEME, ...(data.theme ?? {}) });
    setHome({ ...DEFAULT_HOME, ...(data.home ?? {}) });
    setFooter({ ...DEFAULT_FOOTER, ...(data.footer ?? {}) });
    setPagesSeo((data.pages_seo ?? {}) as Record<string, Partial<PageSeo>>);
    setZonesText(JSON.stringify((data.shipping?.zones ?? []) as unknown[], null, 2));

  }, [data]);


  const save = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: Group }) =>
      await upsertRow("site_settings", { key, value, updated_at: new Date().toISOString() }, "key"),
    onSuccess: async () => {
      toast.success("Settings saved");
      await queryClient.invalidateQueries({ queryKey: adminSettingsQuery.queryKey });
      await queryClient.invalidateQueries({ queryKey: ["site_settings"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (isLoading) return <Loader2 className="size-4 animate-spin text-muted-foreground" />;

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Settings"
        description="Brand identity, colours, fonts, meta tags, home page content, footer, delivery, payments and WhatsApp — every change is live on the storefront the moment you save."
      />

      <Tabs defaultValue="brand">
        <TabsList className="flex-wrap">
          <TabsTrigger value="brand">Brand</TabsTrigger>
          <TabsTrigger value="theme">Colours &amp; fonts</TabsTrigger>
          <TabsTrigger value="home">Home page</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
          <TabsTrigger value="store">Store</TabsTrigger>
          <TabsTrigger value="shipping">Delivery</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="seo">SEO &amp; meta</TabsTrigger>
        </TabsList>

        <TabsContent value="brand">
          <Panel
            title="Brand identity"
            description="App name, tagline, logo, favicon and the announcement bar at the very top of the storefront."
            onSave={() => save.mutate({ key: "branding", value: branding })}
            pending={save.isPending}
          >
            <Text label="App / brand name" value={branding.name} onChange={(v) => setBranding({ ...branding, name: v })} />
            <Text label="Tagline" value={branding.tagline} onChange={(v) => setBranding({ ...branding, tagline: v })} />
            <ImageField
              label="Logo"
              value={branding.logo_url}
              onChange={(v) => setBranding({ ...branding, logo_url: v })}
              help="Shown in the header and footer. Transparent PNG or SVG works best."
            />
            <ImageField
              label="Favicon"
              value={branding.favicon_url}
              onChange={(v) => setBranding({ ...branding, favicon_url: v })}
              help="Square image, 32×32 or larger."
            />
            <Toggle
              label="Show announcement bar"
              value={branding.announcement_enabled}
              onChange={(v) => setBranding({ ...branding, announcement_enabled: v })}
            />
            <Text
              label="Announcement text"
              value={branding.announcement}
              onChange={(v) => setBranding({ ...branding, announcement: v })}
            />
          </Panel>
        </TabsContent>

        <TabsContent value="theme">
          <Panel
            title="Colours &amp; typography"
            description="Leave a colour blank to keep the built-in spice palette. Hex values are supported and apply in light and dark mode."
            onSave={() => save.mutate({ key: "theme", value: theme })}
            pending={save.isPending}
          >
            <ColorField label="Primary" value={theme.primary} onChange={(v) => setTheme({ ...theme, primary: v })} />
            <ColorField
              label="Text on primary"
              value={theme.primary_foreground}
              onChange={(v) => setTheme({ ...theme, primary_foreground: v })}
            />
            <ColorField label="Accent" value={theme.accent} onChange={(v) => setTheme({ ...theme, accent: v })} />
            <ColorField label="Gold / highlight" value={theme.gold} onChange={(v) => setTheme({ ...theme, gold: v })} />
            <ColorField label="Page background" value={theme.background} onChange={(v) => setTheme({ ...theme, background: v })} />
            <ColorField label="Body text" value={theme.foreground} onChange={(v) => setTheme({ ...theme, foreground: v })} />
            <ColorField label="Dark panels (ink)" value={theme.ink} onChange={(v) => setTheme({ ...theme, ink: v })} />
            <Text label="Corner radius (e.g. 0.25rem)" value={theme.radius} onChange={(v) => setTheme({ ...theme, radius: v })} />
            <FontField label="Heading font" value={theme.heading_font} onChange={(v) => setTheme({ ...theme, heading_font: v })} />
            <FontField label="Body font" value={theme.body_font} onChange={(v) => setTheme({ ...theme, body_font: v })} />
          </Panel>
        </TabsContent>

        <TabsContent value="home">
          <Panel
            title="Home page content"
            description="Hero, trust badges, section headings, story block and testimonials. Toggle any section off to hide it."
            onSave={() => save.mutate({ key: "home", value: home })}
            pending={save.isPending}
          >
            <Text label="Hero eyebrow" value={home.hero_eyebrow} onChange={(v) => setHome({ ...home, hero_eyebrow: v })} />
            <Text
              label="Hero overlay opacity (0-100)"
              type="number"
              value={home.hero_overlay}
              onChange={(v) => setHome({ ...home, hero_overlay: Number(v) })}
            />
            <Area label="Hero headline" value={home.hero_title} onChange={(v) => setHome({ ...home, hero_title: v })} />
            <Area label="Hero paragraph" value={home.hero_body} onChange={(v) => setHome({ ...home, hero_body: v })} />
            <ImageField label="Hero image" value={home.hero_image} onChange={(v) => setHome({ ...home, hero_image: v })} />
            <Text
              label="Hero image alt text (SEO)"
              value={home.hero_image_alt}
              onChange={(v) => setHome({ ...home, hero_image_alt: v })}
            />
            <SectionOrderEditor
              value={home.section_order}
              onChange={(next: HomeSectionId[]) => setHome({ ...home, section_order: next })}
            />

            <Text
              label="Primary button label"
              value={home.primary_cta_label}
              onChange={(v) => setHome({ ...home, primary_cta_label: v })}
            />
            <Text
              label="Primary button link"
              value={home.primary_cta_href}
              onChange={(v) => setHome({ ...home, primary_cta_href: v })}
            />
            <Text
              label="Secondary button label"
              value={home.secondary_cta_label}
              onChange={(v) => setHome({ ...home, secondary_cta_label: v })}
            />
            <Text
              label="Secondary button link"
              value={home.secondary_cta_href}
              onChange={(v) => setHome({ ...home, secondary_cta_href: v })}
            />
            <Toggle
              label="Show trust badges"
              value={home.promises_enabled}
              onChange={(v) => setHome({ ...home, promises_enabled: v })}
            />
            <PromisesEditor
              value={(home.promises ?? []) as HomePromise[]}
              onChange={(next) => setHome({ ...home, promises: next })}
            />
            <Toggle
              label="Show categories section"
              value={home.categories_enabled}
              onChange={(v) => setHome({ ...home, categories_enabled: v })}
            />
            <Text
              label="Categories eyebrow"
              value={home.categories_eyebrow}
              onChange={(v) => setHome({ ...home, categories_eyebrow: v })}
            />
            <Text
              label="Categories heading"
              value={home.categories_title}
              onChange={(v) => setHome({ ...home, categories_title: v })}
            />
            <Toggle
              label="Show best sellers section"
              value={home.featured_enabled}
              onChange={(v) => setHome({ ...home, featured_enabled: v })}
            />
            <Text
              label="Best sellers eyebrow"
              value={home.featured_eyebrow}
              onChange={(v) => setHome({ ...home, featured_eyebrow: v })}
            />
            <Text
              label="Best sellers heading"
              value={home.featured_title}
              onChange={(v) => setHome({ ...home, featured_title: v })}
            />
            <Toggle
              label="Show story section"
              value={home.story_enabled}
              onChange={(v) => setHome({ ...home, story_enabled: v })}
            />
            <Text label="Story eyebrow" value={home.story_eyebrow} onChange={(v) => setHome({ ...home, story_eyebrow: v })} />
            <Text label="Story heading" value={home.story_title} onChange={(v) => setHome({ ...home, story_title: v })} />
            <Area label="Story paragraph" value={home.story_body} onChange={(v) => setHome({ ...home, story_body: v })} />
            <ImageField label="Story image" value={home.story_image} onChange={(v) => setHome({ ...home, story_image: v })} />
            <Text
              label="Story image alt text (SEO)"
              value={home.story_image_alt}
              onChange={(v) => setHome({ ...home, story_image_alt: v })}
            />

            <Text
              label="Story button label"
              value={home.story_cta_label}
              onChange={(v) => setHome({ ...home, story_cta_label: v })}
            />
            <Text
              label="Story button link"
              value={home.story_cta_href}
              onChange={(v) => setHome({ ...home, story_cta_href: v })}
            />
            <Toggle
              label="Show testimonials"
              value={home.testimonials_enabled}
              onChange={(v) => setHome({ ...home, testimonials_enabled: v })}
            />
            <Text
              label="Testimonials eyebrow"
              value={home.testimonials_eyebrow}
              onChange={(v) => setHome({ ...home, testimonials_eyebrow: v })}
            />
          </Panel>
        </TabsContent>

        <TabsContent value="footer">
          <Panel
            title="Footer &amp; contact"
            description="Contact details, social links, column headings and the copyright line."
            onSave={() => save.mutate({ key: "footer", value: footer })}
            pending={save.isPending}
          >
            <Area label="About blurb" value={footer.blurb} onChange={(v) => setFooter({ ...footer, blurb: v })} />
            <Text label="Email" value={footer.email} onChange={(v) => setFooter({ ...footer, email: v })} />
            <Text label="Phone" value={footer.phone} onChange={(v) => setFooter({ ...footer, phone: v })} />
            <Text label="Address" value={footer.address} onChange={(v) => setFooter({ ...footer, address: v })} />
            <Text label="Instagram URL" value={footer.instagram} onChange={(v) => setFooter({ ...footer, instagram: v })} />
            <Text label="Facebook URL" value={footer.facebook} onChange={(v) => setFooter({ ...footer, facebook: v })} />
            <Text label="X / Twitter URL" value={footer.twitter} onChange={(v) => setFooter({ ...footer, twitter: v })} />
            <Text label="TikTok URL" value={footer.tiktok} onChange={(v) => setFooter({ ...footer, tiktok: v })} />
            <Text label="YouTube URL" value={footer.youtube} onChange={(v) => setFooter({ ...footer, youtube: v })} />
            <Text label="Shop column heading" value={footer.shop_heading} onChange={(v) => setFooter({ ...footer, shop_heading: v })} />
            <Text
              label="Business column heading"
              value={footer.business_heading}
              onChange={(v) => setFooter({ ...footer, business_heading: v })}
            />
            <Text
              label="Newsletter heading"
              value={footer.newsletter_heading}
              onChange={(v) => setFooter({ ...footer, newsletter_heading: v })}
            />
            <Text
              label="Newsletter blurb"
              value={footer.newsletter_body}
              onChange={(v) => setFooter({ ...footer, newsletter_body: v })}
            />
            <Text label="Copyright line" value={footer.copyright} onChange={(v) => setFooter({ ...footer, copyright: v })} />
          </Panel>
        </TabsContent>



        <TabsContent value="store">
          <Panel
            title="Store details"
            description="Shown in the footer, on invoices and in structured data."
            onSave={() => save.mutate({ key: "store", value: store })}
            pending={save.isPending}
          >
            <Text label="Store name" value={store.name} onChange={(v) => setStore({ ...store, name: v })} />
            <Text label="Support email" value={store.email} onChange={(v) => setStore({ ...store, email: v })} />
            <Text label="Phone" value={store.phone} onChange={(v) => setStore({ ...store, phone: v })} />
            <Text label="Currency" value={store.currency} onChange={(v) => setStore({ ...store, currency: v })} />
            <Area label="Address" value={store.address} onChange={(v) => setStore({ ...store, address: v })} />
          </Panel>
        </TabsContent>

        <TabsContent value="shipping">
          <Panel
            title="Delivery &amp; shipping"
            description="Zone fees are applied automatically at checkout based on the delivery state."
            onSave={() => {
              try {
                const zones = zonesText.trim() ? JSON.parse(zonesText) : [];
                save.mutate({ key: "shipping", value: { ...shipping, zones } });
              } catch {
                toast.error("Delivery zones must be valid JSON.");
              }
            }}
            pending={save.isPending}
          >
            <Text
              label={`Default flat fee (₦) — fallback ${DEFAULT_SHIPPING.flat_fee}`}
              value={shipping.flat_fee}
              onChange={(v) => setShipping({ ...shipping, flat_fee: Number(v) })}
              type="number"
            />
            <Text
              label="Free delivery over (₦)"
              value={shipping.free_over}
              onChange={(v) => setShipping({ ...shipping, free_over: Number(v) })}
              type="number"
            />
            <Text
              label="International fee (₦)"
              value={shipping.international_fee}
              onChange={(v) => setShipping({ ...shipping, international_fee: Number(v) })}
              type="number"
            />
            <div className="sm:col-span-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">Delivery zones (JSON)</Label>
              <Textarea
                className="mt-1.5 font-mono text-xs"
                rows={12}
                value={zonesText}
                onChange={(e) => setZonesText(e.target.value)}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Format: {`[{ "name": "Lagos", "fee": 2000, "states": ["Lagos"] }]`}
              </p>
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="payments">
          <Panel
            title="Payment methods"
            description="Toggle the methods buyers see at checkout. Card gateways require their API keys to be configured."
            onSave={() => save.mutate({ key: "payments", value: payments })}
            pending={save.isPending}
          >
            <Toggle
              label="Paystack"
              value={payments.paystack_enabled}
              onChange={(v) => setPayments({ ...payments, paystack_enabled: v })}
            />
            <Toggle
              label="Flutterwave"
              value={payments.flutterwave_enabled}
              onChange={(v) => setPayments({ ...payments, flutterwave_enabled: v })}
            />
            <Toggle
              label="Manual bank transfer"
              value={payments.bank_transfer_enabled}
              onChange={(v) => setPayments({ ...payments, bank_transfer_enabled: v })}
            />
            <Toggle
              label="Pay on delivery"
              value={payments.pay_on_delivery_enabled}
              onChange={(v) => setPayments({ ...payments, pay_on_delivery_enabled: v })}
            />
            <Text label="Bank name" value={payments.bank_name} onChange={(v) => setPayments({ ...payments, bank_name: v })} />
            <Text
              label="Account name"
              value={payments.account_name}
              onChange={(v) => setPayments({ ...payments, account_name: v })}
            />
            <Text
              label="Account number"
              value={payments.account_number}
              onChange={(v) => setPayments({ ...payments, account_number: v })}
            />
          </Panel>
        </TabsContent>

        <TabsContent value="whatsapp">
          <Panel
            title="WhatsApp ordering"
            description="When enabled, shoppers can send a complete order summary straight to this number instead of paying online."
            onSave={() => save.mutate({ key: "whatsapp", value: whatsapp })}
            pending={save.isPending}
          >
            <Toggle
              label="Enable WhatsApp ordering"
              value={whatsapp.enabled}
              onChange={(v) => setWhatsapp({ ...whatsapp, enabled: v })}
            />
            <Text
              label="Seller WhatsApp number (international format)"
              value={whatsapp.phone}
              onChange={(v) => setWhatsapp({ ...whatsapp, phone: v })}
            />
          </Panel>
        </TabsContent>

        <TabsContent value="seo">
          <Panel
            title="Default SEO"
            description="Used as the fallback title and description across the storefront."
            onSave={() => save.mutate({ key: "seo", value: seo })}
            pending={save.isPending}
          >
            <Text label="Site title" value={seo.title} onChange={(v) => setSeo({ ...seo, title: v })} />
            <Text label="Keywords" value={seo.keywords} onChange={(v) => setSeo({ ...seo, keywords: v })} />
            <Text
              label="Twitter / X handle (@brand)"
              value={seo.twitter_handle}
              onChange={(v) => setSeo({ ...seo, twitter_handle: v })}
            />
            <Text
              label="Canonical site URL"
              value={seo.site_url}
              onChange={(v) => setSeo({ ...seo, site_url: v })}
              help="e.g. https://mummyrose.com — used for canonical tags, social previews and sitemap.xml."
            />
            <Text
              label="Google Analytics 4 measurement ID"
              value={seo.ga4_id}
              onChange={(v) => setSeo({ ...seo, ga4_id: v })}
              help="Looks like G-XXXXXXXXXX. Leave empty to disable analytics tracking."
            />
            <Text
              label="Google Search Console verification token"
              value={seo.gsc_verification}
              onChange={(v) => setSeo({ ...seo, gsc_verification: v })}
              help="Paste only the content value from Google's HTML-tag verification method."
            />

            <Area label="Meta description" value={seo.description} onChange={(v) => setSeo({ ...seo, description: v })} />
            <ImageField
              label="Social share image (og:image)"
              value={seo.og_image}
              onChange={(v) => setSeo({ ...seo, og_image: v })}
              help="1200×630 works best. Link previews may cache the old image for a while."
            />
            <SeoPreview
              url="/"
              title={String(seo.title ?? "")}
              description={String(seo.description ?? "")}
              image={seo.og_image ? String(seo.og_image) : undefined}
              siteName={String(branding.name ?? "Mummy Rose")}
            />
          </Panel>

          <Panel
            title="Per-page meta"
            description="Override the title, description, keywords and social image for any storefront page, with a live search and social preview."
            onSave={() => save.mutate({ key: "pages_seo", value: pagesSeo })}
            pending={save.isPending}
          >
            <PageSeoEditor
              value={pagesSeo}
              onChange={setPagesSeo}
              siteName={String(branding.name ?? "Mummy Rose")}
            />
          </Panel>
        </TabsContent>

      </Tabs>
    </div>
  );
}

function Panel({
  title,
  description,
  children,
  onSave,
  pending,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  onSave: () => void;
  pending: boolean;
}) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">{children}</div>
        <Button className="mt-6" onClick={onSave} disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : null} Save changes
        </Button>
      </CardContent>
    </Card>
  );
}

function Text({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: unknown;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
      <Input className="mt-1.5" type={type} value={value == null ? "" : String(value)} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Area({ label, value, onChange }: { label: string; value: unknown; onChange: (value: string) => void }) {
  return (
    <div className="sm:col-span-2">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
      <Textarea className="mt-1.5" rows={3} value={value == null ? "" : String(value)} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: unknown; onChange: (value: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-md border px-3 py-2.5">
      <Label className="text-sm">{label}</Label>
      <Switch checked={Boolean(value)} onCheckedChange={onChange} />
    </div>
  );
}
