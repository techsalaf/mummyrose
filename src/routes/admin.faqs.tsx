import { createFileRoute } from "@tanstack/react-router";

import { ResourceManager } from "@/components/admin/resource-manager";
import { Badge } from "@/components/ui/badge";
import { adminFaqsQuery } from "@/lib/admin-queries";

export const Route = createFileRoute("/admin/faqs")({
  component: AdminFaqs,
});

function AdminFaqs() {
  return (
    <ResourceManager
      title="FAQs"
      description="Questions shown on the public FAQ page and published as FAQ structured data for search engines."
      table="faqs"
      singular="FAQ"
      query={adminFaqsQuery}
      searchKeys={["question", "category"]}
      defaults={{ is_published: true, sort_order: "0" }}
      prepare={(payload) => ({ ...payload, sort_order: Number(payload.sort_order ?? 0) })}
      fields={[
        { name: "question", label: "Question", type: "text", full: true },
        { name: "answer", label: "Answer", type: "textarea" },
        { name: "category", label: "Group", type: "text", placeholder: "Delivery, Payments, Products" },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "is_published", label: "Published", type: "switch" },
      ]}
      columns={[
        { key: "question", label: "Question" },
        { key: "category", label: "Group" },
        { key: "sort_order", label: "Order" },
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
