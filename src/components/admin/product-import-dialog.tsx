import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload, X, CheckCircle2, AlertCircle, Loader2, Download, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { adminCategoriesQuery } from "@/lib/admin-queries";
import { slugify } from "@/lib/format";

/** One row from the CSV, raw strings */
type RawRow = Record<string, string>;

/** A validated row ready for import */
interface ImportRow {
  name: string;
  slug: string;
  short_description: string;
  description: string;
  price: number;
  discount_price: number | null;
  sku: string;
  stock_quantity: number;
  category_id: string | null;
  tags: string[];
  weight_options: string[];
  ingredients: string;
  is_featured: boolean;
  is_active: boolean;
  seo_title: string;
  seo_description: string;
  /** The category slug/name the user provided — shown in preview */
  _category_raw: string;
  _row_index: number;
  _errors: string[];
}

const TEMPLATE_HEADERS = [
  "name",
  "short_description",
  "description",
  "price",
  "discount_price",
  "sku",
  "stock_quantity",
  "category",
  "tags",
  "weight_options",
  "ingredients",
  "is_featured",
  "seo_title",
  "seo_description",
];

function downloadTemplate() {
  const exampleRows = [
    [
      "Ogbono Powder",
      "Rich wild mango seed powder for hearty soups",
      "Stone-ground ogbono seeds with deep earthy flavour. Perfect for draw soup.",
      "1800",
      "",
      "OGB-001",
      "50",
      "Soups & Stews",
      "soup, ogbono, nigerian",
      "250g, 500g, 1kg",
      "100% wild mango seed (Irvingia gabonensis)",
      "false",
      "Buy Ogbono Powder | Mummy Rose",
      "Premium stone-ground ogbono powder for authentic Nigerian draw soup.",
    ],
    [
      "Suya Spice Blend",
      "Smoky peanut-based suya spice for grilling",
      "Authentic suya yaji with ginger, cloves and chilli. Rub on any meat.",
      "1200",
      "950",
      "SUY-002",
      "75",
      "Spices & Seasonings",
      "suya, spice, grilling",
      "100g, 250g",
      "Groundnut powder, ginger, paprika, cloves, salt",
      "true",
      "Suya Spice Blend | Mummy Rose",
      "Authentic suya yaji seasoning for the perfect Nigerian grilled meat.",
    ],
  ];

  const csv = [TEMPLATE_HEADERS.join(","), ...exampleRows.map((r) => r.map((v) => `"${v}"`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mummyrose-products-import-template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function parseCsv(text: string): RawRow[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]).map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((h, i) => [h, (values[i] ?? "").trim()]));
  });
}

/** Handles quoted fields and commas inside quotes */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

function validateRow(
  raw: RawRow,
  index: number,
  categoryMap: Record<string, string>,
): ImportRow {
  const errors: string[] = [];

  const name = raw["name"] ?? "";
  if (!name) errors.push("name is required");

  const price = parseFloat(raw["price"] ?? "0");
  if (isNaN(price) || price < 0) errors.push("price must be a positive number");

  const discountRaw = raw["discount_price"];
  const discount_price = discountRaw ? parseFloat(discountRaw) : null;
  if (discount_price !== null && isNaN(discount_price)) errors.push("discount_price must be a number");

  const stockRaw = raw["stock_quantity"] ?? "0";
  const stock_quantity = parseInt(stockRaw, 10);
  if (isNaN(stock_quantity) || stock_quantity < 0) errors.push("stock_quantity must be a non-negative integer");

  const categoryRaw = (raw["category"] ?? "").trim();
  let category_id: string | null = null;
  if (categoryRaw) {
    // try by name (case-insensitive) or by id
    const found = categoryMap[categoryRaw.toLowerCase()];
    if (found) {
      category_id = found;
    } else {
      errors.push(`Category "${categoryRaw}" not found — it will be left unassigned`);
    }
  }

  const tags = raw["tags"]
    ? raw["tags"]
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const weight_options = raw["weight_options"]
    ? raw["weight_options"]
        .split(",")
        .map((w) => w.trim())
        .filter(Boolean)
    : [];

  const isFeatured = ["true", "yes", "1"].includes((raw["is_featured"] ?? "").toLowerCase());

  return {
    name,
    slug: slugify(name),
    short_description: raw["short_description"] ?? "",
    description: raw["description"] ?? "",
    price,
    discount_price,
    sku: raw["sku"] ?? "",
    stock_quantity: isNaN(stock_quantity) ? 0 : stock_quantity,
    category_id,
    tags,
    weight_options,
    ingredients: raw["ingredients"] ?? "",
    is_featured: isFeatured,
    is_active: true,
    seo_title: raw["seo_title"] ?? "",
    seo_description: raw["seo_description"] ?? "",
    _category_raw: categoryRaw,
    _row_index: index,
    _errors: errors,
  };
}

