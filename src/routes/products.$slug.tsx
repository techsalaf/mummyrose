import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Heart, Minus, Plus, Truck, ShieldCheck, Leaf, Sparkles, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ProductCard } from "@/components/product-card";
import { ProductReviews } from "@/components/product-reviews";
import { RecentlyViewed } from "@/components/recently-viewed";
import { JsonLd } from "@/components/json-ld";
import { OrderPathsNote, WhatsAppOrderButton } from "@/components/whatsapp-order-button";
import { productQuery, productsQuery } from "@/lib/queries";
import { effectivePrice, formatNaira } from "@/lib/format";
import { productImage } from "@/lib/catalog-images";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ context, params }) => {
    const product = await context.queryClient.ensureQueryData(productQuery(params.slug));
    context.queryClient.ensureQueryData(productsQuery);
    if (!product) throw notFound();
    return {
      name: product.name,
      description: product.seo_description ?? product.short_description ?? "",
      title: product.seo_title ?? product.name,
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Product unavailable — Mummy Rose" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.title} — Mummy Rose`;
    const description = loaderData.description || `Buy ${loaderData.name} from Mummy Rose.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
      ],
    };
  },
  component: ProductDetail,
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-4xl font-bold">Product Not Found</h1>
      <Button asChild className="mt-6 font-semibold">
        <Link to="/products">Explore Pantry Catalog</Link>
      </Button>
    </div>
  ),
  errorComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-4xl font-bold">Failed to load product details</h1>
    </div>
  ),
});

function ProductDetail() {
  const { slug } = Route.useParams();
  const { data: product } = useSuspenseQuery(productQuery(slug));
  const { data: products } = useSuspenseQuery(productsQuery);
  const { addItem, toggleWishlist, isWishlisted, pushRecentlyViewed } = useCart();
  const [qty, setQty] = useState(1);
  const [variant, setVariant] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product?.slug) pushRecentlyViewed(product.slug);
  }, [product?.slug, pushRecentlyViewed]);

  if (!product) return null;

  const price = effectivePrice(product);
  const hasDiscount = price < Number(product.price);
  const cover = productImage(product);
  const images = [cover, ...(product.gallery ?? [])];
  const soldOut = product.stock_quantity <= 0;
  const options = product.weight_options ?? [];
  const chosen = variant ?? options[0] ?? null;
  const related = products
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 4);
  const nutrition = (product.nutrition ?? {}) as Record<string, string | number>;

  const handleAddToCart = () => {
    addItem(
      {
        product_id: product.id,
        slug: product.slug,
        name: product.name,
        image: cover,
        unit_price: price,
        variant: chosen,
      },
      qty,
    );
    setAdded(true);
    toast.success(`${qty}x ${product.name} (${chosen ?? "standard"}) added to cart`);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="container-page py-10 md:py-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.short_description ?? undefined,
          sku: product.sku ?? undefined,
          brand: { "@type": "Brand", name: "Mummy Rose" },
          offers: {
            "@type": "Offer",
            price,
            priceCurrency: "NGN",
            availability: soldOut ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
          },
        }}
      />

      <nav className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        <Link to="/products" className="hover:text-primary transition-colors">
          Pantry
        </Link>
        <span>/</span>
        <Link to="/category/$slug" params={{ slug: product.categories?.slug ?? "spices" }} className="hover:text-primary transition-colors">
          {product.categories?.name ?? "Collection"}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-12 lg:grid-cols-12 items-start">
        
        {/* Left Column: Product Gallery */}
        <div className="lg:col-span-6 lg:sticky lg:top-24">
          <div className="hover-zoom-img relative overflow-hidden rounded-2xl border border-border bg-card shadow-md aspect-square">
            <img
              src={images[activeImage] ?? cover}
              alt={product.name}
              width={1200}
              height={1200}
              className="h-full w-full object-cover"
            />
          </div>

          {images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={img + i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  aria-label={`View product image ${i + 1}`}
                  className={cn(
                    "relative size-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer",
                    activeImage === i ? "border-primary shadow-md scale-105" : "border-border/60 hover:border-primary/50",
                  )}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Purchase Form */}
        <div className="lg:col-span-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-accent uppercase">
            <Leaf className="size-3.5" />
            <span>{product.categories?.name ?? "Mummy Rose Pantry"}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground mt-3">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-display text-3xl font-bold text-foreground">
              {formatNaira(price)}
            </span>
            {hasDiscount && (
              <span className="text-base text-muted-foreground line-through">
                {formatNaira(product.price)}
              </span>
            )}
          </div>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {product.short_description}
          </p>

          {/* Trust Badges Bar */}
          <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl border border-border/80 bg-card p-4 text-xs font-semibold text-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-accent" />
              <span>100% Natural &amp; Preservative Free</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-accent" />
              <span>Generational Family Recipe</span>
            </div>
          </div>

          {/* Size Option Selector */}
          {options.length > 0 && (
            <div className="mt-6">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Select Package Size:
              </label>
              <div className="mt-2.5 flex flex-wrap gap-2.5">
                {options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setVariant(opt)}
                    className={cn(
                      "rounded-full border px-5 py-2 text-xs font-bold transition-all cursor-pointer",
                      chosen === opt
                        ? "border-primary bg-primary text-primary-foreground shadow-md"
                        : "border-border bg-card hover:border-primary/50 text-foreground",
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex h-12 items-center rounded-xl border border-border bg-card px-2 shadow-xs">
              <button
                type="button"
                aria-label="Decrease quantity"
                className="grid size-9 place-items-center rounded-lg hover:bg-secondary text-foreground"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center font-bold text-sm">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                className="grid size-9 place-items-center rounded-lg hover:bg-secondary text-foreground"
                onClick={() => setQty((q) => Math.min(99, q + 1))}
              >
                <Plus className="size-4" />
              </button>
            </div>

            <Button
              size="xl"
              disabled={soldOut}
              onClick={handleAddToCart}
              className="flex-1 font-semibold text-base py-6 shadow-md hover:shadow-lg transition-all"
            >
              {added ? (
                <>
                  <Check className="mr-2 size-5" /> Added to Cart
                </>
              ) : soldOut ? (
                "Sold Out"
              ) : (
                `Add to Cart — ${formatNaira(price * qty)}`
              )}
            </Button>

            <Button
              variant="outline"
              size="xl"
              onClick={() => toggleWishlist(product.slug)}
              className="size-12 p-0 rounded-xl"
              aria-label="Wishlist"
            >
              <Heart className={cn("size-5", isWishlisted(product.slug) && "fill-primary text-primary")} />
            </Button>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <WhatsAppOrderButton
              lines={[{ name: product.name, variant: chosen, quantity: qty, unit_price: price }]}
            />
            <OrderPathsNote className="text-xs leading-relaxed text-muted-foreground" />
          </div>

          <p className="mt-6 flex items-center gap-2 text-xs font-semibold text-muted-foreground border-t border-border/60 pt-4">
            <Truck className="size-4 text-accent" />
            {soldOut
              ? "Out of stock — contact us to get notified on next batch restock."
              : `${product.stock_quantity} available in batch · Dispatched within 48 hours`}
          </p>

          {/* Product Specifications Accordion */}
          <Accordion type="single" collapsible className="mt-8" defaultValue="description">
            <AccordionItem value="description">
              <AccordionTrigger className="font-display text-lg font-bold">Product Story &amp; Details</AccordionTrigger>
              <AccordionContent className="leading-relaxed whitespace-pre-line text-sm text-muted-foreground">
                {product.description || product.short_description}
              </AccordionContent>
            </AccordionItem>
            
            {product.ingredients && (
              <AccordionItem value="ingredients">
                <AccordionTrigger className="font-display text-lg font-bold">Ingredient Transparency</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  <p className="font-semibold text-foreground mb-1">100% Pure &amp; Unadulterated:</p>
                  {product.ingredients}
                </AccordionContent>
              </AccordionItem>
            )}

            {Object.keys(nutrition).length > 0 && (
              <AccordionItem value="nutrition">
                <AccordionTrigger className="font-display text-lg font-bold">Nutritional Profile</AccordionTrigger>
                <AccordionContent>
                  <dl className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                    {Object.entries(nutrition).map(([key, value]) => (
                      <div key={key} className="flex justify-between rounded-lg bg-secondary/50 p-2.5">
                        <dt className="font-semibold capitalize text-foreground">{key.replace(/_/g, " ")}</dt>
                        <dd className="font-bold">{String(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </AccordionContent>
              </AccordionItem>
            )}

            <AccordionItem value="delivery">
              <AccordionTrigger className="font-display text-lg font-bold">Shipping &amp; Storage</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                Nationwide delivery across Nigeria in 2–4 business days. International shipping via express courier. Store in a cool, dry pantry away from direct sunlight.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

        </div>
      </div>

      {/* Pairs Beautifully With Section */}
      {related.length > 0 && (
        <section className="mt-24 border-t border-border/80 pt-16">
          <div className="flex items-center justify-between">
            <div>
              <span className="eyebrow text-accent uppercase tracking-widest">Perfect Combinations</span>
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl mt-1">
                Pairs Beautifully With...
              </h2>
            </div>
            <Link to="/products" className="text-sm font-semibold text-primary hover:underline">
              View All Pantry
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Customer Reviews */}
      <ProductReviews productId={product.id} productName={product.name} />

      <RecentlyViewed products={products} excludeSlug={product.slug} />
    </div>
  );
}

