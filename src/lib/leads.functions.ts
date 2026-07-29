import { createServerFn } from "@tanstack/react-start";
import { inquirySchema, newsletterSchema } from "./schemas";
import { saveInquiry, saveSubscriber } from "./leads.server";

export const submitInquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inquirySchema.parse(data))
  .handler(async ({ data }) => await saveInquiry(data));

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => newsletterSchema.parse(data))
  .handler(async ({ data }) => await saveSubscriber(data.email));
