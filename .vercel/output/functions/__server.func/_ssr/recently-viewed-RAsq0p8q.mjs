import { a as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { R as useCart } from "./router-Bg0ak8An.mjs";
import { t as ProductCard } from "./product-card-nmIB4KSC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/recently-viewed-RAsq0p8q.js
var import_jsx_runtime = require_jsx_runtime();
function RecentlyViewed({ products, excludeSlug }) {
	const { recentlyViewed } = useCart();
	const list = recentlyViewed.filter((slug) => slug !== excludeSlug).map((slug) => products.find((p) => p.slug === slug)).filter((p) => Boolean(p)).slice(0, 4);
	if (list.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow text-accent",
				children: "Recently viewed"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-2 font-display text-2xl",
				children: "Pick up where you left off"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
				children: list.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
			})
		]
	});
}
//#endregion
export { RecentlyViewed as t };
