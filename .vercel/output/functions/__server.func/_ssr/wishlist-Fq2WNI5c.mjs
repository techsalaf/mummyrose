import { a as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { R as useCart } from "./router-Bg0ak8An.mjs";
import { r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { u as productsQuery } from "./queries-BOD52kvY.mjs";
import { n as Button } from "./router-Bg0ak8An2.mjs";
import { t as ProductCard } from "./product-card-nmIB4KSC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wishlist-Fq2WNI5c.js
var import_jsx_runtime = require_jsx_runtime();
function WishlistPage() {
	const { data: products } = useSuspenseQuery(productsQuery);
	const { wishlist } = useCart();
	const saved = products.filter((p) => wishlist.includes(p.slug));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-12 md:py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow text-accent",
				children: "Saved"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl",
				children: "Your wishlist"
			}),
			saved.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-20 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: "You haven't saved anything yet."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "clay",
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/products",
						children: "Browse the pantry"
					})
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
				children: saved.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
			})
		]
	});
}
//#endregion
export { WishlistPage as component };
