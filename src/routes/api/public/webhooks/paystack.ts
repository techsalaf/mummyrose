import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

export const Route = createFileRoute("/api/public/webhooks/paystack")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.PAYSTACK_SECRET_KEY;
        if (!secret) return new Response("Not configured", { status: 503 });

        const body = await request.text();
        const signature = request.headers.get("x-paystack-signature") ?? "";
        const expected = createHmac("sha512", secret).update(body).digest("hex");
        const a = Buffer.from(signature);
        const b = Buffer.from(expected);
        if (a.length !== b.length || !timingSafeEqual(a, b)) {
          return new Response("Invalid signature", { status: 401 });
        }

        const event = JSON.parse(body) as { event?: string; data?: { reference?: string; status?: string } };
        const reference = event.data?.reference;
        if (!reference) return new Response("ok");

        const { markPaid, markFailed } = await import("@/lib/payments.server");
        if (event.event === "charge.success" && event.data?.status === "success") {
          await markPaid(reference, "paystack", event as unknown as Record<string, unknown>);
        } else if (event.event === "charge.failed") {
          await markFailed(reference);
        }
        return new Response("ok");
      },
    },
  },
});
