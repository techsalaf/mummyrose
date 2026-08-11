import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { ChefHat, Clock, Timer, UtensilsCrossed, ShoppingBag, Check } from "lucide-react";
import { toast } from "sonner";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { RichText } from "@/components/rich-text";
import { ShareButtons } from "@/components/share-buttons";
import { RelatedProducts } from "@/components/content/related-products";
import { RelatedContent } from "@/components/content/related-content";
import { useCanonicalOverride } from "@/components/canonical";
import { Button } from "@/components/ui/button";
import { postQuery, recipesQuery, relatedProductsQuery } from "@/lib/queries";
import { categoryImage, productImage } from "@/lib/catalog-images";
import { formatDate, effectivePrice } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { absoluteUrl, formatMinutes, isoDuration, relatedContent, totalMinutes } from "@/lib/content";
import { useSiteConfig } from "@/lib/site-config";

export const Route = createFileRoute("/recipes/$slug")({
  loader: async ({ context, params }) => {
    const post = await context.queryClient.ensureQueryData(postQuery(params.slug));
    if (!post) throw notFound();
    // Articles live under /blog — keep one canonical home per piece of content.
    if (post.kind !== "recipe") throw redirect({ to: "/blog/$slug", params: { slug: params.slug } });
    void context.queryClient.ensureQueryData(recipesQuery);
    return {
      title: post.seo_title ?? post.title,
      description: post.seo_description ?? post.excerpt ?? "",
      keywords: post.seo_keywords ?? "",
      image: post.cover_image ?? "",
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Recipe unavailable — Mummy Rose" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.title} — Mummy Rose`;
    const description = loaderData.description || "A recipe from the Mummy Rose kitchen.";
    const image = loaderData.image?.startsWith("http") ? loaderData.image : "";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        ...(loaderData.keywords ? [{ name: "keywords", content: loaderData.keywords }] : []),
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        ...(image
          ? [
              { property: "og:image", content: image },
              { name: "twitter:image", content: image },
            ]
          : []),
      ],
    };
  },
  component: RecipeDetail,
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-3xl">Recipe not found</h1>
      <p className="mt-3 text-sm text-muted-foreground">This recipe may have been renamed or unpublished.</p>
      <Link to="/recipes" className="mt-6 inline-block text-sm underline underline-offset-4">
        Browse all recipes
      </Link>
    </div>
  ),
  errorComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-3xl">This recipe didn't load</h1>
      <Link to="/recipes" className="mt-6 inline-block text-sm underline underline-offset-4">
        Back to recipes
      </Link>
    </div>
  ),
});

