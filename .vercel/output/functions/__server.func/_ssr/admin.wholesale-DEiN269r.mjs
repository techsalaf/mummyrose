import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { A as formatDateTime } from "./router-Bg0ak8An.mjs";
import { nt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { i as useQuery, o as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Button } from "./router-Bg0ak8An2.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { C as useAdminRealtime, S as adminWholesaleQuery } from "./admin-queries-DArl0zvx.mjs";
import { a as SelectValue, c as TableCell, d as TableRow, i as SelectTrigger, l as TableHead, n as SelectContent, o as Table, r as SelectItem, s as TableBody, t as Select, u as TableHeader } from "./table-Bc3sudQz.mjs";
import { s as saveRow, t as AdminHeader } from "./resource-manager-Atj0jfrY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.wholesale-DEiN269r.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TIERS = [
	{
		value: "bronze",
		label: "Starter — bronze"
	},
	{
		value: "silver",
		label: "Trade — silver"
	},
	{
		value: "gold",
		label: "Distributor — gold"
	}
];
var STATUSES = [
	"pending",
	"approved",
	"suspended",
	"rejected"
];
function AdminWholesale() {
	const queryClient = useQueryClient();
	const { data, isLoading } = useQuery(adminWholesaleQuery);
	useAdminRealtime(["wholesale_accounts"], [["admin", "wholesale"]]);
	const rows = data ?? [];
	const [discounts, setDiscounts] = (0, import_react.useState)({});
	const update = useMutation({
		mutationFn: async ({ id, values }) => await saveRow("wholesale_accounts", values, id),
		onSuccess: async () => {
			toast.success("Wholesale account updated");
			await queryClient.invalidateQueries({ queryKey: adminWholesaleQuery.queryKey });
		},
		onError: (error) => toast.error(error.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminHeader, {
			title: "Wholesale accounts",
			description: "Approve trade applications, set pricing tiers and control account status. Approved buyers see their discount at checkout instantly."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-lg border bg-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Business" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Volume" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "w-48",
					children: "Tier"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "w-32",
					children: "Discount %"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "w-44",
					children: "Status"
				})
			] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				colSpan: 5,
				className: "py-10 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto size-4 animate-spin" })
			}) }) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				colSpan: 5,
				className: "py-10 text-center text-sm text-muted-foreground",
				children: "No wholesale applications yet."
			}) }) : rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
				className: "align-top",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: row.company
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: row.contact_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: row.email
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: row.phone ?? ""
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: formatDateTime(row.created_at)
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						className: "text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: row.monthly_volume ?? "—" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: row.country ?? ""
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: row.tier,
						onValueChange: (tier) => update.mutate({
							id: row.id,
							values: { tier }
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: TIERS.map((tier) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: tier.value,
							children: tier.label
						}, tier.value)) })]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: discounts[row.id] ?? String(row.discount_percent ?? 0),
							onChange: (e) => setDiscounts((prev) => ({
								...prev,
								[row.id]: e.target.value
							}))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => update.mutate({
								id: row.id,
								values: { discount_percent: Number(discounts[row.id] ?? row.discount_percent ?? 0) }
							}),
							children: "Set"
						})]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: row.status,
						onValueChange: (status) => update.mutate({
							id: row.id,
							values: { status }
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUSES.map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: status,
							children: status
						}, status)) })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						className: "mt-2",
						variant: row.status === "approved" ? "default" : "secondary",
						children: row.status
					})] })
				]
			}, row.id)) })] })
		})]
	});
}
//#endregion
export { AdminWholesale as component };
