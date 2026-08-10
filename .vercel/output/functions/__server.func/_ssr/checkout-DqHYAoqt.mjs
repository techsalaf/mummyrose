import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { r as createServerFn } from "./server-CTdGS_ot.mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Textarea, H as createSsrRpc, R as useCart, U as useServerFn, j as formatNaira } from "./router-Bg0ak8An.mjs";
import { d as numberType, f as objectType, p as stringType } from "../_libs/@lovable.dev/mcp-js+[...].mjs";
import { t as checkoutSchema } from "./schemas-CNICxIYS.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { i as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { p as settingsQuery } from "./queries-BOD52kvY.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Button } from "./router-Bg0ak8An2.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as useAuth } from "./useAuth-DQ7W1JA2.mjs";
import { n as SavedAddressPicker } from "./address-book-wteGIdKR.mjs";
import { n as pickShipping, r as pickWhatsApp } from "./settings-C0klt_FD.mjs";
import { n as whatsAppLink, t as buildWhatsAppMessage } from "./whatsapp-7MNxemtf.mjs";
import { n as quoteShipping } from "./shipping-DS0T1UXJ.mjs";
import { t as track } from "./analytics-DzDJOljQ.mjs";
import { t as placeOrder } from "./orders.functions-BufAZ0xZ.mjs";
import { n as getPaymentMethods } from "./payment-methods.functions-DQc-JDJ7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-DqHYAoqt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var checkCoupon = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	code: stringType().trim().min(2).max(40),
	subtotal: numberType().min(0).max(1e8)
}).parse(data)).handler(createSsrRpc("81ebdc76d7715e2ec6681729423a391a581eb56db9bb3dbc43f9403df008c1e2"));
function CheckoutPage() {
	const { items, subtotal, clear } = useCart();
	const navigate = useNavigate();
	const submit = useServerFn(placeOrder);
	const { user } = useAuth();
	const { data: settings } = useQuery(settingsQuery);
	const [errors, setErrors] = (0, import_react.useState)({});
	const [provider, setProvider] = (0, import_react.useState)("paystack");
	const [state, setState] = (0, import_react.useState)("");
	const [country, setCountry] = (0, import_react.useState)("Nigeria");
	const [prefill, setPrefill] = (0, import_react.useState)(null);
	const [couponInput, setCouponInput] = (0, import_react.useState)("");
	const [coupon, setCoupon] = (0, import_react.useState)(null);
	const verifyCoupon = useServerFn(checkCoupon);
	const couponCheck = useMutation({
		mutationFn: (code) => verifyCoupon({ data: {
			code,
			subtotal
		} }),
		onSuccess: (result) => {
			setCoupon(result);
			setCouponInput(result.code);
			toast.success(`${result.code} applied — ${result.label}`);
		},
		onError: (error) => toast.error(error.message || "That code isn't valid.")
	});
	const discount = coupon ? Math.min(coupon.discount, subtotal) : 0;
	const fetchPaymentMethods = useServerFn(getPaymentMethods);
	const { data: payments } = useQuery({
		queryKey: ["payment-methods"],
		queryFn: () => fetchPaymentMethods(),
		staleTime: 6e4
	});
	const whatsapp = pickWhatsApp(settings);
	const shippingConfig = pickShipping(settings);
	const quote = (0, import_react.useMemo)(() => quoteShipping(shippingConfig, {
		subtotal,
		state,
		country
	}), [
		shippingConfig,
		subtotal,
		state,
		country
	]);
	(0, import_react.useEffect)(() => {
		if (items.length > 0) track("begin_checkout", { value: subtotal });
	}, []);
	const options = (0, import_react.useMemo)(() => {
		const list = [];
		if (payments?.paystack_enabled !== false) list.push({
			value: "paystack",
			label: "Paystack — card, bank & USSD",
			hint: "Secure checkout, instant confirmation"
		});
		if (payments?.flutterwave_enabled !== false) list.push({
			value: "flutterwave",
			label: "Flutterwave",
			hint: "Cards and mobile money"
		});
		if (payments?.bank_transfer_enabled !== false) list.push({
			value: "bank_transfer",
			label: "Direct bank transfer",
			hint: "Transfer details shown after ordering"
		});
		if (payments?.pay_on_delivery_enabled !== false) list.push({
			value: "pay_on_delivery",
			label: "Pay on delivery",
			hint: "Available in selected cities"
		});
		return list;
	}, [payments]);
	(0, import_react.useEffect)(() => {
		if (options.length && !options.some((o) => o.value === provider)) setProvider(options[0].value);
	}, [options, provider]);
	const mutation = useMutation({
		mutationFn: (data) => submit({ data }),
		onSuccess: (result, variables) => {
			if (result.redirect_url) {
				window.location.href = result.redirect_url;
				return;
			}
			const order = result.order;
			track("order_placed", { value: order.total });
			if (variables.payment_provider === "whatsapp" && whatsapp.phone) {
				const message = buildWhatsAppMessage({
					order_number: order.order_number,
					customer_name: variables.customer_name,
					customer_phone: variables.customer_phone,
					customer_email: variables.customer_email,
					address_line: variables.address_line,
					city: variables.city,
					state: variables.state,
					country: variables.country,
					notes: variables.notes,
					payment_provider: "whatsapp",
					subtotal: order.subtotal,
					shipping_fee: order.shipping_fee,
					shipping_zone: order.shipping_zone,
					total: order.total,
					items: order.items
				});
				track("whatsapp_order", { value: order.total });
				window.open(whatsAppLink(whatsapp.phone, message), "_blank", "noopener,noreferrer");
			}
			clear();
			toast.success(`Order ${order.order_number} placed`);
			navigate({
				to: "/order-confirmed",
				search: { order: order.order_number }
			});
		},
		onError: (error) => toast.error(error.message || "We couldn't place that order.")
	});
	if (items.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-24 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: "Your cart is empty"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			variant: "clay",
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/products",
				children: "Shop the pantry"
			})
		})]
	});
	const buildPayload = (form, chosen) => ({
		customer_name: String(form.get("customer_name") ?? ""),
		customer_email: String(form.get("customer_email") ?? ""),
		customer_phone: String(form.get("customer_phone") ?? ""),
		address_line: String(form.get("address_line") ?? ""),
		city: String(form.get("city") ?? ""),
		state: String(form.get("state") ?? ""),
		country: String(form.get("country") || "Nigeria"),
		postal_code: String(form.get("postal_code") ?? "") || null,
		notes: String(form.get("notes") ?? "") || null,
		payment_provider: chosen,
		origin: typeof window === "undefined" ? null : window.location.origin,
		coupon_code: coupon?.code ?? null,
		items: items.map((i) => ({
			product_id: i.product_id,
			variant: i.variant,
			quantity: i.quantity
		}))
	});
	const runSubmit = (form, chosen) => {
		const parsed = checkoutSchema.safeParse(buildPayload(new FormData(form), chosen));
		if (!parsed.success) {
			const next = {};
			for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
			setErrors(next);
			toast.error("Please check the highlighted fields.");
			return;
		}
		setErrors({});
		mutation.mutate(parsed.data);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-12 md:py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl",
				children: "Checkout"
			}),
			!user && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: [
					"Checking out as a guest — no account needed.",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/account",
						className: "underline",
						children: "Sign in"
					}),
					" ",
					"if you'd like this order saved to your profile."
				]
			}),
			user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SavedAddressPicker, {
					userId: user.id,
					onSelect: (address) => {
						setPrefill(address);
						setState(address.state);
						setCountry(address.country);
					}
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (event) => {
					event.preventDefault();
					runSubmit(event.currentTarget, provider);
				},
				className: "mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
									className: "font-display text-xl",
									children: "Contact"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									name: "customer_name",
									label: "Full name",
									defaultValue: prefill?.full_name ?? "",
									error: errors.customer_name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										name: "customer_email",
										label: "Email",
										type: "email",
										defaultValue: user?.email ?? "",
										error: errors.customer_email
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										name: "customer_phone",
										label: "Phone",
										defaultValue: prefill?.phone ?? "",
										error: errors.customer_phone
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
									className: "font-display text-xl",
									children: "Delivery"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									name: "address_line",
									label: "Street address",
									defaultValue: prefill?.address_line ?? "",
									error: errors.address_line
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 sm:grid-cols-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											name: "city",
											label: "City",
											defaultValue: prefill?.city ?? "",
											error: errors.city
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											name: "state",
											label: "State",
											defaultValue: prefill?.state ?? "",
											error: errors.state,
											onChange: (value) => setState(value)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											name: "postal_code",
											label: "Postal code (optional)",
											error: errors.postal_code
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									name: "country",
									label: "Country",
									defaultValue: "Nigeria",
									error: errors.country,
									onChange: (value) => setCountry(value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										"Delivery zone: ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: quote.zone }),
										" — ",
										quote.fee === 0 ? "free delivery" : formatNaira(quote.fee),
										quote.free ? ` (free over ${formatNaira(quote.free_over)})` : ""
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "notes",
									children: "Delivery notes (optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "notes",
									name: "notes",
									rows: 3,
									maxLength: 1e3,
									className: "mt-1.5"
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
									className: "font-display text-xl",
									children: "Payment"
								}),
								options.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: `flex cursor-pointer items-start gap-3 rounded-md border p-3 text-sm ${provider === p.value ? "border-accent bg-accent/5" : "border-border"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "radio",
										name: "payment_provider",
										value: p.value,
										checked: provider === p.value,
										onChange: () => setProvider(p.value),
										className: "mt-1 accent-[var(--accent)]"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block font-medium",
										children: p.label
									}), p.hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-xs text-muted-foreground",
										children: p.hint
									})] })]
								}, p.value)),
								provider === "bank_transfer" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-md border border-border bg-muted/40 p-3 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: "Bank transfer"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-muted-foreground",
										children: "We'll show the account details on the confirmation page and in your email — use your order number as the transfer reference."
									})]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "surface-card h-fit rounded-lg p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl",
							children: "Order summary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 space-y-3 text-sm",
							children: items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: [
										i.name,
										i.variant ? ` · ${i.variant}` : "",
										" × ",
										i.quantity
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatNaira(i.unit_price * i.quantity) })]
							}, `${i.product_id}-${i.variant}`))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 border-t border-border pt-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "coupon",
									children: "Discount code"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1.5 flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "coupon",
										value: couponInput,
										onChange: (e) => setCouponInput(e.currentTarget.value.toUpperCase()),
										placeholder: "e.g. ROSE10",
										maxLength: 40
									}), coupon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "outline",
										onClick: () => {
											setCoupon(null);
											setCouponInput("");
										},
										children: "Remove"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "outline",
										disabled: couponCheck.isPending || couponInput.trim().length < 2,
										onClick: () => couponCheck.mutate(couponInput),
										children: couponCheck.isPending ? "Checking…" : "Apply"
									})]
								}),
								coupon && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-xs text-accent",
									children: [
										coupon.code,
										" applied — ",
										coupon.label
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-5 space-y-2 border-t border-border pt-4 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										children: "Subtotal"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formatNaira(subtotal) })]
								}),
								discount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-accent",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", { children: [
										"Discount (",
										coupon?.code,
										")"
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: ["−", formatNaira(discount)] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
										className: "text-muted-foreground",
										children: [
											"Delivery (",
											quote.zone,
											")"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: quote.fee === 0 ? "Free" : formatNaira(quote.fee) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between border-t border-border pt-3 font-display text-lg",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formatNaira(Math.max(0, subtotal - discount) + quote.fee) })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							variant: "clay",
							size: "lg",
							className: "mt-6 w-full",
							disabled: mutation.isPending,
							children: mutation.isPending ? "Placing order…" : "Place order"
						}),
						whatsapp.enabled !== false && whatsapp.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "my-4 flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" }),
									" or ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								size: "lg",
								className: "w-full",
								disabled: mutation.isPending,
								onClick: (event) => {
									const form = event.currentTarget.closest("form");
									if (form) runSubmit(form, "whatsapp");
								},
								children: "Send order on WhatsApp"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xs leading-relaxed text-muted-foreground",
								children: [
									"Your order is created and reserved either way. ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Place order" }),
									" is fastest — you pay or confirm now and get a tracking number instantly. ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Send order on WhatsApp" }),
									" opens a chat with the full order details so a real person can confirm delivery and payment with you — great if you prefer not to pay online, but replies come during business hours."
								]
							})
						] })
					]
				})]
			}, prefill?.id ?? "blank")
		]
	});
}
function Field({ name, label, type = "text", defaultValue, error, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			htmlFor: name,
			children: label
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			id: name,
			name,
			type,
			defaultValue,
			className: "mt-1.5",
			onChange: onChange ? (e) => onChange(e.currentTarget.value) : void 0
		}),
		error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs text-destructive",
			children: error
		})
	] });
}
//#endregion
export { CheckoutPage as component };
