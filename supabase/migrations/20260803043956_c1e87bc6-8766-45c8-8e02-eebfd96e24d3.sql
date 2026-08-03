-- PAGES
CREATE TABLE public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text,
  hero_image text,
  sections jsonb NOT NULL DEFAULT '[]'::jsonb,
  seo_title text,
  seo_description text,
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pages TO authenticated;
GRANT ALL ON public.pages TO service_role;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pages public read" ON public.pages FOR SELECT USING (is_published);
CREATE POLICY "pages staff manage" ON public.pages FOR ALL TO authenticated
  USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER pages_updated_at BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- COUPONS
CREATE TABLE public.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  description text,
  discount_type text NOT NULL DEFAULT 'percent',
  value numeric NOT NULL DEFAULT 0,
  min_subtotal numeric NOT NULL DEFAULT 0,
  max_uses integer,
  used_count integer NOT NULL DEFAULT 0,
  starts_at timestamptz,
  expires_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.coupons TO authenticated;
GRANT ALL ON public.coupons TO service_role;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "coupons staff manage" ON public.coupons FOR ALL TO authenticated
  USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER coupons_updated_at BEFORE UPDATE ON public.coupons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.orders ADD COLUMN coupon_code text;
ALTER TABLE public.orders ADD COLUMN discount_amount numeric NOT NULL DEFAULT 0;

-- PRODUCT VARIANTS
CREATE TABLE public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  label text NOT NULL,
  sku text,
  price numeric NOT NULL DEFAULT 0,
  discount_price numeric,
  stock_quantity integer NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX product_variants_product_id_idx ON public.product_variants(product_id);
GRANT SELECT ON public.product_variants TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_variants TO authenticated;
GRANT ALL ON public.product_variants TO service_role;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "variants public read" ON public.product_variants FOR SELECT USING (is_active);
CREATE POLICY "variants staff manage" ON public.product_variants FOR ALL TO authenticated
  USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER product_variants_updated_at BEFORE UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- REDIRECTS
CREATE TABLE public.redirects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_path text NOT NULL UNIQUE,
  to_path text NOT NULL,
  status_code integer NOT NULL DEFAULT 301,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.redirects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.redirects TO authenticated;
GRANT ALL ON public.redirects TO service_role;
ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "redirects public read" ON public.redirects FOR SELECT USING (is_active);
CREATE POLICY "redirects staff manage" ON public.redirects FOR ALL TO authenticated
  USING (is_staff(auth.uid())) WITH CHECK (is_staff(auth.uid()));
CREATE TRIGGER redirects_updated_at BEFORE UPDATE ON public.redirects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER PUBLICATION supabase_realtime ADD TABLE public.pages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.coupons;
ALTER PUBLICATION supabase_realtime ADD TABLE public.product_variants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.redirects;

-- SEED PAGES
INSERT INTO public.pages (slug, title, subtitle, sections, seo_title, seo_description, sort_order) VALUES
('about', 'Rooted in a Nigerian kitchen', 'Mummy Rose began with one promise: food that tastes like home, prepared with the care of family.',
 '[{"heading":"Our story","body":"What started as small batches milled for family and neighbours grew into a brand trusted by Nigerian homes and diaspora kitchens across the world. Every product carries the same standard we set on day one — clean sourcing, careful milling, honest labelling."},{"heading":"How we source","body":"We buy directly from farming cooperatives across the middle belt and south-east, paying fair prices for produce we can trace. Nothing is bulked out, nothing is padded."},{"heading":"How we process","body":"Sun-dried, sorted by hand, milled in small batches and packed in resealable, food-grade pouches so the aroma survives the journey to your kitchen."},{"heading":"Where we are going","body":"Wholesale, export and white-label partnerships are now a core part of the business, bringing authentic Nigerian staples to shelves and kitchens far beyond Lagos."}]'::jsonb,
 'About Mummy Rose | Authentic Nigerian Food Staples', 'The story behind Mummy Rose — traceable sourcing, small-batch milling and honest Nigerian food staples for homes worldwide.', 1),
('terms', 'Terms of service', 'The agreement between you and Mummy Rose when you shop with us.',
 '[{"heading":"Orders","body":"Placing an order is an offer to buy. We confirm your order by email or WhatsApp once payment is received or, for WhatsApp orders, once we agree the details with you."},{"heading":"Pricing","body":"All prices are in Naira and include applicable levies unless stated. Delivery fees are calculated at checkout from your delivery state."},{"heading":"Delivery","body":"We dispatch within 1-3 working days. Delivery windows depend on your zone and courier. Timelines given at checkout are estimates, not guarantees."},{"heading":"Returns","body":"Because we sell food products, we accept returns only for items that arrive damaged, incorrect or past their best-before date. Contact us within 48 hours of delivery with photos."},{"heading":"Liability","body":"We are not liable for indirect losses. Nothing here limits rights you have under Nigerian consumer law."}]'::jsonb,
 'Terms of Service | Mummy Rose', 'Ordering, pricing, delivery, returns and liability terms for shopping with Mummy Rose.', 2),
('privacy', 'Privacy policy', 'What we collect, why we collect it, and the control you keep.',
 '[{"heading":"What we collect","body":"Your name, email, phone, delivery address and order history. For wholesale and export enquiries we also collect company details and requirements."},{"heading":"Why we collect it","body":"To process and deliver your orders, to support you afterwards, and — only if you opt in — to send occasional recipes and offers."},{"heading":"Payments","body":"Card and transfer payments are handled by our licensed payment partners. We never see or store your full card details."},{"heading":"Sharing","body":"We share only what is necessary with couriers and payment providers. We do not sell your data."},{"heading":"Your control","body":"Ask us any time to see, correct or delete your data, or to unsubscribe. One email is enough."}]'::jsonb,
 'Privacy Policy | Mummy Rose', 'How Mummy Rose collects, uses and protects your personal data when you shop or enquire.', 3);