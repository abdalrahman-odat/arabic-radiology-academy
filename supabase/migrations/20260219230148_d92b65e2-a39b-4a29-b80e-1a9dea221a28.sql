
-- Create testimonials/comments table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Anyone can read testimonials
CREATE POLICY "Anyone can read testimonials"
  ON public.testimonials FOR SELECT
  USING (true);

-- Anyone can insert testimonials (public feedback form)
CREATE POLICY "Anyone can insert testimonials"
  ON public.testimonials FOR INSERT
  WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.testimonials;
