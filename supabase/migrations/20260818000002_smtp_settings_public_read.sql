-- =============================================================================
-- Mummy Rose — Restrict public read of the SMTP settings row
-- =============================================================================
-- The `smtp` settings row contains encrypted credentials; like `payments`, it
-- must never be readable by anonymous users or ordinary customers. Only staff
-- (via the "settings staff" policy) and the service role can access it.
-- The storefront reads public keys (branding, shipping, seo) — those are unchanged.

DROP POLICY IF EXISTS "settings public read" ON public.site_settings;

CREATE POLICY "settings public read"
  ON public.site_settings
  FOR SELECT
  USING (key NOT IN ('payments', 'smtp'));