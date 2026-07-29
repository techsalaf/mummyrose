
CREATE TYPE public.app_role AS ENUM ('admin','staff','customer');
CREATE TYPE public.order_status AS ENUM ('pending','confirmed','processing','shipped','delivered','cancelled');
CREATE TYPE public.payment_status AS ENUM ('unpaid','paid','refunded','failed');
CREATE TYPE public.inquiry_type AS ENUM ('wholesale','export','white_label','corporate','custom_packaging','contact');
CREATE TYPE public.inquiry_status AS ENUM ('new','in_review','responded','closed');

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

-- profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','staff'));
$$;

CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id OR public.is_staff(auth.uid()));
CREATE POLICY "own profile write" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id OR public.is_staff(auth.uid()));
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "roles read" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_staff(auth.uid()));

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer') ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- catalog
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories public read" ON public.categories FOR SELECT USING (is_active);
CREATE POLICY "categories staff manage" ON public.categories FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  short_description TEXT,
  description TEXT,
  image_url TEXT,
  gallery TEXT[] NOT NULL DEFAULT '{}',
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount_price NUMERIC(12,2),
  sku TEXT,
  stock_quantity INT NOT NULL DEFAULT 0,
  low_stock_threshold INT NOT NULL DEFAULT 5,
  ingredients TEXT,
  nutrition JSONB NOT NULL DEFAULT '{}'::jsonb,
  weight_options TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products public read" ON public.products FOR SELECT USING (is_active);
CREATE POLICY "products staff manage" ON public.products FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.inventory_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  change INT NOT NULL,
  reason TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.inventory_logs TO authenticated;
GRANT ALL ON public.inventory_logs TO service_role;
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inventory staff" ON public.inventory_logs FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  address_line TEXT,
  city TEXT,
  state TEXT,
  country TEXT NOT NULL DEFAULT 'Nigeria',
  postal_code TEXT,
  notes TEXT,
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  shipping_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'NGN',
  status public.order_status NOT NULL DEFAULT 'pending',
  payment_status public.payment_status NOT NULL DEFAULT 'unpaid',
  payment_provider TEXT,
  payment_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders own read" ON public.orders FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "orders staff update" ON public.orders FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  variant TEXT,
  unit_price NUMERIC(12,2) NOT NULL,
  quantity INT NOT NULL,
  line_total NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "order items read" ON public.order_items FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR public.is_staff(auth.uid()))));

-- inquiries
CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type public.inquiry_type NOT NULL,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  requirements TEXT,
  message TEXT,
  status public.inquiry_status NOT NULL DEFAULT 'new',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.inquiries TO authenticated;
GRANT ALL ON public.inquiries TO service_role;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inquiries staff" ON public.inquiries FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- content
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  category TEXT,
  kind TEXT NOT NULL DEFAULT 'article',
  author TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT ALL ON public.posts TO service_role;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts public read" ON public.posts FOR SELECT USING (is_published AND (published_at IS NULL OR published_at <= now()));
CREATE POLICY "posts staff" ON public.posts FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  role TEXT,
  quote TEXT NOT NULL,
  rating INT NOT NULL DEFAULT 5,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "testimonials public read" ON public.testimonials FOR SELECT USING (is_published);
CREATE POLICY "testimonials staff" ON public.testimonials FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, DELETE ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "newsletter staff" ON public.newsletter_subscribers FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings public read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "settings staff" ON public.site_settings FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER t_products_u BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER t_categories_u BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER t_orders_u BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER t_posts_u BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER t_inquiries_u BEFORE UPDATE ON public.inquiries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER t_profiles_u BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_order_items_order ON public.order_items(order_id);

-- seed catalog
INSERT INTO public.categories (slug, name, description, sort_order) VALUES
('flours','Flours','Stone-milled natural flours from Nigerian farms.',1),
('seasonings','Seasonings','All-natural seasoning blends, no MSG.',2),
('spices','Spices','Single-origin spices, sun-dried and hand-sorted.',3),
('sweet-savory','Sweet & Savory','Everyday pantry treats with a Nigerian soul.',4),
('tea-infusions','Tea Infusions','Herbal infusions for wellness rituals.',5),
('cereals','Cereals','Wholesome grains and breakfast cereals.',6);

