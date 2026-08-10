import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Textarea } from "./router-Bg0ak8An.mjs";
import { i as wholesaleApplicationSchema } from "./schemas-CNICxIYS.mjs";
import { nt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as supabase } from "./client-Cf-9GAe8.mjs";
import { i as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Button } from "./router-Bg0ak8An2.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as useAuth } from "./useAuth-DQ7W1JA2.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { n as myWholesaleAccountQuery } from "./wholesale-BFAAEWWN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wholesale.apply-BkGHoxII.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FIELDS = [
	{
		name: "company",
		label: "Company / business name"
	},
	{
		name: "contact_name",
		label: "Contact name"
	},
	{
		name: "email",
		label: "Business email",
		type: "email"
	},
	{
		name: "phone",
		label: "Phone number"
	},
	{
		name: "country",
		label: "Country"
	},
	{
		name: "monthly_volume",
		label: "Estimated monthly volume"
	}
];
function WholesaleApply() {
	const { user, loading } = useAuth();
	const navigate = useNavigate();
	const existing = useQuery(myWholesaleAccountQuery(user?.id));
	const [values, setValues] = (0, import_react.useState)({ country: "Nigeria" });
	(0, import_react.useEffect)(() => {
		if (user?.email) setValues((prev) => ({
			...prev,
			email: prev.email ?? user.email ?? ""
		}));
	}, [user?.email]);
	const apply = useMutation({
		mutationFn: async () => {
			const parsed = wholesaleApplicationSchema.parse({
				company: values.company ?? "",
				contact_name: values.contact_name ?? "",
				email: values.email ?? "",
				phone: values.phone ?? "",
				country: values.country ?? null,
				monthly_volume: values.monthly_volume ?? null,
				notes: values.notes ?? null
			});
			const { error } = await supabase.from("wholesale_accounts").insert({
				...parsed,
				user_id: user?.id ?? null,
				status: "pending"
			});
			if (error) throw new Error(error.message);
		},
		onSuccess: () => {
			toast.success("Application submitted — we review trade accounts within one business day.");
			navigate({ to: "/wholesale/portal" });
		},
		onError: (error) => toast.error(error.message)
	});
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "container-page py-24 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto size-5 animate-spin text-muted-foreground" })
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page max-w-lg py-20 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-semibold",
				children: "Create an account to apply"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-muted-foreground",
				children: "Trade accounts are tied to a login so you can reorder at your tier price and track shipments."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-6",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/account",
					children: "Sign in or create an account"
				})
			})
		]
	});
	if (existing.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page max-w-lg py-20 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-semibold",
				children: "You already have an application"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-muted-foreground",
				children: [
					"Your trade account for ",
					existing.data.company,
					" is currently ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: existing.data.status }),
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-6",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/wholesale/portal",
					children: "Open your wholesale portal"
				})
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page max-w-2xl py-12 md:py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow text-muted-foreground",
				children: "Wholesale"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-3xl font-semibold md:text-4xl",
				children: "Apply for trade pricing"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-muted-foreground",
				children: "Tell us about your business. Once approved, your discount is applied automatically at checkout."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Business details"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "All fields except volume and notes are required." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [FIELDS.map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: field.name,
						children: field.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: field.name,
						className: "mt-1.5",
						type: "type" in field ? field.type : "text",
						value: values[field.name] ?? "",
						onChange: (e) => setValues((prev) => ({
							...prev,
							[field.name]: e.target.value
						}))
					})] }, field.name)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sm:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "notes",
							children: "Product mix & requirements"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "notes",
							className: "mt-1.5",
							rows: 4,
							value: values.notes ?? "",
							onChange: (e) => setValues((prev) => ({
								...prev,
								notes: e.target.value
							}))
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "mt-6",
					size: "lg",
					disabled: apply.isPending,
					onClick: () => apply.mutate(),
					children: [apply.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : null, " Submit application"]
				})] })]
			})
		]
	});
}
//#endregion
export { WholesaleApply as component };
