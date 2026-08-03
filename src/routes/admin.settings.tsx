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
} from "@/lib/site-config";
import { ImageField, ColorField, FontField, PromisesEditor } from "@/components/admin/settings-fields";


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
    setZonesText(JSON.stringify((data.shipping?.zones ?? []) as unknown[], null, 2));
  }, [data]);


  const save = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: Group }) =>
      await upsertRow("site_settings", { key, value, updated_at: new Date().toISOString() }, "key"),
    onSuccess: async () => {
      toast.success("Settings saved");
      await queryClient.invalidateQueries({ queryKey: adminSettingsQuery.queryKey });
      await queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (isLoading) return <Loader2 className="size-4 animate-spin text-muted-foreground" />;

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Settings"
        description="Store identity, delivery zones, payment methods, WhatsApp ordering and default SEO — all live on the storefront the moment you save."
      />

      <Tabs defaultValue="store">
        <TabsList className="flex-wrap">
          <TabsTrigger value="store">Store</TabsTrigger>
          <TabsTrigger value="shipping">Delivery</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

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
            <Area label="Meta description" value={seo.description} onChange={(v) => setSeo({ ...seo, description: v })} />
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
