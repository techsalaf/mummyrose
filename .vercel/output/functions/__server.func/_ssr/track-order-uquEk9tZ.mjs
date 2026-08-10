import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { U as useServerFn, j as formatNaira, k as formatDate } from "./router-Bg0ak8An.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as Button } from "./router-Bg0ak8An2.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { n as trackOrder } from "./orders.functions-BufAZ0xZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/track-order-uquEk9tZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TrackOrderPage() {
	const lookup = useServerFn(trackOrder);
	const [notFound, setNotFound] = (0, import_react.useState)(false);
	const mutation = useMutation({
		mutationFn: (data) => lookup({ data }),
		onSuccess: (result) => setNotFound(!result)
	});
	const order = mutation.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page max-w-2xl py-12 md:py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow text-accent",
				children: "Order status"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl",
				children: "Track your order"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-8 space-y-4",
				onSubmit: (e) => {
					e.preventDefault();
					const form = new FormData(e.currentTarget);
					setNotFound(false);
					mutation.mutate({
						order_number: String(form.get("order_number") ?? "").trim(),
						email: String(form.get("email") ?? "").trim()
					});
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "order_number",
						children: "Order number"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "order_number",
						name: "order_number",
						placeholder: "MR-20260101-AB12X",
						className: "mt-1.5"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "email",
						children: "Email used at checkout"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "email",
						name: "email",
						type: "email",
						className: "mt-1.5"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						variant: "clay",
						disabled: mutation.isPending,
						children: mutation.isPending ? "Checking…" : "Track order"
					})
				]
			}),
			notFound && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-sm text-destructive",
				children: "We couldn't find an order with those details. Check the number and email and try again."
			}),
			order && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card mt-10 rounded-lg p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl",
							children: order.order_number
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: ["Placed ", formatDate(order.created_at)]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "rounded-full bg-secondary px-3 py-1 capitalize",
								children: order.status
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-muted-foreground capitalize",
								children: ["Payment: ", order.payment_status]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-6 divide-y divide-border text-sm",
						children: (order.order_items ?? []).map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between gap-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: [
									item.product_name,
									item.variant ? ` · ${item.variant}` : "",
									" × ",
									item.quantity
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatNaira(item.line_total) })]
						}, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-4 space-y-1 border-t border-border pt-4 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: "Subtotal"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formatNaira(order.subtotal) })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: "Shipping"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formatNaira(order.shipping_fee) })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between font-display text-lg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formatNaira(order.total) })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm text-muted-foreground",
						children: [
							"Delivering to ",
							order.address_line,
							", ",
							order.city,
							", ",
							order.state,
							", ",
							order.country
						]
					})
				]
			})
		]
	});
}
//#endregion
export { TrackOrderPage as component };
