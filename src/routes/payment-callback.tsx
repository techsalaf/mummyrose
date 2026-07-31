import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { verifyPayment } from "@/lib/payments.functions";

type Search = {
  provider?: "paystack" | "flutterwave";
  reference?: string;
  trxref?: string;
  tx_ref?: string;
  transaction_id?: string;
  status?: string;
};

export const Route = createFileRoute("/payment-callback")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    provider: search.provider === "flutterwave" ? "flutterwave" : "paystack",
    reference: typeof search.reference === "string" ? search.reference : undefined,
    trxref: typeof search.trxref === "string" ? search.trxref : undefined,
    tx_ref: typeof search.tx_ref === "string" ? search.tx_ref : undefined,
    transaction_id: typeof search.transaction_id === "string" ? search.transaction_id : undefined,
    status: typeof search.status === "string" ? search.status : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Confirming payment — Mummy Rose" },
      { name: "description", content: "We are confirming your Mummy Rose payment." },
      { property: "og:title", content: "Confirming payment — Mummy Rose" },
      { property: "og:description", content: "We are confirming your Mummy Rose payment." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PaymentCallback,
});

function PaymentCallback() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const verify = useServerFn(verifyPayment);
  const started = useRef(false);

  const reference = search.reference ?? search.trxref ?? search.tx_ref ?? "";

  const mutation = useMutation({
    mutationFn: () =>
      verify({
        data: {
          provider: search.provider ?? "paystack",
          reference,
          transaction_id: search.transaction_id ?? null,
        },
      }),
    onSuccess: (result) => {
      if (result.ok && result.order?.order_number) {
        navigate({ to: "/order-confirmed", search: { order: result.order.order_number } });
      }
    },
  });

  useEffect(() => {
    if (started.current || !reference) return;
    started.current = true;
    mutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference]);

  const failed = !reference || mutation.isError || (mutation.data && !mutation.data.ok);

  return (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-3xl">
        {failed ? "We couldn't confirm that payment" : "Confirming your payment…"}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {failed
          ? "If money left your account, contact us with your order number and we'll sort it out immediately."
          : "Please keep this page open for a moment."}
      </p>
      {failed && (
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild variant="clay">
            <Link to="/track-order">Track your order</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/contact">Contact support</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
