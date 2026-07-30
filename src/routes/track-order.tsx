import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trackOrder } from "@/lib/orders.functions";
import { formatDate, formatNaira } from "@/lib/format";

export const Route = createFileRoute("/track-order")({
  head: () => ({
    meta: [
      { title: "Track Your Order — Mummy Rose" },
      {
        name: "description",
        content: "Enter your order number and email to see the live status of your Mummy Rose delivery.",
      },
      { property: "og:title", content: "Track Your Order — Mummy Rose" },
      { property: "og:description", content: "Check the live status of your Mummy Rose delivery." },
    ],
  }),
  component: TrackOrderPage,
});

function TrackOrderPage() {
  const lookup = useServerFn(trackOrder);
  const [notFound, setNotFound] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: { order_number: string; email: string }) => lookup({ data }),
    onSuccess: (result) => setNotFound(!result),
  });

  const order = mutation.data;

  return (
    <div className="container-page max-w-2xl py-12 md:py-16">
      <p className="eyebrow text-accent">Order status</p>
      <h1 className="mt-3 font-display text-4xl">Track your order</h1>

      <form
        className="mt-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          setNotFound(false);
          mutation.mutate({
            order_number: String(form.get("order_number") ?? "").trim(),
            email: String(form.get("email") ?? "").trim(),
          });
        }}
      >
        <div>
          <Label htmlFor="order_number">Order number</Label>
          <Input id="order_number" name="order_number" placeholder="MR-20260101-AB12X" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="email">Email used at checkout</Label>
          <Input id="email" name="email" type="email" className="mt-1.5" />
        </div>
        <Button type="submit" variant="clay" disabled={mutation.isPending}>
          {mutation.isPending ? "Checking…" : "Track order"}
        </Button>
      </form>

      {notFound && (
        <p className="mt-8 text-sm text-destructive">
          We couldn't find an order with those details. Check the number and email and try again.
        </p>
      )}

      {order && (
        <div className="surface-card mt-10 rounded-lg p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-display text-xl">{order.order_number}</p>
              <p className="text-sm text-muted-foreground">Placed {formatDate(order.created_at)}</p>
            </div>
            <div className="text-right text-sm">
              <p className="rounded-full bg-secondary px-3 py-1 capitalize">{order.status}</p>
              <p className="mt-1 text-muted-foreground capitalize">Payment: {order.payment_status}</p>
            </div>
          </div>

          <ul className="mt-6 divide-y divide-border text-sm">
            {(order.order_items ?? []).map((item, i) => (
              <li key={i} className="flex justify-between gap-3 py-2">
                <span className="text-muted-foreground">
                  {item.product_name}
                  {item.variant ? ` · ${item.variant}` : ""} × {item.quantity}
                </span>
                <span>{formatNaira(item.line_total)}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-1 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatNaira(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd>{formatNaira(order.shipping_fee)}</dd>
            </div>
            <div className="flex justify-between font-display text-lg">
              <dt>Total</dt>
              <dd>{formatNaira(order.total)}</dd>
            </div>
          </dl>

          <p className="mt-4 text-sm text-muted-foreground">
            Delivering to {order.address_line}, {order.city}, {order.state}, {order.country}
          </p>
        </div>
      )}
    </div>
  );
}
