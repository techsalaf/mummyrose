import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as formatDateTime, O as effectivePrice, U as useServerFn, j as formatNaira } from "./router-Bg0ak8An.mjs";
import { Jt as BellRing, nt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { i as useQuery, o as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { u as productsQuery } from "./queries-BOD52kvY.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Button } from "./router-Bg0ak8An2.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as useAuth } from "./useAuth-DQ7W1JA2.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { a as SelectValue, c as TableCell, d as TableRow, i as SelectTrigger, l as TableHead, n as SelectContent, o as Table, r as SelectItem, s as TableBody, t as Select, u as TableHeader } from "./table-Bc3sudQz.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { t as placeOrder } from "./orders.functions-BufAZ0xZ.mjs";
import { n as myWholesaleAccountQuery, r as myWholesaleOrdersQuery, t as TIER_LABELS } from "./wholesale-BFAAEWWN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wholesale.portal-rTizN9Cy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WholesalePortal() {
	const { user, loading } = useAuth();
	const queryClient = useQueryClient();
	const account = useQuery(myWholesaleAccountQuery(user?.id));
	const orders = useQuery(myWholesaleOrdersQuery(user?.id));
	const products = useQuery(productsQuery);
	const submit = useServerFn(placeOrder);
	const [quantities, setQuantities] = (0, import_react.useState)({});
	const [form, setForm] = (0, import_react.useState)({
		country: "Nigeria",
		payment_provider: "bank_transfer"
	});
	const discount = Number(account.data?.discount_percent ?? 0);
	const approved = account.data?.status === "approved";
	const productRows = products.data ?? [];
	const selected = (0, import_react.useMemo)(() => productRows.map((product) => ({
		product,
		quantity: Number(quantities[product.id] ?? 0)
	})).filter((row) => row.quantity > 0), [productRows, quantities]);
	const subtotal = selected.reduce((sum, row) => sum + effectivePrice(row.product) * (1 - discount / 100) * row.quantity, 0);
	const place = useMutation({
		mutationFn: async () => {
			if (!approved) throw new Error("Your trade account must be approved before placing wholesale orders.");
			if (selected.length === 0) throw new Error("Add at least one product to your order.");
			return await submit({ data: {
				customer_name: form.customer_name || account.data?.contact_name || "",
				customer_email: form.customer_email || account.data?.email || "",
				customer_phone: form.customer_phone || account.data?.phone || "",
				address_line: form.address_line ?? "",
				city: form.city ?? "",
				state: form.state ?? "",
				country: form.country ?? "Nigeria",
				postal_code: null,
				notes: form.notes ?? null,
				payment_provider: form.payment_provider ?? "bank_transfer",
				origin: window.location.origin,
				order_type: "wholesale",
				wholesale_account_id: account.data?.id ?? null,
				items: selected.map((row) => ({
					product_id: row.product.id,
					variant: null,
					quantity: row.quantity
				}))
			} });
		},
		onSuccess: async (result) => {
			toast.success(`Order ${result.order.order_number} submitted`);
			setQuantities({});
			await queryClient.invalidateQueries({ queryKey: [
				"wholesale",
				"orders",
				user?.id ?? "anon"
			] });
			if (result.redirect_url) window.location.href = result.redirect_url;
		},
		onError: (error) => toast.error(error.message)
	});
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-page py-24 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto size-5 animate-spin text-muted-foreground" })
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
		title: "Sign in to your trade account",
		body: "The wholesale portal shows your tier pricing, order pad and shipment tracking.",
		cta: {
			to: "/account",
			label: "Sign in"
		}
	});
	if (account.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-page py-24 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto size-5 animate-spin text-muted-foreground" })
	});
	if (!account.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
		title: "No trade account yet",
		body: "Apply for wholesale pricing and we'll review your business within one working day.",
		cta: {
			to: "/wholesale/apply",
			label: "Apply for wholesale"
		}
	});
	const orderRows = orders.data ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-12 md:py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow text-muted-foreground",
				children: "Wholesale portal"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-3xl font-semibold md:text-4xl",
				children: account.data.company
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "pt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wide text-muted-foreground",
							children: "Account status"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							className: "mt-2",
							variant: approved ? "default" : "secondary",
							children: account.data.status
						})]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "pt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wide text-muted-foreground",
							children: "Tier"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 font-display text-xl font-semibold",
							children: TIER_LABELS[account.data.tier] ?? account.data.tier
						})]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "pt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wide text-muted-foreground",
							children: "Your discount"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1.5 font-display text-xl font-semibold",
							children: [discount, "% off retail"]
						})]
					}) })
				]
			}),
			!approved ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex items-start gap-3 rounded-md border border-accent/40 bg-accent/5 p-4 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "mt-0.5 size-4 shrink-0 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: account.data.status === "pending" ? "Application under review" : `Application ${account.data.status}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-muted-foreground",
						children: account.data.status === "pending" ? "Our trade team reviews new accounts within one working day. You can browse the order pad now — trade pricing and trade ordering unlock the moment your account is approved." : "Trade ordering is disabled for this account. Reply to our last email or contact the trade desk and we'll take another look."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-muted-foreground",
						children: "Need stock today? You can still buy at retail prices in the shop."
					})
				] })]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex items-start gap-3 rounded-md border border-primary/30 bg-primary/5 p-4 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "mt-0.5 size-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"Account approved on the ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: TIER_LABELS[account.data.tier] ?? account.data.tier }),
					" tier —",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [discount, "% off"] }),
					" every retail price, applied automatically on the order pad."
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "order",
				className: "mt-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "order",
							children: "Order pad"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "orders",
							children: "My orders"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "details",
							children: "Account details"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "order",
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-6 lg:grid-cols-[2fr_1fr]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-lg border bg-card",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Product" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Trade price" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Stock" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "w-28",
										children: "Qty"
									})
								] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: productRows.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: product.name }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [formatNaira(effectivePrice(product) * (1 - discount / 100)), discount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-1 text-xs text-muted-foreground line-through",
										children: formatNaira(effectivePrice(product))
									}) : null] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "text-sm text-muted-foreground",
										children: product.stock_quantity
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 0,
										value: quantities[product.id] ?? "",
										onChange: (e) => setQuantities((prev) => ({
											...prev,
											[product.id]: e.target.value
										}))
									}) })
								] }, product.id)) })] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "h-fit",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
									className: "text-base",
									children: "Delivery & payment"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Delivery is quoted on the order confirmation." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
									className: "space-y-3",
									children: [
										[
											["customer_name", "Contact name"],
											["customer_email", "Email"],
											["customer_phone", "Phone"],
											["address_line", "Delivery address"],
											["city", "City"],
											["state", "State"],
											["country", "Country"]
										].map(([name, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: name,
											children: label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: name,
											className: "mt-1.5",
											value: form[name] ?? (name === "customer_name" ? account.data?.contact_name ?? "" : name === "customer_email" ? account.data?.email ?? "" : name === "customer_phone" ? account.data?.phone ?? "" : ""),
											onChange: (e) => setForm((prev) => ({
												...prev,
												[name]: e.target.value
											}))
										})] }, name)),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Payment method" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: form.payment_provider ?? "bank_transfer",
											onValueChange: (value) => setForm((prev) => ({
												...prev,
												payment_provider: value
											})),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "mt-1.5",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "bank_transfer",
													children: "Bank transfer (invoice)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "paystack",
													children: "Paystack"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "flutterwave",
													children: "Flutterwave"
												})
											] })]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between border-t pt-3 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-muted-foreground",
												children: [
													"Subtotal (",
													selected.length,
													" lines)"
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: formatNaira(subtotal)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											className: "w-full",
											size: "lg",
											disabled: place.isPending || !approved,
											onClick: () => place.mutate(),
											children: [place.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : null, " Submit trade order"]
										}),
										!approved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-center text-xs text-muted-foreground",
											children: "Trade ordering unlocks once your account is approved."
										}) : null
									]
								})]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "orders",
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-lg border bg-card",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Order" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Placed" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Items" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Total" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Payment" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" })
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: orderRows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								colSpan: 6,
								className: "py-10 text-center text-sm text-muted-foreground",
								children: "No orders yet."
							}) }) : orderRows.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "font-medium",
									children: order.order_number
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-sm text-muted-foreground",
									children: formatDateTime(order.created_at)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "text-sm",
									children: order.order_items?.length ?? 0
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatNaira(order.total) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: order.payment_status === "paid" ? "default" : "secondary",
									children: order.payment_status
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									children: order.status
								}) })
							] }, order.id)) })] })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "details",
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "grid gap-3 pt-6 text-sm sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
									label: "Company",
									value: account.data.company
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
									label: "Contact",
									value: account.data.contact_name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
									label: "Email",
									value: account.data.email
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
									label: "Phone",
									value: account.data.phone ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
									label: "Country",
									value: account.data.country ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
									label: "Monthly volume",
									value: account.data.monthly_volume ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
									label: "Applied",
									value: formatDateTime(account.data.created_at)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
									label: "Tier",
									value: TIER_LABELS[account.data.tier] ?? account.data.tier
								})
							]
						}) })
					})
				]
			})
		]
	});
}
function Detail({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs uppercase tracking-wide text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-0.5",
		children: value
	})] });
}
function Empty({ title, body, cta }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page max-w-lg py-20 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-semibold",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-muted-foreground",
				children: body
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-6",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: cta.to,
					children: cta.label
				})
			})
		]
	});
}
//#endregion
export { WholesalePortal as component };
