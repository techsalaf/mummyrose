import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { AdminHeader } from "@/components/admin/resource-manager";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import {
  adminInventoryLogsQuery,
  adminProductsQuery,
  useAdminRealtime,
} from "@/lib/admin-queries";
import { formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/admin/inventory")({
  component: AdminInventory,
});

type Product = {
  id: string;
  name: string;
  sku: string | null;
  stock_quantity: number;
  low_stock_threshold: number;
};

type Log = {
  id: string;
  change: number;
  reason: string | null;
  created_at: string;
  products: { name: string } | null;
};

function AdminInventory() {
  const queryClient = useQueryClient();
  const products = useQuery(adminProductsQuery);
  const logs = useQuery(adminInventoryLogsQuery);
  useAdminRealtime(["products", "inventory_logs"], [["admin", "products"], ["admin", "inventory_logs"]]);

  const rows = (products.data ?? []) as unknown as Product[];
  const logRows = (logs.data ?? []) as unknown as Log[];
  const [deltas, setDeltas] = useState<Record<string, string>>({});
  const [reasons, setReasons] = useState<Record<string, string>>({});

  const sorted = useMemo(
    () => [...rows].sort((a, b) => a.stock_quantity - b.stock_quantity),
    [rows],
  );

  const adjust = useMutation({
    mutationFn: async ({ product, change, reason }: { product: Product; change: number; reason: string }) => {
      if (!Number.isFinite(change) || change === 0) throw new Error("Enter a non-zero adjustment.");
      const next = Math.max(0, Number(product.stock_quantity ?? 0) + change);
      const { error } = await supabase.from("products").update({ stock_quantity: next }).eq("id", product.id);
      if (error) throw new Error(error.message);
      const { data: session } = await supabase.auth.getUser();
      const { error: logError } = await supabase.from("inventory_logs").insert({
        product_id: product.id,
        change,
        reason: reason || "Manual adjustment",
        created_by: session.user?.id ?? null,
      });
      if (logError) throw new Error(logError.message);
    },
    onSuccess: async () => {
      toast.success("Stock updated");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminProductsQuery.queryKey }),
        queryClient.invalidateQueries({ queryKey: adminInventoryLogsQuery.queryKey }),
      ]);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Inventory"
        description="Adjust stock with a full audit trail. Storefront orders deduct stock automatically."
      />

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="w-24">In stock</TableHead>
              <TableHead className="w-24">Alert at</TableHead>
              <TableHead className="w-[26rem]">Adjust</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center">
                  <Loader2 className="mx-auto size-4 animate-spin" />
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.sku ?? "—"}</p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.stock_quantity === 0
                          ? "destructive"
                          : product.stock_quantity <= product.low_stock_threshold
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {product.stock_quantity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{product.low_stock_threshold}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="+10 / -5"
                        className="w-24"
                        value={deltas[product.id] ?? ""}
                        onChange={(e) => setDeltas((prev) => ({ ...prev, [product.id]: e.target.value }))}
                      />
                      <Input
                        placeholder="Reason (restock, damage…)"
                        value={reasons[product.id] ?? ""}
                        onChange={(e) => setReasons((prev) => ({ ...prev, [product.id]: e.target.value }))}
                      />
                      <Button
                        variant="outline"
                        disabled={adjust.isPending}
                        onClick={() =>
                          adjust.mutate({
                            product,
                            change: Number(deltas[product.id] ?? 0),
                            reason: reasons[product.id] ?? "",
                          })
                        }
                      >
                        Apply
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent stock movements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {logRows.length === 0 ? (
            <p className="text-muted-foreground">No movements recorded yet.</p>
          ) : (
            logRows.map((log) => (
              <div key={log.id} className="flex items-center justify-between gap-3 border-b pb-2 last:border-0">
                <span className="truncate">
                  {log.products?.name ?? "Product"} — {log.reason ?? "adjustment"}
                </span>
                <span className="flex shrink-0 items-center gap-3">
                  <Badge variant={log.change < 0 ? "destructive" : "default"}>
                    {log.change > 0 ? `+${log.change}` : log.change}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{formatDateTime(log.created_at)}</span>
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
