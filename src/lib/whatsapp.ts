import { formatNaira } from "./format";

export type WhatsAppOrder = {
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  address_line: string;
  city: string;
  state: string;
  country: string;
  notes?: string | null;
  payment_provider: string;
  subtotal: number;
  shipping_fee: number;
  shipping_zone: string;
  total: number;
  items: { product_name: string; variant?: string | null; quantity: number; unit_price: number }[];
};

const PAYMENT_LABELS: Record<string, string> = {
  paystack: "Paystack (card / transfer)",
  flutterwave: "Flutterwave",
  bank_transfer: "Bank transfer",
  pay_on_delivery: "Pay on delivery",
  whatsapp: "WhatsApp order",
};

/** Builds the plain-text order summary the seller receives on WhatsApp. */
export function buildWhatsAppMessage(order: WhatsAppOrder): string {
  const lines = order.items
    .map(
      (i, index) =>
        `${index + 1}. ${i.product_name}${i.variant ? ` (${i.variant})` : ""} × ${i.quantity} — ${formatNaira(
          i.unit_price * i.quantity,
        )}`,
    )
    .join("\n");

  return [
    `*NEW ORDER — ${order.order_number}*`,
    "",
    "*Items*",
    lines,
    "",
    `Subtotal: ${formatNaira(order.subtotal)}`,
    `Delivery (${order.shipping_zone}): ${order.shipping_fee === 0 ? "Free" : formatNaira(order.shipping_fee)}`,
    `*Total: ${formatNaira(order.total)}*`,
    "",
    "*Customer*",
    `Name: ${order.customer_name}`,
    `Phone: ${order.customer_phone}`,
    `Email: ${order.customer_email}`,
    "",
    "*Delivery address*",
    `${order.address_line}, ${order.city}, ${order.state}, ${order.country}`,
    order.notes ? `\nNotes: ${order.notes}` : "",
    "",
    `Payment method: ${PAYMENT_LABELS[order.payment_provider] ?? order.payment_provider}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function whatsAppLink(phone: string, message: string) {
  const digits = String(phone ?? "").replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
