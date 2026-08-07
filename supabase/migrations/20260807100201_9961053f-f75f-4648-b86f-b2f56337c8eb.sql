ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS seo_keywords text,
  ADD COLUMN IF NOT EXISTS canonical_url text,
  ADD COLUMN IF NOT EXISTS reading_minutes integer,
  ADD COLUMN IF NOT EXISTS prep_minutes integer,
  ADD COLUMN IF NOT EXISTS cook_minutes integer,
  ADD COLUMN IF NOT EXISTS servings text,
  ADD COLUMN IF NOT EXISTS difficulty text,
  ADD COLUMN IF NOT EXISTS ingredients text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS instructions text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS tips text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS serving_suggestions text,
  ADD COLUMN IF NOT EXISTS related_product_ids uuid[] NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS posts_kind_published_idx ON public.posts (kind, is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS posts_category_idx ON public.posts (category);

GRANT SELECT ON public.posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT ALL ON public.posts TO service_role;