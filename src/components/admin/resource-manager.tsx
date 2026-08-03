import { useMemo, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FieldRenderer, serialise, toInput, type FieldDef, type FormValues } from "@/components/admin/fields";
import { useAdminRealtime } from "@/lib/admin-queries";
import { deleteRow, saveRow } from "@/lib/admin-mutations";

export type AdminRow = Record<string, unknown> & { id: string };

export type Column = {
  key: string;
  label: string;
  render?: (row: AdminRow) => ReactNode;
  className?: string;
};

type QueryLike = { queryKey: readonly unknown[]; queryFn?: unknown };

export function AdminHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
        {description ? <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function ResourceManager({
  title,
  description,
  table,
  query,
  fields,
  columns,
  defaults = {},
  searchKeys = ["name"],
  realtimeTables,
  singular,
  actions,
  prepare,
}: {
  title: string;
  description?: string;
  table: string;
  query: QueryLike;
  fields: FieldDef[];
  columns: Column[];
  defaults?: FormValues;
  searchKeys?: string[];
  realtimeTables?: string[];
  singular: string;
  actions?: ReactNode;
  prepare?: (payload: Record<string, unknown>, values: FormValues) => Record<string, unknown>;
}) {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery(query as Parameters<typeof useQuery>[0]);
  const rows = (data ?? []) as AdminRow[];
  useAdminRealtime(realtimeTables ?? [table], [query.queryKey as string[]]);

  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminRow | null>(null);
  const [values, setValues] = useState<FormValues>({});
  const [pendingDelete, setPendingDelete] = useState<AdminRow | null>(null);

  const filtered = useMemo(() => {
    const needle = term.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((row) =>
      searchKeys.some((key) => String(row[key] ?? "").toLowerCase().includes(needle)),
    );
  }, [rows, term, searchKeys]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: query.queryKey });

  const save = useMutation({
    mutationFn: async () => {
      let payload = serialise(fields, values);
      if (prepare) payload = prepare(payload, values);
      await saveRow(table, payload, editing?.id ?? null);
    },
    onSuccess: async () => {
      toast.success(editing ? `${singular} updated` : `${singular} created`);
      setOpen(false);
      await invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const remove = useMutation({
    mutationFn: async (row: AdminRow) => await deleteRow(table, row.id),
    onSuccess: async () => {
      toast.success(`${singular} deleted`);
      setPendingDelete(null);
      await invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function openForm(row: AdminRow | null) {
    setEditing(row);
    const next: FormValues = {};
    for (const field of fields) {
      next[field.name] = row
        ? field.type === "switch"
          ? Boolean(row[field.name])
          : toInput(row[field.name], field.type)
        : (defaults[field.name] ?? (field.type === "switch" ? false : ""));
    }
    setValues(next);
    setOpen(true);
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title={title}
        description={description}
        actions={
          <>
            {actions}
            <Button onClick={() => openForm(null)}>
              <Plus className="size-4" /> New {singular.toLowerCase()}
            </Button>
          </>
        }
      />

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search…" className="pl-9" />
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="py-10 text-center text-sm text-muted-foreground">
                  <Loader2 className="mx-auto size-4 animate-spin" />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="py-10 text-center text-sm text-destructive">
                  {(error as Error).message}
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="py-10 text-center text-sm text-muted-foreground">
                  Nothing here yet.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      {column.render ? column.render(row) : String(row[column.key] ?? "—")}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openForm(row)} aria-label="Edit">
                        <Pencil className="size-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => setPendingDelete(row)} aria-label="Delete">
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Edit ${singular.toLowerCase()}` : `New ${singular.toLowerCase()}`}
            </DialogTitle>
            <DialogDescription>Changes are saved straight to the live store.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <FieldRenderer
                key={field.name}
                field={field}
                value={values[field.name]}
                onChange={(next) => setValues((prev) => ({ ...prev, [field.name]: next }))}
              />
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => save.mutate()} disabled={save.isPending}>
              {save.isPending ? <Loader2 className="size-4 animate-spin" /> : null} Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(next) => !next && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {singular.toLowerCase()}?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => pendingDelete && remove.mutate(pendingDelete)}
              disabled={remove.isPending}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
