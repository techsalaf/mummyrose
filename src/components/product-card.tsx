import { Link } from "@tanstack/react-router";
import { Heart, Plus, Leaf } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { effectivePrice, formatNaira } from "@/lib/format";
import { productImage } from "@/lib/catalog-images";
import { cn } from "@/lib/utils";
import type { ProductRow } from "@/lib/queries";

/**
 * Editorial product card: full-bleed imagery, slow hover zoom, quiet quick-add
 * that lifts in on hover (always visible on touch), and typographic pricing.
 */
export function ProductCard({ product, priority = false }: { product: ProductRow; priority?: boolean }) {
  const { addItem, toggleWishlist, isWishlisted } = useCart();
  const price = effectivePrice(product);
  const hasDiscount = price < Number(product.price);
  const image = productImage(product);
  const soldOut = product.stock_quantity <= 0;
  const saved = isWishlisted(product.slug);

  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative overflow-hidden rounded-sm bg-linen">
        <Link
          to="/products/$slug"
          params={{ slug: product.slug }}
          className="block aspect-4/5 overflow-hidden"
          aria-label={product.name}
        >
          <img
            src={image}
            alt={product.name}
            loading={priority ? "eager" : "lazy"}
            width={900}
            height={1125}
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-editorial group-hover:scale-[1.06]"
          />
        </Link>

        <div className="pointer-events-none absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {hasDiscount ? (
            <span className="rounded-full bg-primary px-2.5 py-1 text-[9px] font-medium tracking-[0.2em] text-primary-foreground uppercase">
              Offer
            </span>
          ) : null}
          {product.is_featured ? (
            <span className="rounded-full bg-background/90 px-2.5 py-1 text-[9px] font-medium tracking-[0.2em] uppercase backdrop-blur">
              Best seller
            </span>
          ) : null}
          {soldOut ? (
            <span className="rounded-full bg-ink px-2.5 py-1 text-[9px] font-medium tracking-[0.2em] text-ink-foreground uppercase">
              Sold out
            </span>
          ) : null}
        </div>

        <button
          type="button"
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={saved}
          onClick={() => toggleWishlist(product.slug)}
          className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-background/80 backdrop-blur transition-all duration-300 hover:bg-background hover:text-primary"
        >
          <Heart className={cn("size-4", saved && "fill-primary text-primary")} />
        </button>

        <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-100 transition-all duration-500 ease-editorial sm:translate-y-3 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
          <Button
            variant="default"
            disabled={soldOut}
            className="h-11 w-full rounded-sm text-[11px] tracking-[0.22em] uppercase"
            aria-label={`Add ${product.name} to cart`}
            onClick={() => {
              addItem({
                product_id: product.id,
                slug: product.slug,
                name: product.name,
                image,
                unit_price: price,
                variant: product.weight_options?.[0] ?? null,
              });
              toast.success(`${product.name} added to your basket`);
            }}
          >
            {soldOut ? "Out of stock" : "Quick add"}
            {soldOut ? null : <Plus className="size-3.5" />}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="flex items-center gap-1.5 text-[10px] tracking-[0.24em] text-muted-foreground uppercase">
          <Leaf className="size-3 text-olive" />
          {product.categories?.name ?? "Pantry"}
        </p>
        <Link to="/products/$slug" params={{ slug: product.slug }} className="mt-2">
          <h3 className="font-display text-[1.375rem] leading-tight transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {product.short_description}
        </p>
        <div className="mt-auto flex items-baseline gap-2 pt-4">
          <span className="font-display text-xl">{formatNaira(price)}</span>
          {hasDiscount ? (
            <span className="text-sm text-muted-foreground line-through">{formatNaira(product.price)}</span>
          ) : null}
          {product.weight_options?.[0] ? (
            <span className="ml-auto text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              {product.weight_options[0]}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
