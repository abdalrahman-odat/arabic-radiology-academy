
ALTER TABLE public.testimonials ADD COLUMN is_approved boolean NOT NULL DEFAULT false;

-- Allow updates (for admin approval)
CREATE POLICY "Allow updates on testimonials" ON public.testimonials FOR UPDATE USING (true) WITH CHECK (true);

-- Allow deletes (for admin rejection)
CREATE POLICY "Allow deletes on testimonials" ON public.testimonials FOR DELETE USING (true);
