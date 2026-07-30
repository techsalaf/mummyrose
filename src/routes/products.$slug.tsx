import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Heart, Minus, Plus, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ProductCard } from "@/components/product-card";
import { RecentlyViewed } from "@/components/recently-viewed";
import { JsonLd } from "@/components/json-ld";
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
      <h1 className="font-display text-3xl">Product not found</h1>
      <Link to="/products" className="mt-4 inline-block text-sm underline">
        Back to shop
      </Link>
    </div>
  ),
  errorComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-3xl">This product didn't load</h1>
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

  return (
    <div className="container-page py-10 md:py-14">
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

      <nav className="text-xs text-muted-foreground">
        <Link to="/products" className="hover:text-accent">
          Products
        </Link>
        <span className="px-2">/</span>
        <span>{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-lg bg-sand">
            <img
              src={images[activeImage] ?? cover}
              alt={product.name}
              width={1200}
              height={1200}
              className="aspect-square w-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {images.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setActiveImage(i)}
                  aria-label={`View image ${i + 1}`}
                  className={cn(
                    "size-20 overflow-hidden rounded-md border",
                    activeImage === i ? "border-accent" : "border-border",
                  )}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="eyebrow text-muted-foreground">{product.categories?.name}</p>
          <h1 className="mt-3 font-display text-3xl md:text-4xl">{product.name}</h1>
          <div className="mt-4 flex items-center gap-3">
            <span className="font-display text-2xl">{formatNaira(price)}</span>
            {hasDiscount && (
              <span className="text-muted-foreground line-through">{formatNaira(product.price)}</span>
            )}
          </div>
          <p className="mt-5 leading-relaxed text-muted-foreground">{product.short_description}</p>

          {options.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium">Size</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setVariant(opt)}
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-sm transition-colors",
                      chosen === opt ? "border-accent bg-accent text-accent-foreground" : "border-border",
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-md border border-input">
              <button
                aria-label="Decrease quantity"
                className="px-3 py-2"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center text-sm">{qty}</span>
              <button
                aria-label="Increase quantity"
                className="px-3 py-2"
                onClick={() => setQty((q) => Math.min(99, q + 1))}
              >
                <Plus className="size-4" />
              </button>
            </div>
            <Button
              size="lg"
              variant="clay"
              disabled={soldOut}
              onClick={() => {
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
                toast.success(`${product.name} added to cart`);
              }}
            >
              {soldOut ? "Sold out" : "Add to cart"}
            </Button>
            <Button variant="outline" size="lg" onClick={() => toggleWishlist(product.slug)}>
              <Heart className={cn(isWishlisted(product.slug) && "fill-accent text-accent")} />
              {isWishlisted(product.slug) ? "Saved" : "Save"}
            </Button>
          </div>

          <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
            <Truck className="size-4 text-accent" />
            {soldOut
              ? "Out of stock — join the waitlist by contacting us."
              : `${product.stock_quantity} in stock · dispatched within 48 hours`}
          </p>

          <Accordion type="single" collapsible className="mt-8" defaultValue="description">
            <AccordionItem value="description">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent className="leading-relaxed whitespace-pre-line text-muted-foreground">
                {product.description || product.short_description}
              </AccordionContent>
            </AccordionItem>
            {product.ingredients && (
              <AccordionItem value="ingredients">
                <AccordionTrigger>Ingredients</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{product.ingredients}</AccordionContent>
              </AccordionItem>
            )}
            {Object.keys(nutrition).length > 0 && (
              <AccordionItem value="nutrition">
                <AccordionTrigger>Nutrition</AccordionTrigger>
                <AccordionContent>
                  <dl className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    {Object.entries(nutrition).map(([key, value]) => (
                      <div key={key} className="flex justify-between border-b border-border/60 py-1">
                        <dt className="capitalize">{key.replace(/_/g, " ")}</dt>
                        <dd>{String(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </AccordionContent>
              </AccordionItem>
            )}
            <AccordionItem value="delivery">
              <AccordionTrigger>Delivery &amp; returns</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Nationwide delivery within 2–5 business days. Free over ₦50,000. Unopened items can be returned
                within 7 days.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <p className="eyebrow text-accent">You may also like</p>
          <h2 className="mt-2 font-display text-2xl">More from {product.categories?.name}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <RecentlyViewed products={products} excludeSlug={product.slug} />
    </div>
  );
}
