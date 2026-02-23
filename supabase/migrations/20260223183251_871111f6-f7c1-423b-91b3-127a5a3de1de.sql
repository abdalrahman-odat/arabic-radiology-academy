
-- Create site_settings table for dynamic academy info
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create courses table
CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  price text NOT NULL,
  duration text NOT NULL DEFAULT '',
  start_date text NOT NULL DEFAULT '',
  total_seats integer NOT NULL DEFAULT 40,
  stats text,
  certification text,
  whatsapp_message text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Public read for both tables
CREATE POLICY "Anyone can read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can read courses" ON public.courses FOR SELECT USING (true);

-- Allow updates/inserts/deletes (admin will use client-side password for now)
CREATE POLICY "Allow update site_settings" ON public.site_settings FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow insert site_settings" ON public.site_settings FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update courses" ON public.courses FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow insert courses" ON public.courses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow delete courses" ON public.courses FOR DELETE USING (true);

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.courses;
