import { createFileRoute } from "@tanstack/react-router";
import { BusinessPage } from "@/components/business-page";

export const Route = createFileRoute("/white-labelling")({
  head: () => ({
    meta: [
      { title: "White Label Manufacturing — Your Brand, Our Kitchen | Mummy Rose" },
      { name: "description", content: "Launch your own spice, flour or tea line with Mummy Rose white-label production, formulation support and compliant packaging." },
      { property: "og:title", content: "White Label Manufacturing — Your Brand, Our Kitchen | Mummy Rose" },
      { property: "og:description", content: "Launch your own spice, flour or tea line with Mummy Rose white-label production, formulation support and compliant packaging." },
    ],
  }),
  component: () => (
    <BusinessPage
      eyebrow="White labelling"
      title="Launch your own line without building a factory"
      intro="From formulation to filled, labelled and coded product — we produce under your brand at commercial scale."
      inquiryType="white_label"
      requirementsLabel="Product concept, target volumes and launch timeline"
      points={[{ title: "Formulation support", body: "Bring a recipe or work with our team to develop a blend that holds up at scale." }, { title: "Low minimums to start", body: "Pilot runs from 500 units so you can test the market before committing." }, { title: "Regulatory support", body: "Ingredient decks, nutrition panels and NAFDAC-ready documentation." }, { title: "Consistent production", body: "The same milling, testing and lot-coding discipline we apply to our own brand." }]}
    />
  ),
});
