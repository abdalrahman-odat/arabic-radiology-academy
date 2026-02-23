import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import radiologyKB from "@/data/radiology_kb.json";

const WHATSAPP_NUMBER = "962795130027";

interface Message {
  role: "user" | "bot";
  text: string;
}

const RadiologyChat = () => {
  const [open, setOpen] = useState(false);
  // استخدام الاختصار ?. لضمان عدم تعطل التطبيق إذا كانت البيانات ناقصة
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "bot", 
      text: `مرحباً بك في AOT of Radiology 👋\nكيف يمكنني مساعدتك اليوم؟` 
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const findAnswer = (question: string) => {
    const q = question.toLowerCase();
    if (q.includes("مرحبا") || q.includes("اهلا") || q.includes("كيفك")) {
      return "الحمد لله، أنا بخير وأعمل لمساعدتكم. ما هي تساؤلاتكم حول الأشعة اليوم؟";
    }
    if (q.includes("ct") || q.includes("مقطعي")) return radiologyKB.courses_details?.CT_Course || "معلومات دورة الـ CT متوفرة لدى الأستاذ عبدالله.";
    if (q.includes("xray") || q.includes("سيني")) return radiologyKB.courses_details?.XRay_Course || "معلومات دورة الـ X-Ray متوفرة لدى الأستاذ عبدالله.";
    
    return `نعتذر، هذه المعلومة غير متوفرة حالياً. يرجى التواصل مع الأستاذ عبدالله:\n${WHATSAPP_NUMBER}`;
  };

  const handleSend = (text: string) => {
    if (!text.trim() || isTyping) return;
    setMessages((prev) => [...prev, { role: "user", text: text.trim() }]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: findAnswer(text) }]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)} className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-orange-500 text-white shadow-lg flex items-center justify-center hover:bg-orange-600">
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[340px] sm:w-[380px] h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-orange-500/30 bg-[#1a1a2e]" dir="rtl">
          <div className="flex items-center justify-between px-4 py-3 bg-[#16213e] border-b border-orange-500/20">
            <span className="text-orange-400 font-bold text-sm">🤖 مساعد AOT للأشعة</span>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${msg.role === "user" ? "bg-orange-500/20 text-orange-100" : "bg-[#0f3460] text-gray-100"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && <div className="text-xs text-gray-500 mr-2">يكتب...</div>}
            <div ref={bottomRef} />
          </div>
          <div className="flex items-center gap-2 p-3 bg-[#16213e]">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend(input)} placeholder="اسأل هنا..." className="flex-1 bg-[#1a1a2e] border border-orange-500/30 rounded-lg px-3 py-2 text-sm text-white" />
            <button onClick={() => handleSend(input)} className="bg-orange-500 p-2 rounded-lg text-white"><Send className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </>
  );
};

export default RadiologyChat;
