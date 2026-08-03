import { createFileRoute } from "@tanstack/react-router";

import { ResourceManager } from "@/components/admin/resource-manager";
import { Badge } from "@/components/ui/badge";
import { adminNavQuery } from "@/lib/admin-queries";

export const Route = createFileRoute("/admin/navigation")({
  component: AdminNavigation,
});

function AdminNavigation() {
  return (
    <ResourceManager
      title="Navigation"
      description="Menu links used across the storefront header, business menu and footer."
      table="nav_links"
      singular="Link"
      query={adminNavQuery}
      searchKeys={["label", "href", "menu_group"]}
      defaults={{ menu_group: "main", is_active: true, sort_order: "0" }}
      prepare={(payload) => ({ ...payload, sort_order: Number(payload.sort_order ?? 0) })}
      fields={[
        { name: "label", label: "Label", type: "text" },
        { name: "href", label: "Link target", type: "text", placeholder: "/products" },
        {
          name: "menu_group",
          label: "Menu",
          type: "select",
          options: [
            { value: "main", label: "Header — main" },
            { value: "business", label: "Header — business" },
            { value: "footer", label: "Footer" },
          ],
        },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "is_active", label: "Visible", type: "switch" },
      ]}
      columns={[
        { key: "label", label: "Label" },
        { key: "href", label: "Target" },
        { key: "menu_group", label: "Menu" },
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
