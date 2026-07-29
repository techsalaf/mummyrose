import flours from "@/assets/cat-flours.jpg";
import spices from "@/assets/cat-spices.jpg";
import tea from "@/assets/cat-tea.jpg";
import cereals from "@/assets/cat-cereals.jpg";

/**
 * Fallback imagery per category slug, used until the team uploads
 * product photography through the admin media fields.
 */
const bySlug: Record<string, string> = {
  flours,
  seasonings: spices,
  spices,
  "sweet-savory": cereals,
  "tea-infusions": tea,
  cereals,
};

export function categoryImage(slug?: string | null) {
  return (slug && bySlug[slug]) || spices;
}

export function productImage(
  product: { image_url?: string | null; categories?: { slug?: string | null } | null },
  categorySlug?: string | null,
) {
  return product.image_url || categoryImage(product.categories?.slug ?? categorySlug);
}
