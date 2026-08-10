import { a as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { U as useServerFn, x as Route$51 } from "./router-Bg0ak8An.mjs";
import { Pt as CircleCheck } from "../_libs/lucide-react.mjs";
import { i as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as Button } from "./router-Bg0ak8An2.mjs";
import { t as getBankDetails } from "./payment-methods.functions-DQc-JDJ7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/order-confirmed-CFnufeMN.js
var import_jsx_runtime = require_jsx_runtime();
function OrderConfirmed() {
	const { order } = Route$51.useSearch();
	const fetchBank = useServerFn(getBankDetails);
	const { data: bank } = useQuery({
		queryKey: ["bank-details", order],
		queryFn: () => fetchBank({ data: { order_number: order } }),
		enabled: Boolean(order),
		staleTime: 6e4
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-24 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mx-auto size-12 text-accent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-6 font-display text-4xl",
				children: "Thank you — your order is in"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-muted-foreground",
				children: order ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					"Your order number is ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-foreground",
						children: order
					}),
					". We've emailed payment and delivery details."
				] }) : "We've emailed your payment and delivery details."
			}),
			bank && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto mt-6 max-w-md rounded-lg border border-border bg-muted/40 p-4 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: "Bank transfer details"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1",
						children: [
							bank.bank_name,
							" · ",
							bank.account_name,
							" · ",
							bank.account_number
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: [
							"Use ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground",
								children: order
							}),
							" as your transfer reference."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-wrap justify-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "clay",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/track-order",
						children: "Track your order"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/products",
						children: "Continue shopping"
					})
				})]
			})
		]
	});
}
//#endregion
export { OrderConfirmed as component };
