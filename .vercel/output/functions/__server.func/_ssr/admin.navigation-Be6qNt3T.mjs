import { a as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { l as adminNavQuery } from "./admin-queries-DArl0zvx.mjs";
import { n as ResourceManager } from "./resource-manager-Atj0jfrY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.navigation-Be6qNt3T.js
var import_jsx_runtime = require_jsx_runtime();
function AdminNavigation() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceManager, {
		title: "Navigation",
		description: "Menu links used across the storefront header, business menu and footer.",
		table: "nav_links",
		singular: "Link",
		query: adminNavQuery,
		searchKeys: [
			"label",
			"href",
			"menu_group"
		],
		defaults: {
			menu_group: "main",
			is_active: true,
			sort_order: "0"
		},
		prepare: (payload) => ({
			...payload,
			sort_order: Number(payload.sort_order ?? 0)
		}),
		fields: [
			{
				name: "label",
				label: "Label",
				type: "text"
			},
			{
				name: "href",
				label: "Link target",
				type: "text",
				placeholder: "/products"
			},
			{
				name: "menu_group",
				label: "Menu",
				type: "select",
				options: [
					{
						value: "main",
						label: "Header — main"
					},
					{
						value: "business",
						label: "Header — business"
					},
					{
						value: "footer",
						label: "Footer"
					}
				]
			},
			{
				name: "sort_order",
				label: "Sort order",
				type: "number"
			},
			{
				name: "is_active",
				label: "Visible",
				type: "switch"
			}
		],
		columns: [
			{
				key: "label",
				label: "Label"
			},
			{
				key: "href",
				label: "Target"
			},
			{
				key: "menu_group",
				label: "Menu"
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
export { AdminNavigation as component };
