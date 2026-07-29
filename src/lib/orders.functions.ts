import { createServerFn } from "@tanstack/react-start";
import { checkoutSchema } from "./schemas";
import { createOrder, lookupOrder } from "./orders.server";
import { z } from "zod";

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => checkoutSchema.parse(data))
  .handler(async ({ data }) => {
    return await createOrder(data, null);
  });

export const trackOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ order_number: z.string().trim().min(4).max(40), email: z.string().trim().email() }).parse(data),
  )
  .handler(async ({ data }) => {
    return await lookupOrder(data.order_number, data.email);
  });
