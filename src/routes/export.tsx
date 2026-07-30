import { createFileRoute } from "@tanstack/react-router";
import { BusinessPage } from "@/components/business-page";

export const Route = createFileRoute("/export")({
  head: () => ({
    meta: [
      { title: "Export Supply — Nigerian Food Ingredients Worldwide | Mummy Rose" },
      { name: "description", content: "Export-grade Nigerian spices, flours and herbal infusions with documentation, compliant labelling and container logistics." },
      { property: "og:title", content: "Export Supply — Nigerian Food Ingredients Worldwide | Mummy Rose" },
      { property: "og:description", content: "Export-grade Nigerian spices, flours and herbal infusions with documentation, compliant labelling and container logistics." },
    ],
  }),
  component: () => (
    <BusinessPage
      eyebrow="Export"
      title="Nigerian pantry staples, shipped worldwide"
      intro="We handle documentation, compliant labelling and freight so your shipment clears cleanly and arrives on time."
      inquiryType="export"
      requirementsLabel="Destination market, volumes and required certifications"
      points={[{ title: "Compliance first", body: "NAFDAC documentation, certificates of analysis and destination-market labelling." }, { title: "Freight flexibility", body: "Air freight for sample and boutique volumes, LCL and FCL sea freight for scale." }, { title: "Shelf-stable formats", body: "Vacuum and nitrogen-flushed packing designed for long transit and humid ports." }, { title: "Private-label ready", body: "Export runs can ship under your own brand with our production support." }]}
    />
  ),
});
