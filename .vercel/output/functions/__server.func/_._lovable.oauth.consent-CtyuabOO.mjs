import { o as __toESM } from "./_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "./_libs/@ai-sdk/react+[...].mjs";
import { N as oauth, y as Route$3 } from "./_ssr/router-Bg0ak8An.mjs";
import { O as ShieldCheck, nt as LoaderCircle } from "./_libs/lucide-react.mjs";
import { t as Input } from "./_ssr/input-B8Q2ztVi.mjs";
import { t as supabase } from "./_ssr/client-Cf-9GAe8.mjs";
import { n as Button } from "./_ssr/router-Bg0ak8An2.mjs";
import { t as Label } from "./_ssr/label-DBD1bRRP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_._lovable.oauth.consent-CtyuabOO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SignInCard() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const returnTo = typeof window !== "undefined" ? window.location.href : "/";
	async function submit(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		const { error: authError } = mode === "signin" ? await supabase.auth.signInWithPassword({
			email,
			password
		}) : await supabase.auth.signUp({
			email,
			password,
			options: { emailRedirectTo: returnTo }
		});
		setBusy(false);
		if (authError) {
			setError(authError.message);
			return;
		}
		window.location.href = returnTo;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: submit,
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "consent-email",
					children: "Email"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "consent-email",
					type: "email",
					autoComplete: "email",
					required: true,
					value: email,
					onChange: (e) => setEmail(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "consent-password",
					children: "Password"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "consent-password",
					type: "password",
					autoComplete: mode === "signin" ? "current-password" : "new-password",
					required: true,
					value: password,
					onChange: (e) => setPassword(e.target.value)
				})]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "text-sm text-destructive",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "submit",
				disabled: busy,
				className: "w-full",
				children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), mode === "signin" ? "Sign in to continue" : "Create account & continue"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "w-full text-center text-sm text-muted-foreground underline",
				onClick: () => setMode(mode === "signin" ? "signup" : "signin"),
				children: mode === "signin" ? "I don't have an account yet" : "I already have an account"
			})
		]
	});
}
function Consent() {
	const loaderData = Route$3.useLoaderData();
	const { authorization_id } = Route$3.useSearch();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	async function decide(approve) {
		setBusy(true);
		setError(null);
		const { data, error: decisionError } = approve ? await oauth().approveAuthorization(authorization_id) : await oauth().denyAuthorization(authorization_id);
		if (decisionError) {
			setBusy(false);
			setError(decisionError.message);
			return;
		}
		const target = data?.redirect_url ?? data?.redirect_to;
		if (!target) {
			setBusy(false);
			setError("No redirect was returned by the authorization server.");
			return;
		}
		window.location.href = target;
	}
	const clientName = loaderData.details?.client?.name ?? "an app";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto flex min-h-[70dvh] max-w-md flex-col justify-center px-6 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border bg-card p-6 shadow-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
					className: "size-6 text-accent",
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 font-display text-2xl",
					children: loaderData.needsAuth ? "Sign in to Mummy Rose" : `Connect ${clientName} to your account`
				}),
				loaderData.needsAuth ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 mb-6 text-sm text-muted-foreground",
					children: "Sign in so we can confirm which account this app should act as."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInCard, {})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: [
							"This lets ",
							clientName,
							" use Mummy Rose as you — browsing the catalogue, reading your own orders and sending enquiries on your behalf."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-6 space-y-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: "Signed in as"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "truncate font-medium",
									children: loaderData.email
								})]
							}),
							loaderData.details?.client?.redirect_uri && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: "Returns to"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "truncate",
									children: loaderData.details.client.redirect_uri
								})]
							}),
							loaderData.details?.scope && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: "Shares"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "truncate",
									children: "Your basic profile and email address"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-xs text-muted-foreground",
						children: "This does not bypass Mummy Rose permissions — it can only reach data your account can already see."
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "alert",
						className: "mt-4 text-sm text-destructive",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							disabled: busy,
							onClick: () => decide(true),
							className: "flex-1",
							children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), " Approve"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							disabled: busy,
							onClick: () => decide(false),
							className: "flex-1",
							children: "Cancel connection"
						})]
					})
				] })
			]
		})
	});
}
//#endregion
export { Consent as component };
