import { a as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Button } from "./router-Bg0ak8An2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products._slug-D9l5kYL_.js
var import_jsx_runtime = require_jsx_runtime();
var SplitNotFoundComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "container-page py-24 text-center",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "font-display text-4xl font-bold",
		children: "Product Not Found"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		asChild: true,
		className: "mt-6 font-semibold",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/products",
			children: "Explore Pantry Catalog"
		})
	})]
});
//#endregion
export { SplitNotFoundComponent as notFoundComponent };
