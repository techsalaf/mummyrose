import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Search, Printer } from "lucide-react";
import { toast } from "sonner";

import { AdminHeader } from "@/components/admin/resource-manager";
import { adminUpdateOrder } from "@/lib/orders.functions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminOrdersQuery, useAdminRealtime } from "@/lib/admin-queries";
import { saveRow } from "@/lib/admin-mutations";
import { formatDateTime, formatNaira } from "@/lib/format";
import { buildWhatsAppMessage, whatsAppLink } from "@/lib/whatsapp";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

type Item = {
  id: string;
  product_name: string;
  variant: string | null;
  quantity: number;
  unit_price: number;
  line_total: number;
};

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  address_line: string | null;
  city: string | null;
  state: string | null;
  country: string;
  notes: string | null;
  subtotal: number;
  shipping_fee: number;
  total: number;
  status: string;
  payment_status: string;
  payment_provider: string | null;
  payment_reference: string | null;
  order_type?: string | null;
  discount_percent?: number | null;
  created_at: string;
  courier_name?: string | null;
  tracking_number?: string | null;
  dispatched_at?: string | null;
  order_items: Item[];
};

const STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUSES = ["unpaid", "paid", "refunded", "failed"];

function auditActionLabel(action: string): string {
  const labels: Record<string, string> = {
    order_status_change: "Status changed",
    order_cancelled_restock: "Cancelled — stock released",
    order_refunded: "Refunded",
    stale_orders_sweep: "Released by stale-order sweep",
    payment_config_update: "Payment settings updated",
    smtp_config_update: "Email settings updated",
    role_permissions_update: "Role permissions updated",
  };
  return labels[action] ?? action.replace(/_/g, " ");
}

