import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ProductGrid } from "@/components/product-grid";
import { categoriesQuery, productsQuery } from "@/lib/queries";
import { categoryImage } from "@/lib/catalog-images";

export const Route = createFileRoute("/category/$slug")({
  loader: async ({ context, params }) => {
    const categories = await context.queryClient.ensureQueryData(categoriesQuery);
    context.queryClient.ensureQueryData(productsQuery);
    const category = categories.find((c) => c.slug === params.slug);
    if (!category) throw notFound();
    return { name: category.name, description: category.description };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Category not found — Mummy Rose" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.name} — Mummy Rose Natural Nigerian Pantry`;
    const description =
      loaderData.description ?? `Shop natural, small-batch ${loaderData.name.toLowerCase()} from Mummy Rose.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-3xl">Category not found</h1>
      <Link to="/products" className="mt-4 inline-block text-sm underline">
        Browse all products
      </Link>
    </div>
  ),
  errorComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-3xl">This category didn't load</h1>
    </div>
  ),
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const { data: categories } = useSuspenseQuery(categoriesQuery);
  const { data: products } = useSuspenseQuery(productsQuery);
  const category = categories.find((c) => c.slug === slug);
  const inCategory = products.filter((p) => p.category_id === category?.id);

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-ink-foreground">
        <img
          src={category?.image_url || categoryImage(slug)}
          alt={category?.name ?? slug}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="relative container-page py-20">
          <nav className="text-xs text-ink-foreground/60">
            <Link to="/" className="hover:text-gold">
              Home
            </Link>
            <span className="px-2">/</span>
            <Link to="/products" className="hover:text-gold">
              Products
            </Link>
            <span className="px-2">/</span>
            <span>{category?.name}</span>
          </nav>
          <h1 className="mt-4 font-display text-4xl md:text-6xl">{category?.name}</h1>
          {category?.description && (
            <p className="mt-4 max-w-xl text-ink-foreground/80">{category.description}</p>
          )}
        </div>
      </section>

      <div className="container-page py-12 md:py-16">
        <ProductGrid products={inCategory} showCategoryFilter={false} />
      </div>
    </>
  );
}
