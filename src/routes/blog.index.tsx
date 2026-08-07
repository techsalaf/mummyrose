import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { ContentIndex } from "@/components/content/content-index";
import { articlesQuery } from "@/lib/queries";

const TITLE = "Journal — Spice, Flour & Infusion Guides | Mummy Rose";
const DESCRIPTION =
  "Ingredient guides, cooking tips and food-culture stories from Mummy Rose: how to use Nigerian spices, choose the right flour and brew herbal infusions.";

export const Route = createFileRoute("/blog/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(articlesQuery),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  const { data: articles } = useSuspenseQuery(articlesQuery);

  return (
    <ContentIndex
      kind="article"
      posts={articles}
      crumbLabel="Journal"
      eyebrow="The journal"
      title="Guides, ingredient notes and kitchen stories"
      intro="What each spice actually does, how to store flour in a humid climate, which infusion suits which evening — the practical knowledge behind the pantry."
      emptyMessage="The first articles are being written."
    />
  );
}
