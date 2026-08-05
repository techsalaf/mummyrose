import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { Reveal } from "@/components/reveal";
import lifestyleTable from "@/assets/lifestyle-table.jpg";
import { formatDate } from "@/lib/format";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  category: string | null;
  published_at: string | null;
};

/** Journal & recipes strip — one lead story plus a stacked reading list. */
export function JournalStrip({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;
  const [lead, ...rest] = posts.slice(0, 4);

  return (
    <section className="py-20 md:py-32">
      <div className="container-wide">
        <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow flex items-center gap-3 text-muted-foreground">
              <span className="h-px w-8 bg-olive" />
              Journal &amp; recipes
            </p>
            <h2 className="display-lg mt-5 max-w-[22ch] text-balance">
              Cook the way our kitchens do
            </h2>
          </div>
          <Link
            to="/recipes"
            className="link-underline shrink-0 text-[11px] tracking-[0.24em] text-primary uppercase"
          >
            All recipes &amp; stories
          </Link>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <Link to="/recipes/$slug" params={{ slug: lead.slug }} className="group block">
              <div className="grain overflow-hidden rounded-sm">
                <img
                  src={lead.cover_image || lifestyleTable}
                  alt={lead.title}
                  loading="lazy"
                  className="aspect-16/10 w-full object-cover transition-transform duration-[1400ms] ease-editorial group-hover:scale-[1.05]"
                />
              </div>
              <p className="mt-6 flex items-center gap-4 text-[10px] tracking-[0.24em] text-muted-foreground uppercase">
                {lead.category || "Recipe"}
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3" /> {formatDate(lead.published_at)}
                </span>
              </p>
              <h3 className="mt-4 font-display text-3xl leading-tight transition-colors group-hover:text-primary md:text-4xl">
                {lead.title}
              </h3>
              <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">{lead.excerpt}</p>
            </Link>
          </Reveal>

          <div className="flex flex-col lg:col-span-5">
            {rest.map((post, i) => (
              <Reveal key={post.id} delay={i * 90}>
                <Link
                  to="/recipes/$slug"
                  params={{ slug: post.slug }}
                  className="group flex items-center gap-5 border-t border-border py-6 first:border-t-0 first:pt-0 lg:first:pt-0"
                >
                  <div className="size-24 shrink-0 overflow-hidden rounded-sm bg-linen">
                    <img
                      src={post.cover_image || lifestyleTable}
                      alt={post.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-1000 ease-editorial group-hover:scale-110"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] tracking-[0.24em] text-muted-foreground uppercase">
                      {post.category || "Journal"}
                    </p>
                    <h3 className="mt-2 font-display text-xl leading-snug transition-colors group-hover:text-primary">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
