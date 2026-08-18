import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Pencil, Plus, Search, ShieldCheck, Trash2, UserCheck } from "lucide-react";
import { toast } from "sonner";

import { AdminHeader } from "@/components/admin/resource-manager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { adminCustomersQuery, adminRolesQuery } from "@/lib/admin-queries";
import { deleteRow, saveRow, upsertRow } from "@/lib/admin-mutations";
import { PERMISSION_GROUPS } from "@/lib/permissions";
import { getRolePermissions, updateRolePermissions } from "@/lib/permissions.functions";

export const Route = createFileRoute("/admin/roles")({
  component: AdminRoles,
});

type RoleMeta = { label: string; desc: string; tone: "default" | "secondary" | "outline" };
const ROLE_INFO: Record<string, RoleMeta> = {
  admin: { label: "Admin", desc: "Full access, including team and payments", tone: "default" },
  manager: { label: "Manager", desc: "Products, orders, content and settings", tone: "outline" },
  staff: { label: "Staff", desc: "Day-to-day orders and operations", tone: "outline" },
  customer: { label: "Customer", desc: "Storefront only", tone: "secondary" },
};
const ROLE_KEYS = ["admin", "manager", "staff", "customer"];

type Person = { id: string; email: string | null; full_name: string | null };
type RoleRow = { id: string; user_id: string; role: string; created_at: string };

function personOf(row: RoleRow, people: Person[]): Person | null {
  return people.find((p) => p.id === row.user_id) ?? null;
}

function RoleBadge({ role }: { role: string }) {
  const meta = ROLE_INFO[role] ?? ROLE_INFO.staff;
  return <Badge variant={meta.tone}>{meta.label}</Badge>;
}

