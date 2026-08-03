import { createFileRoute } from "@tanstack/react-router";

import { ResourceManager } from "@/components/admin/resource-manager";
import { Badge } from "@/components/ui/badge";
import { adminCouponsQuery } from "@/lib/admin-queries";
import { formatDate, formatNaira } from "@/lib/format";

export const Route = createFileRoute("/admin/coupons")({
  component: AdminCoupons,
});

function AdminCoupons() {
  return (
    <ResourceManager
      title="Discount codes"
      description="Create percentage or fixed-amount codes with minimum spend, usage caps and expiry dates. Codes are validated on the server at checkout, so they cannot be tampered with."
      table="coupons"
      singular="Coupon"
      query={adminCouponsQuery}
      searchKeys={["code", "description"]}
      defaults={{ is_active: true, discount_type: "percent", value: "10", min_subtotal: "0" }}
      prepare={(payload) => ({
        ...payload,
        code: String(payload.code ?? "").trim().toUpperCase(),
        value: Number(payload.value ?? 0),
        min_subtotal: Number(payload.min_subtotal ?? 0),
        max_uses: payload.max_uses === "" || payload.max_uses == null ? null : Number(payload.max_uses),
      })}
      fields={[
        { name: "code", label: "Code", type: "text", placeholder: "ROSE10" },
        {
          name: "discount_type",
          label: "Type",
          type: "select",
          options: [
            { value: "percent", label: "Percentage off" },
            { value: "fixed", label: "Fixed amount off (₦)" },
          ],
        },
        { name: "value", label: "Value", type: "number", step: "0.01", help: "10 = 10% or ₦10 depending on type." },
        { name: "min_subtotal", label: "Minimum spend (₦)", type: "number", step: "0.01" },
        { name: "max_uses", label: "Maximum uses", type: "number", help: "Leave blank for unlimited." },
        { name: "starts_at", label: "Starts", type: "date" },
        { name: "expires_at", label: "Expires", type: "date" },
        { name: "description", label: "Internal note", type: "textarea", full: true },
        { name: "is_active", label: "Active", type: "switch" },
      ]}
      columns={[
        { key: "code", label: "Code", render: (row) => <span className="font-mono">{String(row.code)}</span> },
        {
          key: "value",
          label: "Discount",
          render: (row) =>
            row.discount_type === "percent"
              ? `${Number(row.value)}%`
              : formatNaira(Number(row.value)),
        },
        {
          key: "min_subtotal",
          label: "Min spend",
          render: (row) => formatNaira(Number(row.min_subtotal ?? 0)),
        },
        {
          key: "used_count",
          label: "Used",
          render: (row) => `${Number(row.used_count ?? 0)}${row.max_uses ? ` / ${Number(row.max_uses)}` : ""}`,
        },
        { key: "expires_at", label: "Expires", render: (row) => formatDate(row.expires_at as string) },
        {
          key: "is_active",
          label: "Status",
          render: (row) => (
            <Badge variant={row.is_active ? "default" : "secondary"}>{row.is_active ? "Active" : "Off"}</Badge>
          ),
        },
      ]}
    />
  );
}
