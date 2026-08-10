import { r as createServerFn } from "./server-CTdGS_ot.mjs";
import { H as createSsrRpc } from "./router-Bg0ak8An.mjs";
import { f as objectType, p as stringType } from "../_libs/@lovable.dev/mcp-js+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payment-methods.functions-DQc-JDJ7.js
var getPaymentMethods = createServerFn({ method: "GET" }).handler(createSsrRpc("26e0ad3ba15d26c3b3b635e9ae69050cad62771506c0759c530e586fe4f370ac"));
var getBankDetails = createServerFn({ method: "GET" }).inputValidator((data) => objectType({ order_number: stringType().min(3).max(64) }).parse(data)).handler(createSsrRpc("f00c53440c18c2248a544a63f718c4c41472e9639164cd0a54c4f180f003ff00"));
//#endregion
export { getPaymentMethods as n, getBankDetails as t };
