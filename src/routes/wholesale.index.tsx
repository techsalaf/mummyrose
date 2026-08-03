import { createFileRoute } from "@tanstack/react-router";
import { BusinessPage } from "@/components/business-page";

export const Route = createFileRoute("/wholesale/")({
  head: () => ({
    meta: [
      { title: "Wholesale Supply — Bulk Nigerian Spices & Flours | Mummy Rose" },
      { name: "description", content: "Buy Mummy Rose spices, flours and infusions in bulk with trade pricing, consistent lots and nationwide delivery." },
      { property: "og:title", content: "Wholesale Supply — Bulk Nigerian Spices & Flours | Mummy Rose" },
      { property: "og:description", content: "Buy Mummy Rose spices, flours and infusions in bulk with trade pricing, consistent lots and nationwide delivery." },
    ],
  }),
  component: () => (
    <BusinessPage
      eyebrow="Wholesale"
      title="Stock your shelves with a pantry customers come back for"
      intro="Trade pricing, dependable lots and packaging built for retail — from independent grocers to supermarket chains."
      inquiryType="wholesale"
      requirementsLabel="Approximate monthly volume and product mix"
      points={[{ title: "Trade pricing tiers", body: "Volume-based pricing from one pallet upwards, with fixed quarterly rates for contracted partners." }, { title: "Consistent lots", body: "Every batch is moisture tested and lot-coded so what you reorder tastes identical." }, { title: "Retail-ready packaging", body: "Shelf-friendly jars and pouches with barcodes, batch dates and clear ingredient decks." }, { title: "Reliable replenishment", body: "Standing orders, dedicated account support and dispatch within 72 hours." }]}
    />
  ),
});
