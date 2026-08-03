import { createFileRoute } from "@tanstack/react-router";

import { ResourceManager } from "@/components/admin/resource-manager";
import { Badge } from "@/components/ui/badge";
import { adminTestimonialsQuery } from "@/lib/admin-queries";

export const Route = createFileRoute("/admin/testimonials")({
  component: AdminTestimonials,
});

function AdminTestimonials() {
  return (
    <ResourceManager
      title="Testimonials"
      description="Customer quotes shown on the home page and business landing pages."
      table="testimonials"
      singular="Testimonial"
      query={adminTestimonialsQuery}
      searchKeys={["author", "quote"]}
      defaults={{ is_published: true, rating: "5", sort_order: "0" }}
      prepare={(payload) => ({
        ...payload,
        rating: Number(payload.rating ?? 5),
        sort_order: Number(payload.sort_order ?? 0),
      })}
      fields={[
        { name: "author", label: "Author", type: "text" },
        { name: "role", label: "Role / location", type: "text" },
        { name: "rating", label: "Rating (1-5)", type: "number" },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "quote", label: "Quote", type: "textarea" },
        { name: "is_published", label: "Published", type: "switch" },
      ]}
      columns={[
        { key: "author", label: "Author" },
        { key: "role", label: "Role" },
        { key: "rating", label: "Rating" },
        {
          key: "is_published",
          label: "Status",
          render: (row) => (
            <Badge variant={row.is_published ? "default" : "secondary"}>{row.is_published ? "Live" : "Hidden"}</Badge>
          ),
        },
      ]}
    />
  );
}
