import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { d as DialogTitle, l as DialogFooter, o as Dialog, s as DialogContent, u as DialogHeader } from "./router-Bg0ak8An.mjs";
import { $ as MapPin, B as Pencil, R as Plus, m as Trash2, nt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as supabase } from "./client-Cf-9GAe8.mjs";
import { i as useQuery, o as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as addressesQuery } from "./queries-BOD52kvY.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Button } from "./router-Bg0ak8An2.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/address-book-wteGIdKR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMPTY = {
	label: "Home",
	full_name: "",
	phone: "",
	address_line: "",
	city: "",
	state: "",
	country: "Nigeria",
	postal_code: "",
	is_default: false
};
/** Saved delivery addresses for a signed-in shopper. */
function AddressBook({ userId, onUse }) {
	const queryClient = useQueryClient();
	const { data: addresses = [], isLoading } = useQuery(addressesQuery(userId));
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({ ...EMPTY });
	const invalidate = () => queryClient.invalidateQueries({ queryKey: ["customer_addresses", userId] });
	const save = useMutation({
		mutationFn: async () => {
			const payload = {
				...form,
				postal_code: form.postal_code || null,
				user_id: userId
			};
			const { error } = editing ? await supabase.from("customer_addresses").update(payload).eq("id", editing.id) : await supabase.from("customer_addresses").insert(payload);
			if (error) throw new Error(error.message);
			if (payload.is_default) await supabase.from("customer_addresses").update({ is_default: false }).eq("user_id", userId).neq("id", editing?.id ?? "00000000-0000-0000-0000-000000000000");
		},
		onSuccess: async () => {
			toast.success(editing ? "Address updated" : "Address saved");
			setOpen(false);
			await invalidate();
		},
		onError: (error) => toast.error(error.message)
	});
	const remove = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("customer_addresses").delete().eq("id", id);
			if (error) throw new Error(error.message);
		},
		onSuccess: async () => {
			toast.success("Address removed");
			await invalidate();
		},
		onError: (error) => toast.error(error.message)
	});
	const openForm = (address) => {
		setEditing(address);
		setForm(address ? {
			label: address.label,
			full_name: address.full_name,
			phone: address.phone,
			address_line: address.address_line,
			city: address.city,
			state: address.state,
			country: address.country,
			postal_code: address.postal_code ?? "",
			is_default: address.is_default
		} : { ...EMPTY });
		setOpen(true);
	};
	const field = (name, label, props = {}) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
		htmlFor: `addr-${name}`,
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
		id: `addr-${name}`,
		value: String(form[name] ?? ""),
		onChange: (event) => setForm((prev) => ({
			...prev,
			[name]: event.target.value
		})),
		className: "mt-1.5",
		...props
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl",
				children: "Address book"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				onClick: () => openForm(null),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add address"]
			})]
		}),
		isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mt-6 size-4 animate-spin text-muted-foreground" }) : addresses.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-muted-foreground",
			children: "Save an address once and checkout fills itself in next time."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 grid gap-3 sm:grid-cols-2",
			children: addresses.map((address) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card rounded-lg p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4 text-accent" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium",
								children: address.label
							}),
							address.is_default ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								children: "Default"
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm",
						children: address.full_name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [
							address.address_line,
							", ",
							address.city,
							", ",
							address.state,
							", ",
							address.country
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: address.phone
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-1.5",
						children: [
							onUse ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "clay",
								onClick: () => onUse(address),
								children: "Use this address"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => openForm(address),
								"aria-label": "Edit address",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => remove.mutate(address.id),
								"aria-label": "Delete address",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4 text-destructive" })
							})
						]
					})
				]
			}, address.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-h-[90vh] overflow-y-auto sm:max-w-lg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Edit address" : "New address" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [
							field("label", "Label"),
							field("full_name", "Full name"),
							field("phone", "Phone"),
							field("address_line", "Street address"),
							field("city", "City"),
							field("state", "State"),
							field("country", "Country"),
							field("postal_code", "Postal code"),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-sm sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: form.is_default,
									onChange: (event) => setForm((prev) => ({
										...prev,
										is_default: event.target.checked
									}))
								}), "Use as my default delivery address"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setOpen(false),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => save.mutate(),
						disabled: save.isPending,
						children: [save.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : null, " Save address"]
					})] })
				]
			})
		})
	] });
}
/** Compact saved-address chooser used at checkout to prefill the delivery form. */
function SavedAddressPicker({ userId, onSelect }) {
	const { data: addresses = [] } = useQuery(addressesQuery(userId));
	if (addresses.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-card rounded-lg p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium",
			children: "Use a saved address"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 flex flex-wrap gap-2",
			children: addresses.map((address) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "outline",
				size: "sm",
				onClick: () => onSelect(address),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4 text-accent" }),
					address.label,
					" — ",
					address.city
				]
			}, address.id))
		})]
	});
}
//#endregion
export { SavedAddressPicker as n, AddressBook as t };
