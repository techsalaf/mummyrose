import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ArrowUpRight, Eye, ShoppingBag, TrendingUp, Wallet } from "lucide-react";

import { AdminHeader } from "@/components/admin/resource-manager";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime, formatNaira } from "@/lib/format";
import {
  adminAnalyticsQuery,
  adminInquiriesQuery,
  adminOrdersQuery,
  adminProductsQuery,
  useAdminRealtime,
} from "@/lib/admin-queries";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

type OrderRow = {
  id: string;
  order_number: string;
  customer_name: string;
  total: number;
  status: string;
  payment_status: string;
  order_type?: string | null;
  created_at: string;
};

function AdminDashboard() {
  const orders = useQuery(adminOrdersQuery);
  const products = useQuery(adminProductsQuery);
  const analytics = useQuery(adminAnalyticsQuery);
  const inquiries = useQuery(adminInquiriesQuery);
  useAdminRealtime(
    ["orders", "products", "inquiries", "analytics_events"],
    [["admin", "orders"], ["admin", "products"], ["admin", "inquiries"], ["admin", "analytics"]],
  );

  const orderRows = (orders.data ?? []) as unknown as OrderRow[];
  const paidOrders = orderRows.filter((o) => o.payment_status === "paid");
  const revenue = paidOrders.reduce((sum, o) => sum + Number(o.total ?? 0), 0);
  const pending = orderRows.filter((o) => o.status === "pending").length;
  const aov = paidOrders.length ? revenue / paidOrders.length : 0;

  const productRows = (products.data ?? []) as unknown as {
    id: string;
    name: string;
    stock_quantity: number;
    low_stock_threshold: number;
    is_active: boolean;
  }[];
  const lowStock = productRows.filter((p) => p.stock_quantity <= p.low_stock_threshold);

  const events = (analytics.data ?? []) as unknown as { name: string; created_at: string }[];
  const views = events.filter((e) => e.name === "page_view").length;
  const addToCart = events.filter((e) => e.name === "add_to_cart").length;
  const placed = events.filter((e) => e.name === "order_placed" || e.name === "whatsapp_order").length;
  const conversion = views ? (placed / views) * 100 : 0;

  const openInquiries = ((inquiries.data ?? []) as unknown as { status: string }[]).filter(
    (i) => i.status === "new",
  ).length;

  const last14 = buildDailySeries(orderRows);

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Dashboard"
        description="Live trading view — revenue, orders, traffic and stock health update in realtime."
        actions={
          <Button variant="outline" asChild>
            <Link to="/admin/orders">
              Manage orders <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Paid revenue" value={formatNaira(revenue)} icon={Wallet} hint={`${paidOrders.length} paid orders`} />
        <Stat label="Orders" value={String(orderRows.length)} icon={ShoppingBag} hint={`${pending} awaiting action`} />
        <Stat label="Average order" value={formatNaira(aov)} icon={TrendingUp} hint="Paid orders only" />
        <Stat
          label="Conversion (30d)"
          value={`${conversion.toFixed(1)}%`}
          icon={Eye}
          hint={`${views} views · ${addToCart} add-to-cart`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Orders &amp; revenue — last 14 days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-40 items-end gap-1.5">
              {last14.map((day) => {
                const max = Math.max(...last14.map((d) => d.total), 1);
                return (
                  <div key={day.label} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t bg-primary/80"
                      style={{ height: `${Math.max((day.total / max) * 100, day.total > 0 ? 6 : 2)}%` }}
                      title={`${day.label}: ${formatNaira(day.total)} (${day.count} orders)`}
                    />
                    <span className="text-[10px] text-muted-foreground">{day.label}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="size-4 text-destructive" /> Needs attention
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="Pending orders" value={pending} to="/admin/orders" />
            <Row label="Low / out of stock" value={lowStock.length} to="/admin/inventory" />
            <Row label="New inquiries" value={openInquiries} to="/admin/inquiries" />
            <Row label="Inactive products" value={productRows.filter((p) => !p.is_active).length} to="/admin/products" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Latest orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {orderRows.slice(0, 8).map((order) => (
              <div key={order.id} className="flex items-center justify-between gap-3 border-b pb-2 last:border-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{order.order_number}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {order.customer_name} · {formatDateTime(order.created_at)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant={order.payment_status === "paid" ? "default" : "secondary"}>
                    {order.payment_status}
                  </Badge>
                  <span className="text-sm font-medium">{formatNaira(order.total)}</span>
                </div>
              </div>
            ))}
            {orderRows.length === 0 ? <p className="text-sm text-muted-foreground">No orders yet.</p> : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Low stock</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStock.slice(0, 8).map((product) => (
              <div key={product.id} className="flex items-center justify-between gap-3 border-b pb-2 last:border-0">
                <p className="truncate text-sm">{product.name}</p>
                <Badge variant={product.stock_quantity === 0 ? "destructive" : "secondary"}>
                  {product.stock_quantity} left
                </Badge>
              </div>
            ))}
            {lowStock.length === 0 ? <p className="text-sm text-muted-foreground">Every product is well stocked.</p> : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function buildDailySeries(orders: OrderRow[]) {
  const days: { label: string; total: number; count: number }[] = [];
  for (let i = 13; i >= 0; i -= 1) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    const inDay = orders.filter((o) => {
      const created = new Date(o.created_at).getTime();
      return created >= date.getTime() && created < next.getTime();
    });
    days.push({
      label: String(date.getDate()),
      total: inDay.reduce((sum, o) => sum + Number(o.total ?? 0), 0),
      count: inDay.length,
    });
  }
  return days;
}

function Stat({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: typeof Wallet;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
          <Icon className="size-4 text-muted-foreground" />
        </div>
        <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}

function Row({ label, value, to }: { label: string; value: number; to: string }) {
  return (
    <Link to={to} className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted">
      <span>{label}</span>
      <Badge variant={value > 0 ? "destructive" : "secondary"}>{value}</Badge>
    </Link>
  );
}
