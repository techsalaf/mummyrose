import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { JsonLd } from "@/components/json-ld";
import { faqsQuery } from "@/lib/queries";

const FALLBACK = [
  {
    question: "How long does delivery take?",
    answer:
      "Lagos orders arrive in 1–2 business days. Other Nigerian states take 2–5 business days. International export orders are quoted per shipment.",
  },
  {
    question: "How do I pay?",
    answer:
      "You can pay by card or transfer through Paystack or Flutterwave, by direct bank transfer, or on delivery within Lagos.",
  },
  {
    question: "Do you supply restaurants and retailers?",
    answer:
      "Yes. We supply wholesale, corporate and export partners, and we offer white-label and custom packaging programmes.",
  },
];

export const Route = createFileRoute("/faq")({
  loader: ({ context }) => {
    void context.queryClient.ensureQueryData(faqsQuery);
  },
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
  const { data } = useQuery(faqsQuery);
  const faqs = data && data.length > 0 ? data : FALLBACK;

  return (
    <div className="container-page max-w-3xl py-12 md:py-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }}
      />
      <p className="eyebrow text-accent">Help centre</p>
      <h1 className="mt-3 font-display text-4xl md:text-5xl">Frequently asked questions</h1>
      <Accordion type="single" collapsible className="mt-10">
        {faqs.map((f) => (
          <AccordionItem key={f.question} value={f.question}>
            <AccordionTrigger className="text-left">{f.question}</AccordionTrigger>
            <AccordionContent className="leading-relaxed text-muted-foreground">{f.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
