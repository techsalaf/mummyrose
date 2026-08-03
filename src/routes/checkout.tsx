import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/lib/cart";
import { formatNaira } from "@/lib/format";
import { checkoutSchema, type CheckoutInput, type PaymentProvider } from "@/lib/schemas";
import { placeOrder } from "@/lib/orders.functions";
import { checkCoupon } from "@/lib/coupons.functions";
import { settingsQuery } from "@/lib/queries";
import { pickPayments, pickShipping, pickWhatsApp } from "@/lib/settings";
import { quoteShipping } from "@/lib/shipping";
import { buildWhatsAppMessage, whatsAppLink } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Mummy Rose" },
      { name: "description", content: "Complete your Mummy Rose order with secure delivery details." },
      { property: "og:title", content: "Checkout — Mummy Rose" },
      { property: "og:description", content: "Complete your Mummy Rose order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const submit = useServerFn(placeOrder);
  const { user } = useAuth();
  const { data: settings } = useQuery(settingsQuery);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [provider, setProvider] = useState<PaymentProvider>("paystack");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("Nigeria");
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<{ code: string; discount: number; label: string } | null>(null);
  const verifyCoupon = useServerFn(checkCoupon);
  const couponCheck = useMutation({
    mutationFn: (code: string) => verifyCoupon({ data: { code, subtotal } }),
    onSuccess: (result) => {
      setCoupon(result);
      setCouponInput(result.code);
      toast.success(`${result.code} applied — ${result.label}`);
    },
    onError: (error: Error) => toast.error(error.message || "That code isn't valid."),
  });
  const discount = coupon ? Math.min(coupon.discount, subtotal) : 0;


  const payments = pickPayments(settings);
  const whatsapp = pickWhatsApp(settings);
  const shippingConfig = pickShipping(settings);

  const quote = useMemo(
    () => quoteShipping(shippingConfig, { subtotal, state, country }),
    [shippingConfig, subtotal, state, country],
  );

  useEffect(() => {
    if (items.length > 0) track("begin_checkout", { value: subtotal });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = useMemo(() => {
    const list: { value: PaymentProvider; label: string; hint?: string }[] = [];
    if (payments.paystack_enabled !== false)
      list.push({ value: "paystack", label: "Paystack — card, bank & USSD", hint: "Secure checkout, instant confirmation" });
    if (payments.flutterwave_enabled !== false)
      list.push({ value: "flutterwave", label: "Flutterwave", hint: "Cards and mobile money" });
    if (payments.bank_transfer_enabled !== false)
      list.push({ value: "bank_transfer", label: "Direct bank transfer", hint: "Transfer details shown after ordering" });
    if (payments.pay_on_delivery_enabled !== false)
      list.push({ value: "pay_on_delivery", label: "Pay on delivery", hint: "Available in selected cities" });
    return list;
  }, [payments]);

  useEffect(() => {
    if (options.length && !options.some((o) => o.value === provider)) setProvider(options[0].value);
  }, [options, provider]);

  const mutation = useMutation({
    mutationFn: (data: CheckoutInput) => submit({ data }),
    onSuccess: (result, variables) => {
      if (result.redirect_url) {
        window.location.href = result.redirect_url;
        return;
      }
      const order = result.order;
      track("order_placed", { value: order.total });
      if (variables.payment_provider === "whatsapp" && whatsapp.phone) {
        const message = buildWhatsAppMessage({
          order_number: order.order_number,
          customer_name: variables.customer_name,
          customer_phone: variables.customer_phone,
          customer_email: variables.customer_email,
          address_line: variables.address_line,
          city: variables.city,
          state: variables.state,
          country: variables.country,
          notes: variables.notes,
          payment_provider: "whatsapp",
          subtotal: order.subtotal,
          shipping_fee: order.shipping_fee,
          shipping_zone: order.shipping_zone,
          total: order.total,
          items: order.items,
        });
        track("whatsapp_order", { value: order.total });
        window.open(whatsAppLink(whatsapp.phone, message), "_blank", "noopener,noreferrer");
      }
      clear();
      toast.success(`Order ${order.order_number} placed`);
      navigate({ to: "/order-confirmed", search: { order: order.order_number } });
    },
    onError: (error: Error) => toast.error(error.message || "We couldn't place that order."),
  });

  if (items.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-3xl">Your cart is empty</h1>
        <Button asChild variant="clay" className="mt-6">
          <Link to="/products">Shop the pantry</Link>
        </Button>
      </div>
    );
  }

  const buildPayload = (form: FormData, chosen: PaymentProvider) => ({
    customer_name: String(form.get("customer_name") ?? ""),
    customer_email: String(form.get("customer_email") ?? ""),
    customer_phone: String(form.get("customer_phone") ?? ""),
    address_line: String(form.get("address_line") ?? ""),
    city: String(form.get("city") ?? ""),
    state: String(form.get("state") ?? ""),
    country: String(form.get("country") || "Nigeria"),
    postal_code: String(form.get("postal_code") ?? "") || null,
    notes: String(form.get("notes") ?? "") || null,
    payment_provider: chosen,
    origin: typeof window === "undefined" ? null : window.location.origin,
    coupon_code: coupon?.code ?? null,
    items: items.map((i) => ({ product_id: i.product_id, variant: i.variant, quantity: i.quantity })),
  });

  const runSubmit = (form: HTMLFormElement, chosen: PaymentProvider) => {
    const parsed = checkoutSchema.safeParse(buildPayload(new FormData(form), chosen));
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      toast.error("Please check the highlighted fields.");
      return;
    }
    setErrors({});
    mutation.mutate(parsed.data);
  };

  return (
    <div className="container-page py-12 md:py-16">
      <h1 className="font-display text-4xl">Checkout</h1>
      {!user && (
        <p className="mt-3 text-sm text-muted-foreground">
          Checking out as a guest — no account needed.{" "}
          <Link to="/account" className="underline">
            Sign in
          </Link>{" "}
          if you'd like this order saved to your profile.
        </p>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          runSubmit(event.currentTarget, provider);
        }}
        className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]"
      >
        <div className="space-y-8">
          <fieldset className="space-y-4">
            <legend className="font-display text-xl">Contact</legend>
            <Field name="customer_name" label="Full name" error={errors.customer_name} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                name="customer_email"
                label="Email"
                type="email"
                defaultValue={user?.email ?? ""}
                error={errors.customer_email}
              />
              <Field name="customer_phone" label="Phone" error={errors.customer_phone} />
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="font-display text-xl">Delivery</legend>
            <Field name="address_line" label="Street address" error={errors.address_line} />
            <div className="grid gap-4 sm:grid-cols-3">
              <Field name="city" label="City" error={errors.city} />
              <Field
                name="state"
                label="State"
                error={errors.state}
                onChange={(value) => setState(value)}
              />
              <Field name="postal_code" label="Postal code (optional)" error={errors.postal_code} />
            </div>
            <Field
              name="country"
              label="Country"
              defaultValue="Nigeria"
              error={errors.country}
              onChange={(value) => setCountry(value)}
            />
            <p className="text-xs text-muted-foreground">
              Delivery zone: <strong>{quote.zone}</strong> — {quote.fee === 0 ? "free delivery" : formatNaira(quote.fee)}
              {quote.free ? ` (free over ${formatNaira(quote.free_over)})` : ""}
            </p>
            <div>
              <Label htmlFor="notes">Delivery notes (optional)</Label>
              <Textarea id="notes" name="notes" rows={3} maxLength={1000} className="mt-1.5" />
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="font-display text-xl">Payment</legend>
            {options.map((p) => (
              <label
                key={p.value}
                className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 text-sm ${
                  provider === p.value ? "border-accent bg-accent/5" : "border-border"
                }`}
              >
                <input
                  type="radio"
                  name="payment_provider"
                  value={p.value}
                  checked={provider === p.value}
                  onChange={() => setProvider(p.value)}
                  className="mt-1 accent-[var(--accent)]"
                />
                <span>
                  <span className="block font-medium">{p.label}</span>
                  {p.hint && <span className="block text-xs text-muted-foreground">{p.hint}</span>}
                </span>
              </label>
            ))}
            {provider === "bank_transfer" && payments.account_number && (
              <div className="rounded-md border border-border bg-muted/40 p-3 text-xs">
                <p className="font-medium">Transfer to</p>
                <p>
                  {payments.bank_name} · {payments.account_name} · {payments.account_number}
                </p>
                <p className="mt-1 text-muted-foreground">Use your order number as the transfer reference.</p>
              </div>
            )}
          </fieldset>
        </div>

        <aside className="surface-card h-fit rounded-lg p-6">
          <h2 className="font-display text-xl">Order summary</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map((i) => (
              <li key={`${i.product_id}-${i.variant}`} className="flex justify-between gap-3">
                <span className="text-muted-foreground">
                  {i.name}
                  {i.variant ? ` · ${i.variant}` : ""} × {i.quantity}
                </span>
                <span>{formatNaira(i.unit_price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 border-t border-border pt-4">
            <Label htmlFor="coupon">Discount code</Label>
            <div className="mt-1.5 flex gap-2">
              <Input
                id="coupon"
                value={couponInput}
                onChange={(e) => setCouponInput(e.currentTarget.value.toUpperCase())}
                placeholder="e.g. ROSE10"
                maxLength={40}
              />
              {coupon ? (
                <Button type="button" variant="outline" onClick={() => { setCoupon(null); setCouponInput(""); }}>
                  Remove
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  disabled={couponCheck.isPending || couponInput.trim().length < 2}
                  onClick={() => couponCheck.mutate(couponInput)}
                >
                  {couponCheck.isPending ? "Checking…" : "Apply"}
                </Button>
              )}
            </div>
            {coupon && (
              <p className="mt-2 text-xs text-accent">
                {coupon.code} applied — {coupon.label}
              </p>
            )}
          </div>
          <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatNaira(subtotal)}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-accent">
                <dt>Discount ({coupon?.code})</dt>
                <dd>−{formatNaira(discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Delivery ({quote.zone})</dt>
              <dd>{quote.fee === 0 ? "Free" : formatNaira(quote.fee)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 font-display text-lg">
              <dt>Total</dt>
              <dd>{formatNaira(Math.max(0, subtotal - discount) + quote.fee)}</dd>
            </div>
          </dl>

          <Button type="submit" variant="clay" size="lg" className="mt-6 w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Placing order…" : "Place order"}
          </Button>

          {whatsapp.enabled !== false && whatsapp.phone && (
            <>
              <div className="my-4 flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
                <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
              </div>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                disabled={mutation.isPending}
                onClick={(event) => {
                  const form = event.currentTarget.closest("form");
                  if (form) runSubmit(form, "whatsapp");
                }}
              >
                Send order on WhatsApp
              </Button>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Your order is created and reserved either way. <strong>Place order</strong> is fastest — you pay or
                confirm now and get a tracking number instantly. <strong>Send order on WhatsApp</strong> opens a chat
                with the full order details so a real person can confirm delivery and payment with you — great if you
                prefer not to pay online, but replies come during business hours.
              </p>

            </>
          )}
        </aside>
      </form>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  defaultValue,
  error,
  onChange,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string;
  error?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        className="mt-1.5"
        onChange={onChange ? (e) => onChange(e.currentTarget.value) : undefined}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
