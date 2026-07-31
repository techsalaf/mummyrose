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
