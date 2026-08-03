-- 1. Manager role
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'manager';

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role::text IN ('admin','staff','manager'));
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role::text = 'admin');
$$;

-- 2. Product reviews
CREATE TABLE public.product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name text NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title text,
  body text,
  is_approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX product_reviews_product_idx ON public.product_reviews(product_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_reviews TO authenticated;
GRANT SELECT ON public.product_reviews TO anon;
GRANT ALL ON public.product_reviews TO service_role;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved reviews are public" ON public.product_reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Authors read own reviews" ON public.product_reviews FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Staff read all reviews" ON public.product_reviews FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Signed-in users write reviews" ON public.product_reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authors edit own reviews" ON public.product_reviews FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id AND is_approved = false);
CREATE POLICY "Staff manage reviews" ON public.product_reviews FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER product_reviews_updated_at BEFORE UPDATE ON public.product_reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Customer address book
CREATE TABLE public.customer_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label text NOT NULL DEFAULT 'Home',
  full_name text NOT NULL,
  phone text NOT NULL,
  address_line text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  country text NOT NULL DEFAULT 'Nigeria',
  postal_code text,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX customer_addresses_user_idx ON public.customer_addresses(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customer_addresses TO authenticated;
GRANT ALL ON public.customer_addresses TO service_role;
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own addresses" ON public.customer_addresses FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER customer_addresses_updated_at BEFORE UPDATE ON public.customer_addresses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Banners / landing-page sections
CREATE TABLE public.banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  placement text NOT NULL DEFAULT 'home_hero',
  title text NOT NULL,
  subtitle text,
  body text,
  image_url text,
  cta_label text,
  cta_href text,
  theme text NOT NULL DEFAULT 'default',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  starts_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.banners TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.banners TO authenticated;
GRANT ALL ON public.banners TO service_role;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active banners are public" ON public.banners FOR SELECT USING (is_active = true);
CREATE POLICY "Staff manage banners" ON public.banners FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER banners_updated_at BEFORE UPDATE ON public.banners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Admin notifications
CREATE TABLE public.admin_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL,
  title text NOT NULL,
  body text,
  href text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX admin_notifications_created_idx ON public.admin_notifications(created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_notifications TO authenticated;
GRANT ALL ON public.admin_notifications TO service_role;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read notifications" ON public.admin_notifications FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff update notifications" ON public.admin_notifications FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff delete notifications" ON public.admin_notifications FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

CREATE OR REPLACE FUNCTION public.notify_admins()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF TG_TABLE_NAME = 'orders' THEN
    INSERT INTO public.admin_notifications (kind, title, body, href)
    VALUES ('order', 'New order ' || NEW.order_number, NEW.customer_name || ' — ' || NEW.currency || ' ' || NEW.total, '/admin/orders');
  ELSIF TG_TABLE_NAME = 'inquiries' THEN
    INSERT INTO public.admin_notifications (kind, title, body, href)
    VALUES ('inquiry', 'New ' || NEW.type::text || ' inquiry', NEW.name || ' (' || NEW.email || ')', '/admin/inquiries');
  ELSIF TG_TABLE_NAME = 'wholesale_accounts' THEN
    INSERT INTO public.admin_notifications (kind, title, body, href)
    VALUES ('wholesale', 'Wholesale application: ' || NEW.company, NEW.contact_name || ' (' || NEW.email || ')', '/admin/wholesale');
  ELSIF TG_TABLE_NAME = 'product_reviews' THEN
    INSERT INTO public.admin_notifications (kind, title, body, href)
    VALUES ('review', 'New review awaiting approval', NEW.author_name || ' rated ' || NEW.rating || '/5', '/admin/reviews');
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER orders_notify AFTER INSERT ON public.orders FOR EACH ROW EXECUTE FUNCTION public.notify_admins();
CREATE TRIGGER inquiries_notify AFTER INSERT ON public.inquiries FOR EACH ROW EXECUTE FUNCTION public.notify_admins();
CREATE TRIGGER wholesale_notify AFTER INSERT ON public.wholesale_accounts FOR EACH ROW EXECUTE FUNCTION public.notify_admins();
CREATE TRIGGER reviews_notify AFTER INSERT ON public.product_reviews FOR EACH ROW EXECUTE FUNCTION public.notify_admins();

-- 6. Admins manage roles
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

ALTER PUBLICATION supabase_realtime ADD TABLE public.product_reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE public.customer_addresses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.banners;
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_notifications;

INSERT INTO public.banners (placement, title, subtitle, cta_label, cta_href, sort_order) VALUES
  ('home_promo', 'Free delivery over ₦50,000', 'Nationwide dispatch within 48 hours on every pantry order.', 'Shop the pantry', '/products', 0),
  ('home_promo', 'Bulk & wholesale pricing', 'Tiered trade discounts for restaurants, retailers and exporters.', 'Apply for trade', '/wholesale', 1);