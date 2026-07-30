import { createFileRoute } from "@tanstack/react-router";
import { BusinessPage } from "@/components/business-page";

export const Route = createFileRoute("/custom-packaging")({
  head: () => ({
    meta: [
      { title: "Custom Packaging — Branded Jars, Pouches & Gift Sets | Mummy Rose" },
      { name: "description", content: "Custom-packed Nigerian spices, flours and teas in branded jars, pouches, sachets and gift sets for retail or gifting." },
      { property: "og:title", content: "Custom Packaging — Branded Jars, Pouches & Gift Sets | Mummy Rose" },
      { property: "og:description", content: "Custom-packed Nigerian spices, flours and teas in branded jars, pouches, sachets and gift sets for retail or gifting." },
    ],
  }),
  component: () => (
    <BusinessPage
      eyebrow="Custom packaging"
      title="Packaging that carries your brand"
      intro="Choose the format, finish and size — we fill, seal, label and code it to your specification."
      inquiryType="custom_packaging"
      requirementsLabel="Formats, quantities and artwork status"
      points={[{ title: "Format range", body: "Glass jars, stand-up pouches, kraft sachets, tins and wooden gift boxes." }, { title: "Finish options", body: "Matte, gloss, foil and embossed labels, printed in Lagos with short lead times." }, { title: "Gift and corporate sets", body: "Curated multi-product boxes with inserts, greeting cards and branded ribbon." }, { title: "Design help", body: "Send artwork or work with our design partner on dielines and label layout." }]}
    />
  ),
});
