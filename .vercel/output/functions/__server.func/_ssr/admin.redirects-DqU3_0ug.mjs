import { a as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { h as adminRedirectsQuery } from "./admin-queries-DArl0zvx.mjs";
import { n as ResourceManager } from "./resource-manager-Atj0jfrY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.redirects-DqU3_0ug.js
var import_jsx_runtime = require_jsx_runtime();
function AdminRedirects() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceManager, {
		title: "URL redirects",
		description: "Map old WordPress/WooCommerce URLs to their new home so existing search rankings and shared links keep working. Paths must start with a slash.",
		table: "redirects",
		singular: "Redirect",
		query: adminRedirectsQuery,
		searchKeys: ["from_path", "to_path"],
		defaults: {
			is_active: true,
			status_code: "301"
		},
		prepare: (payload) => ({
			...payload,
			from_path: normalisePath(payload.from_path),
			to_path: normalisePath(payload.to_path),
			status_code: Number(payload.status_code ?? 301)
		}),
		fields: [
			{
				name: "from_path",
				label: "Old path",
				type: "text",
				placeholder: "/shop/ogbono-powder"
			},
			{
				name: "to_path",
				label: "New path",
				type: "text",
				placeholder: "/products/ogbono-powder"
			},
			{
				name: "status_code",
				label: "Type",
				type: "select",
				options: [{
					value: "301",
					label: "301 — permanent"
				}, {
					value: "302",
					label: "302 — temporary"
				}]
			},
			{
				name: "is_active",
				label: "Active",
				type: "switch"
			}
		],
		columns: [
			{
				key: "from_path",
				label: "From",
				render: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-xs",
					children: String(row.from_path)
				})
			},
			{
				key: "to_path",
				label: "To",
				render: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-xs",
					children: String(row.to_path)
				})
			},
			{
				key: "status_code",
				label: "Type"
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
function normalisePath(value) {
	const path = String(value ?? "").trim();
	if (!path) return path;
	return path.startsWith("/") || path.startsWith("http") ? path : `/${path}`;
}
//#endregion
export { AdminRedirects as component };
