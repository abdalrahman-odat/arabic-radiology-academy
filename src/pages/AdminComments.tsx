import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Check, Trash2, Lock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ADMIN_PASSWORD = "aot2025admin";

interface Testimonial {
  id: string;
  name: string;
  content: string;
  rating: number;
  is_approved: boolean;
  created_at: string;
}

const AdminComments = () => {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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

  const fetchComments = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setComments(data as Testimonial[]);
    setLoading(false);
  };

  useEffect(() => {
    if (authed) fetchComments();
  }, [authed]);

  const approve = async (id: string) => {
    await supabase.from("testimonials").update({ is_approved: true } as any).eq("id", id);
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, is_approved: true } : c)));
  };

  const remove = async (id: string) => {
    await supabase.from("testimonials").delete().eq("id", id);
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
        <form onSubmit={handleLogin} className="bg-card border border-border rounded-xl p-8 w-full max-w-sm space-y-4">
          <div className="flex items-center justify-center gap-2 text-primary mb-2">
            <Lock className="w-6 h-6" />
            <h1 className="text-xl font-bold">لوحة إدارة التعليقات</h1>
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

  const pending = comments.filter((c) => !c.is_approved);
  const approved = comments.filter((c) => c.is_approved);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-foreground">إدارة التعليقات</h1>
          <button onClick={() => navigate("/")} className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-sm">
            <ArrowRight className="w-4 h-4" />
            العودة للرئيسية
          </button>
        </div>

        <h2 className="text-lg font-bold text-primary mb-4">⏳ بانتظار الموافقة ({pending.length})</h2>
        {loading && <p className="text-muted-foreground">جارٍ التحميل...</p>}
        <div className="space-y-3 mb-10">
          {pending.map((c) => (
            <div key={c.id} className="bg-card border border-border rounded-lg p-4 flex items-start gap-4">
              <div className="flex-1">
                <p className="font-bold text-foreground">{c.name}</p>
                <p className="text-muted-foreground text-sm mt-1">{c.content}</p>
                <p className="text-xs text-muted-foreground/60 mt-2">{new Date(c.created_at).toLocaleDateString("ar")}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => approve(c.id)} className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors" title="موافقة">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={() => remove(c.id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground p-2 rounded-lg transition-colors" title="حذف">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {!loading && pending.length === 0 && <p className="text-muted-foreground text-sm">لا توجد تعليقات بانتظار الموافقة</p>}
        </div>

        <h2 className="text-lg font-bold text-secondary mb-4">✅ تعليقات معتمدة ({approved.length})</h2>
        <div className="space-y-3">
          {approved.map((c) => (
            <div key={c.id} className="bg-card border border-secondary/20 rounded-lg p-4 flex items-start gap-4 opacity-80">
              <div className="flex-1">
                <p className="font-bold text-foreground">{c.name}</p>
                <p className="text-muted-foreground text-sm mt-1">{c.content}</p>
              </div>
              <button onClick={() => remove(c.id)} className="bg-destructive/20 hover:bg-destructive text-destructive-foreground p-2 rounded-lg transition-colors shrink-0" title="حذف">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminComments;
