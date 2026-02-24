import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lock, ArrowRight, Save, Plus, Trash2, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

const AdminDashboard = () => {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"settings" | "courses" | "comments">("settings");
  const [settings, setSettings] = useState<Setting[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [comments, setComments] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
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
    const [s, c, t] = await Promise.all([
      supabase.from("site_settings").select("*"),
      supabase.from("courses").select("*").order("sort_order"),
      supabase.from("testimonials").select("*").order("created_at", { ascending: false }),
    ]);
    if (s.data) setSettings(s.data as Setting[]);
    if (c.data) setCourses(c.data as Course[]);
    if (t.data) setComments(t.data as Testimonial[]);
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
      </div>
    </div>
  );
};

export default AdminDashboard;
