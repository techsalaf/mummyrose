import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { A as formatDateTime } from "./router-Bg0ak8An.mjs";
import { nt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as supabase } from "./client-Cf-9GAe8.mjs";
import { i as useQuery, o as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Button } from "./router-Bg0ak8An2.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { C as useAdminRealtime, c as adminInventoryLogsQuery, m as adminProductsQuery } from "./admin-queries-DArl0zvx.mjs";
import { c as TableCell, d as TableRow, l as TableHead, o as Table, s as TableBody, u as TableHeader } from "./table-Bc3sudQz.mjs";
import { t as AdminHeader } from "./resource-manager-Atj0jfrY.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.inventory-pKTebbu2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminInventory() {
	const queryClient = useQueryClient();
	const products = useQuery(adminProductsQuery);
	const logs = useQuery(adminInventoryLogsQuery);
	useAdminRealtime(["products", "inventory_logs"], [["admin", "products"], ["admin", "inventory_logs"]]);
	const rows = products.data ?? [];
	const logRows = logs.data ?? [];
	const [deltas, setDeltas] = (0, import_react.useState)({});
	const [reasons, setReasons] = (0, import_react.useState)({});
	const sorted = (0, import_react.useMemo)(() => [...rows].sort((a, b) => a.stock_quantity - b.stock_quantity), [rows]);
	const adjust = useMutation({
		mutationFn: async ({ product, change, reason }) => {
			if (!Number.isFinite(change) || change === 0) throw new Error("Enter a non-zero adjustment.");
			const next = Math.max(0, Number(product.stock_quantity ?? 0) + change);
			const { error } = await supabase.from("products").update({ stock_quantity: next }).eq("id", product.id);
			if (error) throw new Error(error.message);
			const { data: session } = await supabase.auth.getUser();
			const { error: logError } = await supabase.from("inventory_logs").insert({
				product_id: product.id,
				change,
				reason: reason || "Manual adjustment",
				created_by: session.user?.id ?? null
			});
			if (logError) throw new Error(logError.message);
		},
		onSuccess: async () => {
			toast.success("Stock updated");
			await Promise.all([queryClient.invalidateQueries({ queryKey: adminProductsQuery.queryKey }), queryClient.invalidateQueries({ queryKey: adminInventoryLogsQuery.queryKey })]);
		},
		onError: (error) => toast.error(error.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminHeader, {
				title: "Inventory",
				description: "Adjust stock with a full audit trail. Storefront orders deduct stock automatically."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-lg border bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Product" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "w-24",
						children: "In stock"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "w-24",
						children: "Alert at"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "w-[26rem]",
						children: "Adjust"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: products.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 4,
					className: "py-10 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto size-4 animate-spin" })
				}) }) : sorted.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: product.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: product.sku ?? "—"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: product.stock_quantity === 0 ? "destructive" : product.stock_quantity <= product.low_stock_threshold ? "secondary" : "outline",
						children: product.stock_quantity
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-sm text-muted-foreground",
						children: product.low_stock_threshold
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								placeholder: "+10 / -5",
								className: "w-24",
								value: deltas[product.id] ?? "",
								onChange: (e) => setDeltas((prev) => ({
									...prev,
									[product.id]: e.target.value
								}))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Reason (restock, damage…)",
								value: reasons[product.id] ?? "",
								onChange: (e) => setReasons((prev) => ({
									...prev,
									[product.id]: e.target.value
								}))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								disabled: adjust.isPending,
								onClick: () => adjust.mutate({
									product,
									change: Number(deltas[product.id] ?? 0),
									reason: reasons[product.id] ?? ""
								}),
								children: "Apply"
							})
						]
					}) })
				] }, product.id)) })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "Recent stock movements"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "space-y-2 text-sm",
				children: logRows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: "No movements recorded yet."
				}) : logRows.map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 border-b pb-2 last:border-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "truncate",
						children: [
							log.products?.name ?? "Product",
							" — ",
							log.reason ?? "adjustment"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex shrink-0 items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: log.change < 0 ? "destructive" : "default",
							children: log.change > 0 ? `+${log.change}` : log.change
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: formatDateTime(log.created_at)
						})]
					})]
				}, log.id))
			})] })
		]
	});
}
//#endregion
export { AdminInventory as component };
