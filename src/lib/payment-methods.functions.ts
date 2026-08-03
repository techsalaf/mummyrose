import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getPaymentMethods = createServerFn({ method: "GET" }).handler(async () => {
  const { readPaymentMethodFlags } = await import("./payment-methods.server");
  return await readPaymentMethodFlags();
});

export const getBankDetails = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ order_number: z.string().min(3).max(64) }).parse(data))
  .handler(async ({ data }) => {
    const { readBankDetailsForOrder } = await import("./payment-methods.server");
    return await readBankDetailsForOrder(data.order_number);
  });
