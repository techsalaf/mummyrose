import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { JsonLd } from "@/components/json-ld";

const faqs = [
  {
    q: "How long does delivery take?",
    a: "Lagos orders arrive in 1–2 business days. Other Nigerian states take 2–5 business days. International export orders are quoted per shipment.",
  },
  {
    q: "Is delivery free?",
    a: "Delivery is free on orders over ₦50,000. Below that, a flat ₦2,500 shipping fee applies nationwide.",
  },
  {
    q: "How do I pay?",
    a: "You can pay by card or transfer through Paystack or Flutterwave, by direct bank transfer, or on delivery within Lagos.",
  },
  {
    q: "Are your products preservative free?",
    a: "Yes. Every product is milled, blended and packed without preservatives, fillers or artificial colouring.",
  },
  {
    q: "How should I store the products?",
    a: "Keep jars and pouches sealed in a cool, dry cupboard away from direct sunlight. Flours are best used within six months of opening.",
  },
  {
    q: "Do you supply restaurants and retailers?",
    a: "Yes. We supply wholesale, corporate and export partners, and we offer white-label and custom packaging programmes.",
  },
  {
    q: "Can I return an order?",
    a: "Unopened items can be returned within 7 days of delivery. Contact us with your order number and we'll arrange pickup.",
  },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Delivery, Payment & Product Questions | Mummy Rose" },
      {
        name: "description",
        content:
          "Answers to common questions about Mummy Rose delivery times, payment methods, storage, returns and wholesale supply.",
      },
      { property: "og:title", content: "Mummy Rose FAQ" },
      { property: "og:description", content: "Delivery, payment, storage and wholesale questions answered." },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <div className="container-page max-w-3xl py-12 md:py-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <p className="eyebrow text-accent">Help centre</p>
      <h1 className="mt-3 font-display text-4xl md:text-5xl">Frequently asked questions</h1>
      <Accordion type="single" collapsible className="mt-10">
        {faqs.map((f) => (
          <AccordionItem key={f.q} value={f.q}>
            <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
            <AccordionContent className="leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
