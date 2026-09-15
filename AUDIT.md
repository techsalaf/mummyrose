# Mummy Rose: Storefront and CMS Engineering Audit

> Date: September 2026
> Scope: Codebase audit of `src/`, `supabase/`, database schema, checkout flows, payment processing, packaging variants, delivery calculation, inventory integrity, order dispatch, and administrative CMS.
> Core Business: Direct-to-consumer and wholesale sales of natural Nigerian spices, seasonings, stone-milled flours, and herbal infusions.
> Stack: TanStack Start (React 19, TypeScript), Vite, Nitro (Vercel target), Supabase (PostgreSQL, Row Level Security, Auth, Storage).

---

## 1. System Architecture

- **Storefront**: Built on TanStack Start with SSR and route loaders. Public reads execute against Supabase using the browser client, with server functions (`createServerFn`) handling server-side computations, mutations, and gateway interactions.
- **Database and Access Boundary**: Supabase PostgreSQL with Row Level Security (RLS). Server-side mutations run through `supabaseAdmin` (service role) inside isolated server modules.
- **Administrative CMS**: Located under `/admin`. Gated client-side via `useAuth` with server-side validation via `requireStaff()` and `requirePermission()`.
- **Payment Infrastructure**: Server-initiated redirect to Paystack and Flutterwave, direct bank transfer instructions, and WhatsApp manual ordering. Webhooks verify signatures using `crypto.timingSafeEqual`. Gateway secrets use AES-256-GCM encryption at rest.
- **Inventory Engine**: Row-locked database stock decrement via `adjust_product_stock(uuid, int, text)` with idempotent restock markers (`stock_restored`) on cancelled orders.

---

## 2. Business Model Requirements vs Current Implementation

Mummy Rose is a specialized pantry and spice business. Spice e-commerce has domain-specific requirements that differ from generic retail:

### 2.1 Spice Packaging and Weight Variants (Critical Defect)
- **Requirement**: Spices sell in multiple packaging sizes (e.g. 50g sample, 100g pouch, 250g jar, 500g pouch, 1kg bulk bag). Larger sizes command higher prices and track distinct stock units.
- **Current State in Code**:
  - In `src/routes/products.$slug.tsx:99`, `product.weight_options` is merely a string array of display tags. Choosing a packaging weight updates a local state string `chosen`, but line 94 uses `effectivePrice(product)` which is the base product price.
  - Selecting a 1kg bag charges the customer the 100g base price.
  - In `src/lib/orders.server.ts:67`, `createOrder()` queries `products.price` and ignores `item.variant` during price calculation.
  - The database contains a `product_variants` table (`id`, `product_id`, `label`, `sku`, `price`, `discount_price`, `stock_quantity`, `is_active`), but this table is omitted from `productQuery` in `src/lib/queries.ts:4` and is disconnected from the storefront checkout.
  - In the admin, variants are edited in an isolated screen (`/admin/variants`) using a raw table rather than inside the product editor (`/admin/products`).

### 2.2 Direct Bank Transfer Workflow
- **Requirement**: Direct bank transfer is widely preferred in Nigeria. Customers need clear transfer instructions (Bank Name, Account Number, Account Name) at checkout and on the order confirmation screen. The merchant needs a way to confirm payment and link transfer references.
- **Current State in Code**:
  - `src/routes/checkout.tsx:88` permits selecting `bank_transfer`.
  - However, no official store bank account details are rendered. The text only states that details will be shown later.
  - On `/order-confirmed` (`src/routes/order-confirmed.tsx`), no bank details appear.
  - In `src/routes/admin.settings.tsx`, there is no panel for Mummy Rose to configure her official bank account (Bank Name, Account Number, Account Name).
  - In `src/routes/admin.orders.tsx`, marking an order as paid requires opening a status dropdown without recording the bank teller or transaction reference.

### 2.3 Order Fulfilment, Dispatch and Waybill Tracking
- **Requirement**: Spices are shipped via local logistics (GIG Logistics, DHL, state transport waybills, dispatch riders). Mummy Rose needs to assign couriers, input tracking or waybill numbers, and notify the customer. A physical packing slip or invoice is needed inside the shipping parcel.
- **Current State in Code**:
  - The `orders` table lacks `courier_name` and `tracking_number` columns.
  - In `src/routes/admin.orders.tsx`, the order dialog has no fields for courier or waybill details.
  - The customer tracking page (`src/routes/track-order.tsx`) displays fulfilment status but cannot display courier tracking links or waybill numbers.
  - No printable packing slip or order invoice exists. Packing orders requires reading details from the admin screen.
  - The WhatsApp button on `/admin/orders` sends an order summary but lacks a dedicated "Order Dispatched" template containing tracking details.

### 2.4 Recipe and Cooking Interlinking
- **Requirement**: Culinary usage drives spice sales. Recipes (Suya beef skewers, Nigerian Jollof, Pepper soup, Fried rice) should link directly to the specific spice blends used, allowing 1-click cart addition.
- **Current State in Code**:
  - `src/routes/recipes.$slug.tsx:100` supports `handleAddRecipeProducts()`, which adds associated ingredients to the cart.
  - However, in `src/routes/admin.posts.tsx`, the recipe editor lacks a product picker. Staff must manually edit JSON arrays or type IDs to attach spices to recipes.

### 2.5 Operational Simplicity for Mummy Rose
- **Requirement**: The store owner needs a clean, approachable console. Complex database operations must be abstracted into straightforward forms.
- **Current State in Code**:
  - Several admin pages rely on `ResourceManager`, exposing raw JSON inputs (e.g. `nutrition` in `src/routes/admin.products.tsx:42`).
  - Stock restocking in `src/routes/admin.inventory.tsx:61` executes updates directly from the browser client rather than routing through the row-locked server RPC `adjust_product_stock`.

