import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { AdminHeader } from "@/components/admin/resource-manager";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminInquiriesQuery, useAdminRealtime } from "@/lib/admin-queries";
import { saveRow } from "@/lib/admin-mutations";
import { formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/admin/inquiries")({
  component: AdminInquiries,
});

type Inquiry = {
  id: string;
  type: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  country: string | null;
  requirements: string | null;
  message: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
};

const STATUSES = ["new", "in_review", "responded", "closed"];

function AdminInquiries() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(adminInquiriesQuery);
  useAdminRealtime(["inquiries"], [["admin", "inquiries"]]);
  const rows = (data ?? []) as unknown as Inquiry[];
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const update = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Record<string, unknown> }) =>
      await saveRow("inquiries", values, id),
    onSuccess: async () => {
      toast.success("Inquiry updated");
      await queryClient.invalidateQueries({ queryKey: adminInquiriesQuery.queryKey });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Inquiries"
        description="Wholesale, export, white-label, corporate and contact-form leads with a workflow status."
      />
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lead</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Requirements</TableHead>
              <TableHead className="w-44">Status</TableHead>
              <TableHead className="w-72">Notes</TableHead>
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
                  No inquiries yet.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id} className="align-top">
                  <TableCell>
                    <p className="font-medium">{row.name}</p>
                    <p className="text-xs text-muted-foreground">{row.company ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">{row.email}</p>
                    <p className="text-xs text-muted-foreground">{row.phone ?? ""}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(row.created_at)}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{row.type.replace(/_/g, " ")}</Badge>
                  </TableCell>
                  <TableCell className="max-w-sm text-sm">
                    <p className="whitespace-pre-wrap">{row.requirements ?? row.message ?? "—"}</p>
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
                            {status.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Textarea
                      rows={3}
                      value={drafts[row.id] ?? row.admin_notes ?? ""}
                      onChange={(e) => setDrafts((prev) => ({ ...prev, [row.id]: e.target.value }))}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() =>
                        update.mutate({
                          id: row.id,
                          values: { admin_notes: drafts[row.id] ?? row.admin_notes ?? "" },
                        })
                      }
                    >
                      Save note
                    </Button>
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
