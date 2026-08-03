import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { ResourceManager } from "@/components/admin/resource-manager";
import { Badge } from "@/components/ui/badge";
import { adminProductsQuery, adminVariantsQuery } from "@/lib/admin-queries";
import { formatNaira } from "@/lib/format";
import type { FieldDef } from "@/components/admin/fields";

export const Route = createFileRoute("/admin/variants")({
  component: AdminVariants,
});

function AdminVariants() {
  const products = useQuery(adminProductsQuery);
  const options = ((products.data ?? []) as unknown as { id: string; name: string }[]).map((p) => ({
    value: p.id,
    label: p.name,
  }));

  const fields: FieldDef[] = [
    { name: "product_id", label: "Product", type: "select", options },
    { name: "label", label: "Variant label", type: "text", placeholder: "250g" },
    { name: "sku", label: "SKU", type: "text" },
    { name: "price", label: "Price (₦)", type: "number", step: "0.01" },
    { name: "discount_price", label: "Offer price (₦)", type: "number", step: "0.01" },
    { name: "stock_quantity", label: "Stock", type: "number" },
    { name: "sort_order", label: "Order", type: "number" },
    { name: "is_active", label: "Active", type: "switch" },
  ];

  return (
    <ResourceManager
      title="Variants &amp; sizes"
      description="Give each pack size its own price, SKU and stock level. Products with variants show a size selector on the storefront."
      table="product_variants"
      singular="Variant"
      query={adminVariantsQuery}
      realtimeTables={["product_variants", "products"]}
      searchKeys={["label", "sku"]}
      defaults={{ is_active: true, stock_quantity: "0", price: "0", sort_order: "0" }}
      fields={fields}
      prepare={(payload) => ({
        ...payload,
        price: Number(payload.price ?? 0),
        stock_quantity: Number(payload.stock_quantity ?? 0),
        sort_order: Number(payload.sort_order ?? 0),
        discount_price:
          payload.discount_price === "" || payload.discount_price == null
            ? null
            : Number(payload.discount_price),
      })}
      columns={[
        {
          key: "product_id",
          label: "Product",
          render: (row) => {
            const product = row.products as { name?: string } | null;
            return product?.name ?? "—";
          },
        },
        { key: "label", label: "Size" },
        { key: "sku", label: "SKU" },
        { key: "price", label: "Price", render: (row) => formatNaira(Number(row.price ?? 0)) },
        {
          key: "stock_quantity",
          label: "Stock",
          render: (row) => {
            const stock = Number(row.stock_quantity ?? 0);
            return <Badge variant={stock === 0 ? "destructive" : "outline"}>{stock}</Badge>;
          },
        },
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
