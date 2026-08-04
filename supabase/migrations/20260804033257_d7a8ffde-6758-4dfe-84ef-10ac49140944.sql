DROP POLICY IF EXISTS "inquiries authenticated submit" ON public.inquiries;
CREATE POLICY "inquiries authenticated submit own email" ON public.inquiries
  FOR INSERT TO authenticated
  WITH CHECK (lower(email) = lower(auth.jwt() ->> 'email'));

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_admins() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated;