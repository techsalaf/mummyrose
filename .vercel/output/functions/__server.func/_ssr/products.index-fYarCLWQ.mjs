import { a as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { g as Route$10 } from "./router-Bg0ak8An.mjs";
import { r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { i as categoriesQuery, u as productsQuery } from "./queries-BOD52kvY.mjs";
import { t as ProductGrid } from "./product-grid-B_kEwo_f.mjs";
import { t as RecentlyViewed } from "./recently-viewed-RAsq0p8q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products.index-fYarCLWQ.js
var import_jsx_runtime = require_jsx_runtime();
function ProductsPage() {
	const { q } = Route$10.useSearch();
	const { data: products } = useSuspenseQuery(productsQuery);
	const { data: categories } = useSuspenseQuery(categoriesQuery);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-12 md:py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow text-accent",
				children: "The pantry"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl md:text-5xl",
				children: "All products"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-xl text-muted-foreground",
				children: "Everything we mill, blend and pack — natural, small batch and preservative free."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductGrid, {
					products,
					categories,
					initialQuery: q ?? ""
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecentlyViewed, { products })
		]
	});
}
//#endregion
export { ProductsPage as component };
