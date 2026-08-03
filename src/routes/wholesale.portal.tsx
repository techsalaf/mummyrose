import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { BellRing, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { placeOrder } from "@/lib/orders.functions";
import { productsQuery } from "@/lib/queries";
import { effectivePrice, formatDateTime, formatNaira } from "@/lib/format";
import { myWholesaleAccountQuery, myWholesaleOrdersQuery, TIER_LABELS } from "@/lib/wholesale";

export const Route = createFileRoute("/wholesale/portal")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Wholesale Portal — Trade Orders & Tracking | Mummy Rose" },
      {
        name: "description",
        content:
          "Manage your Mummy Rose trade account: see your tier discount, place bulk orders at wholesale pricing and track every shipment.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WholesalePortal,
});

type OrderRow = {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  total: number;
  discount_percent: number | null;
  order_type: string | null;
  created_at: string;
  order_items: { id: string; product_name: string; quantity: number; line_total: number }[];
};

function WholesalePortal() {
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();
  const account = useQuery(myWholesaleAccountQuery(user?.id));
  const orders = useQuery(myWholesaleOrdersQuery(user?.id));
  const products = useQuery(productsQuery);
  const submit = useServerFn(placeOrder);

  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [form, setForm] = useState<Record<string, string>>({ country: "Nigeria", payment_provider: "bank_transfer" });

  const discount = Number(account.data?.discount_percent ?? 0);
  const approved = account.data?.status === "approved";

  const productRows = (products.data ?? []) as unknown as {
    id: string;
    name: string;
    price: number;
    discount_price: number | null;
    stock_quantity: number;
  }[];

  const selected = useMemo(
    () =>
      productRows
        .map((product) => ({ product, quantity: Number(quantities[product.id] ?? 0) }))
        .filter((row) => row.quantity > 0),
    [productRows, quantities],
  );

  const subtotal = selected.reduce(
    (sum, row) => sum + effectivePrice(row.product) * (1 - discount / 100) * row.quantity,
    0,
  );

  const place = useMutation({
    mutationFn: async () => {
      if (!approved) throw new Error("Your trade account must be approved before placing wholesale orders.");

      if (selected.length === 0) throw new Error("Add at least one product to your order.");
      const result = await submit({
        data: {
          customer_name: form.customer_name || account.data?.contact_name || "",
          customer_email: form.customer_email || account.data?.email || "",
          customer_phone: form.customer_phone || account.data?.phone || "",
          address_line: form.address_line ?? "",
          city: form.city ?? "",
          state: form.state ?? "",
          country: form.country ?? "Nigeria",
          postal_code: null,
          notes: form.notes ?? null,
          payment_provider: (form.payment_provider ?? "bank_transfer") as "bank_transfer",
          origin: window.location.origin,
          order_type: "wholesale",
          wholesale_account_id: account.data?.id ?? null,
          items: selected.map((row) => ({ product_id: row.product.id, variant: null, quantity: row.quantity })),
        },
      });
      return result;
    },
    onSuccess: async (result) => {
      toast.success(`Order ${result.order.order_number} submitted`);
      setQuantities({});
      await queryClient.invalidateQueries({ queryKey: ["wholesale", "orders", user?.id ?? "anon"] });
      if (result.redirect_url) window.location.href = result.redirect_url;
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (loading) {
    return (
      <div className="container-page py-24 text-center">
        <Loader2 className="mx-auto size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <Empty
        title="Sign in to your trade account"
        body="The wholesale portal shows your tier pricing, order pad and shipment tracking."
        cta={{ to: "/account", label: "Sign in" }}
      />
    );
  }

  if (account.isLoading) {
    return (
      <div className="container-page py-24 text-center">
        <Loader2 className="mx-auto size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!account.data) {
    return (
      <Empty
        title="No trade account yet"
        body="Apply for wholesale pricing and we'll review your business within one working day."
        cta={{ to: "/wholesale/apply", label: "Apply for wholesale" }}
      />
    );
  }

  const orderRows = (orders.data ?? []) as unknown as OrderRow[];

  return (
    <div className="container-page py-12 md:py-16">
      <p className="eyebrow text-muted-foreground">Wholesale portal</p>
      <h1 className="mt-2 font-display text-3xl font-semibold md:text-4xl">{account.data.company}</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Account status</p>
            <Badge className="mt-2" variant={approved ? "default" : "secondary"}>
              {account.data.status}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Tier</p>
            <p className="mt-1.5 font-display text-xl font-semibold">
              {TIER_LABELS[account.data.tier] ?? account.data.tier}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Your discount</p>
            <p className="mt-1.5 font-display text-xl font-semibold">{discount}% off retail</p>
          </CardContent>
        </Card>
      </div>

      {!approved ? (
        <div className="mt-6 flex items-start gap-3 rounded-md border border-accent/40 bg-accent/5 p-4 text-sm">
          <BellRing className="mt-0.5 size-4 shrink-0 text-accent" />
          <div>
            <p className="font-medium">
              {account.data.status === "pending"
                ? "Application under review"
                : `Application ${account.data.status}`}
            </p>
            <p className="mt-1 text-muted-foreground">
              {account.data.status === "pending"
                ? "Our trade team reviews new accounts within one working day. You can browse the order pad now — trade pricing and trade ordering unlock the moment your account is approved."
                : "Trade ordering is disabled for this account. Reply to our last email or contact the trade desk and we'll take another look."}
            </p>
            <p className="mt-2 text-muted-foreground">
              Need stock today? You can still buy at retail prices in the shop.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex items-start gap-3 rounded-md border border-primary/30 bg-primary/5 p-4 text-sm">
          <BellRing className="mt-0.5 size-4 shrink-0 text-primary" />
          <p>
            Account approved on the <strong>{TIER_LABELS[account.data.tier] ?? account.data.tier}</strong> tier —{" "}
            <strong>{discount}% off</strong> every retail price, applied automatically on the order pad.
          </p>
        </div>
      )}


      <Tabs defaultValue="order" className="mt-10">
        <TabsList>
          <TabsTrigger value="order">Order pad</TabsTrigger>
          <TabsTrigger value="orders">My orders</TabsTrigger>
          <TabsTrigger value="details">Account details</TabsTrigger>
        </TabsList>

        <TabsContent value="order" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Trade price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="w-28">Qty</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productRows.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>
                        {formatNaira(effectivePrice(product) * (1 - discount / 100))}
                        {discount > 0 ? (
                          <span className="ml-1 text-xs text-muted-foreground line-through">
                            {formatNaira(effectivePrice(product))}
                          </span>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{product.stock_quantity}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          value={quantities[product.id] ?? ""}
                          onChange={(e) => setQuantities((prev) => ({ ...prev, [product.id]: e.target.value }))}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-base">Delivery &amp; payment</CardTitle>
                <CardDescription>Delivery is quoted on the order confirmation.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  ["customer_name", "Contact name"],
                  ["customer_email", "Email"],
                  ["customer_phone", "Phone"],
                  ["address_line", "Delivery address"],
                  ["city", "City"],
                  ["state", "State"],
                  ["country", "Country"],
                ].map(([name, label]) => (
                  <div key={name}>
                    <Label htmlFor={name}>{label}</Label>
                    <Input
                      id={name}
                      className="mt-1.5"
                      value={
                        form[name] ??
                        (name === "customer_name"
                          ? (account.data?.contact_name ?? "")
                          : name === "customer_email"
                            ? (account.data?.email ?? "")
                            : name === "customer_phone"
                              ? (account.data?.phone ?? "")
                              : "")
                      }
                      onChange={(e) => setForm((prev) => ({ ...prev, [name]: e.target.value }))}
                    />
                  </div>
                ))}
                <div>
                  <Label>Payment method</Label>
                  <Select
                    value={form.payment_provider ?? "bank_transfer"}
                    onValueChange={(value) => setForm((prev) => ({ ...prev, payment_provider: value }))}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank_transfer">Bank transfer (invoice)</SelectItem>
                      <SelectItem value="paystack">Paystack</SelectItem>
                      <SelectItem value="flutterwave">Flutterwave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between border-t pt-3 text-sm">
                  <span className="text-muted-foreground">Subtotal ({selected.length} lines)</span>
                  <span className="font-medium">{formatNaira(subtotal)}</span>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  disabled={place.isPending || !approved}
                  onClick={() => place.mutate()}
                >
                  {place.isPending ? <Loader2 className="size-4 animate-spin" /> : null} Submit trade order
                </Button>
                {!approved ? (
                  <p className="text-center text-xs text-muted-foreground">
                    Trade ordering unlocks once your account is approved.
                  </p>
                ) : null}

              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Placed</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                      No orders yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  orderRows.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.order_number}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDateTime(order.created_at)}
                      </TableCell>
                      <TableCell className="text-sm">{order.order_items?.length ?? 0}</TableCell>
                      <TableCell>{formatNaira(order.total)}</TableCell>
                      <TableCell>
                        <Badge variant={order.payment_status === "paid" ? "default" : "secondary"}>
                          {order.payment_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{order.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <Card>
            <CardContent className="grid gap-3 pt-6 text-sm sm:grid-cols-2">
              <Detail label="Company" value={account.data.company} />
              <Detail label="Contact" value={account.data.contact_name} />
              <Detail label="Email" value={account.data.email} />
              <Detail label="Phone" value={account.data.phone ?? "—"} />
              <Detail label="Country" value={account.data.country ?? "—"} />
              <Detail label="Monthly volume" value={account.data.monthly_volume ?? "—"} />
              <Detail label="Applied" value={formatDateTime(account.data.created_at)} />
              <Detail label="Tier" value={TIER_LABELS[account.data.tier] ?? account.data.tier} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5">{value}</p>
    </div>
  );
}

function Empty({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta: { to: "/account" | "/wholesale/apply"; label: string };
}) {
  return (
    <div className="container-page max-w-lg py-20 text-center">
      <h1 className="font-display text-3xl font-semibold">{title}</h1>
      <p className="mt-3 text-muted-foreground">{body}</p>
      <Button className="mt-6" asChild>
        <Link to={cta.to}>{cta.label}</Link>
      </Button>
    </div>
  );
}