---

## 3. Verified Working Features

The following components were forensically verified in the code:

1. **Server-Side Pricing Integrity** (`src/lib/orders.server.ts:67`):
   Order totals and line items are derived from database records during server execution. Client requests cannot set or alter product prices.
2. **Atomic Inventory Reservation** (`supabase/migrations/20260815000001_mummy_rose_inventory_payment_hardening.sql:60`):
   `adjust_product_stock` executes with row-level locks (`FOR UPDATE`), checks available quantities, refuses negative inventory balances, and logs each change in `inventory_logs`.
3. **Idempotent Stock Restoration** (`src/lib/orders.server.ts:250`):
   Orders contain a `stock_restored` boolean flag. If payment cancels or fails, reserved inventory is restored exactly once, avoiding duplicate additions from multiple webhook attempts.
4. **Gateway Webhook Authentication** (`src/lib/payments.server.ts:160`):
   Paystack and Flutterwave webhooks validate digital signatures using `crypto.timingSafeEqual` against configured secrets.
5. **Encrypted Secret Storage** (`src/lib/secrets.server.ts:18`):
   Payment gateway secret keys and SMTP passwords are encrypted using AES-256-GCM before writing to `site_settings`. They are excluded from public client queries via RLS policies.
6. **Coupon Integrity** (`src/lib/coupons.server.ts:15`):
   Coupons validate minimum subtotal and active dates server-side. Usage limits are only incremented upon confirmed payment.
7. **Email Delivery** (`src/lib/smtp.server.ts:55`):
   Supports custom SMTP connections (host, port, user, TLS) with fallback to Resend. Includes test-send capabilities.
8. **Fine-Grained Role Permissions** (`src/lib/permissions.functions.ts:22`):
   Staff operations are validated against granular permissions (`catalog:write`, `orders:write`, `finance:read`, `settings:write`).

---

## 4. Defect and Vulnerability Register

| Severity | Category | File & Location | Description |
|---|---|---|---|
| **P0** | Pricing & Catalog | `src/routes/products.$slug.tsx:99`, `src/lib/orders.server.ts:67` | Packaging weight selection does not adjust prices. 1kg bags bill at base 100g price. Variant records are ignored by the server order creation. |
| **P1** | Checkout & Payments | `src/routes/checkout.tsx:88`, `src/routes/order-confirmed.tsx:1` | Direct Bank Transfer does not display store bank details. Customers have no account number or transfer guidelines. |
| **P1** | Settings CMS | `src/routes/admin.settings.tsx:100` | No settings panel for Mummy Rose to input official bank details (Bank Name, Account Number, Account Name). |
| **P1** | Fulfilment | `src/routes/admin.orders.tsx:350`, `src/routes/track-order.tsx:70` | No courier name or waybill tracking fields on orders. Customer tracking page cannot show tracking codes. |
| **P1** | Operations | `src/routes/admin.orders.tsx:390` | Missing printable invoice / packing slip view for packing parcels. |
| **P1** | Inventory | `src/routes/admin.inventory.tsx:61` | Inventory adjustments in the admin execute client-side updates instead of calling the server RPC `adjust_product_stock`. |
| **P2** | CMS & Content | `src/routes/admin.posts.tsx:30` | Recipes cannot easily link to catalog spices without technical product ID inputs. |
| **P2** | Customer Care | `src/routes/admin.orders.tsx:402` | WhatsApp message helper only sends generic order receipts, lacking a dedicated dispatch notice. |

---

## 5. Implementation Roadmap

### Phase 1: Product Variants and Packaging Pricing (P0)
1. Update `productQuery` in `src/lib/queries.ts` to include active `product_variants`.
2. Connect variant selection in `src/routes/products.$slug.tsx` so changing weights updates active price, discount price, SKU, and stock.
3. Update `useCart` in `src/lib/cart.tsx` to include `variant_id`.
4. Update `createOrder` in `src/lib/orders.server.ts` to fetch variant records, compute line totals from variant prices, and adjust variant-level inventory.
5. Embed a visual variant manager directly inside `src/routes/admin.products.tsx`.

### Phase 2: Bank Transfer and Payment Settings (P1)
1. Add `bank_account` settings group in `src/lib/site-config.ts` and create an editor tab in `src/routes/admin.settings.tsx` (Bank Name, Account Name, Account Number, Transfer Instructions).
2. Display configured bank details on `/checkout` when bank transfer is selected, and on `/order-confirmed`.
3. Add a "Verify Bank Transfer" action in `src/routes/admin.orders.tsx` with reference notes and audit logging.

### Phase 3: Fulfilment, Dispatch and Packing Slips (P1)
1. Add `courier_name`, `tracking_number`, and `dispatched_at` fields to `orders` (via migration).
2. Add courier dispatch inputs inside the admin order details dialog in `src/routes/admin.orders.tsx`.
3. Display courier name and waybill tracking on `/track-order` (`src/routes/track-order.tsx`).
4. Build a printable Packing Slip / Receipt dialog in `src/routes/admin.orders.tsx`.
5. Add a 1-click WhatsApp "Order Dispatched" message trigger.

### Phase 4: Inventory and CMS Refinement (P1/P2)
1. Route `/admin/inventory` adjustments through a server function calling `adjust_product_stock`.
2. Add a spice product selector to `src/routes/admin.posts.tsx` for recipe ingredients.
3. Add dietary badges (100% Natural, No MSG, Preservative Free, Halal) to spice cards and detail views.