import { createFileRoute } from "@tanstack/react-router";

import { ResourceManager } from "@/components/admin/resource-manager";
import { Badge } from "@/components/ui/badge";
import { adminRedirectsQuery } from "@/lib/admin-queries";

export const Route = createFileRoute("/admin/redirects")({
  component: AdminRedirects,
});

function AdminRedirects() {
  return (
    <ResourceManager
      title="URL redirects"
      description="Map old WordPress/WooCommerce URLs to their new home so existing search rankings and shared links keep working. Paths must start with a slash."
      table="redirects"
      singular="Redirect"
      query={adminRedirectsQuery}
      searchKeys={["from_path", "to_path"]}
      defaults={{ is_active: true, status_code: "301" }}
      prepare={(payload) => ({
        ...payload,
        from_path: normalisePath(payload.from_path),
        to_path: normalisePath(payload.to_path),
        status_code: Number(payload.status_code ?? 301),
      })}
      fields={[
        { name: "from_path", label: "Old path", type: "text", placeholder: "/shop/ogbono-powder" },
        { name: "to_path", label: "New path", type: "text", placeholder: "/products/ogbono-powder" },
        {
          name: "status_code",
          label: "Type",
          type: "select",
          options: [
            { value: "301", label: "301 — permanent" },
            { value: "302", label: "302 — temporary" },
          ],
        },
        { name: "is_active", label: "Active", type: "switch" },
      ]}
      columns={[
        { key: "from_path", label: "From", render: (row) => <span className="font-mono text-xs">{String(row.from_path)}</span> },
        { key: "to_path", label: "To", render: (row) => <span className="font-mono text-xs">{String(row.to_path)}</span> },
        { key: "status_code", label: "Type" },
        {
          key: "is_active",
          label: "Status",
          render: (row) => (
            <Badge variant={row.is_active ? "default" : "secondary"}>{row.is_active ? "Active" : "Off"}</Badge>
          ),
        },
      ]}
    />
  );
}

function normalisePath(value: unknown) {
  const path = String(value ?? "").trim();
  if (!path) return path;
  return path.startsWith("/") || path.startsWith("http") ? path : `/${path}`;
}
