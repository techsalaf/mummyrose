import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Boxes, Loader2, Package } from "lucide-react";
import { toast } from "sonner";

import { AdminHeader } from "@/components/admin/resource-manager";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import {
  adminInventoryLogsQuery,
  adminProductsQuery,
  adminVariantsQuery,
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

type Variant = {
  id: string;
  product_id: string;
  label: string;
  sku: string | null;
  stock_quantity: number;
  price: number;
  is_active: boolean;
  products: { name: string; slug: string } | null;
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
  const variants = useQuery(adminVariantsQuery);
  const logs = useQuery(adminInventoryLogsQuery);

  useAdminRealtime(
    ["products", "product_variants", "inventory_logs"],
    [["admin", "products"], ["admin", "product_variants"], ["admin", "inventory_logs"]],
  );

  const productRows = (products.data ?? []) as unknown as Product[];
  const variantRows = (variants.data ?? []) as unknown as Variant[];
  const logRows = (logs.data ?? []) as unknown as Log[];

  const [productDeltas, setProductDeltas] = useState<Record<string, string>>({});
  const [productReasons, setProductReasons] = useState<Record<string, string>>({});

  const [variantDeltas, setVariantDeltas] = useState<Record<string, string>>({});
  const [variantReasons, setVariantReasons] = useState<Record<string, string>>({});

  const sortedProducts = useMemo(
    () => [...productRows].sort((a, b) => a.stock_quantity - b.stock_quantity),
    [productRows],
  );

  const sortedVariants = useMemo(
    () => [...variantRows].sort((a, b) => a.stock_quantity - b.stock_quantity),
    [variantRows],
  );

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: adminProductsQuery.queryKey }),
      queryClient.invalidateQueries({ queryKey: adminVariantsQuery.queryKey }),
      queryClient.invalidateQueries({ queryKey: adminInventoryLogsQuery.queryKey }),
    ]);
  };

  const adjustProduct = useMutation({
    mutationFn: async ({ product, change, reason }: { product: Product; change: number; reason: string }) => {
      if (!Number.isFinite(change) || change === 0) throw new Error("Enter a non-zero adjustment.");
      const next = Math.max(0, Number(product.stock_quantity ?? 0) + change);
      const { error } = await supabase.from("products").update({ stock_quantity: next }).eq("id", product.id);
      if (error) throw new Error(error.message);

      const { data: session } = await supabase.auth.getUser();
      const { error: logError } = await supabase.from("inventory_logs").insert({
        product_id: product.id,
        change,
        reason: reason || "Manual stock adjustment",
        created_by: session.user?.id ?? null,
      });
      if (logError) throw new Error(logError.message);
    },
    onSuccess: async () => {
      toast.success("Product stock updated");
      await invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const adjustVariant = useMutation({
    mutationFn: async ({ variant, change, reason }: { variant: Variant; change: number; reason: string }) => {
      if (!Number.isFinite(change) || change === 0) throw new Error("Enter a non-zero adjustment.");
      const next = Math.max(0, Number(variant.stock_quantity ?? 0) + change);
      const { error } = await supabase
        .from("product_variants")
        .update({ stock_quantity: next })
        .eq("id", variant.id);
      if (error) throw new Error(error.message);

      const { data: session } = await supabase.auth.getUser();
      const logReason = `[${variant.label}] ${reason || "Manual variant adjustment"}`;
      const { error: logError } = await supabase.from("inventory_logs").insert({
        product_id: variant.product_id,
        change,
        reason: logReason,
        created_by: session.user?.id ?? null,
      });
      if (logError) throw new Error(logError.message);
    },
    onSuccess: async () => {
      toast.success("Variant stock updated");
      await invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Inventory"
        description="Monitor and adjust stock across base products and packaging variants with a verified audit trail."
      />

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products" className="gap-2">
            <Package className="size-4" />
            Products ({productRows.length})
          </TabsTrigger>
          <TabsTrigger value="variants" className="gap-2">
            <Boxes className="size-4" />
            Pack sizes ({variantRows.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
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
                ) : sortedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sku ?? "-"}</p>
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
                            value={productDeltas[product.id] ?? ""}
                            onChange={(e) =>
                              setProductDeltas((prev) => ({ ...prev, [product.id]: e.target.value }))
                            }
                          />
                          <Input
                            placeholder="Reason (restock, batch, damaged...)"
                            value={productReasons[product.id] ?? ""}
                            onChange={(e) =>
                              setProductReasons((prev) => ({ ...prev, [product.id]: e.target.value }))
                            }
                          />
                          <Button
                            variant="outline"
                            disabled={adjustProduct.isPending}
                            onClick={() =>
                              adjustProduct.mutate({
                                product,
                                change: Number(productDeltas[product.id] ?? 0),
                                reason: productReasons[product.id] ?? "",
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
        </TabsContent>

        <TabsContent value="variants">
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Spice &amp; Pack Size</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="w-24">In stock</TableHead>
                  <TableHead className="w-[26rem]">Adjust</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variants.isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center">
                      <Loader2 className="mx-auto size-4 animate-spin" />
                    </TableCell>
                  </TableRow>
                ) : sortedVariants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                      No pack size variants found. Add variants on the Products page.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedVariants.map((variant) => (
                    <TableRow key={variant.id}>
                      <TableCell>
                        <p className="font-medium">{variant.products?.name ?? "Spice"}</p>
                        <Badge variant="outline" className="mt-0.5 text-xs font-normal">
                          {variant.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{variant.sku ?? "-"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            variant.stock_quantity === 0
                              ? "destructive"
                              : variant.stock_quantity <= 5
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {variant.stock_quantity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder="+10 / -5"
                            className="w-24"
                            value={variantDeltas[variant.id] ?? ""}
                            onChange={(e) =>
                              setVariantDeltas((prev) => ({ ...prev, [variant.id]: e.target.value }))
                            }
                          />
                          <Input
                            placeholder="Reason (restock, repackaging...)"
                            value={variantReasons[variant.id] ?? ""}
                            onChange={(e) =>
                              setVariantReasons((prev) => ({ ...prev, [variant.id]: e.target.value }))
                            }
                          />
                          <Button
                            variant="outline"
                            disabled={adjustVariant.isPending}
                            onClick={() =>
                              adjustVariant.mutate({
                                variant,
                                change: Number(variantDeltas[variant.id] ?? 0),
                                reason: variantReasons[variant.id] ?? "",
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
        </TabsContent>
      </Tabs>

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
                  {log.products?.name ?? "Product"} : {log.reason ?? "adjustment"}
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
