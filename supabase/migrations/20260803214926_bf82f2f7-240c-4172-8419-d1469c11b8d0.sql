DROP POLICY IF EXISTS "settings public read" ON public.site_settings;

CREATE POLICY "settings public read" ON public.site_settings
FOR SELECT
USING (key <> 'payments');

REVOKE EXECUTE ON FUNCTION public.claim_admin() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.claim_admin() FROM anon;