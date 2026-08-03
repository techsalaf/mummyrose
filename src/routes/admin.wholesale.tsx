import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

import { AdminHeader } from "@/components/admin/resource-manager";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminWholesaleQuery, useAdminRealtime } from "@/lib/admin-queries";
import { saveRow } from "@/lib/admin-mutations";
import { formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/admin/wholesale")({
  component: AdminWholesale,
});

type Account = {
  id: string;
  company: string;
  contact_name: string;
  email: string;
  phone: string | null;
  country: string | null;
  monthly_volume: string | null;
  tier: string;
  discount_percent: number;
  status: string;
  created_at: string;
};

const TIERS = [
  { value: "bronze", label: "Starter — bronze" },
  { value: "silver", label: "Trade — silver" },
  { value: "gold", label: "Distributor — gold" },
];
const STATUSES = ["pending", "approved", "suspended", "rejected"];

function AdminWholesale() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(adminWholesaleQuery);
  useAdminRealtime(["wholesale_accounts"], [["admin", "wholesale"]]);
  const rows = (data ?? []) as unknown as Account[];
  const [discounts, setDiscounts] = useState<Record<string, string>>({});

  const update = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Record<string, unknown> }) =>
      await saveRow("wholesale_accounts", values, id),
    onSuccess: async () => {
      toast.success("Wholesale account updated");
      await queryClient.invalidateQueries({ queryKey: adminWholesaleQuery.queryKey });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Wholesale accounts"
        description="Approve trade applications, set pricing tiers and control account status. Approved buyers see their discount at checkout instantly."
      />
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business</TableHead>
              <TableHead>Volume</TableHead>
              <TableHead className="w-48">Tier</TableHead>
              <TableHead className="w-32">Discount %</TableHead>
              <TableHead className="w-44">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center">
                  <Loader2 className="mx-auto size-4 animate-spin" />
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                  No wholesale applications yet.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id} className="align-top">
                  <TableCell>
                    <p className="font-medium">{row.company}</p>
                    <p className="text-xs text-muted-foreground">{row.contact_name}</p>
                    <p className="text-xs text-muted-foreground">{row.email}</p>
                    <p className="text-xs text-muted-foreground">{row.phone ?? ""}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(row.created_at)}</p>
                  </TableCell>
                  <TableCell className="text-sm">
                    <p>{row.monthly_volume ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">{row.country ?? ""}</p>
                  </TableCell>
                  <TableCell>
                    <Select value={row.tier} onValueChange={(tier) => update.mutate({ id: row.id, values: { tier } })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIERS.map((tier) => (
                          <SelectItem key={tier.value} value={tier.value}>
                            {tier.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Input
                        type="number"
                        value={discounts[row.id] ?? String(row.discount_percent ?? 0)}
                        onChange={(e) => setDiscounts((prev) => ({ ...prev, [row.id]: e.target.value }))}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          update.mutate({
                            id: row.id,
                            values: {
                              discount_percent: Number(discounts[row.id] ?? row.discount_percent ?? 0),
                            },
                          })
                        }
                      >
                        Set
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={row.status}
                      onValueChange={(status) => update.mutate({ id: row.id, values: { status } })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Badge className="mt-2" variant={row.status === "approved" ? "default" : "secondary"}>
                      {row.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