INSERT INTO public.products (slug,name,short_description,description,category_id,price,discount_price,sku,stock_quantity,ingredients,weight_options,tags,is_featured)
SELECT * FROM (VALUES
 ('plantain-flour','Unripe Plantain Flour','Low-glycemic flour for diabetic-friendly swallow.','Stone-milled from carefully selected unripe plantains, sun-dried and packed at source. Rich in fibre and potassium, ideal for a diabetic-friendly swallow.',(SELECT id FROM public.categories WHERE slug='flours'),6500::numeric,5800::numeric,'MR-FL-001',48,'100% unripe plantain.',ARRAY['500g','1kg','2kg'],ARRAY['diabetic-friendly','high-fibre'],true),
 ('ofada-rice-flour','Ofada Rice Flour','Nutty, aromatic flour from native Ofada rice.','Milled from native Ofada rice, this flour brings a nutty aroma to pastries, pancakes and traditional meals.',(SELECT id FROM public.categories WHERE slug='flours'),7200::numeric,NULL::numeric,'MR-FL-002',30,'100% Ofada rice.',ARRAY['500g','1kg'],ARRAY['whole-grain'],false),
 ('signature-jollof-seasoning','Signature Jollof Seasoning','The smoky base behind a perfect party jollof.','A balanced blend of sun-dried tomato, smoked pepper, onion and herbs. No MSG, no fillers.',(SELECT id FROM public.categories WHERE slug='seasonings'),4500::numeric,3900::numeric,'MR-SE-001',120,'Tomato, red pepper, onion, garlic, thyme, bay leaf.',ARRAY['100g','250g'],ARRAY['bestseller','no-msg'],true),
 ('suya-spice','Authentic Suya Spice','Hand-ground yaji with roasted groundnut.','Northern-style yaji, hand-ground with roasted groundnut, ginger and chilli for authentic suya.',(SELECT id FROM public.categories WHERE slug='spices'),3800::numeric,NULL::numeric,'MR-SP-001',90,'Groundnut, ginger, chilli, cloves, salt.',ARRAY['100g','250g'],ARRAY['bestseller'],true),
 ('uziza-ground','Ground Uziza','Peppery West African aromatic.','Sun-dried uziza seeds, milled fresh for pepper soup, stews and broths.',(SELECT id FROM public.categories WHERE slug='spices'),3200::numeric,NULL::numeric,'MR-SP-002',60,'100% uziza seeds.',ARRAY['50g','100g'],ARRAY['aromatic'],false),
 ('hibiscus-ginger-infusion','Hibiscus & Ginger Infusion','Zobo reimagined as a wellness ritual.','Deep crimson hibiscus petals blended with dried ginger for a caffeine-free daily infusion.',(SELECT id FROM public.categories WHERE slug='tea-infusions'),5200::numeric,4600::numeric,'MR-TI-001',75,'Hibiscus petals, dried ginger root.',ARRAY['50g','150g'],ARRAY['wellness','caffeine-free'],true),
 ('moringa-lemongrass-tea','Moringa & Lemongrass Tea','Green, clean and gently energising.','Shade-dried moringa leaves with lemongrass. A clean, mineral-rich daily green infusion.',(SELECT id FROM public.categories WHERE slug='tea-infusions'),5600::numeric,NULL::numeric,'MR-TI-002',54,'Moringa leaf, lemongrass.',ARRAY['50g','150g'],ARRAY['wellness'],false),
 ('tigernut-cereal','Tigernut Breakfast Cereal','Creamy, naturally sweet morning bowl.','Milled tigernut with dates and coconut. Naturally sweet, dairy-free breakfast cereal.',(SELECT id FROM public.categories WHERE slug='cereals'),6800::numeric,6200::numeric,'MR-CE-001',40,'Tigernut, dates, coconut.',ARRAY['400g','800g'],ARRAY['dairy-free'],true),
 ('coconut-chin-chin','Coconut Chin Chin','A crisp, lightly sweet classic.','Hand-cut chin chin baked with coconut and a hint of nutmeg. Small-batch, always fresh.',(SELECT id FROM public.categories WHERE slug='sweet-savory'),3000::numeric,NULL::numeric,'MR-SS-001',4,'Flour, coconut, sugar, nutmeg, butter.',ARRAY['250g','500g'],ARRAY['snack'],false),
 ('peppered-groundnut','Peppered Groundnut','Roasted, spiced and dangerously moreish.','Roasted groundnuts tossed in Mummy Rose chilli blend. The perfect savoury snack.',(SELECT id FROM public.categories WHERE slug='sweet-savory'),2800::numeric,NULL::numeric,'MR-SS-002',66,'Groundnut, chilli, salt.',ARRAY['200g','500g'],ARRAY['snack'],false)
) AS v;

INSERT INTO public.testimonials (author, role, quote, sort_order) VALUES
('Adaeze Nwosu','Home cook, Lagos','The jollof seasoning changed my kitchen. My family can taste the difference between real spice and shortcuts.',1),
('Chef Tunde Bakare','Executive Chef, Abuja','We source Mummy Rose spices for the restaurant. Consistent quality, clean sourcing, always on time.',2),
('Grace Ibrahim','Wholesale partner, Houston TX','Export documentation was seamless and the packaging survived the journey beautifully. Our shelves sell out.',3);

INSERT INTO public.posts (slug,title,excerpt,content,category,kind,author,is_published,published_at,is_featured) VALUES
('perfect-party-jollof','The Perfect Party Jollof','Smoky, deep and unmistakably Nigerian — here is our house method.','Start with a base of blended red pepper, tomato and onion reduced slowly until the raw edge disappears. Add Mummy Rose Signature Jollof Seasoning, then parboiled long grain rice. Cover with foil, cook low, and let the bottom catch just slightly — that is where the smoke lives.','Recipes','recipe','Mummy Rose Kitchen',true,now(),true),
('zobo-wellness-ritual','Zobo, Reimagined','A calmer, less sugary way to enjoy Nigeria''s favourite drink.','Steep two tablespoons of our Hibiscus & Ginger Infusion in hot water for eight minutes. Chill, add a squeeze of lime and a touch of honey. No refined sugar required.','Wellness','recipe','Mummy Rose Kitchen',true,now(),false),
('why-plantain-flour','Why Plantain Flour Belongs In Your Pantry','Low glycemic, high fibre, and endlessly versatile.','Unripe plantain flour has long been a staple for households managing blood sugar. Beyond swallow, it works in pancakes, flatbreads and thickening stews.','Nutrition','article','Mummy Rose Kitchen',true,now(),false);

INSERT INTO public.site_settings (key, value) VALUES
('contact','{"phone":"+234 800 000 0000","email":"hello@mummyrose.com","whatsapp":"2348000000000","address":"Lagos, Nigeria","instagram":"https://instagram.com/mummyrose"}'::jsonb),
('home_hero','{"eyebrow":"Rooted in Nigerian soil","title":"Spices, flours and infusions made the honest way","subtitle":"Small-batch, naturally sourced pantry essentials from Nigeria to the world.","cta_label":"Shop the collection","cta_href":"/products"}'::jsonb),
('shipping','{"flat_fee":2500,"free_over":50000}'::jsonb);
