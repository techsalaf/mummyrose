import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBankDetails } from "@/lib/payment-methods.functions";

export const Route = createFileRoute("/order-confirmed")({
  validateSearch: z.object({ order: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Order Confirmed — Mummy Rose" },
      { name: "description", content: "Thank you for your Mummy Rose order." },
      { property: "og:title", content: "Order Confirmed — Mummy Rose" },
      { property: "og:description", content: "Thank you for your Mummy Rose order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderConfirmed,
});

function OrderConfirmed() {
  const { order } = Route.useSearch();
  return (
    <div className="container-page py-24 text-center">
      <CheckCircle2 className="mx-auto size-12 text-accent" />
      <h1 className="mt-6 font-display text-4xl">Thank you — your order is in</h1>
      <p className="mt-4 text-muted-foreground">
        {order ? (
          <>
            Your order number is <span className="font-display text-foreground">{order}</span>. We've emailed
            payment and delivery details.
          </>
        ) : (
          "We've emailed your payment and delivery details."
        )}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild variant="clay">
          <Link to="/track-order">Track your order</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/products">Continue shopping</Link>
        </Button>
      </div>
    </div>
  );
}
