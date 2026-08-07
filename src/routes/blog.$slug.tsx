import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { useSuspenseQuery, useQuery } from "@tanstack/react-query";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { RichText } from "@/components/rich-text";
import { ShareButtons } from "@/components/share-buttons";
import { RelatedProducts } from "@/components/content/related-products";
import { RelatedContent } from "@/components/content/related-content";
import { useCanonicalOverride } from "@/components/canonical";
import { articlesQuery, postQuery } from "@/lib/queries";
import { categoryImage } from "@/lib/catalog-images";
import { formatDate } from "@/lib/format";
import { absoluteUrl, extractHeadings, readingMinutes, relatedContent } from "@/lib/content";
import { useSiteConfig } from "@/lib/site-config";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ context, params }) => {
    const post = await context.queryClient.ensureQueryData(postQuery(params.slug));
    if (!post) throw notFound();
    // Recipes live under /recipes — keep one canonical home per piece of content.
    if (post.kind === "recipe") throw redirect({ to: "/recipes/$slug", params: { slug: params.slug } });
    void context.queryClient.ensureQueryData(articlesQuery);
    return {
      title: post.seo_title ?? post.title,
      description: post.seo_description ?? post.excerpt ?? "",
      keywords: post.seo_keywords ?? "",
      image: post.cover_image ?? "",
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Article unavailable — Mummy Rose" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.title} — Mummy Rose`;
    const description = loaderData.description || "A guide from the Mummy Rose journal.";
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
  component: ArticleDetail,
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-3xl">Article not found</h1>
      <p className="mt-3 text-sm text-muted-foreground">This article may have been renamed or unpublished.</p>
      <Link to="/blog" className="mt-6 inline-block text-sm underline underline-offset-4">
        Browse the journal
      </Link>
    </div>
  ),
  errorComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="font-display text-3xl">This article didn't load</h1>
      <Link to="/blog" className="mt-6 inline-block text-sm underline underline-offset-4">
        Back to the journal
      </Link>
    </div>
  ),
});

function ArticleDetail() {
  const { slug } = Route.useParams();
  const { data: post } = useSuspenseQuery(postQuery(slug));
  const { data: allArticles = [] } = useQuery(articlesQuery);
  const { seo } = useSiteConfig();
  useCanonicalOverride(post?.canonical_url);

  if (!post) return null;

  const image = post.cover_image || categoryImage(post.category);
  const url = absoluteUrl(seo.site_url, `/blog/${post.slug}`);
  const headings = extractHeadings(post.content);
  const minutes = readingMinutes(post.content, post.reading_minutes);
  const related = relatedContent(allArticles, { id: post.id, category: post.category });

  return (
    <article className="container-page py-8 md:py-14">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          url,
          description: post.excerpt ?? undefined,
          image: image?.startsWith("http") ? [image] : undefined,
          articleSection: post.category ?? undefined,
          keywords: post.seo_keywords ?? ((post.tags ?? []).join(", ") || undefined),
          author: { "@type": "Organization", name: post.author ?? "Mummy Rose" },
          publisher: { "@type": "Organization", name: "Mummy Rose" },
          datePublished: post.published_at ?? undefined,
          dateModified: post.updated_at ?? undefined,
        }}
      />

      <Breadcrumbs items={[{ label: "Journal", href: "/blog" }, { label: post.title }]} />

      <header className="mt-6 max-w-3xl">
        {post.category ? <p className="eyebrow text-accent">{post.category}</p> : null}
        <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">{post.title}</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          By {post.author ?? "Mummy Rose"} · {formatDate(post.published_at)} · {minutes} min read
        </p>
        {post.updated_at && post.published_at && post.updated_at.slice(0, 10) !== post.published_at.slice(0, 10) ? (
          <p className="mt-1 text-xs text-muted-foreground">Updated {formatDate(post.updated_at)}</p>
        ) : null}
      </header>

      <div className="mt-8 overflow-hidden rounded-sm bg-linen">
        <img src={image} alt={post.title} width={1600} height={900} className="aspect-16/9 w-full object-cover" />
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
        <div className="max-w-2xl">
          {post.excerpt ? (
            <p className="font-display text-xl leading-relaxed text-foreground/90">{post.excerpt}</p>
          ) : null}
          <RichText content={post.content} className="mt-6 leading-relaxed text-muted-foreground" />

          {(post.tags ?? []).length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {(post.tags ?? []).map((tag) => (
                <span key={tag} className="rounded-full bg-linen px-3 py-1 text-xs text-muted-foreground">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-10 border-t border-border pt-6">
            <ShareButtons title={post.title} url={url} />
          </div>
        </div>

        {headings.length > 2 && (
          <nav aria-label="On this page" className="lg:sticky lg:top-28">
            <p className="eyebrow text-muted-foreground">On this page</p>
            <ul className="mt-4 space-y-2.5 border-l border-border pl-4 text-sm">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <a href={`#${heading.id}`} className="text-muted-foreground transition-colors hover:text-accent">
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      <RelatedProducts
        ids={post.related_product_ids}
        heading="Products mentioned"
        blurb="Everything referenced in this guide, ready to shop."
      />
      <RelatedContent posts={related} heading="Keep reading" />

      <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
        <Link to="/blog" className="text-sm underline underline-offset-4 hover:text-accent">
          ← All articles
        </Link>
        <Link to="/recipes" className="text-sm underline underline-offset-4 hover:text-accent">
          Browse recipes →
        </Link>
      </div>
    </article>
  );
}
