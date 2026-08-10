import { r as createServerFn } from "./server-CTdGS_ot.mjs";
import { d as numberType, f as objectType, p as stringType } from "../_libs/@lovable.dev/mcp-js+[...].mjs";
import { t as createServerRpc } from "./createServerRpc-MY1MXvd9.mjs";
import { validateCoupon } from "./coupons.server-DPJSKaiy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/coupons.functions-CqOxt_6n.js
var checkCoupon_createServerFn_handler = createServerRpc({
	id: "81ebdc76d7715e2ec6681729423a391a581eb56db9bb3dbc43f9403df008c1e2",
	name: "checkCoupon",
	filename: "src/lib/coupons.functions.ts"
}, (opts) => checkCoupon.__executeServer(opts));
var checkCoupon = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	code: stringType().trim().min(2).max(40),
	subtotal: numberType().min(0).max(1e8)
}).parse(data)).handler(checkCoupon_createServerFn_handler, async ({ data }) => await validateCoupon(data.code, data.subtotal));
//#endregion
export { checkCoupon_createServerFn_handler };
