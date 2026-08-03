import { createFileRoute } from "@tanstack/react-router";

import { ResourceManager } from "@/components/admin/resource-manager";
import { Badge } from "@/components/ui/badge";
import { adminRedirectsQuery } from "@/lib/admin-queries";

export const Route = createFileRoute("/admin/redirects")({
  component: AdminRedirects;
});

function AdminRedirects() {
  return <div />;
}
