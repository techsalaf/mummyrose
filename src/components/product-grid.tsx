import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, RotateCcw, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { effectivePrice } from "@/lib/format";
import type { ProductRow } from "@/lib/queries";

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "name";

const sorts: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Sort by: Bestsellers" },
  { key: "newest", label: "Sort by: Newest Batch" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "name", label: "Name: A to Z" },
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onOfferOnly, setOnOfferOnly] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      if (q) {
        const haystack = `${p.name} ${p.short_description ?? ""} ${(p.tags ?? []).join(" ")} ${
          p.categories?.name ?? ""
        }`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (selectedCategory && p.category_id !== selectedCategory) return false;
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
  }, [products, query, sort, selectedCategory, inStockOnly, onOfferOnly]);

  const resetFilters = () => {
    setQuery("");
    setSelectedCategory(null);
    setInStockOnly(false);
    setOnOfferOnly(false);
    setSort("featured");
  };

  return (
    <div>
      {/* Category Pill Tabs */}
      {showCategoryFilter && categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
              selectedCategory === null
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
          >
            All Products ({products.length})
          </button>
          {categories.map((c) => {
            const isSelected = selectedCategory === c.id;
            const count = products.filter((p) => p.category_id === c.id).length;

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(isSelected ? null : c.id)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                {c.name} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Control Bar: Search Input & Sort Selector */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center justify-between border-y border-border/60 py-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search spices, flours, tea infusions…"
            aria-label="Search products"
            className="pl-9 bg-card border-border/80"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setInStockOnly((v) => !v)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
              inStockOnly ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
            }`}
          >
            In Stock Only
          </button>
          <button
            type="button"
            onClick={() => setOnOfferOnly((v) => !v)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
              onOfferOnly ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
            }`}
          >
            Special Offers
          </button>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sort products"
            className="h-9 rounded-lg border border-input bg-card px-3 text-xs font-semibold text-foreground"
          >
            {sorts.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result Count and Active Filters Bar */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Showing <span className="text-foreground font-bold">{results.length}</span> of {products.length} Products
        </p>

        {(query || selectedCategory || inStockOnly || onOfferOnly) && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <RotateCcw className="size-3.5" /> Reset Filters
          </button>
        )}
      </div>

      {/* Products Grid */}
      {results.length === 0 ? (
        <div className="my-16 rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <Sparkles className="mx-auto size-10 text-muted-foreground/60" />
          <h3 className="font-display text-2xl font-bold text-foreground mt-4">
            No pantry items match your search
          </h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search query or clear the active category filters.
          </p>
          <Button onClick={resetFilters} variant="outline" className="mt-6 font-semibold">
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

