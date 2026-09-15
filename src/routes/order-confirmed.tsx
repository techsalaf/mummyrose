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
  const fetchBank = useServerFn(getBankDetails);
  const { data: bank } = useQuery({
    queryKey: ["bank-details", order],
    queryFn: () => fetchBank({ data: { order_number: order! } }),
    enabled: Boolean(order),
    staleTime: 60_000,
  });
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
      {bank && (
        <div className="mx-auto mt-6 max-w-md text-left rounded-xl border border-accent/40 bg-accent/5 p-5 shadow-xs">
          <p className="font-semibold text-accent uppercase tracking-wider text-xs">
            Direct Bank Transfer Details
          </p>
          <div className="mt-3 space-y-2 rounded-lg bg-card p-4 border border-border text-sm">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Bank Name</span>
              <strong className="text-foreground">{bank.bank_name}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Account Number</span>
              <strong className="font-mono text-base tracking-wider text-foreground">{bank.account_number}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Account Name</span>
              <strong className="text-foreground">{bank.account_name}</strong>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground">Payment Narration</span>
              <strong className="text-accent font-mono">{order}</strong>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
            Please transfer the order total to this account using your Order Number as the narration. We will verify and dispatch your spices immediately.
          </p>
        </div>
      )}
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
