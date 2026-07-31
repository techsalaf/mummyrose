import { createFileRoute } from "@tanstack/react-router";
import { timingSafeEqual } from "crypto";

export const Route = createFileRoute("/api/public/webhooks/flutterwave")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const hash = process.env.FLUTTERWAVE_WEBHOOK_HASH;
        if (!hash) return new Response("Not configured", { status: 503 });

        const provided = request.headers.get("verif-hash") ?? "";
        const a = Buffer.from(provided);
        const b = Buffer.from(hash);
        if (a.length !== b.length || !timingSafeEqual(a, b)) {
          return new Response("Invalid signature", { status: 401 });
        }

        const event = (await request.json()) as {
          event?: string;
          data?: { tx_ref?: string; status?: string; id?: number };
        };
        const reference = event.data?.tx_ref;
        if (!reference) return new Response("ok");

        const { verifyFlutterwave, markFailed } = await import("@/lib/payments.server");
        if (event.data?.status === "successful") {
          await verifyFlutterwave(reference, event.data.id ? String(event.data.id) : null);
        } else {
          await markFailed(reference);
        }
        return new Response("ok");
      },
    },
  },
});
