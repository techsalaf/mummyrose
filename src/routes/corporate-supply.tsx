import { createFileRoute } from "@tanstack/react-router";
import { BusinessPage } from "@/components/business-page";

export const Route = createFileRoute("/corporate-supply")({
  head: () => ({
    meta: [
      { title: "Corporate Supply — Hotels, Restaurants & Gifting | Mummy Rose" },
      { name: "description", content: "Bulk supply of natural Nigerian spices, flours and teas for hotels, restaurants, caterers and corporate gifting programmes." },
      { property: "og:title", content: "Corporate Supply — Hotels, Restaurants & Gifting | Mummy Rose" },
      { property: "og:description", content: "Bulk supply of natural Nigerian spices, flours and teas for hotels, restaurants, caterers and corporate gifting programmes." },
    ],
  }),
  component: () => (
    <BusinessPage
      eyebrow="Corporate supply"
      title="Kitchens and gifting programmes, supplied on schedule"
      intro="Contracted volumes, scheduled deliveries and account management for HORECA and corporate clients."
      inquiryType="corporate"
      requirementsLabel="Requirements, delivery schedule and volumes"
      points={[{ title: "HORECA formats", body: "Catering packs from 1kg to 25kg with consistent grind and heat levels." }, { title: "Scheduled delivery", body: "Weekly or monthly delivery windows agreed up front and held to." }, { title: "Corporate gifting", body: "Branded hampers for staff and client gifting, delivered to multiple addresses." }, { title: "Dedicated account manager", body: "One contact for pricing, orders, invoicing and issue resolution." }]}
    />
  ),
});
