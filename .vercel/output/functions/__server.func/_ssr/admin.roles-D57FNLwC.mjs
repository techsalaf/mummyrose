import { a as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { _ as adminRolesQuery } from "./admin-queries-DArl0zvx.mjs";
import { n as ResourceManager } from "./resource-manager-Atj0jfrY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.roles-D57FNLwC.js
var import_jsx_runtime = require_jsx_runtime();
var ROLE_TONE = {
	admin: "default",
	manager: "outline",
	staff: "outline",
	customer: "secondary"
};
function AdminRoles() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceManager, {
		title: "Team & roles",
		description: "Grant admin, manager or staff access. Copy a user ID from Customers, paste it here and pick a role — access applies on their next page load.",
		table: "user_roles",
		singular: "Role",
		query: adminRolesQuery,
		searchKeys: ["user_id", "role"],
		defaults: { role: "staff" },
		fields: [{
			name: "user_id",
			label: "User ID",
			type: "text",
			full: true,
			help: "The customer's account ID."
		}, {
			name: "role",
			label: "Role",
			type: "select",
			options: [
				{
					value: "admin",
					label: "Admin — full access"
				},
				{
					value: "manager",
					label: "Manager — commerce & content"
				},
				{
					value: "staff",
					label: "Staff — day-to-day operations"
				},
				{
					value: "customer",
					label: "Customer — storefront only"
				}
			]
		}],
		columns: [
			{
				key: "user_id",
				label: "User ID"
			},
			{
				key: "role",
				label: "Role",
				render: (row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: ROLE_TONE[String(row.role)] ?? "secondary",
					children: String(row.role)
				})
			},
			{
				key: "created_at",
				label: "Granted",
				render: (row) => new Date(String(row.created_at)).toLocaleDateString()
			}
		]
	});
}
//#endregion
export { AdminRoles as component };
