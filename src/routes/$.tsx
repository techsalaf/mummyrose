import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { pageQuery } from "@/lib/cms-queries";
import { CmsPage } from "@/components/cms-page";
import { Button } from "@/components/ui/button";

/**
 * Catch-all: serves any CMS page published from /admin/pages at its own top
 * level URL, and falls back to a branded 404 when no page matches.
 */
export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex" }],
  }),
  component: CatchAll,
});

function CatchAll() {
  const { _splat } = Route.useParams();
  const slug = (_splat ?? "").replace(/^\/+|\/+$/g, "");
  const { data, isLoading } = useQuery({ ...pageQuery(slug), enabled: slug.length > 0 });

  if (slug && isLoading) {
    return (
      <div className="container-page grid min-h-[50vh] place-items-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (data) return <CmsPage slug={slug} eyebrow="Mummy Rose" />;

  return (
    <div className="container-page grid min-h-[60vh] max-w-xl place-items-center py-16 text-center">
      <div>
        <p className="eyebrow text-accent">404</p>
        <h1 className="mt-4 font-display text-4xl">This page has moved out of the pantry</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          The link you followed no longer exists. Try the shop, or ask us and we&rsquo;ll point you
          straight to it.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="rounded-sm tracking-[0.18em] uppercase">
            <Link to="/products">Shop the pantry</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-sm tracking-[0.18em] uppercase">
            <Link to="/contact">Contact us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
