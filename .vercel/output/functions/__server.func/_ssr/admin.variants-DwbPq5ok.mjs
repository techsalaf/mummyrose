import { a as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { j as formatNaira } from "./router-Bg0ak8An.mjs";
import { i as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { m as adminProductsQuery, x as adminVariantsQuery } from "./admin-queries-DArl0zvx.mjs";
import { n as ResourceManager } from "./resource-manager-Atj0jfrY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.variants-DwbPq5ok.js
var import_jsx_runtime = require_jsx_runtime();
function AdminVariants() {
	const fields = [
		{
			name: "product_id",
			label: "Product",
			type: "select",
			options: (useQuery(adminProductsQuery).data ?? []).map((p) => ({
				value: p.id,
				label: p.name
			}))
		},
		{
			name: "label",
			label: "Variant label",
			type: "text",
			placeholder: "250g"
		},
		{
			name: "sku",
			label: "SKU",
			type: "text"
		},
		{
			name: "price",
			label: "Price (₦)",
			type: "number",
			step: "0.01"
		},
		{
			name: "discount_price",
			label: "Offer price (₦)",
			type: "number",
			step: "0.01"
		},
		{
			name: "stock_quantity",
			label: "Stock",
			type: "number"
		},
		{
			name: "sort_order",
			label: "Order",
			type: "number"
		},
		{
			name: "is_active",
			label: "Active",
			type: "switch"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceManager, {
		title: "Variants & sizes",
		description: "Give each pack size its own price, SKU and stock level. Products with variants show a size selector on the storefront.",
		table: "product_variants",
		singular: "Variant",
		query: adminVariantsQuery,
		realtimeTables: ["product_variants", "products"],
		searchKeys: ["label", "sku"],
		defaults: {
			is_active: true,
			stock_quantity: "0",
			price: "0",
			sort_order: "0"
		},
		fields,
		prepare: (payload) => ({
			...payload,
			price: Number(payload.price ?? 0),
			stock_quantity: Number(payload.stock_quantity ?? 0),
			sort_order: Number(payload.sort_order ?? 0),
			discount_price: payload.discount_price === "" || payload.discount_price == null ? null : Number(payload.discount_price)
		}),
		columns: [
			{
				key: "product_id",
				label: "Product",
				render: (row) => {
					return row.products?.name ?? "—";
				}
			},
			{
				key: "label",
				label: "Size"
			},
			{
				key: "sku",
				label: "SKU"
			},
			{
				key: "price",
				label: "Price",
				render: (row) => formatNaira(Number(row.price ?? 0))
			},
			{
				key: "stock_quantity",
				label: "Stock",
				render: (row) => {
					const stock = Number(row.stock_quantity ?? 0);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: stock === 0 ? "destructive" : "outline",
						children: stock
					});
				}
			},
			{
				key: "is_active",
				label: "Status",
				render: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: row.is_active ? "default" : "secondary",
					children: row.is_active ? "Live" : "Off"
				})
			}
		]
	});
}
//#endregion
export { AdminVariants as component };
