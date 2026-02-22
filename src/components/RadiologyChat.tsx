import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import radiologyKB from "@/data/radiology_kb.json";

const WHATSAPP_NUMBER = "962795418245";

interface Message {
  role: "user" | "bot";
  text: string;
}

const quickQuestions = radiologyKB.radiology_faqs.map((faq) => faq.question);

function findAnswer(question: string): string {
  const q = question.trim().toLowerCase();
  
  // Check FAQs
  for (const faq of radiologyKB.radiology_faqs) {
    const faqQ = faq.question.toLowerCase();
    // Check if the user question substantially matches
    if (q === faqQ || faqQ.includes(q) || q.includes(faqQ.slice(0, 20))) {
      return faq.answer;
    }
  }

  // Check keywords
  if (q.includes("ct") && (q.includes("دورة") || q.includes("كورس"))) {
    return radiologyKB.courses_details.CT_Course;
  }
  if ((q.includes("x-ray") || q.includes("اكس راي") || q.includes("xray")) && (q.includes("دورة") || q.includes("كورس"))) {
    return radiologyKB.courses_details.XRay_Course;
  }
  if (q.includes("المدرب") || q.includes("المحاضر") || q.includes("عبدالله") || q.includes("عودات")) {
    return `المحاضر هو ${radiologyKB.academy_info.instructor} - ${radiologyKB.academy_info.specialty}`;
  }
  if (q.includes("الأكاديمية") || q.includes("اسم")) {
    return `مرحباً بك في ${radiologyKB.academy_info.name}! نحن متخصصون في تدريب فنيي الأشعة.`;
  }

  return `عذراً، لا أملك إجابة على هذا السؤال حالياً. 😊\nتواصل مع الأستاذ عبدالله مباشرة عبر واتساب:\nhttps://wa.me/${WHATSAPP_NUMBER}`;
}

const RadiologyChat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "أهلاً بك في AOT of Radiology\nكيف بقدر أساعدك اليوم؟" },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", text: text.trim() };
    const botMsg: Message = { role: "bot", text: findAnswer(text) };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-orange-500 text-white shadow-lg flex items-center justify-center hover:bg-orange-600 transition-colors"
          aria-label="فتح المحادثة"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[340px] sm:w-[380px] h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-orange-500/30 bg-[#1a1a2e]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#16213e] border-b border-orange-500/20">
            <span className="text-orange-400 font-bold text-sm">🤖 مساعد AOT للأشعة</span>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3" dir="rtl">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-[80%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap leading-relaxed ${
                    msg.role === "user"
                      ? "bg-orange-500/20 text-orange-100"
                      : "bg-[#0f3460] text-gray-100"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Quick questions */}
          <div className="px-3 pb-2 flex flex-wrap gap-1.5" dir="rtl">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="text-[11px] px-2.5 py-1.5 rounded-full border border-orange-500/40 text-orange-300 hover:bg-orange-500/20 transition-colors truncate max-w-full"
              >
                {q.length > 35 ? q.slice(0, 35) + "..." : q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-3 border-t border-orange-500/20 bg-[#16213e]" dir="rtl">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
              placeholder="اكتب سؤالك هنا..."
              className="flex-1 bg-[#1a1a2e] border border-orange-500/30 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-orange-500"
            />
            <button
              onClick={() => handleSend(input)}
              className="w-9 h-9 rounded-lg bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RadiologyChat;