function AdminRoles() {
  const queryClient = useQueryClient();
  const { data: roles, isLoading } = useQuery(adminRolesQuery);
  const { data: people } = useQuery(adminCustomersQuery);

  const roleRows = (roles ?? []) as RoleRow[];
  const peopleList = (people ?? []) as Person[];
  const adminCount = roleRows.filter((r) => r.role === "admin").length;

  const [term, setTerm] = useState("");
  const [grantOpen, setGrantOpen] = useState(false);
  const [pickTerm, setPickTerm] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [grantRole, setGrantRole] = useState("staff");
  const [editing, setEditing] = useState<RoleRow | null>(null);
  const [editRole, setEditRole] = useState("staff");
  const [pendingRevoke, setPendingRevoke] = useState<RoleRow | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: adminRolesQuery.queryKey });

  const filtered = useMemo(() => {
    const needle = term.trim().toLowerCase();
    if (!needle) return roleRows;
    return roleRows.filter((row) => {
      const person = personOf(row, peopleList);
      const hay = `${person?.full_name ?? ""} ${person?.email ?? ""} ${row.role} ${
        ROLE_INFO[row.role]?.label ?? row.role
      }`.toLowerCase();
      return hay.includes(needle);
    });
  }, [roleRows, peopleList, term]);

  const candidatePeople = useMemo(() => {
    const needle = pickTerm.trim().toLowerCase();
    if (!needle) return peopleList;
    return peopleList.filter((p) => `${p.full_name ?? ""} ${p.email ?? ""}`.toLowerCase().includes(needle));
  }, [peopleList, pickTerm]);

  const grant = useMutation({
    mutationFn: async () => {
      if (!selectedPerson) throw new Error("Choose a person first.");
      await upsertRow("user_roles", { user_id: selectedPerson.id, role: grantRole }, "user_id,role");
    },
    onSuccess: () => {
      toast.success("Access granted");
      setGrantOpen(false);
      setSelectedPerson(null);
      setPickTerm("");
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const saveRole = useMutation({
    mutationFn: async ({ row, role }: { row: RoleRow; role: string }) => {
      const demotingLastAdmin = row.role === "admin" && role !== "admin" && adminCount <= 1;
      if (demotingLastAdmin) throw new Error("At least one Admin must remain on the store.");
      await saveRow("user_roles", { role }, row.id);
    },
    onSuccess: () => {
      toast.success("Role updated");
      setEditing(null);
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const revoke = useMutation({
    mutationFn: async (row: RoleRow) => {
      if (row.role === "admin" && adminCount <= 1) {
        throw new Error("At least one Admin must remain on the store.");
      }
      await deleteRow("user_roles", row.id);
    },
    onSuccess: () => {
      toast.success("Access revoked");
      setPendingRevoke(null);
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const fetchRolePerms = useServerFn(getRolePermissions);
  const saveRolePerms = useServerFn(updateRolePermissions);

  const rolePerms = useQuery({
    queryKey: ["role-permissions"],
    queryFn: async () => {
      const out: Record<string, string[]> = {};
      for (const key of ROLE_KEYS) {
        out[key] = await fetchRolePerms({ data: { role: key as "admin" | "manager" | "staff" | "customer" } });
      }
      return out;
    },
  });

  const [permRole, setPermRole] = useState<string | null>(null);
  const [permSet, setPermSet] = useState<string[]>([]);

  const openPermissions = (role: string) => {
    setPermRole(role);
    setPermSet(rolePerms.data?.[role] ?? []);
  };

  const savePerms = useMutation({
    mutationFn: async () => {
      if (!permRole) throw new Error("Choose a role first.");
      return saveRolePerms({
        data: { role: permRole as "admin" | "manager" | "staff" | "customer", permission_ids: permSet },
      });
    },
    onSuccess: async () => {
      toast.success("Role permissions saved");
      setPermRole(null);
      await queryClient.invalidateQueries({ queryKey: ["role-permissions"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const togglePerm = (id: string) =>
    setPermSet((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
if (isLoading) return <Loader2 className="size-4 animate-spin text-muted-foreground" />;

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Team & roles"
        description="Manage who can access the store and what they can do. Search people by name or email — no need to remember IDs."
        actions={
          <Button onClick={() => setGrantOpen(true)}>
            <Plus className="size-4" /> Grant access
          </Button>
        }
      />

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search by name, email or role…"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Granted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                  No team members match.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row) => {
                const person = personOf(row, peopleList);
                return (
                  <TableRow key={row.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserCheck className="size-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{person?.full_name || "Unknown member"}</p>
                          <p className="text-xs text-muted-foreground">{person?.email || row.user_id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <RoleBadge role={row.role} />
                      <p className="mt-1 text-xs text-muted-foreground">{ROLE_INFO[row.role]?.desc ?? ""}</p>
                    </TableCell>
                    <TableCell>{new Date(row.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Change role"
                          onClick={() => {
                            setEditing(row);
                            setEditRole(row.role);
                          }}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Revoke access"
                          disabled={row.role === "admin" && adminCount <= 1}
                          onClick={() => setPendingRevoke(row)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="rounded-md border bg-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">Roles & permissions</h2>
            <p className="text-sm text-muted-foreground">Tune exactly what each role can do in the console.</p>
          </div>
          <ShieldCheck className="size-5 text-muted-foreground" />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {ROLE_KEYS.map((key) => {
            const meta = ROLE_INFO[key];
            const count = rolePerms.data?.[key]?.length;
            return (
              <div key={key} className="flex items-center justify-between rounded-md border px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium">{meta.label}</p>
                  <p className="text-xs text-muted-foreground">{meta.desc}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {key === "admin" ? "All permissions" : count == null ? "Loading…" : `${count} permissions`}
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => openPermissions(key)} disabled={key === "admin"}>
                  Edit
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={grantOpen} onOpenChange={setGrantOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Grant store access</DialogTitle>
            <DialogDescription>
              Find the person by name or email and choose the role to give them.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">Person</Label>
              <Input
                className="mt-1.5"
                placeholder="Search by name or email…"
                value={pickTerm}
                onChange={(e) => {
                  setPickTerm(e.target.value);
                  setSelectedPerson(null);
                }}
              />
              {!selectedPerson ? (
                <div className="mt-2 max-h-44 space-y-1 overflow-y-auto">
                  {candidatePeople.slice(0, 50).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPerson(p)}
                      className="flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm hover:bg-muted"
                    >
                      <span>{p.full_name || "No name"}</span>
                      <span className="text-xs text-muted-foreground">{p.email}</span>
                    </button>
                  ))}
                  {candidatePeople.length === 0 ? (
                    <p className="px-1 py-2 text-xs text-muted-foreground">
                      No matching account found. The person needs a customer account first.
                    </p>
                  ) : null}
                </div>
              ) : (
                <div className="mt-2 flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">{selectedPerson.full_name || "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">{selectedPerson.email}</p>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedPerson(null)}>
                    Change
                  </Button>
                </div>
              )}
            </div>

            <div>
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">Role</Label>
              <div className="mt-1.5 space-y-2">
                {ROLE_KEYS.map((key) => {
                  const meta = ROLE_INFO[key];
                  return (
                    <label
                      key={key}
                      onClick={() => setGrantRole(key)}
                      className={`flex cursor-pointer items-start gap-2 rounded-md border px-3 py-2 ${
                        grantRole === key ? "border-primary bg-muted/40" : ""
                      }`}
                    >
                      <input type="radio" name="grant-role" value={key} checked={grantRole === key} readOnly className="mt-0.5" />
                      <span>
                        <span className="block text-sm font-medium">{meta.label}</span>
                        <span className="block text-xs text-muted-foreground">{meta.desc}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setGrantOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => grant.mutate()} disabled={!selectedPerson || grant.isPending}>
              {grant.isPending ? <Loader2 className="size-4 animate-spin" /> : <UserCheck className="size-4" />} Grant access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editing)} onOpenChange={(next) => !next && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change role</DialogTitle>
            <DialogDescription>Update the access level for this team member.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {ROLE_KEYS.map((key) => {
              const meta = ROLE_INFO[key];
              return (
                <label
                  key={key}
                  onClick={() => setEditRole(key)}
                  className={`flex cursor-pointer items-start gap-2 rounded-md border px-3 py-2 ${
                    editRole === key ? "border-primary bg-muted/40" : ""
                  }`}
                >
                  <input type="radio" name="edit-role" value={key} checked={editRole === key} readOnly className="mt-0.5" />
                  <span>
                    <span className="block text-sm font-medium">{meta.label}</span>
                    <span className="block text-xs text-muted-foreground">{meta.desc}</span>
                  </span>
                </label>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => editing && saveRole.mutate({ row: editing, role: editRole })}
              disabled={!editing || saveRole.isPending}
            >
              {saveRole.isPending ? <Loader2 className="size-4 animate-spin" /> : null} Save role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(permRole)} onOpenChange={(next) => !next && setPermRole(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Permissions — {permRole ? ROLE_INFO[permRole]?.label ?? permRole : ""}</DialogTitle>
            <DialogDescription>Tick the permissions this role can use in the console.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {PERMISSION_GROUPS.map((group) => (
              <div key={group.group}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group.group}</p>
                <div className="space-y-2">
                  {group.permissions.map((perm) => (
                    <label key={perm.id} className="flex items-start gap-2 rounded-md border px-3 py-2">
                      <input
                        type="checkbox"
                        checked={permSet.includes(perm.id)}
                        onChange={() => togglePerm(perm.id)}
                        className="mt-0.5"
                      />
                      <span>
                        <span className="block text-sm font-medium">{perm.label}</span>
                        <span className="block text-xs text-muted-foreground">{perm.description}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPermRole(null)}>
              Cancel
            </Button>
            <Button onClick={() => savePerms.mutate()} disabled={savePerms.isPending}>
              {savePerms.isPending ? <Loader2 className="size-4 animate-spin" /> : null} Save permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(pendingRevoke)} onOpenChange={(next) => !next && setPendingRevoke(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke access?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingRevoke
                ? `${personOf(pendingRevoke, peopleList)?.email ?? pendingRevoke.user_id} will lose ${
                    ROLE_INFO[pendingRevoke.role]?.label ?? pendingRevoke.role
                  } access immediately.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => pendingRevoke && revoke.mutate(pendingRevoke)} disabled={revoke.isPending}>
              Revoke
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
