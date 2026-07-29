import { Link } from "@tanstack/react-router";
import { Heart, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { effectivePrice, formatNaira } from "@/lib/format";
import { productImage } from "@/lib/catalog-images";
import { cn } from "@/lib/utils";
import type { ProductRow } from "@/lib/queries";

export function ProductCard({ product }: { product: ProductRow }) {
  const { addItem, toggleWishlist, isWishlisted } = useCart();
  const price = effectivePrice(product);
  const hasDiscount = price < Number(product.price);
  const image = productImage(product);
  const soldOut = product.stock_quantity <= 0;

  return (
    <article className="group surface-card hover-lift relative flex h-full flex-col overflow-hidden rounded-lg">
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-square overflow-hidden bg-sand"
      >
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          width={900}
          height={900}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {hasDiscount && (
          <span className="absolute top-3 left-3 rounded-full bg-accent px-3 py-1 text-[10px] font-semibold tracking-widest text-accent-foreground uppercase">
            Offer
          </span>
        )}
        {soldOut && (
          <span className="absolute top-3 right-3 rounded-full bg-ink px-3 py-1 text-[10px] font-semibold tracking-widest text-ink-foreground uppercase">
            Sold out
          </span>
        )}
      </Link>

      <button
        type="button"
        aria-label="Save to wishlist"
        onClick={() => toggleWishlist(product.slug)}
        className="absolute top-3 right-3 hidden rounded-full bg-background/85 p-2 backdrop-blur transition-colors hover:text-accent sm:block"
      >
        <Heart className={cn("size-4", isWishlisted(product.slug) && "fill-accent text-accent")} />
      </button>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="eyebrow text-muted-foreground">{product.categories?.name ?? "Pantry"}</p>
        <Link to="/products/$slug" params={{ slug: product.slug }}>
          <h3 className="font-display text-lg leading-snug">{product.name}</h3>
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.short_description}</p>
        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <span className="font-display text-lg">{formatNaira(price)}</span>
            {hasDiscount && (
              <span className="ml-2 text-sm text-muted-foreground line-through">
                {formatNaira(product.price)}
              </span>
            )}
          </div>
          <Button
            size="icon"
            variant="clay"
            disabled={soldOut}
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
              toast.success(`${product.name} added to cart`);
            }}
          >
            <Plus />
          </Button>
        </div>
      </div>
    </article>
  );
}
