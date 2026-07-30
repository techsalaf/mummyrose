import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Mummy Rose" },
      { name: "description", content: "The terms that apply when you order from Mummy Rose: pricing, delivery, returns and liability." },
      { property: "og:title", content: "Terms of Service — Mummy Rose" },
      { property: "og:description", content: "The terms that apply when you order from Mummy Rose: pricing, delivery, returns and liability." },
    ],
  }),
  component: LegalPage,
});

const sections = [{ title: "Orders", body: "An order is confirmed once you receive an order number. We may cancel and refund an order if an item is out of stock." }, { title: "Pricing", body: "All prices are in Nigerian Naira and include applicable taxes. Shipping is free over 50,000 Naira, otherwise a flat 2,500 Naira fee applies." }, { title: "Delivery", body: "Lagos deliveries take 1-2 business days; other states 2-5 business days. Export shipments are quoted individually." }, { title: "Returns", body: "Unopened items may be returned within 7 days of delivery. Contact us with your order number to arrange collection." }, { title: "Liability", body: "Our liability for any order is limited to the value of that order. Always check ingredient decks if you have allergies." }];

function LegalPage() {
  return (
    <div className="container-page max-w-3xl py-12 md:py-16">
      <p className="eyebrow text-accent">Legal</p>
      <h1 className="mt-3 font-display text-4xl">Terms of service</h1>
      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-display text-xl">{section.title}</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
