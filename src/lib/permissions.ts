/**
 * Human-readable permission catalog used by the Role Builder UI and the
 * server-side `requirePermission` gate. Group ids are stable; labels are what
 * staff see in the admin — raw permission ids are never shown.
 */

export type PermissionDef = { id: string; label: string; description: string };
export type PermissionGroup = { group: string; permissions: PermissionDef[] };

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    group: "Orders",
    permissions: [
      { id: "orders.view", label: "View orders", description: "See orders, payments and customer details" },
      { id: "orders.update", label: "Update orders", description: "Change fulfilment status and internal notes" },
      { id: "orders.cancel", label: "Cancel orders", description: "Cancel unpaid orders and release stock" },
      { id: "orders.refund", label: "Refund orders", description: "Refund paid Paystack orders" },
    ],
  },
  {
    group: "Inventory",
    permissions: [
      { id: "inventory.view", label: "View inventory", description: "See stock levels and movement" },
      { id: "inventory.adjust", label: "Adjust inventory", description: "Manually change stock and log adjustments" },
    ],
  },
  {
    group: "Products",
    permissions: [
      { id: "products.view", label: "View products", description: "Browse the product catalogue" },
      { id: "products.manage", label: "Manage products", description: "Create, edit, price and publish products" },
    ],
  },
  {
    group: "Customers",
    permissions: [
      { id: "customers.view", label: "View customers", description: "See customer accounts and orders" },
      { id: "customers.manage", label: "Manage customers", description: "Edit customer details and disable accounts" },
    ],
  },
  {
    group: "Payments",
    permissions: [
      { id: "payments.view", label: "View payments", description: "See the payment ledger and reconcile" },
      { id: "payments.refund", label: "Refund payments", description: "Process refunds for paid transactions" },
      { id: "payments.configure", label: "Configure gateways", description: "Change Paystack/Flutterwave credentials" },
    ],
  },
  {
    group: "Settings",
    permissions: [
      { id: "settings.view", label: "View settings", description: "Read store, delivery and SEO settings" },
      { id: "settings.edit", label: "Edit settings", description: "Change store, delivery and SEO settings" },
    ],
  },
  {
    group: "Staff",
    permissions: [
      { id: "staff.view", label: "View staff", description: "See team members and their roles" },
      { id: "staff.manage", label: "Manage staff", description: "Grant roles and edit role permissions" },
    ],
  },
];

export const ALL_PERMISSIONS: PermissionDef[] = PERMISSION_GROUPS.flatMap((g) => g.permissions);

export function permissionLabel(id: string): string {
  return ALL_PERMISSIONS.find((p) => p.id === id)?.label ?? id;
}

export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: ALL_PERMISSIONS.map((p) => p.id),
  manager: [
    "orders.view",
    "orders.update",
    "orders.cancel",
    "inventory.view",
    "inventory.adjust",
    "products.view",
    "products.manage",
    "customers.view",
    "payments.view",
    "settings.view",
    "settings.edit",
    "staff.view",
  ],
  staff: [
    "orders.view",
    "orders.update",
    "inventory.view",
    "products.view",
    "customers.view",
    "payments.view",
    "settings.view",
    "staff.view",
  ],
  customer: [],
};