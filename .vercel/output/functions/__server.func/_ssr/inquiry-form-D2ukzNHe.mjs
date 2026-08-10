import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { E as Textarea, U as useServerFn, V as submitInquiry } from "./router-Bg0ak8An.mjs";
import { n as inquirySchema } from "./schemas-CNICxIYS.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Button } from "./router-Bg0ak8An2.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inquiry-form-D2ukzNHe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var empty = {
	name: "",
	company: "",
	email: "",
	phone: "",
	country: "",
	requirements: "",
	message: ""
};
function InquiryForm({ type, requirementsLabel = "Requirements", submitLabel = "Send enquiry" }) {
	const send = useServerFn(submitInquiry);
	const [form, setForm] = (0, import_react.useState)(empty);
	const [pending, setPending] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	const set = (key) => (e) => setForm((prev) => ({
		...prev,
		[key]: e.target.value
	}));
	async function onSubmit(e) {
		e.preventDefault();
		const parsed = inquirySchema.safeParse({
			...form,
			type
		});
		if (!parsed.success) {
			toast.error(parsed.error.issues[0].message);
			return;
		}
		setPending(true);
		try {
			await send({ data: parsed.data });
			setForm(empty);
			setDone(true);
			toast.success("Enquiry received. Our team replies within one business day.");
		} catch {
			toast.error("Could not send your enquiry. Please try again or email hello@mummyrose.com.");
		} finally {
			setPending(false);
		}
	}
	if (done) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-card rounded-lg p-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-2xl",
				children: "Thank you"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Your enquiry is with our commercial team. We reply within one business day."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				className: "mt-6",
				onClick: () => setDone(false),
				children: "Send another"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		className: "surface-card grid gap-5 rounded-lg p-6 sm:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Full name",
						required: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.name,
							onChange: set("name"),
							required: true,
							maxLength: 120
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Company",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.company,
							onChange: set("company"),
							maxLength: 160
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Email",
						required: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							value: form.email,
							onChange: set("email"),
							required: true,
							maxLength: 255
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Phone",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.phone,
							onChange: set("phone"),
							maxLength: 40
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Country",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: form.country,
					onChange: set("country"),
					maxLength: 80
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: requirementsLabel,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: form.requirements,
					onChange: set("requirements"),
					rows: 3,
					maxLength: 2e3,
					placeholder: "Products, volumes, packaging format, target markets…"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Message",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: form.message,
					onChange: set("message"),
					rows: 4,
					maxLength: 4e3
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				size: "lg",
				disabled: pending,
				className: "justify-self-start",
				children: pending ? "Sending…" : submitLabel
			})
		]
	});
}
function Field({ label, required, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
			className: "text-xs tracking-wide text-muted-foreground uppercase",
			children: [label, required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-accent",
				children: " *"
			})]
		}), children]
	});
}
//#endregion
export { InquiryForm as t };
