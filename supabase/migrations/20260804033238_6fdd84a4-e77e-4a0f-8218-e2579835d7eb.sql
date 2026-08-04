CREATE POLICY "inquiries authenticated submit" ON public.inquiries FOR INSERT TO authenticated WITH CHECK (true);
GRANT INSERT ON public.inquiries TO authenticated;