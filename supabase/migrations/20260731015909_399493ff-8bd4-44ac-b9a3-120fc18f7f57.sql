-- 1. analytics
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  path text,
  referrer text,
  session_id text,
  product_id uuid,
  value numeric,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.analytics_events TO anon, authenticated;
GRANT SELECT ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "analytics anyone insert" ON public.analytics_events FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "analytics staff read" ON public.analytics_events FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE INDEX IF NOT EXISTS analytics_events_created_at_idx ON public.analytics_events (created_at DESC);

-- 2. wholesale accounts
CREATE TABLE IF NOT EXISTS public.wholesale_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  company text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text,
  country text,
  monthly_volume text,
  tier text NOT NULL DEFAULT 'bronze',
  discount_percent numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wholesale_accounts TO authenticated;
GRANT ALL ON public.wholesale_accounts TO service_role;
ALTER TABLE public.wholesale_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wholesale own read" ON public.wholesale_accounts FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "wholesale own insert" ON public.wholesale_accounts FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "wholesale staff update" ON public.wholesale_accounts FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "wholesale staff delete" ON public.wholesale_accounts FOR DELETE TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE TRIGGER update_wholesale_accounts_updated_at BEFORE UPDATE ON public.wholesale_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. payment transactions
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  provider text NOT NULL,
  reference text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'NGN',
  status text NOT NULL DEFAULT 'pending',
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS payment_transactions_reference_idx ON public.payment_transactions (reference);
GRANT SELECT ON public.payment_transactions TO authenticated;
GRANT ALL ON public.payment_transactions TO service_role;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "payments staff read" ON public.payment_transactions FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON public.payment_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. admin management policies
CREATE POLICY "orders staff insert" ON public.orders FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "orders staff delete" ON public.orders FOR DELETE TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "order items staff write" ON public.order_items FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "order items staff update" ON public.order_items FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "order items staff delete" ON public.order_items FOR DELETE TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "roles admin insert" ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "roles admin delete" ON public.user_roles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 5. newsletter uniqueness (needed for upsert)
CREATE UNIQUE INDEX IF NOT EXISTS newsletter_subscribers_email_idx ON public.newsletter_subscribers (lower(email));

-- 6. realtime
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.order_items REPLICA IDENTITY FULL;
ALTER TABLE public.inquiries REPLICA IDENTITY FULL;
ALTER TABLE public.products REPLICA IDENTITY FULL;
ALTER TABLE public.wholesale_accounts REPLICA IDENTITY FULL;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.inquiries;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.wholesale_accounts;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 7. default settings
INSERT INTO public.site_settings (key, value) VALUES
  ('store', '{"name":"Mummy Rose","email":"hello@mummyrose.com","phone":"+2348000000000","address":"Lagos, Nigeria","currency":"NGN"}'::jsonb),
  ('shipping', '{"flat_fee":2500,"free_over":50000,"international_fee":25000,"zones":[{"name":"Lagos","fee":2000,"states":["Lagos"]},{"name":"South West","fee":3000,"states":["Ogun","Oyo","Osun","Ondo","Ekiti"]},{"name":"Abuja & North","fee":4000,"states":["FCT","Abuja","Kaduna","Kano","Niger","Plateau"]}]}'::jsonb),
  ('payments', '{"paystack_enabled":true,"flutterwave_enabled":true,"bank_transfer_enabled":true,"pay_on_delivery_enabled":true,"bank_name":"","account_name":"Mummy Rose Foods","account_number":""}'::jsonb),
  ('whatsapp', '{"enabled":true,"phone":"2348000000000"}'::jsonb),
  ('seo', '{"title":"Mummy Rose — Premium Nigerian Pantry","description":"Premium Nigerian food staples, spices and pantry essentials delivered nationwide.","keywords":"nigerian food, spices, pantry, wholesale"}'::jsonb)
ON CONFLICT (key) DO NOTHING;