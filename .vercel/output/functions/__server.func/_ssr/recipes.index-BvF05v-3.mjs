import { a as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { d as recipesQuery } from "./queries-BOD52kvY.mjs";
import { t as ContentIndex } from "./content-index-CudDaaYO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/recipes.index-BvF05v-3.js
var import_jsx_runtime = require_jsx_runtime();
function RecipesPage() {
	const { data: recipes } = useSuspenseQuery(recipesQuery);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContentIndex, {
		kind: "recipe",
		posts: recipes,
		crumbLabel: "Recipes",
		eyebrow: "From the kitchen",
		title: "Recipes for everyday Nigerian cooking",
		intro: "Weeknight jollof, slow Sunday stews, baking with stone-milled flours and quiet herbal infusions — each one written around ingredients you can actually find.",
		emptyMessage: "New recipes are on the way."
	});
}
//#endregion
export { RecipesPage as component };
