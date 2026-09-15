import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2, Edit2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminVariantsQuery } from "@/lib/admin-queries";
import { deleteRow, saveRow } from "@/lib/admin-mutations";
import { formatNaira } from "@/lib/format";

export type VariantProductInfo = {
  id: string;
  name: string;
  sku?: string | null;
  price: number;
};

type VariantRow = {
  id: string;
  product_id: string;
  label: string;
  sku: string | null;
  price: number;
  discount_price: number | null;
  stock_quantity: number;
  sort_order: number;
  is_active: boolean;
};

export function ProductVariantsDialog({
  product,
  open,
  onClose,
}: {
  product: VariantProductInfo | null;
  open: boolean;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const variantsQuery = useQuery(adminVariantsQuery);

  const [formOpen, setFormOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<VariantRow | null>(null);

  // Form states
  const [label, setLabel] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("0");
  const [sortOrder, setSortOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  if (!product) return null;

  const productVariants = ((variantsQuery.data ?? []) as unknown as VariantRow[]).filter(
    (v) => v.product_id === product.id,
  );

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: adminVariantsQuery.queryKey }),
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] }),
    ]);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const cleanLabel = label.trim();
      if (!cleanLabel) throw new Error("Pack size label is required (e.g. 250g)");
      const numPrice = Number(price);
      if (isNaN(numPrice) || numPrice <= 0) throw new Error("Please enter a valid price");

      const payload: Record<string, unknown> = {
        product_id: product.id,
        label: cleanLabel,
        sku: sku.trim() || null,
        price: numPrice,
        discount_price: discountPrice.trim() ? Number(discountPrice) : null,
        stock_quantity: Math.max(0, parseInt(stockQuantity, 10) || 0),
        sort_order: parseInt(sortOrder, 10) || 0,
        is_active: isActive,
      };

      await saveRow("product_variants", payload, editingVariant?.id ?? null);
    },
    onSuccess: async () => {
      toast.success(editingVariant ? "Pack size updated" : "Pack size added");
      setFormOpen(false);
      resetForm();
      await invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteRow("product_variants", id);
    },
    onSuccess: async () => {
      toast.success("Pack size deleted");
      await invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const generatePresetsMutation = useMutation({
    mutationFn: async () => {
      const presets = [
        { label: "100g", multiplier: 0.5, sort: 1 },
        { label: "250g", multiplier: 1.0, sort: 2 },
        { label: "500g", multiplier: 1.85, sort: 3 },
        { label: "1kg", multiplier: 3.5, sort: 4 },
      ];

      for (const p of presets) {
        const basePrice = product.price > 0 ? product.price : 2000;
        const calcPrice = Math.round(basePrice * p.multiplier);
        const autoSku = product.sku ? `${product.sku}-${p.label.toUpperCase()}` : null;

        await saveRow("product_variants", {
          product_id: product.id,
          label: p.label,
          sku: autoSku,
          price: calcPrice,
          discount_price: null,
          stock_quantity: 25,
          sort_order: p.sort,
          is_active: true,
        });
      }
    },
    onSuccess: async () => {
      toast.success("Standard spice pack sizes added (100g, 250g, 500g, 1kg)");
      await invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function resetForm() {
    setEditingVariant(null);
    setLabel("");
    setSku("");
    setPrice(product?.price ? String(product.price) : "");
    setDiscountPrice("");
    setStockQuantity("20");
    setSortOrder("0");
    setIsActive(true);
  }

  function openEdit(v: VariantRow) {
    setEditingVariant(v);
    setLabel(v.label);
    setSku(v.sku ?? "");
    setPrice(String(v.price));
    setDiscountPrice(v.discount_price != null ? String(v.discount_price) : "");
    setStockQuantity(String(v.stock_quantity));
    setSortOrder(String(v.sort_order));
    setIsActive(v.is_active);
    setFormOpen(true);
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Pack Sizes &amp; Variants</span>
            <Badge variant="outline" className="font-normal">
              {product.name}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Configure weight and size options (100g, 250g, 500g, 1kg) with individual prices, offer rates, and live stock.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
            <div className="text-sm text-muted-foreground">
              Base product price: <span className="font-medium text-foreground">{formatNaira(product.price)}</span>
            </div>
            <div className="flex items-center gap-2">
              {productVariants.length === 0 ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => generatePresetsMutation.mutate()}
                  disabled={generatePresetsMutation.isPending}
                  className="gap-1.5 text-xs"
                >
                  <Sparkles className="size-3.5 text-primary" />
                  Auto-fill standard sizes (100g - 1kg)
                </Button>
              ) : null}
              <Button
                size="sm"
                onClick={() => {
                  resetForm();
                  setFormOpen(true);
                }}
                className="gap-1.5 text-xs"
              >
                <Plus className="size-3.5" />
                Add pack size
              </Button>
            </div>
          </div>

          {formOpen ? (
            <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">
                  {editingVariant ? `Edit Size: ${editingVariant.label}` : "New Pack Size"}
                </h3>
                <Button size="sm" variant="ghost" onClick={() => setFormOpen(false)} className="h-7 text-xs">
                  Cancel
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <Label className="text-xs">Pack size label *</Label>
                  <Input
                    placeholder="e.g. 250g Jar"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="mt-1 h-9"
                  />
                </div>
                <div>
                  <Label className="text-xs">Price (₦) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 2500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="mt-1 h-9"
                  />
                </div>
                <div>
                  <Label className="text-xs">Offer price (₦, optional)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 2200"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    className="mt-1 h-9"
                  />
                </div>
                <div>
                  <Label className="text-xs">Stock quantity</Label>
                  <Input
                    type="number"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    className="mt-1 h-9"
                  />
                </div>
                <div>
                  <Label className="text-xs">SKU (optional)</Label>
                  <Input
                    placeholder="e.g. SPICE-250G"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="mt-1 h-9"
                  />
                </div>
                <div>
                  <Label className="text-xs">Display order</Label>
                  <Input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="mt-1 h-9"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Switch id="variant-active" checked={isActive} onCheckedChange={setIsActive} />
                  <Label htmlFor="variant-active" className="text-xs cursor-pointer">
                    Available for customers on storefront
                  </Label>
                </div>
                <Button
                  size="sm"
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending}
                  className="gap-1.5"
                >
                  {saveMutation.isPending ? <Loader2 className="size-3.5 animate-spin" /> : null}
                  {editingVariant ? "Save changes" : "Create size"}
                </Button>
              </div>
            </div>
          ) : null}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Size / Label</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>In stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-20 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productVariants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                      No packaging variants added yet. Click &quot;Auto-fill standard sizes&quot; or &quot;Add pack size&quot; to begin.
                    </TableCell>
                  </TableRow>
                ) : (
                  productVariants.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-medium">{v.label}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{v.sku ?? "-"}</TableCell>
                      <TableCell>
                        <span className="font-medium">{formatNaira(v.price)}</span>
                        {v.discount_price ? (
                          <span className="ml-1 text-xs text-primary">→ {formatNaira(v.discount_price)}</span>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            v.stock_quantity === 0
                              ? "destructive"
                              : v.stock_quantity <= 5
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {v.stock_quantity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={v.is_active ? "default" : "secondary"}>
                          {v.is_active ? "Live" : "Hidden"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-7"
                            onClick={() => openEdit(v)}
                            aria-label="Edit"
                          >
                            <Edit2 className="size-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-7 text-destructive"
                            onClick={() => deleteMutation.mutate(v.id)}
                            disabled={deleteMutation.isPending}
                            aria-label="Delete"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
