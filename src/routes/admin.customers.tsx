import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";

import { AdminHeader } from "@/components/admin/resource-manager";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import {
  adminCustomersQuery,
  adminOrdersQuery,
  adminRolesQuery,
  adminSubscribersQuery,
  useAdminRealtime,
} from "@/lib/admin-queries";
import { formatDate, formatNaira } from "@/lib/format";

export const Route = createFileRoute("/admin/customers")({
  component: AdminCustomers,
});

type Profile = { id: string; full_name: string | null; email: string | null; phone: string | null; created_at: string };
type RoleRow = { id: string; user_id: string; role: string };
type OrderRow = { user_id: string | null; customer_email: string; total: number; payment_status: string };

function AdminCustomers() {
  const queryClient = useQueryClient();
  const customers = useQuery(adminCustomersQuery);
  const roles = useQuery(adminRolesQuery);
  const orders = useQuery(adminOrdersQuery);
  const subscribers = useQuery(adminSubscribersQuery);
  useAdminRealtime(["profiles", "user_roles"], [["admin", "customers"], ["admin", "user_roles"]]);

  const profiles = (customers.data ?? []) as unknown as Profile[];
  const roleRows = (roles.data ?? []) as unknown as RoleRow[];
  const orderRows = (orders.data ?? []) as unknown as OrderRow[];
  const subs = (subscribers.data ?? []) as unknown as { id: string; email: string; created_at: string }[];
  const [term, setTerm] = useState("");

  const spendByEmail = useMemo(() => {
    const map = new Map<string, { count: number; total: number }>();
    for (const order of orderRows) {
      const key = (order.customer_email ?? "").toLowerCase();
      const entry = map.get(key) ?? { count: 0, total: 0 };
      entry.count += 1;
      if (order.payment_status === "paid") entry.total += Number(order.total ?? 0);
      map.set(key, entry);
    }
    return map;
  }, [orderRows]);

  const filtered = profiles.filter((profile) => {
    const needle = term.trim().toLowerCase();
    if (!needle) return true;
    return [profile.full_name ?? "", profile.email ?? "", profile.phone ?? ""].some((v) =>
      v.toLowerCase().includes(needle),
    );
  });

  const setRole = useMutation({
    mutationFn: async ({ userId, role, existing }: { userId: string; role: string; existing?: RoleRow }) => {
      if (existing) {
        const { error } = await supabase.from("user_roles").delete().eq("id", existing.id);
        if (error) throw new Error(error.message);
        return;
      }
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: role as "admin" | "staff" | "customer" });
      if (error) throw new Error(error.message);
    },
    onSuccess: async () => {
      toast.success("Roles updated");
      await queryClient.invalidateQueries({ queryKey: adminRolesQuery.queryKey });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Customers"
        description="Registered accounts, lifetime spend, staff roles and newsletter subscribers."
      />

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search customers…" className="pl-9" />
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Lifetime spend</TableHead>
              <TableHead>Roles</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center">
                  <Loader2 className="mx-auto size-4 animate-spin" />
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                  No customer accounts yet — guest orders appear under Orders.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((profile) => {
                const spend = spendByEmail.get((profile.email ?? "").toLowerCase());
                const mine = roleRows.filter((r) => r.user_id === profile.id);
                return (
                  <TableRow key={profile.id}>
                    <TableCell>
                      <p className="font-medium">{profile.full_name ?? "—"}</p>
                      <p className="text-xs text-muted-foreground">{profile.email ?? "—"}</p>
                      <p className="text-xs text-muted-foreground">{profile.phone ?? ""}</p>
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(profile.created_at)}</TableCell>
                    <TableCell className="text-sm">{spend?.count ?? 0}</TableCell>
                    <TableCell className="text-sm">{formatNaira(spend?.total ?? 0)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {["admin", "staff"].map((role) => {
                          const existing = mine.find((r) => r.role === role);
                          return (
                            <Button
                              key={role}
                              size="sm"
                              variant={existing ? "default" : "outline"}
                              disabled={setRole.isPending}
                              onClick={() => setRole.mutate({ userId: profile.id, role, existing })}
                            >
                              {role}
                            </Button>
                          );
                        })}
                        {mine.some((r) => r.role === "customer") ? <Badge variant="secondary">customer</Badge> : null}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Newsletter subscribers ({subs.length})</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-1.5 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {subs.length === 0 ? (
            <p className="text-muted-foreground">No subscribers yet.</p>
          ) : (
            subs.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between gap-2 border-b pb-1">
                <span className="truncate">{sub.email}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{formatDate(sub.created_at)}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
