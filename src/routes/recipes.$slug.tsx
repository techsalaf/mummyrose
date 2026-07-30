import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { JsonLd } from "@/components/json-ld";
import { postQuery } from "@/lib/queries";
import { formatDate } from "@/lib/format";
import { categoryImage } from "@/lib/catalog-images";

export const Route = createFileRoute("/recipes/$slug")({
  loader: async ({ context, params }) => {
    const post = await context.queryClient.ensureQueryData(postQuery(params.slug));
    if (!post) throw notFound();
    return {
      title: post.seo_title ?? post.title,
      description: post.seo_description ?? post.excerpt ?? "",
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Article unavailable — Mummy Rose" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.title} — Mummy Rose`;
    const description = loaderData.description || "A recipe from the Mummy Rose kitchen.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: RecipeDetail,
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-3xl">Article not found</h1>
      <Link to="/recipes" className="mt-4 inline-block text-sm underline">
        Back to the journal
      </Link>
    </div>
  ),
  errorComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-3xl">This article didn't load</h1>
    </div>
  ),
});

function RecipeDetail() {
  const { slug } = Route.useParams();
  const { data: post } = useSuspenseQuery(postQuery(slug));
  if (!post) return null;

  return (
    <article className="container-page max-w-3xl py-12 md:py-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": post.kind === "recipe" ? "Recipe" : "Article",
          headline: post.title,
          description: post.excerpt ?? undefined,
          author: { "@type": "Organization", name: post.author ?? "Mummy Rose" },
          datePublished: post.published_at ?? undefined,
        }}
      />
      <nav className="text-xs text-muted-foreground">
        <Link to="/recipes" className="hover:text-accent">
          Recipes &amp; journal
        </Link>
      </nav>
      <p className="eyebrow mt-6 text-accent">{post.category ?? post.kind}</p>
      <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">{post.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {post.author ?? "Mummy Rose"} · {formatDate(post.published_at)}
      </p>
      <img
        src={post.cover_image || categoryImage(post.category)}
        alt={post.title}
        className="mt-8 aspect-[16/9] w-full rounded-lg object-cover"
      />
      {post.excerpt && <p className="mt-8 font-display text-xl leading-relaxed">{post.excerpt}</p>}
      <div className="mt-6 leading-relaxed whitespace-pre-line text-muted-foreground">{post.content}</div>
    </article>
  );
}
