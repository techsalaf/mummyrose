import { Link } from "@tanstack/react-router";
import { Clock, ArrowRight, Utensils, ShoppingBag } from "lucide-react";
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

export function JournalStrip({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;
  const [lead, ...rest] = posts.slice(0, 4);

  return (
    <section className="py-20 md:py-32 bg-secondary/30 border-b border-border/60">
      <div className="container-wide">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-1 text-xs font-semibold text-primary uppercase border border-border/80">
              <Utensils className="size-3.5 text-accent" />
              <span>Recipes &amp; Kitchen Ideas</span>
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl mt-3">
              Cook Something Memorable
            </h2>
          </div>
          <Link
            to="/recipes"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            <span>Explore All Recipes</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          {/* Main Recipe Card */}
          <Reveal className="lg:col-span-7">
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg transition-all duration-400 hover:shadow-xl">
              <Link to="/recipes/$slug" params={{ slug: lead.slug }} className="block hover-zoom-img relative aspect-16/10 w-full bg-muted">
                <img
                  src={lead.cover_image || lifestyleTable}
                  alt={lead.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="eyebrow text-accent-foreground uppercase tracking-widest">
                    {lead.category || "Featured Recipe"}
                  </span>
                  <h3 className="font-display text-2xl sm:text-4xl font-bold text-white mt-1 leading-snug">
                    {lead.title}
                  </h3>
                </div>
              </Link>

              <div className="p-6">
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {lead.excerpt}
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-between border-t border-border/60 pt-4 gap-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="size-4" />
                    <span>{formatDate(lead.published_at)}</span>
                  </div>

                  <Link
                    to="/products"
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-2 text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <ShoppingBag className="size-3.5" />
                    <span>Shop Featured Ingredient</span>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Secondary Recipe List */}
          <div className="flex flex-col gap-4 lg:col-span-5">
            {rest.map((post, i) => (
              <Reveal key={post.id} delay={i * 90}>
                <div className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-xs transition-all hover:shadow-md hover:border-primary/40">
                  <Link to="/recipes/$slug" params={{ slug: post.slug }} className="hover-zoom-img size-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <img
                      src={post.cover_image || lifestyleTable}
                      alt={post.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold tracking-widest text-accent uppercase">
                      {post.category || "Recipe"}
                    </span>
                    <Link to="/recipes/$slug" params={{ slug: post.slug }}>
                      <h4 className="font-display text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary line-clamp-2 mt-0.5">
                        {post.title}
                      </h4>
                    </Link>
                    <Link
                      to="/products"
                      className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                    >
                      <span>Shop Spice</span> <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

