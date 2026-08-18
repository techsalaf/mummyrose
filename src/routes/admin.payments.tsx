import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";

import { AdminHeader } from "@/components/admin/resource-manager";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminPaymentsQuery, useAdminRealtime } from "@/lib/admin-queries";
import { formatDateTime } from "@/lib/format";
import { refundOrder, sweepStaleOrders, verifyPayment } from "@/lib/payments.functions";

export const Route = createFileRoute("/admin/payments")({
  component: AdminPayments,
});

type TxOrder = {
  order_number: string | null;
  customer_name: string | null;
  customer_email: string | null;
  total: number | null;
};
type Tx = {
  id: string;
  order_id: string | null;
  provider: string;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  updated_at: string;
  orders: TxOrder | null;
};

const STATUS_TONE: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  success: "default",
  pending: "outline",
  failed: "destructive",
};

function AdminPayments() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(adminPaymentsQuery);
  useAdminRealtime(["payment_transactions"], [["admin", "payments"]]);
  const rows = (data ?? []) as unknown as Tx[];

  const [term, setTerm] = useState("");
  const [provider, setProvider] = useState("all");
  const [status, setStatus] = useState("all");

  const verify = useServerFn(verifyPayment);
  const doSweep = useServerFn(sweepStaleOrders);
  const doRefund = useServerFn(refundOrder);

  const [pendingRefund, setPendingRefund] = useState<Tx | null>(null);

  const recheck = useMutation({
    mutationFn: async (row: Tx) =>
      verify({ data: { provider: row.provider as "paystack" | "flutterwave", reference: row.reference } }),
    onSuccess: async (result) => {
      if (result.ok) toast.success("Payment verified and order confirmed.");
      else toast.error("Payment not confirmed (it may still be pending or failed).");
      await queryClient.invalidateQueries({ queryKey: adminPaymentsQuery.queryKey });
      await queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const sweep = useMutation({
    mutationFn: () => doSweep({ data: { hours: 24 } }),
    onSuccess: (result) => {
      toast.success(
        result.released.length
          ? `Released stock for ${result.released.length} stale unpaid order(s).`
          : "No stale unpaid orders to release.",
      );
      queryClient.invalidateQueries({ queryKey: adminPaymentsQuery.queryKey });
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const refund = useMutation({
    mutationFn: async (row: Tx) => {
      if (!row.order_id) throw new Error("This transaction has no order.");
      return doRefund({ data: { order_id: row.order_id } });
    },
    onSuccess: async () => {
      toast.success("Refund processed and order marked refunded.");
      setPendingRefund(null);
      await queryClient.invalidateQueries({ queryKey: adminPaymentsQuery.queryKey });
      await queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const filtered = useMemo(() => {
    const needle = term.trim().toLowerCase();
    return rows.filter((row) => {
      const order = row.orders;
      const matchesTerm =
        !needle ||
        [row.reference, order?.order_number ?? "", order?.customer_name ?? "", order?.customer_email ?? ""].some(
          (v) => String(v).toLowerCase().includes(needle),
        );
      return (
        matchesTerm &&
        (provider === "all" || row.provider === provider) &&
        (status === "all" || row.status === status)
      );
    });
  }, [rows, term, provider, status]);

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Payments & reconciliation"
        description="Transaction ledger from Paystack and Flutterwave. Failed or abandoned payments already release reserved stock automatically."
        actions={
          <Button variant="outline" onClick={() => sweep.mutate()} disabled={sweep.isPending}>
            {sweep.isPending ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            Release stale unpaid orders (24h+)
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search reference, order, customer…"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </div>
        <Select value={provider} onValueChange={setProvider}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All providers</SelectItem>
            <SelectItem value="paystack">Paystack</SelectItem>
            <SelectItem value="flutterwave">Flutterwave</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center">
                  <Loader2 className="mx-auto size-4 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                  No transactions match.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <p className="font-mono text-xs">{row.reference}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium">{row.orders?.order_number ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">
                      {row.orders?.customer_name || row.orders?.customer_email || "?"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p>{formatNaira(row.amount)}</p>
                    <p className="text-xs text-muted-foreground">{row.currency}</p>
                  </TableCell>
                  <TableCell className="capitalize">{row.provider}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_TONE[row.status] ?? "outline"}>{row.status}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDateTime(row.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={recheck.isPending}
                        onClick={() => recheck.mutate(row)}
                      >
                        {recheck.isPending ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
                        Re-verify
                      </Button>
                      {row.status === "success" && row.provider === "paystack" ? (
                        <Button size="sm" variant="outline" onClick={() => setPendingRefund(row)}>
                          Refund
                        </Button>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={Boolean(pendingRefund)} onOpenChange={(next) => !next && setPendingRefund(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Refund this Paystack payment?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingRefund
                ? `${formatNaira(pendingRefund.amount)} for order ${pendingRefund.orders?.order_number ?? "—"} will be refunded to the customer and the order marked refunded.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => pendingRefund && refund.mutate(pendingRefund)} disabled={refund.isPending}>
              {refund.isPending ? <Loader2 className="size-4 animate-spin" /> : null} Confirm refund
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function formatNaira(value: number) {
  return `₦${Number(value).toLocaleString("en-NG", { minimumFractionDigits: 0 })}`;
}