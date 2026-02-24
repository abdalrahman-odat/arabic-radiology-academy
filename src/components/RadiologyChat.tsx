import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "bot";
  text: string;
}

interface CourseData {
  title: string;
  description: string;
  price: string;
  start_date: string;
  is_active: boolean;
}

const RadiologyChat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "مرحباً بك في AOT of Radiology 👋\nكيف يمكنني مساعدتك اليوم؟" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState("962795130027");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const fetchData = async () => {
      const [c, s] = await Promise.all([
        supabase.from("courses").select("title, description, price, start_date, is_active"),
        supabase.from("site_settings").select("key, value").eq("key", "whatsapp_number"),
      ]);
      if (c.data) setCourses(c.data as CourseData[]);
      if (s.data && s.data.length > 0) setWhatsappNumber((s.data[0] as any).value);
    };
    fetchData();
  }, []);

  const findAnswer = (question: string) => {
    const q = question.toLowerCase();
    if (q.includes("مرحبا") || q.includes("اهلا") || q.includes("كيفك") || q.includes("هلا")) {
      return "أهلاً وسهلاً! أنا مساعد AOT للأشعة. كيف أقدر أساعدك؟ 😊";
    }

    if (q.includes("ct") || q.includes("مقطعي")) {
      const ct = courses.find(c => c.title.includes("CT"));
      if (ct) return `${ct.title}: ${ct.description}\nالسعر: ${ct.price}\nيبدأ: ${ct.start_date}\nالحالة: ${ct.is_active ? "التسجيل مفتوح ✅" : "التسجيل مغلق ❌"}`;
    }

    if (q.includes("xray") || q.includes("x-ray") || q.includes("سيني") || q.includes("اكس راي")) {
      const xr = courses.find(c => c.title.includes("X-Ray"));
      if (xr) return `${xr.title}: ${xr.description}\nالسعر: ${xr.price}\nيبدأ: ${xr.start_date}\nالحالة: ${xr.is_active ? "التسجيل مفتوح ✅" : "التسجيل مغلق ❌"}`;
    }

    if (q.includes("دورات") || q.includes("كورس") || q.includes("courses")) {
      return courses.map(c => `• ${c.title} - ${c.price} ${c.is_active ? "✅" : "❌"}`).join("\n");
    }

    if (q.includes("سجل") || q.includes("تسجيل") || q.includes("register")) {
      return `للتسجيل تواصل معنا عبر الواتساب:\nhttps://wa.me/${whatsappNumber}`;
    }

    return `نعتذر، هذه المعلومة غير متوفرة حالياً. تواصل مع الأستاذ عبدالله:\nhttps://wa.me/${whatsappNumber}`;
  };

  const handleSend = (text: string) => {
    if (!text.trim() || isTyping) return;
    setMessages(prev => [...prev, { role: "user", text: text.trim() }]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "bot", text: findAnswer(text) }]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)} className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90">
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[340px] sm:w-[380px] h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-primary/30 bg-card" dir="rtl">
          <div className="flex items-center justify-between px-4 py-3 bg-muted border-b border-border">
            <span className="text-primary font-bold text-sm">🤖 مساعد AOT للأشعة</span>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm whitespace-pre-line ${
                  msg.role === "user" ? "bg-primary/20 text-foreground" : "bg-muted text-foreground"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && <div className="text-xs text-muted-foreground mr-2">يكتب...</div>}
            <div ref={bottomRef} />
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend(input)} placeholder="اسأل هنا..." className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <button onClick={() => handleSend(input)} className="bg-primary p-2 rounded-lg text-primary-foreground"><Send className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </>
  );
};

export default RadiologyChat;
