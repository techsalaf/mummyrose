import { Link } from "@tanstack/react-router";

import { categoryImage } from "@/lib/catalog-images";
import { formatDate } from "@/lib/format";
import { contentPath } from "@/lib/content";
import type { PostListRow } from "@/lib/queries";

/** Compact "keep reading" rail used at the foot of recipe and article pages. */
export function RelatedContent({ posts, heading }: { posts: PostListRow[]; heading: string }) {
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="related-content" className="mt-16 border-t border-border pt-12">
      <h2 id="related-content" className="font-display text-2xl md:text-3xl">
        {heading}
      </h2>
      <div className="mt-8 grid gap-8 sm:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} to={contentPath(post.kind, post.slug)} className="group">
            <div className="overflow-hidden rounded-sm bg-linen">
              <img
                src={post.cover_image || categoryImage(post.category)}
                alt={post.title}
                width={600}
                height={450}
                loading="lazy"
                className="aspect-4/3 w-full object-cover transition-transform duration-[1200ms] ease-editorial group-hover:scale-[1.05]"
              />
            </div>
            {post.category ? <p className="eyebrow mt-3 text-accent">{post.category}</p> : null}
            <h3 className="mt-1.5 font-display text-lg leading-snug group-hover:text-accent">{post.title}</h3>
            <p className="mt-1.5 text-xs text-muted-foreground">{formatDate(post.published_at)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
