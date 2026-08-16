import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { verifyFlutterwave, verifyPaystack } from "./payments.server";

export const verifyPayment = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        provider: z.enum(["paystack", "flutterwave"]),
        reference: z.string().trim().min(4).max(120),
        transaction_id: z.string().trim().max(60).optional().nullable(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    if (data.provider === "paystack") return await verifyPaystack(data.reference);
    return await verifyFlutterwave(data.reference, data.transaction_id ?? null);
  });

/** Staff-only: read the Paystack configuration WITHOUT the secret key. */
export const getPaystackConfig = createServerFn({ method: "GET" }).handler(async () => {
  const { requireStaff } = await import("./orders.server");
  await requireStaff();
  const { readPaystackStoredConfig } = await import("./payments.server");
  return await readPaystackStoredConfig();
});

/** Staff-only: persist the Paystack configuration. The secret is encrypted at rest. */
export const savePaystackConfig = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        enabled: z.boolean(),
        mode: z.enum(["test", "live"]),
        public_key: z.string().trim().max(300).optional().nullable(),
        secret_key: z.string().trim().max(500).optional().nullable(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { requireStaff, logAudit } = await import("./orders.server");
    const actor = await requireStaff();
    const { savePaystackConfig: saveServer } = await import("./payments.server");
    const result = await saveServer(data);
    await logAudit(actor, "payment_config_update", "settings", "payments", {
      provider: "paystack",
      enabled: data.enabled,
      mode: data.mode,
      secret_changed: Boolean(data.secret_key),
      public_key_changed: Boolean(data.public_key),
    });
    return result;
  });

/** Staff-only: safely verify the stored Paystack secret against Paystack. */
export const testPaystackConnection = createServerFn({ method: "POST" }).handler(async () => {
  const { requireStaff } = await import("./orders.server");
  await requireStaff();
  const { testPaystackConnectionServer } = await import("./payments.server");
  return await testPaystackConnectionServer();
});

/** Staff-only: cancel an unpaid order and restore its reserved stock (idempotent). */
export const cancelOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ order_id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { requireStaff, logAudit, restoreOrderStock } = await import("./orders.server");
    const actor = await requireStaff();
    const result = await restoreOrderStock(data.order_id);
    await logAudit(actor, "order_cancelled_restock", "orders", data.order_id, { result });
    return result;
  });