interface ImportResult {
  success: number;
  skipped: number;
  errors: { name: string; error: string }[];
}

export function ProductImportDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const categories = useQuery(adminCategoriesQuery);
  const categoryMap: Record<string, string> = {};
  for (const cat of (categories.data ?? []) as { id: string; name: string }[]) {
    categoryMap[cat.name.toLowerCase()] = cat.id;
  }

  function handleFile(file: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rawRows = parseCsv(text);
      const validated = rawRows.map((r, i) => validateRow(r, i, categoryMap));
      setRows(validated);
      setResult(null);
    };
    reader.readAsText(file);
  }

  const importMutation = useMutation({
    mutationFn: async () => {
      const importResult: ImportResult = { success: 0, skipped: 0, errors: [] };
      const validRows = rows.filter((r) => r._errors.filter((e) => !e.includes("not found")).length === 0);

      // Process in batches of 20
      const BATCH = 20;
      for (let i = 0; i < validRows.length; i += BATCH) {
        const batch = validRows.slice(i, i + BATCH);
        const inserts = batch.map((r) => ({
          name: r.name,
          slug: r.slug,
          short_description: r.short_description || null,
          description: r.description || null,
          price: r.price,
          discount_price: r.discount_price,
          sku: r.sku || null,
          stock_quantity: r.stock_quantity,
          category_id: r.category_id,
          tags: r.tags,
          weight_options: r.weight_options,
          ingredients: r.ingredients || null,
          is_featured: r.is_featured,
          is_active: r.is_active,
          seo_title: r.seo_title || null,
          seo_description: r.seo_description || null,
        }));

        const { data, error } = await supabase
          .from("products")
          .upsert(inserts, { onConflict: "slug", ignoreDuplicates: false })
          .select("id");

        if (error) {
          for (const row of batch) {
            importResult.errors.push({ name: row.name, error: error.message });
          }
        } else {
          importResult.success += data?.length ?? 0;
        }
      }

      importResult.skipped = rows.length - validRows.length;
      return importResult;
    },
    onSuccess: async (data) => {
      setResult(data);
      await qc.invalidateQueries({ queryKey: ["admin", "products"] });
      toast.success(`Imported ${data.success} product${data.success !== 1 ? "s" : ""} successfully`);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const validCount = rows.filter((r) => r._errors.filter((e) => !e.includes("not found")).length === 0).length;
  const errorCount = rows.filter((r) => r._errors.filter((e) => !e.includes("not found")).length > 0).length;

  function reset() {
    setRows([]);
    setResult(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose(); } }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Bulk Import Products</DialogTitle>
          <DialogDescription>
            Upload a CSV file to add or update multiple products at once. Existing products with the same slug will be updated.
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Download template */}
        <div className="rounded-lg border border-dashed border-border p-4 bg-muted/30">
          <p className="text-sm font-medium mb-2">Step 1 — Download the template</p>
          <Button variant="outline" size="sm" onClick={downloadTemplate} className="gap-2">
            <Download className="size-4" />
            Download CSV template
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Fill in the template with your products, then upload it below. Required fields: <strong>name</strong>, <strong>price</strong>.
          </p>
        </div>

        {/* Step 2: Upload file */}
        <div
          className="rounded-lg border-2 border-dashed border-border bg-muted/20 p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/40 transition-colors"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
        >
          <Upload className="mx-auto size-8 text-muted-foreground mb-3" />
          <p className="text-sm font-medium">Drop your CSV here or click to browse</p>
          <p className="text-xs text-muted-foreground mt-1">Accepts .csv files</p>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>

        {/* Preview table */}
        {rows.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                Preview — {rows.length} row{rows.length !== 1 ? "s" : ""} found
              </p>
              <div className="flex items-center gap-2">
                {validCount > 0 && <Badge variant="default">{validCount} ready</Badge>}
                {errorCount > 0 && <Badge variant="destructive">{errorCount} have errors</Badge>}
                <Button variant="ghost" size="sm" onClick={reset}>
                  <X className="size-4" />
                </Button>
              </div>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-2 font-semibold">#</th>
                    <th className="text-left p-2 font-semibold">Name</th>
                    <th className="text-left p-2 font-semibold">Category</th>
                    <th className="text-right p-2 font-semibold">Price</th>
                    <th className="text-right p-2 font-semibold">Stock</th>
                    <th className="text-left p-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const hardErrors = row._errors.filter((e) => !e.includes("not found"));
                    const warnings = row._errors.filter((e) => e.includes("not found"));
                    const isExpanded = expanded === row._row_index;
                    return (
                      <>
                        <tr
                          key={row._row_index}
                          className={`border-t border-border cursor-pointer hover:bg-muted/30 ${
                            hardErrors.length > 0 ? "bg-destructive/5" : warnings.length > 0 ? "bg-yellow-500/5" : ""
                          }`}
                          onClick={() => setExpanded(isExpanded ? null : row._row_index)}
                        >
                          <td className="p-2 text-muted-foreground">{row._row_index + 1}</td>
                          <td className="p-2 font-medium max-w-[160px] truncate">{row.name || <span className="text-destructive">— empty —</span>}</td>
                          <td className="p-2 text-muted-foreground">{row._category_raw || "—"}</td>
                          <td className="p-2 text-right">₦{row.price.toLocaleString()}</td>
                          <td className="p-2 text-right">{row.stock_quantity}</td>
                          <td className="p-2">
                            {hardErrors.length > 0 ? (
                              <span className="flex items-center gap-1 text-destructive font-medium">
                                <AlertCircle className="size-3.5" /> Error
                              </span>
                            ) : warnings.length > 0 ? (
                              <span className="flex items-center gap-1 text-yellow-600 font-medium">
                                <AlertCircle className="size-3.5" /> Warning
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                                <CheckCircle2 className="size-3.5" /> Ready
                              </span>
                            )}
                          </td>
                        </tr>
                        {isExpanded && row._errors.length > 0 && (
                          <tr key={`${row._row_index}-detail`} className="border-t border-border">
                            <td colSpan={6} className="p-3 bg-muted/40">
                              <ul className="space-y-1">
                                {row._errors.map((err, i) => (
                                  <li key={i} className={`text-xs flex items-start gap-1.5 ${err.includes("not found") ? "text-yellow-700" : "text-destructive"}`}>
                                    <AlertCircle className="size-3.5 mt-0.5 shrink-0" />
                                    {err}
                                  </li>
                                ))}
                              </ul>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-muted-foreground">Click any row to see its errors or warnings.</p>
          </div>
        )}

        {/* Import result */}
        {result && (
          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-4 space-y-1">
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="size-4" />
              Import complete!
            </p>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              {result.success} product{result.success !== 1 ? "s" : ""} imported/updated
              {result.skipped > 0 ? ` · ${result.skipped} skipped (errors)` : ""}
            </p>
            {result.errors.length > 0 && (
              <ul className="mt-2 space-y-0.5">
                {result.errors.map((e, i) => (
                  <li key={i} className="text-xs text-destructive">
                    <strong>{e.name}</strong>: {e.error}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-border">
          <Button variant="outline" onClick={() => { reset(); onClose(); }}>
            Cancel
          </Button>
          <Button
            disabled={validCount === 0 || importMutation.isPending || !!result}
            onClick={() => importMutation.mutate()}
            className="gap-2 min-w-32"
          >
            {importMutation.isPending ? (
              <><Loader2 className="size-4 animate-spin" /> Importing…</>
            ) : (
              <><Upload className="size-4" /> Import {validCount > 0 ? `${validCount} product${validCount !== 1 ? "s" : ""}` : ""}</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
