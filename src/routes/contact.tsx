import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { InquiryForm } from "@/components/inquiry-form";
import { useSiteConfig } from "@/lib/site-config";
import { pickWhatsApp } from "@/lib/settings";
import { whatsAppLink } from "@/lib/whatsapp";
import { useQuery } from "@tanstack/react-query";
import { settingsQuery } from "@/lib/queries";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Mummy Rose — Orders, Support & Partnerships" },
      {
        name: "description",
        content:
          "Reach the Mummy Rose team about orders, deliveries, stockist enquiries or partnerships. Call, WhatsApp or email us — we reply within one business day.",
      },
      { property: "og:title", content: "Contact Mummy Rose" },
      { property: "og:description", content: "Talk to us about orders, deliveries or partnerships." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { footer } = useSiteConfig();
  const { data: settings } = useQuery({ ...settingsQuery, staleTime: 30_000 });
  const whatsapp = pickWhatsApp(settings);
  const telHref = `tel:${(footer.phone || "").replace(/[^\d+]/g, "")}`;

  return (
    <div className="container-page grid gap-14 py-12 md:py-16 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <p className="eyebrow text-accent">Contact</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">We'd love to hear from you</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Questions about an order, a product or a partnership? Call us, message us on WhatsApp, or send a
          note below — a real person replies within one business day.
        </p>

        <div className="mt-8 space-y-2 text-sm">
          <a
            href={`mailto:${footer.email}`}
            className="flex min-h-11 items-center gap-3 rounded-md px-2 -mx-2 transition-colors hover:bg-muted"
          >
            <Mail className="size-4 shrink-0 text-accent" aria-hidden="true" />
            <span className="break-all">{footer.email}</span>
          </a>
          <a
            href={telHref}
            className="flex min-h-11 items-center gap-3 rounded-md px-2 -mx-2 transition-colors hover:bg-muted"
          >
            <Phone className="size-4 shrink-0 text-accent" aria-hidden="true" />
            <span>{footer.phone}</span>
            <span className="text-xs text-muted-foreground">(tap to call)</span>
          </a>
          {whatsapp.enabled && whatsapp.phone ? (
            <a
              href={whatSappHref(whatsapp.phone)}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-11 items-center gap-3 rounded-md px-2 -mx-2 transition-colors hover:bg-muted"
            >
              <MessageCircle className="size-4 shrink-0 text-accent" aria-hidden="true" />
              <span>Chat on WhatsApp</span>
            </a>
          ) : null}
          <p className="flex min-h-11 items-center gap-3 px-2 -mx-2">
            <MapPin className="size-4 shrink-0 text-accent" aria-hidden="true" />
            <span>{footer.address}</span>
          </p>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Customer care hours: Monday to Friday, 9am – 5pm WAT.
        </p>
      </div>
      <div>
        <h2 className="font-display text-2xl">Send a message</h2>
        <div className="mt-6">
          <InquiryForm type="contact" />
        </div>
      </div>
    </div>
  );
}

function whatSappHref(phone: string) {
  return whatsAppLink(phone, "Hello Mummy Rose, I have a question about your products.");
}

