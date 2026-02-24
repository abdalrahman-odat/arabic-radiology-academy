import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteSettings {
  [key: string]: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  start_date: string;
  total_seats: number;
  stats: string | null;
  certification: string | null;
  whatsapp_message: string;
  is_active: boolean;
  sort_order: number;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    const { data } = await supabase.from("site_settings").select("key, value");
    if (data) {
      const map: SiteSettings = {};
      data.forEach((row: any) => { map[row.key] = row.value; });
      setSettings(map);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();

    const channel = supabase
      .channel("site_settings_realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_settings" }, () => {
        fetchSettings();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { settings, loading };
}

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    const { data } = await supabase
      .from("courses")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) setCourses(data as Course[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();

    const channel = supabase
      .channel("courses_realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "courses" }, () => {
        fetchCourses();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { courses, loading, refetch: fetchCourses };
}
