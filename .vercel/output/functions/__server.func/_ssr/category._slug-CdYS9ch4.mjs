import { a as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as categoryImage, _ as Route$11 } from "./router-Bg0ak8An.mjs";
import { r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { i as categoriesQuery, u as productsQuery } from "./queries-BOD52kvY.mjs";
import { t as ProductGrid } from "./product-grid-B_kEwo_f.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/category._slug-CdYS9ch4.js
var import_jsx_runtime = require_jsx_runtime();
function CategoryPage() {
	const { slug } = Route$11.useParams();
	const { data: categories } = useSuspenseQuery(categoriesQuery);
	const { data: products } = useSuspenseQuery(productsQuery);
	const category = categories.find((c) => c.slug === slug);
	const inCategory = products.filter((p) => p.category_id === category?.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative overflow-hidden bg-ink text-ink-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: category?.image_url || categoryImage(slug),
			alt: category?.name ?? slug,
			className: "absolute inset-0 h-full w-full object-cover opacity-30"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative container-page py-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "text-xs text-ink-foreground/60",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "hover:text-gold",
							children: "Home"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2",
							children: "/"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/products",
							className: "hover:text-gold",
							children: "Products"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2",
							children: "/"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: category?.name })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 font-display text-4xl md:text-6xl",
					children: category?.name
				}),
				category?.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-xl text-ink-foreground/80",
					children: category.description
				})
			]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-page py-12 md:py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductGrid, {
			products: inCategory,
			showCategoryFilter: false
		})
	})] });
}
//#endregion
export { CategoryPage as component };
