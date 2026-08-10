import { r as createServerFn } from "./server-CTdGS_ot.mjs";
import { f as objectType, p as stringType } from "../_libs/@lovable.dev/mcp-js+[...].mjs";
import { t as createServerRpc } from "./createServerRpc-MY1MXvd9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payment-methods.functions-k-BOu_kQ.js
var getPaymentMethods_createServerFn_handler = createServerRpc({
	id: "26e0ad3ba15d26c3b3b635e9ae69050cad62771506c0759c530e586fe4f370ac",
	name: "getPaymentMethods",
	filename: "src/lib/payment-methods.functions.ts"
}, (opts) => getPaymentMethods.__executeServer(opts));
var getPaymentMethods = createServerFn({ method: "GET" }).handler(getPaymentMethods_createServerFn_handler, async () => {
	const { readPaymentMethodFlags } = await import("./payment-methods.server-Bk_EZ2J-.mjs");
	return await readPaymentMethodFlags();
});
var getBankDetails_createServerFn_handler = createServerRpc({
	id: "f00c53440c18c2248a544a63f718c4c41472e9639164cd0a54c4f180f003ff00",
	name: "getBankDetails",
	filename: "src/lib/payment-methods.functions.ts"
}, (opts) => getBankDetails.__executeServer(opts));
var getBankDetails = createServerFn({ method: "GET" }).inputValidator((data) => objectType({ order_number: stringType().min(3).max(64) }).parse(data)).handler(getBankDetails_createServerFn_handler, async ({ data }) => {
	const { readBankDetailsForOrder } = await import("./payment-methods.server-Bk_EZ2J-.mjs");
	return await readBankDetailsForOrder(data.order_number);
});
//#endregion
export { getBankDetails_createServerFn_handler, getPaymentMethods_createServerFn_handler };
