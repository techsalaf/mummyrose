import { a as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as adminBannersQuery } from "./admin-queries-DArl0zvx.mjs";
import { n as ResourceManager } from "./resource-manager-Atj0jfrY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.banners-CUwhnyYB.js
var import_jsx_runtime = require_jsx_runtime();
function AdminBanners() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceManager, {
		title: "Banners & landing sections",
		description: "Promo strips, hero banners and landing-page sections. Choose a placement, schedule it, and it appears on the storefront live.",
		table: "banners",
		singular: "Banner",
		query: adminBannersQuery,
		searchKeys: ["title", "placement"],
		defaults: {
			is_active: true,
			placement: "home_hero",
			sort_order: "0"
		},
		prepare: (payload) => ({
			...payload,
			sort_order: Number(payload.sort_order ?? 0)
		}),
		fields: [
			{
				name: "title",
				label: "Title",
				type: "text"
			},
			{
				name: "placement",
				label: "Placement",
				type: "select",
				options: [
					{
						value: "home_hero",
						label: "Home — hero"
					},
					{
						value: "home_promo",
						label: "Home — promo strip"
					},
					{
						value: "home_section",
						label: "Home — landing section"
					},
					{
						value: "products_top",
						label: "Products — top"
					},
					{
						value: "global_announcement",
						label: "Global announcement bar"
					}
				]
			},
			{
				name: "subtitle",
				label: "Subtitle",
				type: "textarea",
				full: true
			},
			{
				name: "body",
				label: "Body (rich text)",
				type: "richtext",
				full: true
			},
			{
				name: "image_url",
				label: "Image",
				type: "image"
			},
			{
				name: "cta_label",
				label: "Button label",
				type: "text"
			},
			{
				name: "cta_href",
				label: "Button link",
				type: "text"
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
				name: "sort_order",
				label: "Order",
				type: "number"
			},
			{
				name: "is_active",
				label: "Active",
				type: "switch"
			}
		],
		columns: [
			{
				key: "title",
				label: "Banner"
			},
			{
				key: "placement",
				label: "Placement"
			},
			{
				key: "cta_label",
				label: "CTA"
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
export { AdminBanners as component };
