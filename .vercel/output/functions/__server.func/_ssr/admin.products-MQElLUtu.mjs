import { a as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { L as slugify, j as formatNaira } from "./router-Bg0ak8An.mjs";
import { i as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { m as adminProductsQuery, r as adminCategoriesQuery } from "./admin-queries-DArl0zvx.mjs";
import { n as ResourceManager } from "./resource-manager-Atj0jfrY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.products-MQElLUtu.js
var import_jsx_runtime = require_jsx_runtime();
function AdminProducts() {
	const fields = [
		{
			name: "name",
			label: "Product name",
			type: "text",
			placeholder: "Ogbono Powder 250g"
		},
		{
			name: "slug",
			label: "Slug",
			type: "text",
			help: "Auto-generated from the name when left blank."
		},
		{
			name: "category_id",
			label: "Category",
			type: "select",
			options: (useQuery(adminCategoriesQuery).data ?? []).map((c) => ({
				value: c.id,
				label: c.name
			}))
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
			label: "Stock quantity",
			type: "number"
		},
		{
			name: "low_stock_threshold",
			label: "Low stock alert at",
			type: "number"
		},
		{
			name: "weight_options",
			label: "Weight options",
			type: "tags",
			help: "Comma separated, e.g. 250g, 500g, 1kg"
		},
		{
			name: "tags",
			label: "Tags",
			type: "tags"
		},
		{
			name: "image_url",
			label: "Main image",
			type: "image"
		},
		{
			name: "gallery",
			label: "Gallery URLs",
			type: "tags",
			full: true
		},
		{
			name: "short_description",
			label: "Short description",
			type: "textarea"
		},
		{
			name: "description",
			label: "Full description",
			type: "richtext"
		},
		{
			name: "ingredients",
			label: "Ingredients",
			type: "textarea"
		},
		{
			name: "nutrition",
			label: "Nutrition (JSON)",
			type: "json",
			placeholder: "{\"Energy\":\"350kcal\"}"
		},
		{
			name: "seo_title",
			label: "SEO title",
			type: "text"
		},
		{
			name: "seo_description",
			label: "SEO description",
			type: "textarea"
		},
		{
			name: "is_active",
			label: "Published",
			type: "switch"
		},
		{
			name: "is_featured",
			label: "Featured",
			type: "switch"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceManager, {
		title: "Products",
		description: "Full catalogue control — pricing, offers, stock, media, nutrition and SEO.",
		table: "products",
		singular: "Product",
		query: adminProductsQuery,
		searchKeys: [
			"name",
			"slug",
			"sku"
		],
		defaults: {
			is_active: true,
			stock_quantity: "0",
			low_stock_threshold: "5",
			price: "0"
		},
		fields,
		prepare: (payload) => {
			const name = String(payload.name ?? "");
			return {
				...payload,
				slug: payload.slug ? String(payload.slug) : slugify(name),
				price: Number(payload.price ?? 0),
				stock_quantity: Number(payload.stock_quantity ?? 0),
				low_stock_threshold: Number(payload.low_stock_threshold ?? 5)
			};
		},
		columns: [
			{
				key: "name",
				label: "Product",
				render: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [row.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: String(row.image_url),
						alt: "",
						className: "size-9 rounded object-cover",
						loading: "lazy"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-9 rounded bg-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-medium",
							children: String(row.name)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs text-muted-foreground",
							children: String(row.slug)
						})]
					})]
				})
			},
			{
				key: "price",
				label: "Price",
				render: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [formatNaira(Number(row.price)), row.discount_price ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "ml-1 text-xs text-primary",
					children: ["→ ", formatNaira(Number(row.discount_price))]
				}) : null] })
			},
			{
				key: "stock_quantity",
				label: "Stock",
				render: (row) => {
					const stock = Number(row.stock_quantity ?? 0);
					const low = Number(row.low_stock_threshold ?? 5);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: stock === 0 ? "destructive" : stock <= low ? "secondary" : "outline",
						children: stock
					});
				}
			},
			{
				key: "is_active",
				label: "Status",
				render: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: row.is_active ? "default" : "secondary",
					children: row.is_active ? "Live" : "Draft"
				})
			}
		]
	});
}
//#endregion
export { AdminProducts as component };
