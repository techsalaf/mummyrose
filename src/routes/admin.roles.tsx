import { createFileRoute } from "@tanstack/react-router";

import { ResourceManager } from "@/components/admin/resource-manager";
import { Badge } from "@/components/ui/badge";
import { adminRolesQuery } from "@/lib/admin-queries";

export const Route = createFileRoute("/admin/roles")({
  component: AdminRoles,
});

const ROLE_TONE: Record<string, "default" | "secondary" | "outline"> = {
  admin: "default",
  manager: "outline",
  staff: "outline",
  customer: "secondary",
};

function AdminRoles() {
  return (
    <ResourceManager
      title="Team & roles"
      description="Grant admin, manager or staff access. Copy a user ID from Customers, paste it here and pick a role — access applies on their next page load."
      table="user_roles"
      singular="Role"
      query={adminRolesQuery}
      searchKeys={["user_id", "role"]}
      defaults={{ role: "staff" }}
      fields={[
        { name: "user_id", label: "User ID", type: "text", full: true, help: "The customer's account ID." },
        {
          name: "role",
          label: "Role",
          type: "select",
          options: [
            { value: "admin", label: "Admin — full access" },
            { value: "manager", label: "Manager — commerce & content" },
            { value: "staff", label: "Staff — day-to-day operations" },
            { value: "customer", label: "Customer — storefront only" },
          ],
        },
      ]}
      columns={[
        { key: "user_id", label: "User ID" },
        {
          key: "role",
          label: "Role",
          render: (row) => (
            <Badge variant={ROLE_TONE[String(row.role)] ?? "secondary"}>{String(row.role)}</Badge>
          ),
        },
        {
          key: "created_at",
          label: "Granted",
          render: (row) => new Date(String(row.created_at)).toLocaleDateString(),
        },
      ]}
    />
  );
}
