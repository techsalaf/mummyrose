import { a as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { n as articlesQuery } from "./queries-BOD52kvY.mjs";
import { t as ContentIndex } from "./content-index-CudDaaYO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blog.index-CphUhr6z.js
var import_jsx_runtime = require_jsx_runtime();
function BlogPage() {
	const { data: articles } = useSuspenseQuery(articlesQuery);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContentIndex, {
		kind: "article",
		posts: articles,
		crumbLabel: "Journal",
		eyebrow: "The journal",
		title: "Guides, ingredient notes and kitchen stories",
		intro: "What each spice actually does, how to store flour in a humid climate, which infusion suits which evening — the practical knowledge behind the pantry.",
		emptyMessage: "The first articles are being written."
	});
}
//#endregion
export { BlogPage as component };
