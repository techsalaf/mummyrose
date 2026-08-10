import { r as createServerFn } from "./server-CTdGS_ot.mjs";
import { f as objectType, p as stringType, u as enumType } from "../_libs/@lovable.dev/mcp-js+[...].mjs";
import { t as createServerRpc } from "./createServerRpc-MY1MXvd9.mjs";
import { verifyFlutterwave, verifyPaystack } from "./payments.server-BrZGIjSv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payments.functions-BSB0Q77S.js
var verifyPayment_createServerFn_handler = createServerRpc({
	id: "3082e488c4a8779ced42ff7d7eb0cb04aaf3c1cba345399c512c9e4e1bae4239",
	name: "verifyPayment",
	filename: "src/lib/payments.functions.ts"
}, (opts) => verifyPayment.__executeServer(opts));
var verifyPayment = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	provider: enumType(["paystack", "flutterwave"]),
	reference: stringType().trim().min(4).max(120),
	transaction_id: stringType().trim().max(60).optional().nullable()
}).parse(data)).handler(verifyPayment_createServerFn_handler, async ({ data }) => {
	if (data.provider === "paystack") return await verifyPaystack(data.reference);
	return await verifyFlutterwave(data.reference, data.transaction_id ?? null);
});
//#endregion
export { verifyPayment_createServerFn_handler };
