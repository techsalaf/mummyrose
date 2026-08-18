# Mummy Rose — Engineering Audit & Production Hardening

> Status: initial audit + first P0/P1 hardening batch. This reflects a forensic
> review of `src/`, `supabase/`, configuration, RLS, payment, checkout, delivery,
> inventory and authorization code.

Stack: **TanStack Start (React 19) + Vite, Supabase (Postgres + RLS)**, deployed to
Vercel. Payment providers: Paystack + Flutterwave (server-initiated redirect).

---

## Current Architecture

- **Storefront** served from TanStack Start routes (SSG/SSR), Supabase via a
  browser anon client for public reads and server functions (`createServerFn`)
  for mutations/payments.
- **Admin** is a route group under `/admin`, gated client-side by `useAuth` +
  `user_roles`, with a generic `ResourceManager` CRUD table and Supabase
  browser-client calls for all admin reads/writes. Database RLS is the real
  authorization boundary.
- **Cart** is client-side (localStorage). Prices are re-derived **server-side**
  from the DB at order creation — the browser never sets prices.
- **Payments**: server creates the order, deducts stock, redirects to
  Paystack/Flutterwave; gateway webhooks + a `/payment-callback` verify step
  mark orders paid (`payment_transactions` table).
- **Delivery** pricing read from `site_settings.shipping` (zones + flat fee).

## What Is Already Working (verified in code)

- Server-side order pricing/stock validation — client cannot invent prices.
- Paystack/Flutterwave webhook **signature validation** (`timingSafeEqual`).
- Reasonable RLS: staff vs customer separation on orders/products/settings;
  `payments` settings row is **excluded from public read** (migration present).
- Coupon validation is re-done server-side at order creation.
- Vibrant CMS/SEO surface (settings, pages, banners, JSON-LD, sitemap, robots).

## What Is Partially Implemented

- Paystack is functional but configured **only via `.env`** — no admin UI.
- Delivery zones are edited as **raw JSON** in the admin.
- Order lifecycle statuses exist but reconciliation UI/refunds are minimal.
- RBAC is coarse (`admin`/`manager`/`staff`/`customer`), no fine-grained
  permissions, and staff management requires pasting a technical user ID.

## What Is Broken

- **Inventory leak (P0):** stock is deducted at order creation for unpaid orders
  but never restored when payment fails/cancels.
- **Non-atomic stock decrement (P0):** a read-then-write race can oversell stock
  into the negative.
- **`manager` role blocked at `/admin` (P1):** client `isStaff` ignored `manager`
  while DB `is_staff` includes it — an authorized manager can't use the console.
- Coupon `used_count` is billed at order creation and never returned on failure.

## What Is Insecure / Needs Hardening

- No fine-grained authorization: any staff member can edit products, orders,
  settings and delete records (coarse `is_staff` gate only).
- Payment confirmation did not verify the gateway amount against the order total.
- `.env` is **not** in `.gitignore` (currently only non-secret values, but risky).

## What Was Fixed in This Batch (P0/P1)

1. **Inventory integrity**
   - New `adjust_product_stock(uuid, int, text)` SQL function: row-locked,
     refuses negative stock, logs every change inside one transaction.
   - `createOrder` uses it (atomic reserve) and rolls back the order on failure.
   - `markFailed` and an admin `cancelOrder` now **restore reserved stock
     idempotently** via a `stock_restored` marker — duplicate/late webhooks can't
     double-restore.
2. **Payment integrity**
   - `markPaid` now reconciles the gateway-reported amount against the order
     total before confirming; mismatches mark the order failed.
   - Paystack secret can be configured from the admin: stored **encrypted at
     rest** (AES-256-GCM), never returned to the browser, with a safe
     **Test Connection**.
3. **Delivery UX** — removed the JSON textarea; replaced with a visual
   **Delivery Zones editor** (add/edit/delete/enable per-zone fee, coverage and
   optional free-over). `shipping.ts` now honours per-zone enable + free-over.
4. **RBAC correctness** — `useAuth` now treats `manager` as staff; sensitive
   payment/order admin actions are gated **server-side** via `requireStaff()`.
5. **Human-centered Team & Roles** — the Team & Roles page no longer requires
   pasting a raw user ID. It now searches people by name/email (`profiles`),
   shows readable role badges/descriptions, and grants/edits/revokes access with
   a people picker + role radio groups, plus "last admin" lockout protection.
6. **Audit logging** — new `admin_audit_logs` table + `logAudit()` helper wired
   to payment-config changes and admin cancellations.
7. **Coupon integrity** — coupons are now billed on *successful payment* (with
   idempotency) instead of at order creation, so failed/abandoned checkouts no
   longer burn usage limits.
8. **Stale unpaid sweep + refunds** — `sweepStaleOrders` releases reserved stock
   for 24h+ unpaid card orders; `refundOrder` refunds paid Paystack orders via
   the gateway, both admin-triggered from **Payments & reconciliation**.
9. **Fine-grained RBAC** — new `permissions` + `role_permissions` tables (seeded
   per role), a `has_permission()` DB check, `requirePermission()` (admin
   bypass + pre-migration fallback) enforced on refund/payment-config/order
   functions, and a **role-builder UI** (grouped, readable permission
   checkboxes) on the Team & Roles page.
10. **Admin-configured SMTP mail** — new Settings → Email panel (host/port/TLS/
    username/password/from), password encrypted at rest (shared AES-256-GCM
    secrets module), live "Send test email", and `sendMail()` used by order
    receipts + admin alerts with Resend as fallback. SMTP settings are excluded
    from public reads via RLS.
11. **Order timeline** — the admin order dialog now shows a timeline of
    order placement, gateway payment attempts, and every audited admin action
    (with actor + timestamp).

## Prioritized Roadmap

| Priority | Item |
|---|---|
| P0 | ✅ Inventory restore + atomic stock; ✅ server-side staff gate; ✅ amount reconcile |
| P1 | ✅ Human-centered Team & Roles UI (search, picker, last-admin guard) |
| P1 | ✅ Coupon billed on successful payment (idempotent), not at creation |
| P1 | ✅ Admin order updates via `adminUpdateOrder` (restock on cancel/fail; admin+audit to mark paid/refunded) |
| P1 | ✅ Payments & reconciliation page (ledger, filters, re-verify) |
| P1 | ✅ Stale unpaid card orders sweep (release stock) + Paystack refund workflow |
| P1 | ✅ Fine-grained **permissions**: catalog, role→permission mapping, `has_permission`, role-builder UI, enforcement on server functions |
| P1 | Auto-expire stale unpaid orders (scheduled sweep) + refund workflow UI |
| P1 | ✅ Address-book default selection + checkout prefill (verified present) |
| P1 | ✅ Admin-configured **SMTP** mail with panel + test send |
| P2 | Dashboard/reporting (sales, AOV, top products, low-stock) |
| P2 | Customer notifications (email via SMTP/Resend) + ✅ admin order timeline |
| P3 | Search autocomplete, product reviews moderation polish, media validation |
| P3 | `.env` hardened + remove publishable-key hardcoded fallbacks to Config |

## Production Readiness Notes

- Deploy the migration **with** the code changes (order code calls
  `adjust_product_stock`). Add `PAYMENT_ENCRYPTION_KEY` in production; without
  it the config derives a key from the service-role env (functional but rotate
  for defense in depth).
- Rotate `PAYSTACK_SECRET_KEY` if it was ever committed; it is now optionally
  stored encrypted in DB. Keep env fallback only as bootstrap.