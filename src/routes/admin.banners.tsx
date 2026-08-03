import { createFileRoute } from "@tanstack/react-router";

import { ResourceManager } from "@/components/admin/resource-manager";
import { Badge } from "@/components/ui/badge";
import { adminBannersQuery } from "@/lib/admin-queries";

export const Route = createFileRoute("/admin/banners")({
  component: AdminBanners,
});

function AdminBanners() {
  return (
    <ResourceManager
      title="Banners & landing sections"
      description="Promo strips, hero banners and landing-page sections. Choose a placement, schedule it, and it appears on the storefront live."
      table="banners"
      singular="Banner"
      query={adminBannersQuery}
      searchKeys={["title", "placement"]}
      defaults={{ is_active: true, placement: "home_hero", sort_order: "0" }}
      prepare={(payload) => ({ ...payload, sort_order: Number(payload.sort_order ?? 0) })}
      fields={[
        { name: "title", label: "Title", type: "text" },
        {
          name: "placement",
          label: "Placement",
          type: "select",
          options: [
            { value: "home_hero", label: "Home — hero" },
            { value: "home_promo", label: "Home — promo strip" },
            { value: "home_section", label: "Home — landing section" },
            { value: "products_top", label: "Products — top" },
            { value: "global_announcement", label: "Global announcement bar" },
          ],
        },
        { name: "subtitle", label: "Subtitle", type: "textarea", full: true },
        { name: "body", label: "Body (rich text)", type: "richtext", full: true },
        { name: "image_url", label: "Image", type: "image" },
        { name: "cta_label", label: "Button label", type: "text" },
        { name: "cta_href", label: "Button link", type: "text" },
        { name: "starts_at", label: "Starts", type: "date" },
        { name: "expires_at", label: "Expires", type: "date" },
        { name: "sort_order", label: "Order", type: "number" },
        { name: "is_active", label: "Active", type: "switch" },
      ]}
      columns={[
        { key: "title", label: "Banner" },
        { key: "placement", label: "Placement" },
        { key: "cta_label", label: "CTA" },
        {
          key: "is_active",
          label: "Status",
          render: (row) => (
            <Badge variant={row.is_active ? "default" : "secondary"}>{row.is_active ? "Live" : "Off"}</Badge>
          ),
        },
      ]}
    />
  );
}
