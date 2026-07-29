import { z } from "zod";

export const inquiryTypes = [
  "wholesale",
  "export",
  "white_label",
  "corporate",
  "custom_packaging",
  "contact",
] as const;

export const inquirySchema = z.object({
  type: z.enum(inquiryTypes),
  name: z.string().trim().min(2, "Please enter your name").max(120),
  company: z.string().trim().max(160).optional().nullable(),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(40).optional().nullable(),
  country: z.string().trim().max(80).optional().nullable(),
  requirements: z.string().trim().max(2000).optional().nullable(),
  message: z.string().trim().max(4000).optional().nullable(),
});
export type InquiryInput = z.infer<typeof inquirySchema>;

export const newsletterSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
});

export const checkoutSchema = z.object({
  customer_name: z.string().trim().min(2, "Full name is required").max(120),
  customer_email: z.string().trim().email("Enter a valid email").max(255),
  customer_phone: z.string().trim().min(7, "Phone number is required").max(40),
  address_line: z.string().trim().min(4, "Delivery address is required").max(300),
  city: z.string().trim().min(2, "City is required").max(120),
  state: z.string().trim().min(2, "State is required").max(120),
  country: z.string().trim().min(2).max(120).default("Nigeria"),
  postal_code: z.string().trim().max(20).optional().nullable(),
  notes: z.string().trim().max(1000).optional().nullable(),
  payment_provider: z.enum(["paystack", "flutterwave", "bank_transfer", "pay_on_delivery"]),
  items: z
    .array(
      z.object({
        product_id: z.string().uuid(),
        variant: z.string().max(60).optional().nullable(),
        quantity: z.number().int().min(1).max(999),
      }),
    )
    .min(1, "Your cart is empty")
    .max(60),
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;
