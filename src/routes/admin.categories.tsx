import { createFileRoute } from "@tanstack/react-router";

import { ResourceManager } from "@/components/admin/resource-manager";
import { Badge } from "@/components/ui/badge";
import { adminCategoriesQuery } from "@/lib/admin-queries";
import { slugify } from "@/lib/format";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

function AdminCategories() {
  return (
    <ResourceManager
      title="Categories"
      description="Shop navigation collections with imagery, ordering and SEO copy."
      table="categories"
      singular="Category"
      query={adminCategoriesQuery}
      searchKeys={["name", "slug"]}
      defaults={{ is_active: true, sort_order: "0" }}
      prepare={(payload) => ({
        ...payload,
        slug: payload.slug ? String(payload.slug) : slugify(String(payload.name ?? "")),
        sort_order: Number(payload.sort_order ?? 0),
      })}
      fields={[
        { name: "name", label: "Name", type: "text" },
        { name: "slug", label: "Slug", type: "text" },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "image_url", label: "Image", type: "image" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "seo_title", label: "SEO title", type: "text" },
        { name: "seo_description", label: "SEO description", type: "textarea" },
        { name: "is_active", label: "Visible", type: "switch" },
      ]}
      columns={[
        { key: "name", label: "Name" },
        { key: "slug", label: "Slug" },
        { key: "sort_order", label: "Order" },
        {
          key: "is_active",
          label: "Status",
          render: (row) => (
            <Badge variant={row.is_active ? "default" : "secondary"}>{row.is_active ? "Visible" : "Hidden"}</Badge>
          ),
        },
      ]}
    />
  );
}
