import { a as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { L as slugify } from "./router-Bg0ak8An.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { r as adminCategoriesQuery } from "./admin-queries-DArl0zvx.mjs";
import { n as ResourceManager } from "./resource-manager-Atj0jfrY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.categories-SDMpxi4-.js
var import_jsx_runtime = require_jsx_runtime();
function AdminCategories() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceManager, {
		title: "Categories",
		description: "Shop navigation collections with imagery, ordering and SEO copy.",
		table: "categories",
		singular: "Category",
		query: adminCategoriesQuery,
		searchKeys: ["name", "slug"],
		defaults: {
			is_active: true,
			sort_order: "0"
		},
		prepare: (payload) => ({
			...payload,
			slug: payload.slug ? String(payload.slug) : slugify(String(payload.name ?? "")),
			sort_order: Number(payload.sort_order ?? 0)
		}),
		fields: [
			{
				name: "name",
				label: "Name",
				type: "text"
			},
			{
				name: "slug",
				label: "Slug",
				type: "text"
			},
			{
				name: "sort_order",
				label: "Sort order",
				type: "number"
			},
			{
				name: "image_url",
				label: "Image",
				type: "image"
			},
			{
				name: "description",
				label: "Description",
				type: "textarea"
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
				label: "Visible",
				type: "switch"
			}
		],
		columns: [
			{
				key: "name",
				label: "Name"
			},
			{
				key: "slug",
				label: "Slug"
			},
			{
				key: "sort_order",
				label: "Order"
			},
			{
				key: "is_active",
				label: "Status",
				render: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: row.is_active ? "default" : "secondary",
					children: row.is_active ? "Visible" : "Hidden"
				})
			}
		]
	});
}
//#endregion
export { AdminCategories as component };
