import { supabase } from "@/integrations/supabase/client";

export const trackClick = async (linkName: string, category: string = "cta") => {
  try {
    await supabase.from("link_clicks").insert({
      link_name: linkName,
      link_category: category,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
    } as any);
  } catch (e) {
    // silent fail – tracking should never block UX
  }
};

export const trackPageVisit = async (pagePath: string = window.location.pathname) => {
  const sessionId =
    sessionStorage.getItem("aot_session") ||
    (() => {
      const id = crypto.randomUUID();
      sessionStorage.setItem("aot_session", id);
      return id;
    })();

  try {
    await supabase.from("page_visits").insert({
      page_path: pagePath,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      session_id: sessionId,
    } as any);
  } catch (e) {
    // silent
  }
};
