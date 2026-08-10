import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { r as createServerFn } from "./server-CTdGS_ot.mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { H as createSsrRpc, U as useServerFn, b as Route$50 } from "./router-Bg0ak8An.mjs";
import { f as objectType, p as stringType, u as enumType } from "../_libs/@lovable.dev/mcp-js+[...].mjs";
import { t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as Button } from "./router-Bg0ak8An2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payment-callback-BDtgFjG1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var verifyPayment = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	provider: enumType(["paystack", "flutterwave"]),
	reference: stringType().trim().min(4).max(120),
	transaction_id: stringType().trim().max(60).optional().nullable()
}).parse(data)).handler(createSsrRpc("3082e488c4a8779ced42ff7d7eb0cb04aaf3c1cba345399c512c9e4e1bae4239"));
function PaymentCallback() {
	const search = Route$50.useSearch();
	const navigate = useNavigate();
	const verify = useServerFn(verifyPayment);
	const started = (0, import_react.useRef)(false);
	const reference = search.reference ?? search.trxref ?? search.tx_ref ?? "";
	const mutation = useMutation({
		mutationFn: () => verify({ data: {
			provider: search.provider ?? "paystack",
			reference,
			transaction_id: search.transaction_id ?? null
		} }),
		onSuccess: (result) => {
			if (result.ok && result.order?.order_number) navigate({
				to: "/order-confirmed",
				search: { order: result.order.order_number }
			});
		}
	});
	(0, import_react.useEffect)(() => {
		if (started.current || !reference) return;
		started.current = true;
		mutation.mutate();
	}, [reference]);
	const failed = !reference || mutation.isError || mutation.data && !mutation.data.ok;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-24 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: failed ? "We couldn't confirm that payment" : "Confirming your payment…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: failed ? "If money left your account, contact us with your order number and we'll sort it out immediately." : "Please keep this page open for a moment."
			}),
			failed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex justify-center gap-3",
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
						to: "/contact",
						children: "Contact support"
					})
				})]
			})
		]
	});
}
//#endregion
export { PaymentCallback as component };
