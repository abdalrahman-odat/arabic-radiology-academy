
CREATE TABLE public.link_clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  link_name TEXT NOT NULL,
  link_category TEXT NOT NULL DEFAULT 'cta',
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.link_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert link_clicks" ON public.link_clicks FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can read link_clicks" ON public.link_clicks FOR SELECT TO public USING (true);

CREATE TABLE public.page_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL DEFAULT '/',
  referrer TEXT,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert page_visits" ON public.page_visits FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can read page_visits" ON public.page_visits FOR SELECT TO public USING (true);
