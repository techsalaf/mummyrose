import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { ResourceManager } from "@/components/admin/resource-manager";
import { Badge } from "@/components/ui/badge";
import { adminCategoriesQuery, adminProductsQuery } from "@/lib/admin-queries";
import { formatNaira, slugify } from "@/lib/format";
import type { FieldDef } from "@/components/admin/fields";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

function AdminProducts() {
  const categories = useQuery(adminCategoriesQuery);
  const options = ((categories.data ?? []) as unknown as { id: string; name: string }[]).map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const fields: FieldDef[] = [
    { name: "name", label: "Product name", type: "text", placeholder: "Ogbono Powder 250g" },
    { name: "slug", label: "Slug", type: "text", help: "Auto-generated from the name when left blank." },
    { name: "category_id", label: "Category", type: "select", options },
    { name: "sku", label: "SKU", type: "text" },
    { name: "price", label: "Price (₦)", type: "number", step: "0.01" },
    { name: "discount_price", label: "Offer price (₦)", type: "number", step: "0.01" },
    { name: "stock_quantity", label: "Stock quantity", type: "number" },
    { name: "low_stock_threshold", label: "Low stock alert at", type: "number" },
    { name: "weight_options", label: "Weight options", type: "tags", help: "Comma separated, e.g. 250g, 500g, 1kg" },
    { name: "tags", label: "Tags", type: "tags" },
    { name: "image_url", label: "Main image", type: "image" },
    { name: "gallery", label: "Gallery URLs", type: "tags", full: true },
    { name: "short_description", label: "Short description", type: "textarea" },
    { name: "description", label: "Full description", type: "richtext" },
    { name: "ingredients", label: "Ingredients", type: "textarea" },
    { name: "nutrition", label: "Nutrition (JSON)", type: "json", placeholder: '{"Energy":"350kcal"}' },
    { name: "seo_title", label: "SEO title", type: "text" },
    { name: "seo_description", label: "SEO description", type: "textarea" },
    { name: "is_active", label: "Published", type: "switch" },
    { name: "is_featured", label: "Featured", type: "switch" },
  ];

  return (
    <ResourceManager
      title="Products"
      description="Full catalogue control — pricing, offers, stock, media, nutrition and SEO."
      table="products"
      singular="Product"
      query={adminProductsQuery}
      searchKeys={["name", "slug", "sku"]}
      defaults={{ is_active: true, stock_quantity: "0", low_stock_threshold: "5", price: "0" }}
      fields={fields}
      prepare={(payload) => {
        const name = String(payload.name ?? "");
        return {
          ...payload,
          slug: payload.slug ? String(payload.slug) : slugify(name),
          price: Number(payload.price ?? 0),
          stock_quantity: Number(payload.stock_quantity ?? 0),
          low_stock_threshold: Number(payload.low_stock_threshold ?? 5),
        };
      }}
      columns={[
        {
          key: "name",
          label: "Product",
          render: (row) => (
            <div className="flex items-center gap-3">
              {row.image_url ? (
                <img
                  src={String(row.image_url)}
                  alt=""
                  className="size-9 rounded object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="size-9 rounded bg-muted" />
              )}
              <div className="min-w-0">
                <p className="truncate font-medium">{String(row.name)}</p>
                <p className="truncate text-xs text-muted-foreground">{String(row.slug)}</p>
              </div>
            </div>
          ),
        },
        {
          key: "price",
          label: "Price",
          render: (row) => (
            <span>
              {formatNaira(Number(row.price))}
              {row.discount_price ? (
                <span className="ml-1 text-xs text-primary">→ {formatNaira(Number(row.discount_price))}</span>
              ) : null}
            </span>
          ),
        },
        {
          key: "stock_quantity",
          label: "Stock",
          render: (row) => {
            const stock = Number(row.stock_quantity ?? 0);
            const low = Number(row.low_stock_threshold ?? 5);
            return (
              <Badge variant={stock === 0 ? "destructive" : stock <= low ? "secondary" : "outline"}>{stock}</Badge>
            );
          },
        },
        {
          key: "is_active",
          label: "Status",
          render: (row) => (
            <Badge variant={row.is_active ? "default" : "secondary"}>{row.is_active ? "Live" : "Draft"}</Badge>
          ),
        },
      ]}
    />
  );
}
