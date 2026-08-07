import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Clock, Search, UtensilsCrossed } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NewsletterForm } from "@/components/newsletter-form";
import { categoryImage } from "@/lib/catalog-images";
import { formatDate } from "@/lib/format";
import { contentCategories, contentPath, formatMinutes, readingMinutes, totalMinutes } from "@/lib/content";
import type { PostListRow } from "@/lib/queries";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 9;

function PostMeta({ post, kind }: { post: PostListRow; kind: "recipe" | "article" }) {
  const cookTime = formatMinutes(totalMinutes(post.prep_minutes, post.cook_minutes));
  const read = `${readingMinutes(null, post.reading_minutes)} min read`;
  return (
    <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
      <span>{formatDate(post.published_at)}</span>
      {kind === "recipe" && cookTime ? (
        <span className="inline-flex items-center gap-1">
          <Clock aria-hidden className="size-3" /> {cookTime}
        </span>
      ) : null}
      {kind === "recipe" && post.servings ? (
        <span className="inline-flex items-center gap-1">
          <UtensilsCrossed aria-hidden className="size-3" /> Serves {post.servings}
        </span>
      ) : null}
      {kind === "article" && post.reading_minutes ? <span>{read}</span> : null}
    </p>
  );
}

function PostCard({ post, kind }: { post: PostListRow; kind: "recipe" | "article" }) {
  return (
    <article className="group h-full">
      <Link to={contentPath(post.kind, post.slug)} className="flex h-full flex-col">
        <div className="overflow-hidden rounded-sm bg-linen">
          <img
            src={post.cover_image || categoryImage(post.category)}
            alt={post.title}
            width={800}
            height={600}
            loading="lazy"
            className="aspect-4/3 w-full object-cover transition-transform duration-[1200ms] ease-editorial group-hover:scale-[1.05]"
          />
        </div>
        {post.category ? <p className="eyebrow mt-4 text-accent">{post.category}</p> : null}
        <h3 className="mt-2 font-display text-xl leading-snug group-hover:text-accent">{post.title}</h3>
        {post.excerpt ? <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p> : null}
        <PostMeta post={post} kind={kind} />
      </Link>
    </article>
  );
}

/**
 * Shared index experience for /recipes and /blog: featured lead, keyword
 * search, category filtering and load-more paging over one content table.
 */
export function ContentIndex({
  kind,
  posts,
  eyebrow,
  title,
  intro,
  emptyMessage,
  crumbLabel,
}: {
  kind: "recipe" | "article";
  posts: PostListRow[];
  eyebrow: string;
  title: string;
  intro: string;
  emptyMessage: string;
  crumbLabel: string;
}) {
  const [term, setTerm] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const categories = useMemo(() => contentCategories(posts), [posts]);

  const filtered = useMemo(() => {
    const needle = term.trim().toLowerCase();
    return posts.filter((post) => {
      if (category && post.category !== category) return false;
      if (!needle) return true;
      return [post.title, post.excerpt, post.category, ...(post.tags ?? [])]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(needle));
    });
  }, [posts, term, category]);

  const isFiltering = Boolean(term.trim() || category);
  const featured = !isFiltering ? (filtered.find((p) => p.is_featured) ?? filtered[0]) : undefined;
  const rest = filtered.filter((p) => p.id !== featured?.id);
  const shown = rest.slice(0, visible);

  return (
    <div className="container-page py-10 md:py-16">
      <Breadcrumbs items={[{ label: crumbLabel }]} />

      <header className="mt-6 max-w-2xl">
        <p className="eyebrow text-accent">{eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">{title}</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">{intro}</p>
      </header>

      <div className="mt-8 flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search aria-hidden className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={term}
            onChange={(event) => {
              setTerm(event.target.value);
              setVisible(PAGE_SIZE);
            }}
            placeholder={kind === "recipe" ? "Search recipes, ingredients…" : "Search articles, guides…"}
            aria-label={kind === "recipe" ? "Search recipes" : "Search articles"}
            className="pl-9"
          />
        </div>
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            <button
              type="button"
              onClick={() => {
                setCategory(null);
                setVisible(PAGE_SIZE);
              }}
              aria-pressed={category === null}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs tracking-wide uppercase transition-colors",
                category === null
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary",
              )}
            >
              All
            </button>
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setCategory(item === category ? null : item);
                  setVisible(PAGE_SIZE);
                }}
                aria-pressed={category === item}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs tracking-wide uppercase transition-colors",
                  category === item
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-display text-2xl">{isFiltering ? "Nothing matched that search" : emptyMessage}</p>
          {isFiltering && (
            <Button
              variant="outline"
              className="mt-5"
              onClick={() => {
                setTerm("");
                setCategory(null);
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <>
          {featured && (
            <Reveal>
              <Link
                to={contentPath(featured.kind, featured.slug)}
                className="group mt-10 grid items-center gap-8 md:grid-cols-2"
              >
                <div className="overflow-hidden rounded-sm bg-linen">
                  <img
                    src={featured.cover_image || categoryImage(featured.category)}
                    alt={featured.title}
                    width={1200}
                    height={900}
                    className="aspect-4/3 w-full object-cover transition-transform duration-[1200ms] ease-editorial group-hover:scale-[1.04]"
                  />
                </div>
                <div>
                  <p className="eyebrow text-accent">{featured.category ?? "Featured"}</p>
                  <h2 className="mt-3 font-display text-3xl leading-tight md:text-4xl group-hover:text-accent">
                    {featured.title}
                  </h2>
                  {featured.excerpt ? (
                    <p className="mt-4 leading-relaxed text-muted-foreground">{featured.excerpt}</p>
                  ) : null}
                  <PostMeta post={featured} kind={kind} />
                  <span className="mt-5 inline-block text-sm underline underline-offset-4">
                    {kind === "recipe" ? "Read the recipe" : "Read the article"}
                  </span>
                </div>
              </Link>
            </Reveal>
          )}

          {shown.length > 0 && (
            <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((post, index) => (
                <Reveal key={post.id} delay={Math.min(index, 3) * 60}>
                  <PostCard post={post} kind={kind} />
                </Reveal>
              ))}
            </div>
          )}

          {rest.length > visible && (
            <div className="mt-12 text-center">
              <Button variant="outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                Load more
              </Button>
            </div>
          )}
        </>
      )}

      <section className="mt-20 rounded-sm bg-linen px-6 py-12 text-center md:px-16">
        <p className="eyebrow text-accent">The pantry letter</p>
        <h2 className="mt-3 font-display text-2xl md:text-3xl">New recipes and guides, straight to your inbox</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          Cooking notes, ingredient guides and restocks. No noise.
        </p>
        <div className="mx-auto mt-6 max-w-md">
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
