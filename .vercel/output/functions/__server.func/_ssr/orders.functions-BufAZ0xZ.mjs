import { r as createServerFn } from "./server-CTdGS_ot.mjs";
import { H as createSsrRpc } from "./router-Bg0ak8An.mjs";
import { d as numberType, f as objectType, p as stringType } from "../_libs/@lovable.dev/mcp-js+[...].mjs";
import { t as checkoutSchema } from "./schemas-CNICxIYS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders.functions-BufAZ0xZ.js
var placeOrder = createServerFn({ method: "POST" }).inputValidator((data) => checkoutSchema.parse(data)).handler(createSsrRpc("a6485a0caa6c7276b8f38fd2e39c7cd965ae3addca5ff318987f97661206380a"));
var trackOrder = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	order_number: stringType().trim().min(4).max(40),
	email: stringType().trim().email()
}).parse(data)).handler(createSsrRpc("d74efaed9d368b50c737966712aaf37f9bc30edca8be1eed754f166b39b69dcd"));
createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	subtotal: numberType().min(0).max(1e8),
	state: stringType().trim().max(120).default(""),
	country: stringType().trim().max(120).default("Nigeria")
}).parse(data)).handler(createSsrRpc("377adb88f76be82b3b842c83d63b452509e037a8f8502f9e653a9f6cb109bc15"));
//#endregion
export { trackOrder as n, placeOrder as t };
