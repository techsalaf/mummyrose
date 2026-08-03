import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { categoriesQuery, productsQuery } from "@/lib/queries";
import { effectivePrice, formatNaira } from "@/lib/format";
import { productImage } from "@/lib/catalog-images";

/** Smart search with live product, category and tag suggestions (⌘K / Ctrl+K). */
export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const navigate = useNavigate();
  const { data: products = [] } = useQuery({ ...productsQuery, enabled: open });
  const { data: categories = [] } = useQuery({ ...categoriesQuery, enabled: open });

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const needle = term.trim().toLowerCase();

  const matches = useMemo(() => {
    if (!needle) return products.filter((product) => product.is_featured).slice(0, 5);
    return products
      .filter((product) =>
        [product.name, product.short_description, ...(product.tags ?? [])]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(needle)),
      )
      .slice(0, 7);
  }, [products, needle]);

  const categoryMatches = useMemo(
    () => (needle ? categories.filter((c) => c.name.toLowerCase().includes(needle)).slice(0, 4) : categories.slice(0, 4)),
    [categories, needle],
  );

  const go = (fn: () => void) => {
    setOpen(false);
    setTerm("");
    fn();
  };

  return (
    <>
      <Button variant="ghost" size="icon" aria-label="Search products" onClick={() => setOpen(true)}>
        <Search />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 sm:max-w-xl">
          <DialogTitle className="sr-only">Search Mummy Rose</DialogTitle>
          <Command shouldFilter={false}>
        <CommandInput
          value={term}
          onValueChange={setTerm}
          placeholder="Search spices, blends, flours, recipes…"
        />
        <CommandList>
          <CommandEmpty>No matches. Try “curry”, “thyme” or “jollof”.</CommandEmpty>

          {matches.length > 0 ? (
            <CommandGroup heading={needle ? "Products" : "Popular right now"}>
              {matches.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.slug}
                  onSelect={() =>
                    go(() => navigate({ to: "/products/$slug", params: { slug: product.slug } }))
                  }
                  className="gap-3"
                >
                  <img
                    src={productImage(product)}
                    alt=""
                    className="size-9 shrink-0 rounded-md object-cover"
                    loading="lazy"
                  />
                  <span className="min-w-0 flex-1 truncate">{product.name}</span>
                  <span className="text-xs text-muted-foreground">{formatNaira(effectivePrice(product))}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}

          {categoryMatches.length > 0 ? (
            <CommandGroup heading="Categories">
              {categoryMatches.map((category) => (
                <CommandItem
                  key={category.id}
                  value={`category-${category.slug}`}
                  onSelect={() => go(() => navigate({ to: "/category/$slug", params: { slug: category.slug } }))}
                >
                  <TrendingUp className="size-4 text-accent" />
                  {category.name}
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}

          {needle ? (
            <CommandGroup heading="Search">
              <CommandItem
                value="see-all"
                onSelect={() => go(() => navigate({ to: "/products", search: { q: term } }))}
              >
                <Search className="size-4" />
                See all results for “{term}”
              </CommandItem>
            </CommandGroup>
          ) : null}
        </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
