import { createFileRoute } from "@tanstack/react-router";
import { CmsPage } from "@/components/cms-page";

const TITLE = "Returns & Refunds — Mummy Rose";
const DESCRIPTION =
  "Our returns window, refund timelines and what to do if a Mummy Rose order arrives damaged, incomplete or not as described.";

export const Route = createFileRoute("/refunds")({
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
  component: RefundsPage,
});

function RefundsPage() {
  return (
    <CmsPage
      slug="refunds"
      eyebrow="Customer care"
      fallbackTitle="Returns & refunds"
      fallbackSubtitle="Food safety limits what we can accept back, so here is exactly where you stand."
      fallbackSections={[
        {
          heading: "Damaged or incorrect items",
          body: "Tell us within 48 hours of delivery, with a photo of the item and the packaging. We replace or refund in full — no return shipping cost to you.",
        },
        {
          heading: "Unopened items",
          body: "Sealed, unopened products in original packaging can be returned within 7 days of delivery. Delivery fees are non-refundable and return shipping is at your cost.",
        },
        {
          heading: "What we cannot accept",
          body: "For hygiene and food-safety reasons we cannot accept opened spices, flours, cereals or infusions, or any custom, white-label or bulk trade order.",
        },
        {
          heading: "Refund timelines",
          body: "Approved refunds are issued to the original payment method within 5–10 working days. Bank transfer refunds are sent to the account you confirm with us.",
        },
        {
          heading: "How to start a claim",
          body: "Email hello@mummyrose.com or message us on WhatsApp with your MR order number and a short description. Our team responds within one working day.",
        },
      ]}
    />
  );
}
