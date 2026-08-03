import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { validateCoupon } from "./coupons.server";

export const checkCoupon = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        code: z.string().trim().min(2).max(40),
        subtotal: z.number().min(0).max(100000000),
      })
      .parse(data),
  )
  .handler(async ({ data }) => await validateCoupon(data.code, data.subtotal));
