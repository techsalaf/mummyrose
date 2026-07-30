import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/lib/cart";
import { formatNaira } from "@/lib/format";
import { checkoutSchema, type CheckoutInput } from "@/lib/schemas";
import { placeOrder } from "@/lib/orders.functions";

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

const payments = [
  { value: "paystack", label: "Paystack (card / transfer)" },
  { value: "flutterwave", label: "Flutterwave" },
  { value: "bank_transfer", label: "Direct bank transfer" },
  { value: "pay_on_delivery", label: "Pay on delivery (Lagos only)" },
] as const;

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const submit = useServerFn(placeOrder);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [provider, setProvider] = useState<CheckoutInput["payment_provider"]>("paystack");

  const shipping = items.length === 0 ? 0 : subtotal >= 50000 ? 0 : 2500;

  const mutation = useMutation({
    mutationFn: (data: CheckoutInput) => submit({ data }),
    onSuccess: (order) => {
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

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      customer_name: String(form.get("customer_name") ?? ""),
      customer_email: String(form.get("customer_email") ?? ""),
      customer_phone: String(form.get("customer_phone") ?? ""),
      address_line: String(form.get("address_line") ?? ""),
      city: String(form.get("city") ?? ""),
      state: String(form.get("state") ?? ""),
      country: String(form.get("country") || "Nigeria"),
      postal_code: String(form.get("postal_code") ?? "") || null,
      notes: String(form.get("notes") ?? "") || null,
      payment_provider: provider,
      items: items.map((i) => ({ product_id: i.product_id, variant: i.variant, quantity: i.quantity })),
    };
    const parsed = checkoutSchema.safeParse(payload);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    mutation.mutate(parsed.data);
  };

  return (
    <div className="container-page py-12 md:py-16">
      <h1 className="font-display text-4xl">Checkout</h1>

      <form onSubmit={onSubmit} className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          <fieldset className="space-y-4">
            <legend className="font-display text-xl">Contact</legend>
            <Field name="customer_name" label="Full name" error={errors.customer_name} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="customer_email" label="Email" type="email" error={errors.customer_email} />
              <Field name="customer_phone" label="Phone" error={errors.customer_phone} />
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="font-display text-xl">Delivery</legend>
            <Field name="address_line" label="Street address" error={errors.address_line} />
            <div className="grid gap-4 sm:grid-cols-3">
              <Field name="city" label="City" error={errors.city} />
              <Field name="state" label="State" error={errors.state} />
              <Field name="postal_code" label="Postal code (optional)" error={errors.postal_code} />
            </div>
            <Field name="country" label="Country" defaultValue="Nigeria" error={errors.country} />
            <div>
              <Label htmlFor="notes">Delivery notes (optional)</Label>
              <Textarea id="notes" name="notes" rows={3} maxLength={1000} className="mt-1.5" />
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="font-display text-xl">Payment</legend>
            {payments.map((p) => (
              <label
                key={p.value}
                className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm ${
                  provider === p.value ? "border-accent bg-accent/5" : "border-border"
                }`}
              >
                <input
                  type="radio"
                  name="payment_provider"
                  value={p.value}
                  checked={provider === p.value}
                  onChange={() => setProvider(p.value)}
                  className="accent-[var(--accent)]"
                />
                {p.label}
              </label>
            ))}
            <p className="text-xs text-muted-foreground">
              Payment instructions are emailed after you place the order. Nothing is charged on this page.
            </p>
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
          <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatNaira(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd>{shipping === 0 ? "Free" : formatNaira(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 font-display text-lg">
              <dt>Total</dt>
              <dd>{formatNaira(subtotal + shipping)}</dd>
            </div>
          </dl>
          <Button type="submit" variant="clay" size="lg" className="mt-6 w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Placing order…" : "Place order"}
          </Button>
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
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string;
  error?: string;
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} defaultValue={defaultValue} className="mt-1.5" />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
