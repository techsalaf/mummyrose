import { createFileRoute } from "@tanstack/react-router";

import { BusinessPage } from "@/components/business-page";

export const Route = createFileRoute("/retail")({
  head: () => ({
    meta: [
      { title: "Retail & Stockists — Sell Mummy Rose in Your Store" },
      {
        name: "description",
        content:
          "Stock Mummy Rose spices, flours and herbal infusions in your supermarket, food store or online shop. Retail pricing, shelf-ready packaging and reliable restocking across Nigeria.",
      },
      { property: "og:title", content: "Retail & Stockists — Mummy Rose" },
      {
        property: "og:description",
        content: "Shelf-ready Nigerian spices, flours and infusions for supermarkets and food retailers.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: RetailPage,
});

function RetailPage() {
  return (
    <BusinessPage
      eyebrow="Retail & stockists"
      title="Put Mummy Rose on your shelves"
      intro="From neighbourhood provision stores to national supermarket chains and online grocers — we supply shelf-ready, barcoded packs with dependable restocking and margins that work for retail."
      points={[
        {
          title: "Shelf-ready packaging",
          body: "Retail packs are labelled, barcoded and batch-coded with clear ingredient, weight and best-before information, so they go straight from carton to shelf.",
        },
        {
          title: "Retail margins that work",
          body: "Structured stockist pricing with volume breaks, plus recommended retail prices so your margin stays healthy without undercutting the brand.",
        },
        {
          title: "Consistent restocking",
          body: "We mill and blend weekly, hold buffer stock on best sellers, and confirm restock windows in advance so your shelf never runs empty.",
        },
        {
          title: "Merchandising support",
          body: "Shelf talkers, product photography and recipe cards to help your customers understand what each spice, flour and infusion is used for.",
        },
        {
          title: "Nationwide delivery",
          body: "Zone-based dispatch across Nigeria with tracked delivery, and pallet consignments for larger retail groups.",
        },
      ]}
      inquiryType="wholesale"
      requirementsLabel="Tell us about your store — location, size, and the categories you'd like to stock"
      formTitle="Become a stockist"
    />
  );
}
