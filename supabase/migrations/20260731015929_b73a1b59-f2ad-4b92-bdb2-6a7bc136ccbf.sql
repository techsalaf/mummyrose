DROP POLICY IF EXISTS "analytics anyone insert" ON public.analytics_events;

ALTER TABLE public.analytics_events
  ADD CONSTRAINT analytics_events_name_check CHECK (name IN (
    'page_view','product_view','add_to_cart','begin_checkout','order_placed','whatsapp_order','search','newsletter_signup','inquiry'
  )),
  ADD CONSTRAINT analytics_events_path_len CHECK (path IS NULL OR length(path) <= 300),
  ADD CONSTRAINT analytics_events_referrer_len CHECK (referrer IS NULL OR length(referrer) <= 300),
  ADD CONSTRAINT analytics_events_session_len CHECK (session_id IS NULL OR length(session_id) <= 64),
  ADD CONSTRAINT analytics_events_meta_len CHECK (length(meta::text) <= 2000);

CREATE POLICY "analytics visitors record known events" ON public.analytics_events
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    name IN ('page_view','product_view','add_to_cart','begin_checkout','order_placed','whatsapp_order','search','newsletter_signup','inquiry')
    AND created_at >= now() - interval '5 minutes'
    AND (value IS NULL OR (value >= 0 AND value <= 100000000))
  );