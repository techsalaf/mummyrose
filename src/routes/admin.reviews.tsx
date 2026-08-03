import { createFileRoute } from "@tanstack/react-router";

import { ResourceManager } from "@/components/admin/resource-manager";
import { Badge } from "@/components/ui/badge";
import { adminReviewsQuery } from "@/lib/admin-queries";

export const Route = createFileRoute("/admin/reviews")({
  component: AdminReviews,
});

function AdminReviews() {
  return (
    <ResourceManager
      title="Reviews & ratings"
      description="Approve customer reviews before they appear on product pages. Flip Approved on to publish instantly."
      table="product_reviews"
      singular="Review"
      query={adminReviewsQuery}
      searchKeys={["author_name", "title", "body"]}
      defaults={{ is_approved: false, rating: "5" }}
      prepare={(payload) => ({ ...payload, rating: Number(payload.rating ?? 5) })}
      fields={[
        { name: "author_name", label: "Author", type: "text" },
        { name: "rating", label: "Rating (1-5)", type: "number" },
        { name: "title", label: "Headline", type: "text" },
        { name: "body", label: "Review", type: "textarea", full: true },
        { name: "is_approved", label: "Approved", type: "switch" },
      ]}
      columns={[
        { key: "author_name", label: "Author" },
        {
          key: "product",
          label: "Product",
          render: (row) => String((row.products as { name?: string } | null)?.name ?? "—"),
        },
        { key: "rating", label: "Rating", render: (row) => `${row.rating} ★` },
        { key: "title", label: "Headline" },
        {
          key: "is_approved",
          label: "Status",
          render: (row) => (
            <Badge variant={row.is_approved ? "default" : "secondary"}>
              {row.is_approved ? "Published" : "Pending"}
            </Badge>
          ),
        },
      ]}
    />
  );
}