function AdminOrders() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(adminOrdersQuery);
  useAdminRealtime(["orders", "order_items"], [["admin", "orders"]]);
  const orders = (data ?? []) as unknown as Order[];

  const [term, setTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [active, setActive] = useState<Order | null>(null);
  const [notes, setNotes] = useState("");
  const [courierName, setCourierName] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [packingSlipOpen, setPackingSlipOpen] = useState(false);

  const filtered = useMemo(() => {
    const needle = term.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesTerm =
        !needle ||
        [order.order_number, order.customer_name, order.customer_email, order.customer_phone ?? ""].some((v) =>
          String(v).toLowerCase().includes(needle),
        );
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      return matchesTerm && matchesStatus;
    });
  }, [orders, term, statusFilter]);

  const update = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Record<string, unknown> }) =>
      await saveRow("orders", values, id),
    onSuccess: async () => {
      toast.success("Order updated");
      await queryClient.invalidateQueries({ queryKey: adminOrdersQuery.queryKey });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const changeOrderRaw = useServerFn(adminUpdateOrder);
  // Status/payment changes go through the server so integrity rules are enforced
  // (stock restored on cancel/fail, admin + audit required to mark paid/refunded).
  const changeOrder = useMutation({
    mutationFn: (vars: { id: string; status?: string; payment_status?: string }) =>
      changeOrderRaw({ data: vars }),
    onSuccess: async () => {
      toast.success("Order updated");
      await queryClient.invalidateQueries({ queryKey: adminOrdersQuery.queryKey });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const current = active ? (orders.find((o) => o.id === active.id) ?? active) : null;

  const audit = useQuery({
    queryKey: ["admin", "audit", current?.id],
    queryFn: async () => {
      const { data: auditData, error } = await (supabase.from as unknown as (t: string) => {
        select: (cols: string) => {
          eq: (c: string, v: unknown) => {
            eq: (c2: string, v2: unknown) => {
              order: (col: string, opts?: { ascending?: boolean }) => {
                limit: (n: number) => PromiseLike<{
                  data: { action: string; actor_email: string | null; created_at: string }[] | null;
                  error: { message: string } | null;
                }>;
              };
            };
          };
        };
      })("admin_audit_logs")
        .select("action,actor_email,created_at")
        .eq("entity_type", "orders")
        .eq("entity_id", current?.id ?? "")
        .order("created_at", { ascending: false })
        .limit(30);
      if (error) throw new Error(error.message);
      return auditData ?? [];
    },
    enabled: Boolean(current),
  });

  const orderPayments = useQuery({
    queryKey: ["admin", "order-payments", current?.id],
    queryFn: async () => {
      const { data: txData, error } = await supabase
        .from("payment_transactions")
        .select("provider,status,reference,amount,created_at")
        .eq("order_id", current?.id ?? "")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return txData ?? [];
    },
    enabled: Boolean(current),
  });

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Orders"
        description="Every storefront, WhatsApp and wholesale order with live payment and fulfilment status."
      />

      <div className="flex flex-wrap gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Order number, name, email or phone"
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Fulfilment</TableHead>
              <TableHead className="text-right">Placed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center">
                  <Loader2 className="mx-auto size-4 animate-spin" />
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  No orders match this view.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((order) => (
                <TableRow
                  key={order.id}
                  className="cursor-pointer"
                  onClick={() => {
                    setActive(order);
                    setNotes(order.notes ?? "");
                    setCourierName(order.courier_name ?? "");
                    setTrackingNumber(order.tracking_number ?? "");
                  }}
                >
                  <TableCell>
                    <p className="font-medium">{order.order_number}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.order_items?.length ?? 0} items
                      {order.order_type && order.order_type !== "retail" ? ` · ${order.order_type}` : ""}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p>{order.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                  </TableCell>
                  <TableCell>{formatNaira(order.total)}</TableCell>
                  <TableCell>
                    <Badge variant={order.payment_status === "paid" ? "default" : "secondary"}>
                      {order.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{order.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {formatDateTime(order.created_at)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={Boolean(current)} onOpenChange={(next) => !next && setActive(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          {current ? (
            <>
              <DialogHeader className="flex flex-row items-center justify-between gap-3 space-y-0 pb-2 border-b">
                <DialogTitle className="text-xl font-display">{current.order_number}</DialogTitle>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 shrink-0"
                  onClick={() => setPackingSlipOpen(true)}
                >
                  <Printer className="size-4" /> Print Packing Slip
                </Button>
              </DialogHeader>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1 text-sm">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Customer</p>
                  <p>{current.customer_name}</p>
                  <p>{current.customer_email}</p>
                  <p>{current.customer_phone ?? "—"}</p>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Delivery</p>
                  <p>{current.address_line ?? "—"}</p>
                  <p>
                    {current.city ?? "—"}, {current.state ?? "—"}, {current.country}
                  </p>
                </div>
              </div>

              <div className="rounded-md border">
                {current.order_items?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 border-b p-3 text-sm last:border-0">
                    <span>
                      {item.product_name}
                      {item.variant ? ` (${item.variant})` : ""} × {item.quantity}
                    </span>
                    <span>{formatNaira(item.line_total)}</span>
                  </div>
                ))}
                <div className="space-y-1 p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatNaira(current.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span>{current.shipping_fee === 0 ? "Free" : formatNaira(current.shipping_fee)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{formatNaira(current.total)}</span>
                  </div>
                  <p className="pt-1 text-xs text-muted-foreground">
                    {current.payment_provider ?? "—"}
                    {current.payment_reference ? ` · ${current.payment_reference}` : ""}
                  </p>
                </div>
              </div>

              <div className="rounded-md border p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Timeline</p>
                <ol className="mt-3 space-y-3 text-sm">
                  <li className="flex items-start justify-between gap-3">
                    <span>Order placed</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{formatDateTime(current.created_at)}</span>
                  </li>
                  {(orderPayments.data ?? []).map((tx, i) => (
                    <li key={i} className="flex items-start justify-between gap-3">
                      <span>
                        Payment via {tx.provider}{" "}
                        <Badge variant={tx.status === "success" ? "default" : tx.status === "failed" ? "destructive" : "secondary"}>
                          {tx.status}
                        </Badge>
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">{formatDateTime(tx.created_at)}</span>
                    </li>
                  ))}
                  {(audit.data ?? []).map((event, i) => (
                    <li key={i} className="flex items-start justify-between gap-3">
                      <span>
                        {auditActionLabel(event.action)}
                        {event.actor_email ? (
                          <span className="block text-xs text-muted-foreground">{event.actor_email}</span>
                        ) : null}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">{formatDateTime(event.created_at)}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-1.5 text-xs uppercase tracking-wide text-muted-foreground">Fulfilment status</p>
                  <Select
                    value={current.status}
                    onValueChange={(status) => changeOrder.mutate({ id: current.id, status })}
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
                </div>
                <div>
                  <p className="mb-1.5 text-xs uppercase tracking-wide text-muted-foreground">Payment status</p>
                  <Select
                    value={current.payment_status}
                    onValueChange={(payment_status) => changeOrder.mutate({ id: current.id, payment_status })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Bank Transfer Verification Banner */}
              {current.payment_status === "unpaid" && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
                  <div>
                    <p className="font-semibold text-amber-950 dark:text-amber-200">
                      Payment Pending ({current.payment_provider || "manual"})
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Confirm received funds into your bank account before dispatching spices.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                    disabled={changeOrder.isPending}
                    onClick={() => changeOrder.mutate({ id: current.id, payment_status: "paid" })}
                  >
                    Confirm &amp; Mark Paid
                  </Button>
                </div>
              )}

              {/* Fulfilment & Courier Logistics */}
              <div className="rounded-md border p-3.5 space-y-3 bg-muted/20">
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                  Fulfilment &amp; Courier Logistics
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Courier Service</label>
                    <Input
                      placeholder="e.g. GIG Logistics, DHL, Kwik, Rider"
                      value={courierName}
                      onChange={(e) => setCourierName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Waybill / Tracking Number</label>
                    <Input
                      placeholder="e.g. GIG-12345678"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={update.isPending}
                    onClick={() =>
                      update.mutate({
                        id: current.id,
                        values: {
                          courier_name: courierName || null,
                          tracking_number: trackingNumber || null,
                          status:
                            current.status === "pending" || current.status === "processing"
                              ? "shipped"
                              : current.status,
                          dispatched_at: current.dispatched_at || new Date().toISOString(),
                        },
                      })
                    }
                  >
                    Save Dispatch Info
                  </Button>
                  {current.customer_phone && trackingNumber ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const msg = `Hello ${current.customer_name}, your Mummy Rose spice order #${current.order_number} has been dispatched!\n\nCourier: ${courierName || "Designated Courier"}\nWaybill / Tracking: ${trackingNumber}\nDelivery Address: ${current.address_line ?? ""}, ${current.city ?? ""}\n\nTrack online at: https://mummyrose.com/track-order\n\nThank you for choosing Mummy Rose!`;
                        const link = whatsAppLink(current.customer_phone ?? "", msg);
                        if (link) window.open(link, "_blank", "noopener,noreferrer");
                      }}
                    >
                      Send Dispatch WhatsApp
                    </Button>
                  ) : null}
                </div>
              </div>

              <div>
                <p className="mb-1.5 text-xs uppercase tracking-wide text-muted-foreground">Internal notes</p>
                <Textarea value={notes} rows={3} onChange={(e) => setNotes(e.target.value)} />
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    disabled={update.isPending}
                    onClick={() => update.mutate({ id: current.id, values: { notes } })}
                  >
                    {update.isPending ? <Loader2 className="size-4 animate-spin" /> : null} Save notes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const link = whatsAppLink(
                        current.customer_phone ?? "",
                        buildWhatsAppMessage({
                          order_number: current.order_number,
                          customer_name: current.customer_name,
                          customer_phone: current.customer_phone ?? "",
                          customer_email: current.customer_email,
                          address_line: current.address_line ?? "",
                          city: current.city ?? "",
                          state: current.state ?? "",
                          country: current.country,
                          notes: current.notes,
                          payment_provider: current.payment_provider ?? "",
                          subtotal: Number(current.subtotal),
                          shipping_fee: Number(current.shipping_fee),
                          shipping_zone: current.state ?? "",
                          total: Number(current.total),
                          items: (current.order_items ?? []).map((i) => ({
                            product_name: i.product_name,
                            variant: i.variant,
                            quantity: i.quantity,
                            unit_price: Number(i.unit_price),
                          })),
                        }),
                      );
                      if (link) window.open(link, "_blank", "noopener,noreferrer");
                      else toast.error("This order has no phone number.");
                    }}
                  >
                    Message customer on WhatsApp
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Packing Slip Print Dialog */}
      <Dialog open={packingSlipOpen} onOpenChange={setPackingSlipOpen}>
        <DialogContent className="max-h-[92vh] max-w-xl overflow-y-auto p-6 text-foreground print:p-0">
          {current ? (
            <div className="space-y-6 print:space-y-4">
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h2 className="text-2xl font-display font-bold">Mummy Rose</h2>
                  <p className="text-xs text-muted-foreground">Natural Nigerian Spices &amp; Pantry</p>
                  <p className="text-xs text-muted-foreground">hello@mummyrose.com · +234 800 000 0000</p>
                </div>
                <div className="text-right">
                  <span className="inline-block rounded bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary uppercase">
                    Packing Slip
                  </span>
                  <p className="mt-1 font-mono text-sm font-semibold">{current.order_number}</p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(current.created_at)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="rounded border p-3">
                  <p className="font-semibold text-muted-foreground uppercase text-[10px]">Customer Information</p>
                  <p className="mt-1 text-sm font-medium">{current.customer_name}</p>
                  <p className="text-muted-foreground">{current.customer_email}</p>
                  <p className="text-muted-foreground">{current.customer_phone || "—"}</p>
                </div>
                <div className="rounded border p-3">
                  <p className="font-semibold text-muted-foreground uppercase text-[10px]">Delivery Destination</p>
                  <p className="mt-1 text-sm font-medium">{current.address_line || "—"}</p>
                  <p className="text-muted-foreground">
                    {current.city ? `${current.city}, ` : ""}{current.state || ""}{current.country ? ` (${current.country})` : ""}
                  </p>
                  {current.postal_code && <p className="text-muted-foreground">Postal Code: {current.postal_code}</p>}
                </div>
              </div>

              {current.notes && (
                <div className="rounded bg-muted/40 p-2.5 text-xs">
                  <span className="font-semibold">Delivery Instructions: </span>
                  <span className="text-muted-foreground">{current.notes}</span>
                </div>
              )}

              <div>
                <p className="font-semibold text-xs uppercase text-muted-foreground mb-2">Package Items Checklist</p>
                <div className="rounded border overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted/50 border-b">
                      <tr>
                        <th className="p-2.5 w-12 text-center">Check</th>
                        <th className="p-2.5">Item &amp; Packaging Size</th>
                        <th className="p-2.5 text-center">Qty</th>
                        <th className="p-2.5 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {(current.order_items ?? []).map((item) => (
                        <tr key={item.id}>
                          <td className="p-2.5 text-center">
                            <div className="size-4 border rounded border-muted-foreground/50 mx-auto" />
                          </td>
                          <td className="p-2.5">
                            <span className="font-medium text-foreground">{item.product_name}</span>
                            {item.variant && <span className="ml-1 text-muted-foreground">({item.variant})</span>}
                          </td>
                          <td className="p-2.5 text-center font-bold">{item.quantity}</td>
                          <td className="p-2.5 text-right">{formatNaira(item.line_total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-t pt-3 space-y-1 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatNaira(current.subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Fee</span>
                  <span>{current.shipping_fee === 0 ? "Free" : formatNaira(current.shipping_fee)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-foreground border-t pt-2">
                  <span>Total Amount</span>
                  <span>{formatNaira(current.total)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground pt-1">
                  <span>Payment Status</span>
                  <span className="capitalize">{current.payment_status} ({current.payment_provider || "manual"})</span>
                </div>
                {courierName && (
                  <div className="flex justify-between text-xs text-muted-foreground pt-1">
                    <span>Carrier / Tracking</span>
                    <span>{courierName}{trackingNumber ? ` · ${trackingNumber}` : ""}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 print:hidden">
                <Button variant="outline" size="sm" onClick={() => setPackingSlipOpen(false)}>
                  Close
                </Button>
                <Button size="sm" className="gap-1.5" onClick={() => window.print()}>
                  <Printer className="size-4" /> Print Now
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
