import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { checkoutSchema } from "./schemas";
import { createOrder, lookupOrder, resolveUserId, getShippingConfig } from "./orders.server";
import { initPaystack, initFlutterwave } from "./payments.server";
import { quoteShipping } from "./shipping";

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => checkoutSchema.parse(data))
  .handler(async ({ data }) => {
    const userId = await resolveUserId();
    const order = await createOrder(data, userId);

    if (data.payment_provider === "paystack" || data.payment_provider === "flutterwave") {
      const origin = data.origin ?? "";
      const init =
        data.payment_provider === "paystack"
          ? await initPaystack(order, data.customer_email, origin)
          : await initFlutterwave(
              order,
              { email: data.customer_email, name: data.customer_name, phone: data.customer_phone },
              origin,
            );
      return { order, redirect_url: init.kind === "redirect" ? init.url : null };
    }

    return { order, redirect_url: null };
  });

export const trackOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ order_number: z.string().trim().min(4).max(40), email: z.string().trim().email() }).parse(data),
  )
  .handler(async ({ data }) => {
    return await lookupOrder(data.order_number, data.email);
  });

export const quoteDelivery = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        subtotal: z.number().min(0).max(100000000),
        state: z.string().trim().max(120).default(""),
        country: z.string().trim().max(120).default("Nigeria"),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const config = await getShippingConfig();
    return quoteShipping(config, data);
  });
