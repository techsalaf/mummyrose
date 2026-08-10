import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { A as formatDateTime, E as Textarea, d as DialogTitle, j as formatNaira, o as Dialog, s as DialogContent, u as DialogHeader } from "./router-Bg0ak8An.mjs";
import { j as Search, nt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { i as useQuery, o as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Button } from "./router-Bg0ak8An2.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { C as useAdminRealtime, d as adminOrdersQuery } from "./admin-queries-DArl0zvx.mjs";
import { a as SelectValue, c as TableCell, d as TableRow, i as SelectTrigger, l as TableHead, n as SelectContent, o as Table, r as SelectItem, s as TableBody, t as Select, u as TableHeader } from "./table-Bc3sudQz.mjs";
import { s as saveRow, t as AdminHeader } from "./resource-manager-Atj0jfrY.mjs";
import { n as whatsAppLink, t as buildWhatsAppMessage } from "./whatsapp-7MNxemtf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.orders-D8_owzYT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUSES = [
	"pending",
	"confirmed",
	"processing",
	"shipped",
	"delivered",
	"cancelled"
];
var PAYMENT_STATUSES = [
	"unpaid",
	"paid",
	"refunded",
	"failed"
];
function AdminOrders() {
	const queryClient = useQueryClient();
	const { data, isLoading } = useQuery(adminOrdersQuery);
	useAdminRealtime(["orders", "order_items"], [["admin", "orders"]]);
	const orders = data ?? [];
	const [term, setTerm] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [active, setActive] = (0, import_react.useState)(null);
	const [notes, setNotes] = (0, import_react.useState)("");
	const filtered = (0, import_react.useMemo)(() => {
		const needle = term.trim().toLowerCase();
		return orders.filter((order) => {
			const matchesTerm = !needle || [
				order.order_number,
				order.customer_name,
				order.customer_email,
				order.customer_phone ?? ""
			].some((v) => String(v).toLowerCase().includes(needle));
			const matchesStatus = statusFilter === "all" || order.status === statusFilter;
			return matchesTerm && matchesStatus;
		});
	}, [
		orders,
		term,
		statusFilter
	]);
	const update = useMutation({
		mutationFn: async ({ id, values }) => await saveRow("orders", values, id),
		onSuccess: async () => {
			toast.success("Order updated");
			await queryClient.invalidateQueries({ queryKey: adminOrdersQuery.queryKey });
		},
		onError: (error) => toast.error(error.message)
	});
	const current = active ? orders.find((o) => o.id === active.id) ?? active : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminHeader, {
				title: "Orders",
				description: "Every storefront, WhatsApp and wholesale order with live payment and fulfilment status."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative max-w-sm flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: term,
						onChange: (e) => setTerm(e.target.value),
						placeholder: "Order number, name, email or phone",
						className: "pl-9"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: statusFilter,
					onValueChange: setStatusFilter,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "w-48",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "all",
						children: "All statuses"
					}), STATUSES.map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: status,
						children: status
					}, status))] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-lg border bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Order" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Customer" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Total" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Payment" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Fulfilment" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Placed"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 6,
					className: "py-10 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto size-4 animate-spin" })
				}) }) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 6,
					className: "py-10 text-center text-sm text-muted-foreground",
					children: "No orders match this view."
				}) }) : filtered.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
					className: "cursor-pointer",
					onClick: () => {
						setActive(order);
						setNotes(order.notes ?? "");
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: order.order_number
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								order.order_items?.length ?? 0,
								" items",
								order.order_type && order.order_type !== "retail" ? ` · ${order.order_type}` : ""
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: order.customer_name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: order.customer_email
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatNaira(order.total) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: order.payment_status === "paid" ? "default" : "secondary",
							children: order.payment_status
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							children: order.status
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right text-xs text-muted-foreground",
							children: formatDateTime(order.created_at)
						})
					]
				}, order.id)) })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: Boolean(current),
				onOpenChange: (next) => !next && setActive(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "max-h-[90vh] max-w-2xl overflow-y-auto",
					children: current ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: current.order_number }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs uppercase tracking-wide text-muted-foreground",
										children: "Customer"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: current.customer_name }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: current.customer_email }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: current.customer_phone ?? "—" })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs uppercase tracking-wide text-muted-foreground",
										children: "Delivery"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: current.address_line ?? "—" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										current.city ?? "—",
										", ",
										current.state ?? "—",
										", ",
										current.country
									] })
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md border",
							children: [current.order_items?.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3 border-b p-3 text-sm last:border-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									item.product_name,
									item.variant ? ` (${item.variant})` : "",
									" × ",
									item.quantity
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatNaira(item.line_total) })]
							}, item.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 p-3 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Subtotal"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatNaira(current.subtotal) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Delivery"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: current.shipping_fee === 0 ? "Free" : formatNaira(current.shipping_fee) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatNaira(current.total) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "pt-1 text-xs text-muted-foreground",
										children: [current.payment_provider ?? "—", current.payment_reference ? ` · ${current.payment_reference}` : ""]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-1.5 text-xs uppercase tracking-wide text-muted-foreground",
								children: "Fulfilment status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: current.status,
								onValueChange: (status) => update.mutate({
									id: current.id,
									values: { status }
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUSES.map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: status,
									children: status
								}, status)) })]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-1.5 text-xs uppercase tracking-wide text-muted-foreground",
								children: "Payment status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: current.payment_status,
								onValueChange: (payment_status) => update.mutate({
									id: current.id,
									values: { payment_status }
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PAYMENT_STATUSES.map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: status,
									children: status
								}, status)) })]
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-1.5 text-xs uppercase tracking-wide text-muted-foreground",
								children: "Internal notes"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: notes,
								rows: 3,
								onChange: (e) => setNotes(e.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									disabled: update.isPending,
									onClick: () => update.mutate({
										id: current.id,
										values: { notes }
									}),
									children: [update.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : null, " Save notes"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => {
										const link = whatsAppLink(current.customer_phone ?? "", buildWhatsAppMessage({
											order_number: current.order_number,
											customer_name: current.customer_name,
											customer_phone: current.customer_phone ?? "",
											customer_email: current.customer_email,
											address_line: current.address_line ?? "",
											city: current.city ?? "",
											state: current.state ?? "",
											country: current.country,
											notes: current.notes,
											payment_provider: current.payment_provider ?? "",
											subtotal: Number(current.subtotal),
											shipping_fee: Number(current.shipping_fee),
											shipping_zone: current.state ?? "",
											total: Number(current.total),
											items: (current.order_items ?? []).map((i) => ({
												product_name: i.product_name,
												variant: i.variant,
												quantity: i.quantity,
												unit_price: Number(i.unit_price)
											}))
										}));
										if (link) window.open(link, "_blank", "noopener,noreferrer");
										else toast.error("This order has no phone number.");
									},
									children: "Message customer on WhatsApp"
								})]
							})
						] })
					] }) : null
				})
			})
		]
	});
}
//#endregion
export { AdminOrders as component };
