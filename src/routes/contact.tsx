import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { InquiryForm } from "@/components/inquiry-form";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Mummy Rose — Orders, Support & Partnerships" },
      {
        name: "description",
        content:
          "Reach the Mummy Rose team about orders, deliveries, stockist enquiries or partnerships. We reply within one business day.",
      },
      { property: "og:title", content: "Contact Mummy Rose" },
      { property: "og:description", content: "Talk to us about orders, deliveries or partnerships." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="container-page grid gap-14 py-12 md:py-16 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <p className="eyebrow text-accent">Contact</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">We'd love to hear from you</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Questions about an order, a product or a partnership? Send us a note and a real person will reply
          within one business day.
        </p>
        <div className="mt-8 space-y-3 text-sm">
          <p className="flex items-center gap-3">
            <Mail className="size-4 text-accent" /> hello@mummyrose.com
          </p>
          <p className="flex items-center gap-3">
            <Phone className="size-4 text-accent" /> +234 800 000 0000
          </p>
          <p className="flex items-center gap-3">
            <MapPin className="size-4 text-accent" /> Lagos, Nigeria
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
