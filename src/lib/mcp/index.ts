import { auth, defineMcp } from "@lovable.dev/mcp-js";

import searchProducts from "./tools/search-products";
import getProduct from "./tools/get-product";
import listMyOrders from "./tools/list-my-orders";
import trackOrder from "./tools/track-order";
import createInquiry from "./tools/create-inquiry";

// The OAuth issuer must be the direct Supabase host: the published runtime URL is
// a proxy that fails the RFC 8414 issuer match. The project ref is inlined by Vite.
const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "mummy-rose-e-commerce-hub",
  title: "Mummy Rose E-commerce Hub",
  version: "1.0.0",
  instructions:
    "Tools for the Mummy Rose store (Nigerian spices, flours and herbal infusions). Use `search_products` and `get_product` to browse the catalogue, `list_my_orders` and `track_order` for the signed-in customer's own orders, and `create_inquiry` to send a wholesale, export, white-label or corporate-supply enquiry to the team.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [searchProducts, getProduct, listMyOrders, trackOrder, createInquiry],
});
