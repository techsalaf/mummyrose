import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { effectivePrice } from "@/lib/format";
import type { ProductRow } from "@/lib/queries";

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "name";

const sorts: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
  { key: "name", label: "A – Z" },
];

export function ProductGrid({
  products,
  categories = [],
  initialQuery = "",
  showCategoryFilter = true,
}: {
  products: ProductRow[];
  categories?: { id: string; name: string; slug: string }[];
  initialQuery?: string;
  showCategoryFilter?: boolean;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<SortKey>("featured");
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onOfferOnly, setOnOfferOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      if (q) {
        const haystack = `${p.name} ${p.short_description ?? ""} ${(p.tags ?? []).join(" ")} ${
          p.categories?.name ?? ""
        }`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (activeCategories.length && !activeCategories.includes(p.category_id ?? "")) return false;
      if (inStockOnly && p.stock_quantity <= 0) return false;
      if (onOfferOnly && effectivePrice(p) >= Number(p.price)) return false;
      return true;
    });

    list = [...list];
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => effectivePrice(a) - effectivePrice(b));
        break;
      case "price-desc":
        list.sort((a, b) => effectivePrice(b) - effectivePrice(a));
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "featured":
        list.sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
        break;
      default:
        break;
    }
    return list;
  }, [products, query, sort, activeCategories, inStockOnly, onOfferOnly]);

  const toggleCategory = (id: string) =>
    setActiveCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, spices, flours…"
            aria-label="Search products"
            className="pl-9"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          aria-label="Sort products"
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          {sorts.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
        <Button variant="outline" onClick={() => setShowFilters((v) => !v)} className="sm:w-auto">
          <SlidersHorizontal /> Filters
        </Button>
      </div>

      {showFilters && (
        <div className="surface-card mt-4 flex flex-wrap items-center gap-2 rounded-md p-4">
          {showCategoryFilter &&
            categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleCategory(c.id)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  activeCategories.includes(c.id)
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border hover:border-accent"
                }`}
              >
                {c.name}
              </button>
            ))}
          <button
            type="button"
            onClick={() => setInStockOnly((v) => !v)}
            className={`rounded-full border px-3 py-1.5 text-xs ${
              inStockOnly ? "border-accent bg-accent text-accent-foreground" : "border-border"
            }`}
          >
            In stock
          </button>
          <button
            type="button"
            onClick={() => setOnOfferOnly((v) => !v)}
            className={`rounded-full border px-3 py-1.5 text-xs ${
              onOfferOnly ? "border-accent bg-accent text-accent-foreground" : "border-border"
            }`}
          >
            On offer
          </button>
        </div>
      )}

      <p className="mt-6 text-sm text-muted-foreground">
        {results.length} product{results.length === 1 ? "" : "s"}
      </p>

      {results.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          Nothing matched that search. Try a different word.
        </p>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