function StatCard({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 border-l border-border pl-4">
      <Icon aria-hidden className="size-4 text-accent" />
      <div>
        <p className="text-[0.7rem] tracking-wide text-muted-foreground uppercase">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function RecipeDetail() {
  const { slug } = Route.useParams();
  const { data: post } = useSuspenseQuery(postQuery(slug));
  const { data: allRecipes = [] } = useQuery(recipesQuery);
  const { data: recipeProducts = [] } = useQuery(relatedProductsQuery(post?.related_product_ids));
  const { addItem } = useCart();
  const { seo } = useSiteConfig();
  useCanonicalOverride(post?.canonical_url);

  const handleAddRecipeProducts = () => {
    if (recipeProducts.length === 0) return;
    for (const prod of recipeProducts) {
      addItem({
        product_id: prod.id,
        slug: prod.slug,
        name: prod.name,
        image: productImage(prod),
        unit_price: effectivePrice(prod),
        variant: prod.weight_options?.[0] ?? null,
      });
    }
    toast.success(`Added ${recipeProducts.length} Mummy Rose ingredients to your cart!`);
  };

  if (!post) return null;

  const ingredients = post.ingredients ?? [];
  const instructions = post.instructions ?? [];
  const tips = post.tips ?? [];
  const total = totalMinutes(post.prep_minutes, post.cook_minutes);
  const image = post.cover_image || categoryImage(post.category);
  const url = absoluteUrl(seo.site_url, `/recipes/${post.slug}`);
  const related = relatedContent(allRecipes, { id: post.id, category: post.category });
  const hasRecipeData = ingredients.length > 0 || instructions.length > 0;

  return (
    <article className="container-page py-8 md:py-14">
      <JsonLd
        data={
          hasRecipeData
            ? {
                "@context": "https://schema.org",
                "@type": "Recipe",
                name: post.title,
                url,
                image: image?.startsWith("http") ? [image] : undefined,
                description: post.excerpt ?? undefined,
                author: { "@type": "Organization", name: post.author ?? "Mummy Rose" },
                datePublished: post.published_at ?? undefined,
                dateModified: post.updated_at ?? undefined,
                recipeCategory: post.category ?? undefined,
                recipeCuisine: "Nigerian",
                keywords: post.seo_keywords ?? ((post.tags ?? []).join(", ") || undefined),
                prepTime: isoDuration(post.prep_minutes),
                cookTime: isoDuration(post.cook_minutes),
                totalTime: isoDuration(total),
                recipeYield: post.servings ?? undefined,
                recipeIngredient: ingredients.length ? ingredients : undefined,
                recipeInstructions: instructions.length
                  ? instructions.map((step, index) => ({
                      "@type": "HowToStep",
                      position: index + 1,
                      text: step,
                    }))
                  : undefined,
              }
            : {
                "@context": "https://schema.org",
                "@type": "Article",
                headline: post.title,
                url,
                description: post.excerpt ?? undefined,
                author: { "@type": "Organization", name: post.author ?? "Mummy Rose" },
                datePublished: post.published_at ?? undefined,
                dateModified: post.updated_at ?? undefined,
              }
        }
      />

      <Breadcrumbs items={[{ label: "Recipes", href: "/recipes" }, { label: post.title }]} />

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="max-w-2xl">
          {post.category ? <p className="eyebrow text-accent">{post.category}</p> : null}
          <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">{post.title}</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            By {post.author ?? "Mummy Rose"} · {formatDate(post.published_at)}
          </p>
          {post.excerpt ? (
            <p className="mt-6 font-display text-xl leading-relaxed text-foreground/90">{post.excerpt}</p>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {hasRecipeData && (
              <Button asChild variant="default">
                <a href="#recipe">Jump to recipe</a>
              </Button>
            )}
            <ShareButtons title={post.title} url={url} showPrint={hasRecipeData} />
          </div>
        </div>

        <div className="overflow-hidden rounded-sm bg-linen lg:sticky lg:top-28">
          <img
            src={image}
            alt={post.title}
            width={1200}
            height={900}
            className="aspect-4/3 w-full object-cover"
          />
        </div>
      </div>

      {(post.prep_minutes || post.cook_minutes || post.servings || post.difficulty) && (
        <div className="mt-12 grid gap-6 border-y border-border py-6 sm:grid-cols-2 lg:grid-cols-4">
          {post.prep_minutes ? (
            <StatCard icon={Timer} label="Prep" value={formatMinutes(post.prep_minutes) ?? "—"} />
          ) : null}
          {post.cook_minutes ? (
            <StatCard icon={Clock} label="Cook" value={formatMinutes(post.cook_minutes) ?? "—"} />
          ) : null}
          {post.servings ? <StatCard icon={UtensilsCrossed} label="Serves" value={post.servings} /> : null}
          {post.difficulty ? <StatCard icon={ChefHat} label="Difficulty" value={post.difficulty} /> : null}
        </div>
      )}

      {post.content ? (
        <div className="mt-12 max-w-2xl">
          <RichText content={post.content} className="leading-relaxed text-muted-foreground" />
        </div>
      ) : null}

      {hasRecipeData && (
        <div id="recipe" className="mt-16 scroll-mt-28 rounded-sm bg-linen p-6 md:p-10">
          <p className="eyebrow text-accent">The recipe</p>
          <h2 className="mt-2 font-display text-2xl md:text-3xl">{post.title}</h2>
          <div className="mt-8 grid gap-10 md:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
            {ingredients.length > 0 && (
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="font-display text-lg">Ingredients</h3>
                  {recipeProducts.length > 0 && (
                    <Button
                      size="xs"
                      onClick={handleAddRecipeProducts}
                      className="gap-1 font-semibold text-[11px] h-7 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
                    >
                      <ShoppingBag className="size-3" /> Add All to Cart
                    </Button>
                  )}
                </div>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {ingredients.map((item, index) => (
                    <li key={index} className="flex gap-3 border-b border-border/60 pb-2.5">
                      <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                {recipeProducts.length > 0 && (
                  <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-3.5">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                      Mummy Rose Pantry Match
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      {recipeProducts.length} essential product{recipeProducts.length !== 1 ? "s" : ""} used in this recipe available in our store.
                    </p>
                    <Button
                      size="sm"
                      onClick={handleAddRecipeProducts}
                      className="w-full gap-2 font-semibold shadow-xs"
                    >
                      <ShoppingBag className="size-4" /> Add All Recipe Products to Cart
                    </Button>
                  </div>
                )}
              </div>
            )}
            {instructions.length > 0 && (
              <div>
                <h3 className="font-display text-lg">Method</h3>
                <ol className="mt-4 space-y-5 text-sm leading-relaxed">
                  {instructions.map((step, index) => (
                    <li key={index} className="flex gap-4">
                      <span className="font-display text-xl text-accent" aria-hidden>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="pt-1">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {tips.length > 0 && (
            <div className="mt-10 border-t border-border pt-6">
              <h3 className="font-display text-lg">Tips from the kitchen</h3>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                {tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {post.serving_suggestions ? (
            <div className="mt-8 border-t border-border pt-6">
              <h3 className="font-display text-lg">Serving suggestions</h3>
              <RichText
                content={post.serving_suggestions}
                className="mt-2 text-sm leading-relaxed text-muted-foreground"
              />
            </div>
          ) : null}
        </div>
      )}

      <RelatedProducts
        ids={post.related_product_ids}
        heading="Shop this recipe"
        blurb="The exact Mummy Rose products used in this recipe."
      />
      <RelatedContent posts={related} heading="More recipes to try" />

      <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
        <Link to="/recipes" className="text-sm underline underline-offset-4 hover:text-accent">
          ← All recipes
        </Link>
        <Link to="/blog" className="text-sm underline underline-offset-4 hover:text-accent">
          Read ingredient guides →
        </Link>
      </div>
    </article>
  );
}
