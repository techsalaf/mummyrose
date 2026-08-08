import { createFileRoute } from "@tanstack/react-router";
import { CmsPage } from "@/components/cms-page";

const TITLE = "Shipping & Delivery — Mummy Rose";
const DESCRIPTION =
  "Delivery timelines, zones and shipping fees for Mummy Rose orders across Nigeria, plus how international and export shipments are handled.";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShippingPage,
});

function ShippingPage() {
  return (
    <CmsPage
      slug="shipping"
      eyebrow="Customer care"
      fallbackTitle="Shipping & delivery"
      fallbackSubtitle="How and when your pantry order reaches you — in Lagos, across Nigeria and worldwide."
      fallbackSections={[
        {
          heading: "Dispatch times",
          body: "Orders placed before 2pm on a working day are packed and dispatched the same day. Weekend orders leave our Lagos pack house on the next working day.",
        },
        {
          heading: "Delivery timelines",
          body: "Lagos: 1–2 working days. South-West and Abuja: 2–3 working days. Rest of Nigeria: 3–5 working days. Remote locations may add one extra day.",
        },
        {
          heading: "Delivery fees",
          body: "Fees are calculated by zone at checkout, so you always see the exact cost before you pay. Orders above the free-delivery threshold ship at no charge nationwide.",
        },
        {
          heading: "International & export",
          body: "We ship worldwide by air and sea freight. For export volumes, pallet quotes and documentation, contact our trade desk through the wholesale or export pages.",
        },
        {
          heading: "Tracking your order",
          body: "Every order gets an MR order number by email. Use the Track order page with that number and the phone or email on the order to see live status.",
        },
      ]}
    />
  );
}
