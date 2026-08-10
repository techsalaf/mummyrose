import { a as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/recipes._slug-8Jtjtn7n.js
var import_jsx_runtime = require_jsx_runtime();
var SplitErrorComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "container-page py-24 text-center",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "font-display text-3xl",
		children: "This recipe didn't load"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/recipes",
		className: "mt-6 inline-block text-sm underline underline-offset-4",
		children: "Back to recipes"
	})]
});
//#endregion
export { SplitErrorComponent as errorComponent };
