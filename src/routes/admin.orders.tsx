import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";

import { AdminHeader } from "@/components/admin/resource-manager";
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
  order_items: Item[];
};

const STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUSES = ["unpaid", "paid", "refunded", "failed"];

function AdminOrders() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(adminOrdersQuery);
  useAdminRealtime(["orders", "order_items"], [["admin", "orders"]]);
  const orders = (data ?? []) as unknown as Order[];

  const [term, setTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [active, setActive] = useState<Order | null>(null);
  const [notes, setNotes] = useState("");

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

  const current = active ? (orders.find((o) => o.id === active.id) ?? active) : null;

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
              <DialogHeader>
                <DialogTitle>{current.order_number}</DialogTitle>
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

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-1.5 text-xs uppercase tracking-wide text-muted-foreground">Fulfilment status</p>
                  <Select
                    value={current.status}
                    onValueChange={(status) => update.mutate({ id: current.id, values: { status } })}
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
                    onValueChange={(payment_status) => update.mutate({ id: current.id, values: { payment_status } })}
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
    </div>
  );
}
