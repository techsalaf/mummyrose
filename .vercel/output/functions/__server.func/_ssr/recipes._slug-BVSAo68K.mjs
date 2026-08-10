import { a as require_jsx_runtime } from "../_libs/@ai-sdk/react+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as useSiteConfig, C as Route$7, D as categoryImage, k as formatDate } from "./router-Bg0ak8An.mjs";
import { Bt as ChefHat, Nt as Clock, h as Timer, o as UtensilsCrossed } from "../_libs/lucide-react.mjs";
import { i as useQuery, r as useSuspenseQuery } from "../_libs/tanstack__react-query.mjs";
import { d as recipesQuery, o as postQuery } from "./queries-BOD52kvY.mjs";
import { n as Button } from "./router-Bg0ak8An2.mjs";
import { t as RichText } from "./rich-text-LLOFDu3f.mjs";
import { t as JsonLd } from "./json-ld-2dnvi90N.mjs";
import { l as relatedContent, n as absoluteUrl, o as formatMinutes, s as isoDuration, t as Breadcrumbs, u as totalMinutes } from "./breadcrumbs-ByinkId4.mjs";
import { i as useCanonicalOverride, n as RelatedProducts, r as ShareButtons, t as RelatedContent } from "./canonical-BkT-Vm25.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/recipes._slug-BVSAo68K.js
var import_jsx_runtime = require_jsx_runtime();
function StatCard({ icon: Icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3 border-l border-border pl-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			"aria-hidden": true,
			className: "size-4 text-accent"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[0.7rem] tracking-wide text-muted-foreground uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium",
			children: value
		})] })]
	});
}
function RecipeDetail() {
	const { slug } = Route$7.useParams();
	const { data: post } = useSuspenseQuery(postQuery(slug));
	const { data: allRecipes = [] } = useQuery(recipesQuery);
	const { seo } = useSiteConfig();
	useCanonicalOverride(post?.canonical_url);
	if (!post) return null;
	const ingredients = post.ingredients ?? [];
	const instructions = post.instructions ?? [];
	const tips = post.tips ?? [];
	const total = totalMinutes(post.prep_minutes, post.cook_minutes);
	const image = post.cover_image || categoryImage(post.category);
	const url = absoluteUrl(seo.site_url, `/recipes/${post.slug}`);
	const related = relatedContent(allRecipes, {
		id: post.id,
		category: post.category
	});
	const hasRecipeData = ingredients.length > 0 || instructions.length > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "container-page py-8 md:py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JsonLd, { data: hasRecipeData ? {
				"@context": "https://schema.org",
				"@type": "Recipe",
				name: post.title,
				url,
				image: image?.startsWith("http") ? [image] : void 0,
				description: post.excerpt ?? void 0,
				author: {
					"@type": "Organization",
					name: post.author ?? "Mummy Rose"
				},
				datePublished: post.published_at ?? void 0,
				dateModified: post.updated_at ?? void 0,
				recipeCategory: post.category ?? void 0,
				recipeCuisine: "Nigerian",
				keywords: post.seo_keywords ?? ((post.tags ?? []).join(", ") || void 0),
				prepTime: isoDuration(post.prep_minutes),
				cookTime: isoDuration(post.cook_minutes),
				totalTime: isoDuration(total),
				recipeYield: post.servings ?? void 0,
				recipeIngredient: ingredients.length ? ingredients : void 0,
				recipeInstructions: instructions.length ? instructions.map((step, index) => ({
					"@type": "HowToStep",
					position: index + 1,
					text: step
				})) : void 0
			} : {
				"@context": "https://schema.org",
				"@type": "Article",
				headline: post.title,
				url,
				description: post.excerpt ?? void 0,
				author: {
					"@type": "Organization",
					name: post.author ?? "Mummy Rose"
				},
				datePublished: post.published_at ?? void 0,
				dateModified: post.updated_at ?? void 0
			} }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, { items: [{
				label: "Recipes",
				href: "/recipes"
			}, { label: post.title }] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-2xl",
					children: [
						post.category ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow text-accent",
							children: post.category
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-3 font-display text-4xl leading-tight md:text-5xl",
							children: post.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-sm text-muted-foreground",
							children: [
								"By ",
								post.author ?? "Mummy Rose",
								" · ",
								formatDate(post.published_at)
							]
						}),
						post.excerpt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 font-display text-xl leading-relaxed text-foreground/90",
							children: post.excerpt
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap items-center gap-4",
							children: [hasRecipeData && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "default",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#recipe",
									children: "Jump to recipe"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareButtons, {
								title: post.title,
								url,
								showPrint: hasRecipeData
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-sm bg-linen lg:sticky lg:top-28",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: image,
						alt: post.title,
						width: 1200,
						height: 900,
						className: "aspect-4/3 w-full object-cover"
					})
				})]
			}),
			(post.prep_minutes || post.cook_minutes || post.servings || post.difficulty) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 grid gap-6 border-y border-border py-6 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					post.prep_minutes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: Timer,
						label: "Prep",
						value: formatMinutes(post.prep_minutes) ?? "—"
					}) : null,
					post.cook_minutes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: Clock,
						label: "Cook",
						value: formatMinutes(post.cook_minutes) ?? "—"
					}) : null,
					post.servings ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: UtensilsCrossed,
						label: "Serves",
						value: post.servings
					}) : null,
					post.difficulty ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: ChefHat,
						label: "Difficulty",
						value: post.difficulty
					}) : null
				]
			}),
			post.content ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 max-w-2xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichText, {
					content: post.content,
					className: "leading-relaxed text-muted-foreground"
				})
			}) : null,
			hasRecipeData && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				id: "recipe",
				className: "mt-16 scroll-mt-28 rounded-sm bg-linen p-6 md:p-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow text-accent",
						children: "The recipe"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-2xl md:text-3xl",
						children: post.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 grid gap-10 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)]",
						children: [ingredients.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg",
							children: "Ingredients"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 space-y-2.5 text-sm",
							children: ingredients.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-3 border-b border-border/60 pb-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									"aria-hidden": true,
									className: "mt-1.5 size-1.5 shrink-0 rounded-full bg-accent"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item })]
							}, index))
						})] }), instructions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg",
							children: "Method"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "mt-4 space-y-5 text-sm leading-relaxed",
							children: instructions.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-xl text-accent",
									"aria-hidden": true,
									children: String(index + 1).padStart(2, "0")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "pt-1",
									children: step
								})]
							}, index))
						})] })]
					}),
					tips.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-10 border-t border-border pt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg",
							children: "Tips from the kitchen"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground",
							children: tips.map((tip, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: tip }, index))
						})]
					}),
					post.serving_suggestions ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 border-t border-border pt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg",
							children: "Serving suggestions"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichText, {
							content: post.serving_suggestions,
							className: "mt-2 text-sm leading-relaxed text-muted-foreground"
						})]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RelatedProducts, {
				ids: post.related_product_ids,
				heading: "Shop this recipe",
				blurb: "The exact Mummy Rose products used in this recipe."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RelatedContent, {
				posts: related,
				heading: "More recipes to try"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/recipes",
					className: "text-sm underline underline-offset-4 hover:text-accent",
					children: "← All recipes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/blog",
					className: "text-sm underline underline-offset-4 hover:text-accent",
					children: "Read ingredient guides →"
				})]
			})
		]
	});
}
//#endregion
export { RecipeDetail as component };
