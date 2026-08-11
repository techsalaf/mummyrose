import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Plus, Leaf, ShoppingBag, Eye, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { useCurrency } from "@/lib/currency";
import { effectivePrice } from "@/lib/format";
import { productImage } from "@/lib/catalog-images";
import { cn } from "@/lib/utils";
import type { ProductRow } from "@/lib/queries";

export function ProductCard({ product, priority = false }: { product: ProductRow; priority?: boolean }) {
  const { addItem, toggleWishlist, isWishlisted } = useCart();
  const { formatPrice } = useCurrency();
  const price = effectivePrice(product);
  const hasDiscount = price < Number(product.price);
  const image = productImage(product);
  const soldOut = product.stock_quantity <= 0;
  const saved = isWishlisted(product.slug);

  const weightOptions = product.weight_options && product.weight_options.length > 0 
    ? product.weight_options 
    : ["100g", "250g"];
  const [selectedWeight, setSelectedWeight] = useState(weightOptions[0]);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      slug: product.slug,
      name: product.name,
      image,
      unit_price: price,
      variant: selectedWeight,
    });
    setAdded(true);
    toast.success(`${product.name} (${selectedWeight}) added to cart`);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-400 hover:-translate-y-1 hover:shadow-lg">
      
      {/* Product Image Box */}
      <div className="hover-zoom-img relative aspect-4/5 w-full bg-secondary/40">
        <Link
          to="/products/$slug"
          params={{ slug: product.slug }}
          className="block h-full w-full"
          aria-label={product.name}
        >
          <img
            src={image}
            alt={product.name}
            loading={priority ? "eager" : "lazy"}
            width={900}
            height={1125}
            className="h-full w-full object-cover"
          />
        </Link>

        {/* Top Badges */}
        <div className="pointer-events-none absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {hasDiscount ? (
            <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground uppercase shadow-sm">
              Sale
            </span>
          ) : null}
          {product.is_featured ? (
            <span className="rounded-full bg-background/90 px-2.5 py-0.5 text-[10px] font-bold uppercase backdrop-blur text-foreground shadow-sm">
              Best Seller
            </span>
          ) : null}
          {soldOut ? (
            <span className="rounded-full bg-destructive px-2.5 py-0.5 text-[10px] font-bold text-destructive-foreground uppercase">
              Sold Out
            </span>
          ) : null}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          onClick={() => toggleWishlist(product.slug)}
          className="absolute top-3 right-3 z-10 grid size-9 place-items-center rounded-full bg-background/90 text-foreground shadow-md backdrop-blur transition-transform hover:scale-110 hover:text-primary"
        >
          <Heart className={cn("size-4 transition-colors", saved && "fill-primary text-primary")} />
        </button>

        {/* Quick View Link overlay on hover */}
        <div className="absolute inset-x-3 bottom-3 z-10 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hidden sm:block">
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="w-full font-semibold shadow-md bg-background/95 hover:bg-background text-foreground"
          >
            <Link to="/products/$slug" params={{ slug: product.slug }}>
              <Eye className="mr-2 size-4" /> Quick Details
            </Link>
          </Button>
        </div>
      </div>

      {/* Product Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1 text-[11px] font-semibold text-accent uppercase tracking-wider">
            <Leaf className="size-3" />
            {product.categories?.name ?? "Pantry"}
          </p>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
            100% Natural
          </span>
        </div>

        <Link to="/products/$slug" params={{ slug: product.slug }} className="mt-2">
          <h3 className="font-display text-xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>

        {product.short_description ? (
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {product.short_description}
          </p>
        ) : null}

        {/* Weight Selector Pills */}
        {weightOptions.length > 0 && (
          <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase mr-1">Size:</span>
            {weightOptions.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setSelectedWeight(w)}
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-all ${
                  selectedWeight === w
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        )}

        {/* Pricing & Add To Cart Button */}
        <div className="mt-auto flex items-center justify-between pt-5 border-t border-border/60">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-xl font-bold text-foreground">
                {formatPrice(price)}
              </span>
              {hasDiscount ? (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              ) : null}
            </div>
          </div>

          <Button
            size="sm"
            disabled={soldOut}
            onClick={handleAddToCart}
            className={`font-semibold shadow-xs transition-all ${
              added ? "bg-accent text-accent-foreground" : ""
            }`}
          >
            {added ? (
              <>
                <Check className="mr-1.5 size-4" /> Added
              </>
            ) : (
              <>
                <ShoppingBag className="mr-1.5 size-4" /> Add
              </>
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}

