import { a as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as formatDateTime, j as formatNaira } from "./router-Bg0ak8An.mjs";
import { E as ShoppingBag, Tt as Eye, Zt as ArrowUpRight, f as TriangleAlert, i as Wallet, p as TrendingUp } from "../_libs/lucide-react.mjs";
import { i as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as Button } from "./router-Bg0ak8An2.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { C as useAdminRealtime, d as adminOrdersQuery, m as adminProductsQuery, s as adminInquiriesQuery, t as adminAnalyticsQuery } from "./admin-queries-DArl0zvx.mjs";
import { t as AdminHeader } from "./resource-manager-Atj0jfrY.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CtX3ithx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-DeuWS4Vk.js
var import_jsx_runtime = require_jsx_runtime();
function AdminDashboard() {
	const orders = useQuery(adminOrdersQuery);
	const products = useQuery(adminProductsQuery);
	const analytics = useQuery(adminAnalyticsQuery);
	const inquiries = useQuery(adminInquiriesQuery);
	useAdminRealtime([
		"orders",
		"products",
		"inquiries",
		"analytics_events"
	], [
		["admin", "orders"],
		["admin", "products"],
		["admin", "inquiries"],
		["admin", "analytics"]
	]);
	const orderRows = orders.data ?? [];
	const paidOrders = orderRows.filter((o) => o.payment_status === "paid");
	const revenue = paidOrders.reduce((sum, o) => sum + Number(o.total ?? 0), 0);
	const pending = orderRows.filter((o) => o.status === "pending").length;
	const aov = paidOrders.length ? revenue / paidOrders.length : 0;
	const productRows = products.data ?? [];
	const lowStock = productRows.filter((p) => p.stock_quantity <= p.low_stock_threshold);
	const events = analytics.data ?? [];
	const views = events.filter((e) => e.name === "page_view").length;
	const addToCart = events.filter((e) => e.name === "add_to_cart").length;
	const placed = events.filter((e) => e.name === "order_placed" || e.name === "whatsapp_order").length;
	const conversion = views ? placed / views * 100 : 0;
	const openInquiries = (inquiries.data ?? []).filter((i) => i.status === "new").length;
	const last14 = buildDailySeries(orderRows);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminHeader, {
				title: "Dashboard",
				description: "Live trading view — revenue, orders, traffic and stock health update in realtime.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin/orders",
						children: ["Manage orders ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4" })]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Paid revenue",
						value: formatNaira(revenue),
						icon: Wallet,
						hint: `${paidOrders.length} paid orders`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Orders",
						value: String(orderRows.length),
						icon: ShoppingBag,
						hint: `${pending} awaiting action`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Average order",
						value: formatNaira(aov),
						icon: TrendingUp,
						hint: "Paid orders only"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Conversion (30d)",
						value: `${conversion.toFixed(1)}%`,
						icon: Eye,
						hint: `${views} views · ${addToCart} add-to-cart`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Orders & revenue — last 14 days"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-40 items-end gap-1.5",
						children: last14.map((day) => {
							const max = Math.max(...last14.map((d) => d.total), 1);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-1 flex-col items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-full rounded-t bg-primary/80",
									style: { height: `${Math.max(day.total / max * 100, day.total > 0 ? 6 : 2)}%` },
									title: `${day.label}: ${formatNaira(day.total)} (${day.count} orders)`
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-muted-foreground",
									children: day.label
								})]
							}, day.label);
						})
					}) })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "flex items-center gap-2 text-base",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-4 text-destructive" }), " Needs attention"]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Pending orders",
							value: pending,
							to: "/admin/orders"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Low / out of stock",
							value: lowStock.length,
							to: "/admin/inventory"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "New inquiries",
							value: openInquiries,
							to: "/admin/inquiries"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Inactive products",
							value: productRows.filter((p) => !p.is_active).length,
							to: "/admin/products"
						})
					]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Latest orders"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3",
					children: [orderRows.slice(0, 8).map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3 border-b pb-2 last:border-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-medium",
								children: order.order_number
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "truncate text-xs text-muted-foreground",
								children: [
									order.customer_name,
									" · ",
									formatDateTime(order.created_at)
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex shrink-0 items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: order.payment_status === "paid" ? "default" : "secondary",
								children: order.payment_status
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium",
								children: formatNaira(order.total)
							})]
						})]
					}, order.id)), orderRows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "No orders yet."
					}) : null]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Low stock"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3",
					children: [lowStock.slice(0, 8).map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3 border-b pb-2 last:border-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm",
							children: product.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: product.stock_quantity === 0 ? "destructive" : "secondary",
							children: [product.stock_quantity, " left"]
						})]
					}, product.id)), lowStock.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Every product is well stocked."
					}) : null]
				})] })]
			})
		]
	});
}
function buildDailySeries(orders) {
	const days = [];
	for (let i = 13; i >= 0; i -= 1) {
		const date = /* @__PURE__ */ new Date();
		date.setHours(0, 0, 0, 0);
		date.setDate(date.getDate() - i);
		const next = new Date(date);
		next.setDate(next.getDate() + 1);
		const inDay = orders.filter((o) => {
			const created = new Date(o.created_at).getTime();
			return created >= date.getTime() && created < next.getTime();
		});
		days.push({
			label: String(date.getDate()),
			total: inDay.reduce((sum, o) => sum + Number(o.total ?? 0), 0),
			count: inDay.length
		});
	}
	return days;
}
function Stat({ label, value, hint, icon: Icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "pt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-wide text-muted-foreground",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 text-muted-foreground" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-display text-2xl font-semibold",
				children: value
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: hint
			}) : null
		]
	}) });
}
function Row({ label, value, to }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: "flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: value > 0 ? "destructive" : "secondary",
			children: value
		})]
	});
}
//#endregion
export { AdminDashboard as component };
