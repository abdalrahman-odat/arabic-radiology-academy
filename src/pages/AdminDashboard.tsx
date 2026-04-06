import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lock, ArrowRight, Save, Plus, Trash2, Check, BarChart3, Users, BookOpen, MessageCircle, Globe, MousePointerClick, Eye, Clock, FileDown, TrendingUp, Smartphone, Monitor, MapPin, Radio } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, CartesianGrid } from "recharts";

const ADMIN_PASSWORD = "aot2025admin";

interface Course {
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
  button_text: string;
  registration_status: string;
}

interface Setting {
  id: string;
  key: string;
  value: string;
}

interface Testimonial {
  id: string;
  name: string;
  content: string;
  rating: number;
  is_approved: boolean;
  created_at: string;
}

interface ClickData {
  link_name: string;
  link_category: string;
  created_at: string;
}

interface VisitData {
  page_path: string;
  referrer: string | null;
  session_id: string | null;
  user_agent: string | null;
  created_at: string;
}

const REFERRER_COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "#06b6d4", "#8b5cf6", "#f59e0b"];

const glassCard = "backdrop-blur-md bg-card/60 border border-border/40 rounded-xl shadow-lg shadow-primary/5";

type TimeRange = "24h" | "30d" | "90d";

const AdminDashboard = () => {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"settings" | "courses" | "comments" | "analytics">("settings");
  const [settings, setSettings] = useState<Setting[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [comments, setComments] = useState<Testimonial[]>([]);
  const [clicks, setClicks] = useState<ClickData[]>([]);
  const [visits, setVisits] = useState<VisitData[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>("90d");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setError("");
    } else {
      setError("كلمة المرور غير صحيحة");
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    const [s, c, t, cl, v] = await Promise.all([
      supabase.from("site_settings").select("*"),
      supabase.from("courses").select("*").order("sort_order"),
      supabase.from("testimonials").select("*").order("created_at", { ascending: false }),
      supabase.from("link_clicks").select("*").order("created_at", { ascending: false }),
      supabase.from("page_visits").select("*").order("created_at", { ascending: false }),
    ]);
    if (s.data) setSettings(s.data as Setting[]);
    if (c.data) setCourses(c.data as Course[]);
    if (t.data) setComments(t.data as Testimonial[]);
    if (cl.data) setClicks(cl.data as ClickData[]);
    if (v.data) setVisits(v.data as VisitData[]);
    setLoading(false);
  };

  useEffect(() => {
    if (authed) fetchAll();
  }, [authed]);

  // Settings handlers
  const updateSetting = async (id: string, value: string) => {
    setSettings(prev => prev.map(s => s.id === id ? { ...s, value } : s));
  };

  const saveSettings = async () => {
    for (const s of settings) {
      await supabase.from("site_settings").update({ value: s.value, updated_at: new Date().toISOString() } as any).eq("id", s.id);
    }
    toast.success("تم حفظ الإعدادات بنجاح");
  };

  // Course handlers
  const updateCourse = (id: string, field: string, value: any) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const saveCourse = async (course: Course) => {
    const { id, ...rest } = course;
    await supabase.from("courses").update({ ...rest, updated_at: new Date().toISOString() } as any).eq("id", id);
    toast.success(`تم حفظ "${course.title}"`);
  };

  const deleteCourse = async (id: string) => {
    await supabase.from("courses").delete().eq("id", id);
    setCourses(prev => prev.filter(c => c.id !== id));
    toast.success("تم حذف الدورة");
  };

  // Comment handlers
  const approveComment = async (id: string) => {
    await supabase.from("testimonials").update({ is_approved: true } as any).eq("id", id);
    setComments(prev => prev.map(c => c.id === id ? { ...c, is_approved: true } : c));
    toast.success("تمت الموافقة");
  };

  const deleteComment = async (id: string) => {
    await supabase.from("testimonials").delete().eq("id", id);
    setComments(prev => prev.filter(c => c.id !== id));
  };

  const settingLabels: Record<string, string> = {
    academy_name: "اسم الأكاديمية",
    instructor_name: "اسم المدرب",
    instructor_bio: "نبذة عن المدرب",
    whatsapp_number: "رقم الواتساب",
    hero_tagline: "شعار الصفحة الرئيسية",
    hero_description: "وصف الصفحة الرئيسية",
    total_students: "عدد الطلاب",
    total_batches: "عدد الدفعات",
  };

  // Time-range filter helper
  const getTimeRangeMs = (range: TimeRange) => {
    const now = Date.now();
    if (range === "24h") return now - 24 * 60 * 60 * 1000;
    if (range === "30d") return now - 30 * 24 * 60 * 60 * 1000;
    return now - 90 * 24 * 60 * 60 * 1000;
  };

  const cutoff = getTimeRangeMs(timeRange);
  const filteredVisits = visits.filter(v => new Date(v.created_at).getTime() >= cutoff);
  const filteredClicks = clicks.filter(c => new Date(c.created_at).getTime() >= cutoff);
  const filteredComments = comments.filter(c => new Date(c.created_at).getTime() >= getTimeRangeMs("90d"));

  // Analytics computed
  const uniqueVisitors = new Set(filteredVisits.map(v => v.session_id)).size;
  const totalPageViews = filteredVisits.length;

  // Growth percentage (this month vs previous 2 months average)
  const now = Date.now();
  const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
  const prevMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).getTime();
  const prev2MonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1).getTime();
  const visitsThisMonth = visits.filter(v => new Date(v.created_at).getTime() >= thisMonthStart).length;
  const visitsPrevMonth = visits.filter(v => { const t = new Date(v.created_at).getTime(); return t >= prevMonthStart && t < thisMonthStart; }).length;
  const visitsPrev2Month = visits.filter(v => { const t = new Date(v.created_at).getTime(); return t >= prev2MonthStart && t < prevMonthStart; }).length;
  const prevAvg = (visitsPrevMonth + visitsPrev2Month) / 2;
  const growthPercent = prevAvg > 0 ? Math.round(((visitsThisMonth - prevAvg) / prevAvg) * 100) : visitsThisMonth > 0 ? 100 : 0;

  // Referral source chart data
  const referrerMap: Record<string, number> = {};
  filteredVisits.forEach(v => {
    let source = "مباشر";
    if (v.referrer) {
      try {
        const host = new URL(v.referrer).hostname;
        if (host.includes("instagram")) source = "Instagram";
        else if (host.includes("google")) source = "Google";
        else if (host.includes("facebook") || host.includes("fb")) source = "Facebook";
        else if (host.includes("t.co") || host.includes("twitter") || host.includes("x.com")) source = "Twitter/X";
        else source = host;
      } catch { source = "أخرى"; }
    }
    referrerMap[source] = (referrerMap[source] || 0) + 1;
  });
  const referrerChartData = Object.entries(referrerMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  // CTA click ranking
  const clickRanking: Record<string, number> = {};
  filteredClicks.forEach(c => { clickRanking[c.link_name] = (clickRanking[c.link_name] || 0) + 1; });
  const clickChartData = Object.entries(clickRanking)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name: name.length > 25 ? name.slice(0, 22) + "..." : name, count }));

  // Daily traffic trend data
  const dailyTrendData = (() => {
    const days: Record<string, { date: string; visitors: Set<string>; views: number }> = {};
    filteredVisits.forEach(v => {
      const day = new Date(v.created_at).toLocaleDateString("ar-EG", { month: "short", day: "numeric" });
      if (!days[day]) days[day] = { date: day, visitors: new Set(), views: 0 };
      days[day].views++;
      if (v.session_id) days[day].visitors.add(v.session_id);
    });
    return Object.values(days).map(d => ({ date: d.date, زوار: d.visitors.size, مشاهدات: d.views }));
  })();

  // Device type detection from user_agent
  const deviceData = (() => {
    let mobile = 0, desktop = 0;
    filteredVisits.forEach(v => {
      if (v.user_agent && /mobile|android|iphone|ipad/i.test(v.user_agent)) mobile++;
      else desktop++;
    });
    return [
      { name: "موبايل", value: mobile },
      { name: "سطح المكتب", value: desktop },
    ].filter(d => d.value > 0);
  })();

  // Location estimation from user_agent (timezone-based heuristic isn't available, use referrer domain TLD)
  const locationData = (() => {
    const locMap: Record<string, number> = {};
    filteredVisits.forEach(v => {
      // Simple heuristic: count by referrer or default to "غير محدد"
      let loc = "غير محدد";
      if (v.user_agent) {
        // Detect common locale patterns in UA or just categorize
        if (v.referrer) {
          try {
            const host = new URL(v.referrer).hostname;
            if (host.includes(".jo") || host.includes("jordan")) loc = "الأردن";
            else if (host.includes(".sa") || host.includes("saudi")) loc = "السعودية";
            else if (host.includes(".eg") || host.includes("egypt")) loc = "مصر";
            else if (host.includes(".dz") || host.includes("algeria")) loc = "الجزائر";
            else loc = "أخرى";
          } catch { /* */ }
        }
      }
      locMap[loc] = (locMap[loc] || 0) + 1;
    });
    return Object.entries(locMap).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, value]) => ({ name, value }));
  })();

  // Conversion rate: course CTA clicks / unique visitors
  const courseClicks = filteredClicks.filter(c => c.link_category === "cta" && c.link_name.startsWith("Join Course")).length;
  const conversionRate = uniqueVisitors > 0 ? ((courseClicks / uniqueVisitors) * 100).toFixed(1) : "0.0";

  // Live sessions (visits in last 5 minutes)
  const fiveMinAgo = Date.now() - 5 * 60 * 1000;
  const liveSessions = new Set(visits.filter(v => new Date(v.created_at).getTime() >= fiveMinAgo).map(v => v.session_id)).size;

  const DEVICE_COLORS = ["#06b6d4", "hsl(var(--primary))"];

  // Export PDF
  const handleExportPDF = () => {
    const content = `
تقرير الإحصائيات - ${new Date().toLocaleDateString("ar")}
========================================

الزوار الفريدون: ${uniqueVisitors}
مشاهدات الصفحات: ${totalPageViews}
إجمالي الدورات: ${courses.length}
إجمالي الطلاب: ${settings.find(s => s.key === "total_students")?.value || "0"}
إجمالي التعليقات: ${comments.length}

--- مصادر الزيارات ---
${referrerChartData.map(r => `${r.name}: ${r.value}`).join("\n")}

--- أكثر الروابط نقراً ---
${clickChartData.map(c => `${c.name}: ${c.count}`).join("\n")}
    `.trim();

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AOT_Report_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("تم تصدير التقرير");
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
        <form onSubmit={handleLogin} className="bg-card border border-border rounded-xl p-8 w-full max-w-sm space-y-4">
          <div className="flex items-center justify-center gap-2 text-primary mb-2">
            <Lock className="w-6 h-6" />
            <h1 className="text-xl font-bold">لوحة التحكم</h1>
          </div>
          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          {error && <p className="text-destructive text-sm text-center">{error}</p>}
          <button type="submit" className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors">
            دخول
          </button>
        </form>
      </div>
    );
  }

  const tabs = [
    { id: "settings" as const, label: "⚙️ إعدادات الموقع" },
    { id: "courses" as const, label: "📚 إدارة الدورات" },
    { id: "comments" as const, label: "💬 التعليقات" },
    { id: "analytics" as const, label: "📊 الإحصائيات" },
  ];

  const pending = comments.filter(c => !c.is_approved);
  const approved = comments.filter(c => c.is_approved);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8" dir="rtl">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">لوحة التحكم</h1>
          <button onClick={() => navigate("/")} className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-sm">
            <ArrowRight className="w-4 h-4" />
            العودة للرئيسية
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border pb-2 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t-lg text-sm font-bold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading && <p className="text-muted-foreground">جارٍ التحميل...</p>}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-4">
            {settings.map(s => (
              <div key={s.id} className="bg-card border border-border rounded-lg p-4">
                <label className="block text-sm font-bold text-foreground mb-2">
                  {settingLabels[s.key] || s.key}
                </label>
                {s.value.length > 60 ? (
                  <textarea
                    value={s.value}
                    onChange={(e) => updateSetting(s.id, e.target.value)}
                    rows={3}
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                ) : (
                  <input
                    value={s.value}
                    onChange={(e) => updateSetting(s.id, e.target.value)}
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                )}
              </div>
            ))}
            <button onClick={saveSettings} className="flex items-center gap-2 bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors">
              <Save className="w-4 h-4" />
              حفظ الإعدادات
            </button>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <div className="space-y-6">
            {courses.map(course => (
              <div key={course.id} className="bg-card border border-border rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-foreground">{course.title}</h3>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm">
                      <span className={course.is_active ? "text-green-500" : "text-destructive"}>
                        {course.is_active ? "التسجيل مفتوح" : "التسجيل مغلق"}
                      </span>
                      <input
                        type="checkbox"
                        checked={course.is_active}
                        onChange={(e) => updateCourse(course.id, "is_active", e.target.checked)}
                        className="w-5 h-5 accent-primary"
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">العنوان</label>
                    <input value={course.title} onChange={(e) => updateCourse(course.id, "title", e.target.value)}
                      className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">السعر</label>
                    <input value={course.price} onChange={(e) => updateCourse(course.id, "price", e.target.value)}
                      className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">تاريخ البدء</label>
                    <input value={course.start_date} onChange={(e) => updateCourse(course.id, "start_date", e.target.value)}
                      className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">المدة</label>
                    <input value={course.duration} onChange={(e) => updateCourse(course.id, "duration", e.target.value)}
                      className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">عدد المقاعد</label>
                    <input type="number" value={course.total_seats} onChange={(e) => updateCourse(course.id, "total_seats", parseInt(e.target.value) || 0)}
                      className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">الإحصائيات</label>
                    <input value={course.stats || ""} onChange={(e) => updateCourse(course.id, "stats", e.target.value)}
                      className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">الوصف</label>
                  <textarea value={course.description} onChange={(e) => updateCourse(course.id, "description", e.target.value)} rows={2}
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">الشهادة</label>
                  <input value={course.certification || ""} onChange={(e) => updateCourse(course.id, "certification", e.target.value)}
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">نص زر التسجيل</label>
                    <input value={course.button_text || ""} onChange={(e) => updateCourse(course.id, "button_text", e.target.value)}
                      className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">حالة التسجيل</label>
                    <select
                      value={course.registration_status || "open"}
                      onChange={(e) => updateCourse(course.id, "registration_status", e.target.value)}
                      className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="open">مفتوح</option>
                      <option value="closed">مغلق</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => saveCourse(course)} className="flex items-center gap-2 bg-primary text-primary-foreground font-bold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors text-sm">
                    <Save className="w-4 h-4" />
                    حفظ
                  </button>
                  <button onClick={() => deleteCourse(course.id)} className="flex items-center gap-2 bg-destructive text-destructive-foreground font-bold py-2 px-4 rounded-lg hover:bg-destructive/90 transition-colors text-sm">
                    <Trash2 className="w-4 h-4" />
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === "comments" && (
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">⏳ بانتظار الموافقة ({pending.length})</h2>
            <div className="space-y-3 mb-10">
              {pending.map(c => (
                <div key={c.id} className="bg-card border border-border rounded-lg p-4 flex items-start gap-4">
                  <div className="flex-1">
                    <p className="font-bold text-foreground">{c.name}</p>
                    <p className="text-muted-foreground text-sm mt-1">{c.content}</p>
                    <p className="text-xs text-muted-foreground/60 mt-2">{new Date(c.created_at).toLocaleDateString("ar")}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => approveComment(c.id)} className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg" title="موافقة">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteComment(c.id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground p-2 rounded-lg" title="حذف">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {pending.length === 0 && <p className="text-muted-foreground text-sm">لا توجد تعليقات بانتظار الموافقة</p>}
            </div>

            <h2 className="text-lg font-bold text-secondary mb-4">✅ تعليقات معتمدة ({approved.length})</h2>
            <div className="space-y-3">
              {approved.map(c => (
                <div key={c.id} className="bg-card border border-secondary/20 rounded-lg p-4 flex items-start gap-4 opacity-80">
                  <div className="flex-1">
                    <p className="font-bold text-foreground">{c.name}</p>
                    <p className="text-muted-foreground text-sm mt-1">{c.content}</p>
                  </div>
                  <button onClick={() => deleteComment(c.id)} className="bg-destructive/20 hover:bg-destructive text-destructive-foreground p-2 rounded-lg shrink-0" title="حذف">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* Top Bar: Live Indicator + Time Filter + Export */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-4">
                {/* Live Indicator */}
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-3 py-1.5">
                  <Radio className="w-3.5 h-3.5 text-green-400 animate-pulse" />
                  <span className="text-xs font-bold text-green-400">{liveSessions} مباشر الآن</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                    className="bg-muted border border-border rounded-lg px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="24h">آخر 24 ساعة</option>
                    <option value="30d">آخر 30 يوم</option>
                    <option value="90d">آخر 90 يوم</option>
                  </select>
                </div>
              </div>
              <button onClick={handleExportPDF} className="flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary font-bold py-2 px-5 rounded-lg transition-colors text-sm border border-primary/30">
                <FileDown className="w-4 h-4" />
                تصدير التقرير
              </button>
            </div>

            {/* Traffic Center Cards */}
            <div className={`${glassCard} p-6`}>
              <h3 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                مركز الزيارات
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className={`${glassCard} p-4 text-center`}>
                  <Eye className="w-6 h-6 text-primary mx-auto mb-1" />
                  <div className="text-2xl font-black text-primary">{uniqueVisitors}</div>
                  <div className="text-xs text-muted-foreground">زوار فريدون</div>
                </div>
                <div className={`${glassCard} p-4 text-center`}>
                  <Globe className="w-6 h-6 text-secondary mx-auto mb-1" />
                  <div className="text-2xl font-black text-secondary">{totalPageViews}</div>
                  <div className="text-xs text-muted-foreground">مشاهدات</div>
                </div>
                <div className={`${glassCard} p-4 text-center`}>
                  <MousePointerClick className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
                  <div className="text-2xl font-black text-cyan-400">{filteredClicks.length}</div>
                  <div className="text-xs text-muted-foreground">نقرات CTA</div>
                </div>
                <div className={`${glassCard} p-4 text-center`}>
                  <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-1" />
                  <div className="text-2xl font-black text-green-400">{conversionRate}%</div>
                  <div className="text-xs text-muted-foreground">معدل التحويل</div>
                </div>
              </div>
            </div>

            {/* Daily Traffic Line Chart */}
            <div className={`${glassCard} p-6`}>
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                حركة الزيارات اليومية
              </h3>
              {dailyTrendData.length > 0 ? (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyTrendData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, direction: "rtl" }} />
                      <Legend />
                      <Line type="monotone" dataKey="زوار" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="مشاهدات" stroke="hsl(var(--secondary))" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-8">لا توجد بيانات كافية لعرض الرسم البياني</p>
              )}
            </div>

            {/* Summary Cards with Growth */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`${glassCard} p-6 text-center`}>
                <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-3xl font-black text-primary">{courses.length}</div>
                <div className="text-sm text-muted-foreground">إجمالي الدورات</div>
              </div>
              <div className={`${glassCard} p-6 text-center`}>
                <Users className="w-8 h-8 text-secondary mx-auto mb-2" />
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-black text-secondary">
                    {settings.find(s => s.key === "total_students")?.value || "0"}
                  </span>
                  {growthPercent !== 0 && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                      growthPercent > 0
                        ? "bg-green-500/20 text-green-400"
                        : "bg-destructive/20 text-destructive"
                    }`}>
                      <TrendingUp className={`w-3 h-3 ${growthPercent < 0 ? "rotate-180" : ""}`} />
                      {growthPercent > 0 ? "+" : ""}{growthPercent}%
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">إجمالي الطلاب</div>
              </div>
              <div className={`${glassCard} p-6 text-center`}>
                <MessageCircle className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <div className="text-3xl font-black text-cyan-400">{filteredComments.length}</div>
                <div className="text-sm text-muted-foreground">التعليقات (90 يوم)</div>
              </div>
            </div>

            {/* Two small pie charts: Device + Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Device Types */}
              <div className={`${glassCard} p-6`}>
                <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  نوع الجهاز
                </h3>
                {deviceData.length > 0 ? (
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={deviceData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={70} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                          {deviceData.map((_, i) => (
                            <Cell key={i} fill={DEVICE_COLORS[i % DEVICE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm text-center py-6">لا توجد بيانات</p>
                )}
              </div>

              {/* Top Locations */}
              <div className={`${glassCard} p-6`}>
                <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-secondary" />
                  المواقع الجغرافية
                </h3>
                {locationData.length > 0 ? (
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={locationData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={70} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                          {locationData.map((_, i) => (
                            <Cell key={i} fill={REFERRER_COLORS[i % REFERRER_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm text-center py-6">لا توجد بيانات</p>
                )}
              </div>
            </div>

            {/* Referral Sources Chart */}
            <div className={`${glassCard} p-6`}>
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-secondary" />
                مصادر الزيارات
              </h3>
              {referrerChartData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={referrerChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                        {referrerChartData.map((_, i) => (
                          <Cell key={i} fill={REFERRER_COLORS[i % REFERRER_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-8">لا توجد بيانات حتى الآن</p>
              )}
            </div>

            {/* CTA Click Ranking */}
            <div className={`${glassCard} p-6`}>
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <MousePointerClick className="w-5 h-5 text-primary" />
                أكثر الروابط نقراً
              </h3>
              {clickChartData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={clickChartData} layout="vertical" margin={{ right: 20 }}>
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis type="category" dataKey="name" width={160} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-8">لا توجد نقرات حتى الآن</p>
              )}
            </div>

            {/* Course Stats + Comments Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`${glassCard} p-6`}>
                <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  حالة الدورات
                </h3>
                <div className="space-y-3">
                  {courses.map(course => (
                    <div key={course.id} className="flex items-center justify-between bg-muted/50 backdrop-blur-sm rounded-lg px-4 py-3">
                      <span className="font-medium text-foreground text-sm">{course.title}</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        course.registration_status === "open"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-destructive/20 text-destructive"
                      }`}>
                        {course.registration_status === "open" ? "مفتوح" : "مغلق"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={`${glassCard} p-6`}>
                <h3 className="text-base font-bold text-foreground mb-4">إحصائيات التعليقات</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center backdrop-blur-sm">
                    <div className="text-2xl font-black text-green-400">{approved.length}</div>
                    <div className="text-sm text-muted-foreground">معتمدة</div>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center backdrop-blur-sm">
                    <div className="text-2xl font-black text-yellow-400">{pending.length}</div>
                    <div className="text-sm text-muted-foreground">بانتظار الموافقة</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
