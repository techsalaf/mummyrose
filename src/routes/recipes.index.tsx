import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { postsQuery } from "@/lib/queries";
import { formatDate } from "@/lib/format";
import { categoryImage } from "@/lib/catalog-images";

export const Route = createFileRoute("/recipes/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(postsQuery);
  },
  head: () => ({
    meta: [
      { title: "Recipes & Journal — Cooking with Mummy Rose" },
      {
        name: "description",
        content:
          "Nigerian recipes, cooking guides and stories from the Mummy Rose kitchen — how to use our spices, flours and infusions.",
      },
      { property: "og:title", content: "Recipes & Journal — Mummy Rose" },
      { property: "og:description", content: "Nigerian recipes and cooking guides from the Mummy Rose kitchen." },
    ],
  }),
  component: RecipesPage,
});

function RecipesPage() {
  const { data: posts } = useSuspenseQuery(postsQuery);
  const [featured, ...rest] = posts;

  return (
    <div className="container-page py-12 md:py-16">
      <p className="eyebrow text-accent">Kitchen journal</p>
      <h1 className="mt-3 font-display text-4xl md:text-5xl">Recipes &amp; stories</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Ways to cook with our pantry — from weeknight jollof to herbal infusions and slow Sunday stews.
      </p>

      {posts.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">New recipes are on the way.</p>
      ) : (
        <>
          {featured && (
            <Link
              to="/recipes/$slug"
              params={{ slug: featured.slug }}
              className="group mt-10 grid gap-6 overflow-hidden rounded-lg md:grid-cols-2"
            >
              <img
                src={featured.cover_image || categoryImage(featured.category)}
                alt={featured.title}
                className="aspect-[4/3] w-full rounded-lg object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="flex flex-col justify-center">
                <p className="eyebrow text-accent">{featured.category ?? featured.kind}</p>
                <h2 className="mt-3 font-display text-3xl leading-tight">{featured.title}</h2>
                <p className="mt-3 text-muted-foreground">{featured.excerpt}</p>
                <p className="mt-4 text-xs text-muted-foreground">
                  {featured.author ?? "Mummy Rose"} · {formatDate(featured.published_at)}
                </p>
              </div>
            </Link>
          )}

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <Link key={post.id} to="/recipes/$slug" params={{ slug: post.slug }} className="group">
                <img
                  src={post.cover_image || categoryImage(post.category)}
                  alt={post.title}
                  className="aspect-[4/3] w-full rounded-lg object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  loading="lazy"
                />
                <p className="eyebrow mt-4 text-accent">{post.category ?? post.kind}</p>
                <h2 className="mt-2 font-display text-xl leading-snug">{post.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                <p className="mt-3 text-xs text-muted-foreground">{formatDate(post.published_at)}</p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
