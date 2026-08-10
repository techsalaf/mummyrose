import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { j as formatNaira, k as formatDate } from "./router-Bg0ak8An.mjs";
import { j as Search, nt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as supabase } from "./client-Cf-9GAe8.mjs";
import { i as useQuery, o as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Button } from "./router-Bg0ak8An2.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { C as useAdminRealtime, _ as adminRolesQuery, a as adminCustomersQuery, d as adminOrdersQuery, y as adminSubscribersQuery } from "./admin-queries-DArl0zvx.mjs";
import { c as TableCell, d as TableRow, l as TableHead, o as Table, s as TableBody, u as TableHeader } from "./table-Bc3sudQz.mjs";
import { t as AdminHeader } from "./resource-manager-Atj0jfrY.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.customers-Cyhgw_rf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminCustomers() {
	const queryClient = useQueryClient();
	const customers = useQuery(adminCustomersQuery);
	const roles = useQuery(adminRolesQuery);
	const orders = useQuery(adminOrdersQuery);
	const subscribers = useQuery(adminSubscribersQuery);
	useAdminRealtime(["profiles", "user_roles"], [["admin", "customers"], ["admin", "user_roles"]]);
	const profiles = customers.data ?? [];
	const roleRows = roles.data ?? [];
	const orderRows = orders.data ?? [];
	const subs = subscribers.data ?? [];
	const [term, setTerm] = (0, import_react.useState)("");
	const spendByEmail = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const order of orderRows) {
			const key = (order.customer_email ?? "").toLowerCase();
			const entry = map.get(key) ?? {
				count: 0,
				total: 0
			};
			entry.count += 1;
			if (order.payment_status === "paid") entry.total += Number(order.total ?? 0);
			map.set(key, entry);
		}
		return map;
	}, [orderRows]);
	const filtered = profiles.filter((profile) => {
		const needle = term.trim().toLowerCase();
		if (!needle) return true;
		return [
			profile.full_name ?? "",
			profile.email ?? "",
			profile.phone ?? ""
		].some((v) => v.toLowerCase().includes(needle));
	});
	const setRole = useMutation({
		mutationFn: async ({ userId, role, existing }) => {
			if (existing) {
				const { error } = await supabase.from("user_roles").delete().eq("id", existing.id);
				if (error) throw new Error(error.message);
				return;
			}
			const { error } = await supabase.from("user_roles").insert({
				user_id: userId,
				role
			});
			if (error) throw new Error(error.message);
		},
		onSuccess: async () => {
			toast.success("Roles updated");
			await queryClient.invalidateQueries({ queryKey: adminRolesQuery.queryKey });
		},
		onError: (error) => toast.error(error.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminHeader, {
				title: "Customers",
				description: "Registered accounts, lifetime spend, staff roles and newsletter subscribers."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative max-w-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: term,
					onChange: (e) => setTerm(e.target.value),
					placeholder: "Search customers…",
					className: "pl-9"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-lg border bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Customer" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Joined" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Orders" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Lifetime spend" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Roles" })
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: customers.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 5,
					className: "py-10 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto size-4 animate-spin" })
				}) }) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 5,
					className: "py-10 text-center text-sm text-muted-foreground",
					children: "No customer accounts yet — guest orders appear under Orders."
				}) }) : filtered.map((profile) => {
					const spend = spendByEmail.get((profile.email ?? "").toLowerCase());
					const mine = roleRows.filter((r) => r.user_id === profile.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: profile.full_name ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: profile.email ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: profile.phone ?? ""
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-sm",
							children: formatDate(profile.created_at)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-sm",
							children: spend?.count ?? 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-sm",
							children: formatNaira(spend?.total ?? 0)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-1.5",
							children: [["admin", "staff"].map((role) => {
								const existing = mine.find((r) => r.role === role);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: existing ? "default" : "outline",
									disabled: setRole.isPending,
									onClick: () => setRole.mutate({
										userId: profile.id,
										role,
										existing
									}),
									children: role
								}, role);
							}), mine.some((r) => r.role === "customer") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								children: "customer"
							}) : null]
						}) })
					] }, profile.id);
				}) })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "text-base",
				children: [
					"Newsletter subscribers (",
					subs.length,
					")"
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "grid gap-1.5 text-sm sm:grid-cols-2 lg:grid-cols-3",
				children: subs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: "No subscribers yet."
				}) : subs.map((sub) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2 border-b pb-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: sub.email
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 text-xs text-muted-foreground",
						children: formatDate(sub.created_at)
					})]
				}, sub.id))
			})] })
		]
	});
}
//#endregion
export { AdminCustomers as component };
