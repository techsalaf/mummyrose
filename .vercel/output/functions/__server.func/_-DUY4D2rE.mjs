import { a as require_jsx_runtime } from "./_libs/@ai-sdk/react+[...].mjs";
import { v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { S as Route$63 } from "./_ssr/router-Bg0ak8An.mjs";
import { nt as LoaderCircle } from "./_libs/lucide-react.mjs";
import { i as useQuery } from "./_libs/tanstack__react-query.mjs";
import { n as Button } from "./_ssr/router-Bg0ak8An2.mjs";
import { n as pageQuery, t as CmsPage } from "./_ssr/cms-page-C2u7A_No.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_-DUY4D2rE.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Catch-all: serves any CMS page published from /admin/pages at its own top
* level URL, and falls back to a branded 404 when no page matches.
*/
function CatchAll() {
	const { _splat } = Route$63.useParams();
	const slug = (_splat ?? "").replace(/^\/+|\/+$/g, "");
	const { data, isLoading } = useQuery({
		...pageQuery(slug),
		enabled: slug.length > 0
	});
	if (slug && isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-page grid min-h-[50vh] place-items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin text-muted-foreground" })
	});
	if (data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CmsPage, {
		slug,
		eyebrow: "Mummy Rose"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-page grid min-h-[60vh] max-w-xl place-items-center py-16 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow text-accent",
				children: "404"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-4xl",
				children: "This page has moved out of the pantry"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 leading-relaxed text-muted-foreground",
				children: "The link you followed no longer exists. Try the shop, or ask us and we’ll point you straight to it."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-wrap items-center justify-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "lg",
					className: "rounded-sm tracking-[0.18em] uppercase",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/products",
						children: "Shop the pantry"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "lg",
					variant: "outline",
					className: "rounded-sm tracking-[0.18em] uppercase",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/contact",
						children: "Contact us"
					})
				})]
			})
		] })
	});
}
//#endregion
export { CatchAll as component };
