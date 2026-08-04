DROP POLICY IF EXISTS "Authors edit own reviews" ON public.product_reviews;
CREATE POLICY "Authors edit own pending reviews"
ON public.product_reviews
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND is_approved = false)
WITH CHECK (auth.uid() = user_id AND is_approved = false);