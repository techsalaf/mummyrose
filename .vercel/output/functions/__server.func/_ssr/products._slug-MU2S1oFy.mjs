import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Textarea, O as effectivePrice, P as productImage, R as useCart, j as formatNaira, w as Route$9 } from "./router-Bg0ak8An.mjs";
import { C as Sparkles, O as ShieldCheck, R as Plus, Vt as Check, Y as Minus, d as Truck, mt as Heart, nt as LoaderCircle, ot as Leaf, x as Star } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as supabase } from "./client-Cf-9GAe8.mjs";
import { i as useQuery, o as useQueryClient, r as useSuspenseQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { c as productQuery, l as productReviewsQuery, u as productsQuery } from "./queries-BOD52kvY.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as cn, n as Button } from "./router-Bg0ak8An2.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as useAuth } from "./useAuth-DQ7W1JA2.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as JsonLd } from "./json-ld-2dnvi90N.mjs";
import { t as ProductCard } from "./product-card-nmIB4KSC.mjs";
import { n as WhatsAppOrderButton, t as OrderPathsNote } from "./whatsapp-order-button-D6KmzVcM.mjs";
import { i as AccordionTrigger, n as AccordionContent, r as AccordionItem, t as Accordion } from "./accordion-uwqhymWC.mjs";
import { t as RecentlyViewed } from "./recently-viewed-RAsq0p8q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products._slug-MU2S1oFy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Stars({ rating, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center gap-0.5", className),
		"aria-label": `${rating} out of 5`,
		children: [
			1,
			2,
			3,
			4,
			5
		].map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("size-4", value <= Math.round(rating) ? "fill-accent text-accent" : "text-muted-foreground/40") }, value))
	});
}
function ratingSummary(reviews) {
	const approved = reviews.filter((review) => review.is_approved);
	if (approved.length === 0) return {
		average: 0,
		count: 0
	};
	return {
		average: approved.reduce((sum, review) => sum + Number(review.rating), 0) / approved.length,
		count: approved.length
	};
}
/** Public reviews & ratings block for a product page. */
function ProductReviews({ productId, productName }) {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const { data: reviews = [], isLoading } = useQuery(productReviewsQuery(productId));
	const [rating, setRating] = (0, import_react.useState)(5);
	const [title, setTitle] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	const summary = ratingSummary(reviews);
	const visible = reviews.filter((review) => review.is_approved || review.user_id === user?.id);
	const mine = reviews.find((review) => review.user_id === user?.id);
	const submit = useMutation({
		mutationFn: async () => {
			if (!user) throw new Error("Please sign in to review");
			const payload = {
				product_id: productId,
				user_id: user.id,
				author_name: user.user_metadata?.["full_name"] || user.email?.split("@")[0] || "Customer",
				rating,
				title: title.trim() || null,
				body: body.trim() || null
			};
			const { error } = mine ? await supabase.from("product_reviews").update(payload).eq("id", mine.id) : await supabase.from("product_reviews").insert(payload);
			if (error) throw new Error(error.message);
		},
		onSuccess: async () => {
			toast.success("Thank you — your review is awaiting approval");
			setTitle("");
			setBody("");
			await queryClient.invalidateQueries({ queryKey: ["product_reviews", productId] });
		},
		onError: (error) => toast.error(error.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-20 border-t border-border pt-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-end justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow text-accent",
				children: "Reviews & ratings"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "mt-2 font-display text-2xl",
				children: ["What cooks say about ", productName]
			})] }), summary.count > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, { rating: summary.average }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-sm text-muted-foreground",
					children: [
						summary.average.toFixed(1),
						" · ",
						summary.count,
						" review",
						summary.count === 1 ? "" : "s"
					]
				})]
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-5",
				children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin text-muted-foreground" }) : visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No reviews yet — be the first to share how you cooked with it."
				}) : visible.map((review) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "surface-card rounded-lg p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, { rating: Number(review.rating) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium",
									children: review.author_name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: new Date(review.created_at).toLocaleDateString()
								}),
								!review.is_approved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									children: "Pending approval"
								}) : null
							]
						}),
						review.title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-3 font-display text-lg",
							children: review.title
						}) : null,
						review.body ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 leading-relaxed whitespace-pre-line text-muted-foreground",
							children: review.body
						}) : null
					]
				}, review.id))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card h-fit rounded-lg p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-lg",
					children: mine ? "Update your review" : "Write a review"
				}), !user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Reviews are verified, so you need an account to post one. It takes a few seconds."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "clay",
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/account",
						children: "Sign in to review"
					})
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-4 space-y-4",
					onSubmit: (event) => {
						event.preventDefault();
						submit.mutate();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Your rating" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1.5 flex gap-1",
							children: [
								1,
								2,
								3,
								4,
								5
							].map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": `${value} star`,
								onClick: () => setRating(value),
								className: "p-0.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("size-6 transition-transform hover:scale-110", value <= rating ? "fill-accent text-accent" : "text-muted-foreground/40") })
							}, value))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "review-title",
							children: "Headline"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "review-title",
							value: title,
							maxLength: 120,
							onChange: (event) => setTitle(event.target.value),
							className: "mt-1.5",
							placeholder: "Rich, fresh and worth it"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "review-body",
							children: "Your review"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "review-body",
							value: body,
							rows: 4,
							maxLength: 1500,
							onChange: (event) => setBody(event.target.value),
							className: "mt-1.5",
							placeholder: "How did you cook with it?"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							variant: "clay",
							className: "w-full",
							disabled: submit.isPending,
							children: [submit.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : null, mine ? "Update review" : "Submit review"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Reviews are published once our team approves them, usually within a day."
						})
					]
				})]
			})]
		})]
	});
}
function ProductDetail() {
	const { slug } = Route$9.useParams();
	const { data: product } = useSuspenseQuery(productQuery(slug));
	const { data: products } = useSuspenseQuery(productsQuery);
	const { addItem, toggleWishlist, isWishlisted, pushRecentlyViewed } = useCart();
	const [qty, setQty] = (0, import_react.useState)(1);
	const [variant, setVariant] = (0, import_react.useState)(null);
	const [activeImage, setActiveImage] = (0, import_react.useState)(0);
	const [added, setAdded] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (product?.slug) pushRecentlyViewed(product.slug);
	}, [product?.slug, pushRecentlyViewed]);
	if (!product) return null;
	const price = effectivePrice(product);
	const hasDiscount = price < Number(product.price);
	const cover = productImage(product);
	const images = [cover, ...product.gallery ?? []];
	const soldOut = product.stock_quantity <= 0;
	const options = product.weight_options ?? [];
	const chosen = variant ?? options[0] ?? null;
	const related = products.filter((p) => p.category_id === product.category_id && p.id !== product.id).slice(0, 4);
	const nutrition = product.nutrition ?? {};
	const handleAddToCart = () => {
		addItem({
			product_id: product.id,
			slug: product.slug,
			name: product.name,
			image: cover,
			unit_price: price,
			variant: chosen
		}, qty);
		setAdded(true);
		toast.success(`${qty}x ${product.name} (${chosen ?? "standard"}) added to cart`);
		setTimeout(() => setAdded(false), 2e3);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-10 md:py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JsonLd, { data: {
				"@context": "https://schema.org",
				"@type": "Product",
				name: product.name,
				description: product.short_description ?? void 0,
				sku: product.sku ?? void 0,
				brand: {
					"@type": "Brand",
					name: "Mummy Rose"
				},
				offers: {
					"@type": "Offer",
					price,
					priceCurrency: "NGN",
					availability: soldOut ? "https://schema.org/OutOfStock" : "https://schema.org/InStock"
				}
			} }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/products",
						className: "hover:text-primary transition-colors",
						children: "Pantry"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/category/$slug",
						params: { slug: product.categories?.slug ?? "spices" },
						className: "hover:text-primary transition-colors",
						children: product.categories?.name ?? "Collection"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground",
						children: product.name
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-12 lg:grid-cols-12 items-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-6 lg:sticky lg:top-24",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hover-zoom-img relative overflow-hidden rounded-2xl border border-border bg-card shadow-md aspect-square",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: images[activeImage] ?? cover,
							alt: product.name,
							width: 1200,
							height: 1200,
							className: "h-full w-full object-cover"
						})
					}), images.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 flex gap-3 overflow-x-auto pb-2",
						children: images.map((img, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setActiveImage(i),
							"aria-label": `View product image ${i + 1}`,
							className: cn("relative size-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer", activeImage === i ? "border-primary shadow-md scale-105" : "border-border/60 hover:border-primary/50"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: img,
								alt: "",
								className: "h-full w-full object-cover"
							})
						}, img + i))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-accent uppercase",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: product.categories?.name ?? "Mummy Rose Pantry" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground mt-3",
							children: product.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-baseline gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-3xl font-bold text-foreground",
								children: formatNaira(price)
							}), hasDiscount && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-base text-muted-foreground line-through",
								children: formatNaira(product.price)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-base leading-relaxed text-muted-foreground",
							children: product.short_description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 grid grid-cols-2 gap-3 rounded-xl border border-border/80 bg-card p-4 text-xs font-semibold text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "100% Natural & Preservative Free" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Generational Family Recipe" })]
							})]
						}),
						options.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
								children: "Select Package Size:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2.5 flex flex-wrap gap-2.5",
								children: options.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setVariant(opt),
									className: cn("rounded-full border px-5 py-2 text-xs font-bold transition-all cursor-pointer", chosen === opt ? "border-primary bg-primary text-primary-foreground shadow-md" : "border-border bg-card hover:border-primary/50 text-foreground"),
									children: opt
								}, opt))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap items-center gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex h-12 items-center rounded-xl border border-border bg-card px-2 shadow-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-label": "Decrease quantity",
											className: "grid size-9 place-items-center rounded-lg hover:bg-secondary text-foreground",
											onClick: () => setQty((q) => Math.max(1, q - 1)),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-10 text-center font-bold text-sm",
											children: qty
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-label": "Increase quantity",
											className: "grid size-9 place-items-center rounded-lg hover:bg-secondary text-foreground",
											onClick: () => setQty((q) => Math.min(99, q + 1)),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "xl",
									disabled: soldOut,
									onClick: handleAddToCart,
									className: "flex-1 font-semibold text-base py-6 shadow-md hover:shadow-lg transition-all",
									children: added ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mr-2 size-5" }), " Added to Cart"] }) : soldOut ? "Sold Out" : `Add to Cart — ${formatNaira(price * qty)}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "xl",
									onClick: () => toggleWishlist(product.slug),
									className: "size-12 p-0 rounded-xl",
									"aria-label": "Wishlist",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("size-5", isWishlisted(product.slug) && "fill-primary text-primary") })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-col gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppOrderButton, { lines: [{
								name: product.name,
								variant: chosen,
								quantity: qty,
								unit_price: price
							}] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderPathsNote, { className: "text-xs leading-relaxed text-muted-foreground" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-6 flex items-center gap-2 text-xs font-semibold text-muted-foreground border-t border-border/60 pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "size-4 text-accent" }), soldOut ? "Out of stock — contact us to get notified on next batch restock." : `${product.stock_quantity} available in batch · Dispatched within 48 hours`]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Accordion, {
							type: "single",
							collapsible: true,
							className: "mt-8",
							defaultValue: "description",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
									value: "description",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
										className: "font-display text-lg font-bold",
										children: "Product Story & Details"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, {
										className: "leading-relaxed whitespace-pre-line text-sm text-muted-foreground",
										children: product.description || product.short_description
									})]
								}),
								product.ingredients && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
									value: "ingredients",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
										className: "font-display text-lg font-bold",
										children: "Ingredient Transparency"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionContent, {
										className: "text-sm leading-relaxed text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold text-foreground mb-1",
											children: "100% Pure & Unadulterated:"
										}), product.ingredients]
									})]
								}),
								Object.keys(nutrition).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
									value: "nutrition",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
										className: "font-display text-lg font-bold",
										children: "Nutritional Profile"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
										className: "grid grid-cols-2 gap-3 text-xs text-muted-foreground",
										children: Object.entries(nutrition).map(([key, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between rounded-lg bg-secondary/50 p-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
												className: "font-semibold capitalize text-foreground",
												children: key.replace(/_/g, " ")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
												className: "font-bold",
												children: String(value)
											})]
										}, key))
									}) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
									value: "delivery",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
										className: "font-display text-lg font-bold",
										children: "Shipping & Storage"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, {
										className: "text-sm leading-relaxed text-muted-foreground",
										children: "Nationwide delivery across Nigeria in 2–4 business days. International shipping via express courier. Store in a cool, dry pantry away from direct sunlight."
									})]
								})
							]
						})
					]
				})]
			}),
			related.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-24 border-t border-border/80 pt-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "eyebrow text-accent uppercase tracking-widest",
						children: "Perfect Combinations"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl mt-1",
						children: "Pairs Beautifully With..."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/products",
						className: "text-sm font-semibold text-primary hover:underline",
						children: "View All Pantry"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
					children: related.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductReviews, {
				productId: product.id,
				productName: product.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecentlyViewed, {
				products,
				excludeSlug: product.slug
			})
		]
	});
}
//#endregion
export { ProductDetail as component };
