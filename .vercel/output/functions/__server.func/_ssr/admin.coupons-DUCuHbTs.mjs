import { a as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { j as formatNaira, k as formatDate } from "./router-Bg0ak8An.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { i as adminCouponsQuery } from "./admin-queries-DArl0zvx.mjs";
import { n as ResourceManager } from "./resource-manager-Atj0jfrY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.coupons-DUCuHbTs.js
var import_jsx_runtime = require_jsx_runtime();
function AdminCoupons() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceManager, {
		title: "Discount codes",
		description: "Create percentage or fixed-amount codes with minimum spend, usage caps and expiry dates. Codes are validated on the server at checkout, so they cannot be tampered with.",
		table: "coupons",
		singular: "Coupon",
		query: adminCouponsQuery,
		searchKeys: ["code", "description"],
		defaults: {
			is_active: true,
			discount_type: "percent",
			value: "10",
			min_subtotal: "0"
		},
		prepare: (payload) => ({
			...payload,
			code: String(payload.code ?? "").trim().toUpperCase(),
			value: Number(payload.value ?? 0),
			min_subtotal: Number(payload.min_subtotal ?? 0),
			max_uses: payload.max_uses === "" || payload.max_uses == null ? null : Number(payload.max_uses)
		}),
		fields: [
			{
				name: "code",
				label: "Code",
				type: "text",
				placeholder: "ROSE10"
			},
			{
				name: "discount_type",
				label: "Type",
				type: "select",
				options: [{
					value: "percent",
					label: "Percentage off"
				}, {
					value: "fixed",
					label: "Fixed amount off (₦)"
				}]
			},
			{
				name: "value",
				label: "Value",
				type: "number",
				step: "0.01",
				help: "10 = 10% or ₦10 depending on type."
			},
			{
				name: "min_subtotal",
				label: "Minimum spend (₦)",
				type: "number",
				step: "0.01"
			},
			{
				name: "max_uses",
				label: "Maximum uses",
				type: "number",
				help: "Leave blank for unlimited."
			},
			{
				name: "starts_at",
				label: "Starts",
				type: "date"
			},
			{
				name: "expires_at",
				label: "Expires",
				type: "date"
			},
			{
				name: "description",
				label: "Internal note",
				type: "textarea",
				full: true
			},
			{
				name: "is_active",
				label: "Active",
				type: "switch"
			}
		],
		columns: [
			{
				key: "code",
				label: "Code",
				render: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono",
					children: String(row.code)
				})
			},
			{
				key: "value",
				label: "Discount",
				render: (row) => row.discount_type === "percent" ? `${Number(row.value)}%` : formatNaira(Number(row.value))
			},
			{
				key: "min_subtotal",
				label: "Min spend",
				render: (row) => formatNaira(Number(row.min_subtotal ?? 0))
			},
			{
				key: "used_count",
				label: "Used",
				render: (row) => `${Number(row.used_count ?? 0)}${row.max_uses ? ` / ${Number(row.max_uses)}` : ""}`
			},
			{
				key: "expires_at",
				label: "Expires",
				render: (row) => formatDate(row.expires_at)
			},
			{
				key: "is_active",
				label: "Status",
				render: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: row.is_active ? "default" : "secondary",
					children: row.is_active ? "Active" : "Off"
				})
			}
		]
	});
}
//#endregion
export { AdminCoupons as component };
