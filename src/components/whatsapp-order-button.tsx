import { useQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { settingsQuery } from "@/lib/queries";
import { pickWhatsApp } from "@/lib/settings";
import { formatNaira } from "@/lib/format";
import { whatsAppLink } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";

export type WhatsAppLine = { name: string; variant?: string | null; quantity: number; unit_price: number };

/**
 * Opens WhatsApp pre-filled with the shopper's basket so they can order by chat
 * instead of paying online. Hidden when the store has no WhatsApp number set.
 */
export function WhatsAppOrderButton({
  lines,
  label = "Order on WhatsApp",
  size = "lg",
  className,
}: {
  lines: WhatsAppLine[];
  label?: string;
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  const { data: settings } = useQuery(settingsQuery);
  const whatsapp = pickWhatsApp(settings);
  if (whatsapp.enabled === false || !whatsapp.phone) return null;

  const total = lines.reduce((sum, line) => sum + line.unit_price * line.quantity, 0);
  const message = [
    "Hello Mummy Rose 👋 I'd like to order:",
    "",
    ...lines.map(
      (line, index) =>
        `${index + 1}. ${line.name}${line.variant ? ` (${line.variant})` : ""} × ${line.quantity} — ${formatNaira(
          line.unit_price * line.quantity,
        )}`,
    ),
    "",
    `Estimated total (before delivery): ${formatNaira(total)}`,
    "",
    "Please confirm availability, delivery fee and payment details.",
  ].join("\n");

  return (
    <Button
      type="button"
      variant="outline"
      size={size}
      className={className}
      onClick={() => {
        track("whatsapp_order", { value: total });
        window.open(whatsAppLink(whatsapp.phone!, message), "_blank", "noopener,noreferrer");
      }}
    >
      <MessageCircle className="size-4" /> {label}
    </Button>
  );
}

/** Short explainer that sits under the two ordering paths. */
export function OrderPathsNote({ className }: { className?: string }) {
  return (
    <p className={className}>
      <strong>Pay online</strong> is fastest — your order is reserved instantly, stock is held and you get a tracking
      number straight away. <strong>Order on WhatsApp</strong> is best if you'd rather talk to a human first, confirm
      delivery to your street, or pay by transfer; a person replies during business hours, so it isn't instant.
    </p>
  );
}
