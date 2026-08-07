import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { ContentIndex } from "@/components/content/content-index";
import { recipesQuery } from "@/lib/queries";

const TITLE = "Nigerian Recipes & Cooking Guides — Mummy Rose";
const DESCRIPTION =
  "Everyday Nigerian recipes and cooking guides from the Mummy Rose kitchen — how to cook with our spices, stone-milled flours and herbal infusions.";

export const Route = createFileRoute("/recipes/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(recipesQuery),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
    ],
  }),
  component: RecipesPage,
});

function RecipesPage() {
  const { data: recipes } = useSuspenseQuery(recipesQuery);

  return (
    <ContentIndex
      kind="recipe"
      posts={recipes}
      crumbLabel="Recipes"
      eyebrow="From the kitchen"
      title="Recipes for everyday Nigerian cooking"
      intro="Weeknight jollof, slow Sunday stews, baking with stone-milled flours and quiet herbal infusions — each one written around ingredients you can actually find."
      emptyMessage="New recipes are on the way."
    />
  );
}
