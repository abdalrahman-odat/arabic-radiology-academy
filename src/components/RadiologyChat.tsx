import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import radiologyKB from "@/data/radiology_kb.json";

const WHATSAPP_NUMBER = "962795418245";

interface Message {
  role: "user" | "bot" | "typing";
  text: string;
}

const quickQuestions = radiologyKB.radiology_faqs.map((faq) => faq.question);

const smallTalkResponses: Record<string, string[]> = {
  greetings: ["مرحبا", "هلا", "اهلا", "السلام عليكم", "سلام", "هاي", "مرحبا"],
  howAreYou: ["كيفك", "كيف حالك", "شلونك", "شو اخبارك", "شو الأخبار", "كيف الحال"],
  thanks: ["شكرا", "مشكور", "يعطيك العافية", "الله يعافيك", "تسلم"],
  goodbye: ["مع السلامة", "باي", "الله يسلمك", "يلا باي"],
};

const smallTalkReplies: Record<string, string[]> = {
  greetings: [
    "أهلاً وسهلاً! 👋 أنا مساعدك في عالم الأشعة، كيف أقدر أساعدك اليوم؟",
    "هلا والله! 😊 معك مساعد AOT للأشعة، تفضل اسأل اللي تبي!",
    "مرحبا فيك! 🌟 جاهز أساعدك بأي سؤال عن الأشعة أو الدورات.",
  ],
  howAreYou: [
    "الحمد لله تمام! 💪 جاهز أساعدك بأي استفسار عن الأشعة. شو حاب تعرف؟",
    "بخير والحمد لله! 😊 أنا هنا عشان أساعدك تتعلم أكثر عن CT و X-Ray. اسأل براحتك!",
    "تمام الحمد لله! 🎯 خلينا نبدأ، عندك سؤال عن الأشعة؟",
  ],
  thanks: [
    "العفو! 😊 هذا واجبي. إذا عندك أي سؤال ثاني لا تتردد!",
    "الله يعافيك! 🙏 أي وقت تحتاج مساعدة أنا هنا.",
    "ولو! هذا أقل شيء 💛 بدك تسأل عن شيء ثاني؟",
  ],
  goodbye: [
    "مع السلامة! 👋 بالتوفيق في دراستك، وإذا احتجت شيء ارجع لي!",
    "الله يوفقك! 🌟 لا تنسى تتابع دوراتنا في AOT!",
  ],
};

const followUpQuestions = [
  "هل تبي تعرف أكثر عن هذا الموضوع؟ 🤔",
  "عندك سؤال ثاني متعلق بالموضوع؟ 😊",
  "تبي أشرحلك نقطة معينة أكثر؟ 📚",
  "هل هالمعلومة كانت مفيدة؟ تقدر تسأل أكثر! 💡",
  "ممتاز! تبي نكمل بموضوع ثاني؟ 🎯",
];

function checkSmallTalk(question: string): string | null {
  const q = question.trim().toLowerCase().replace(/[؟?!.,]/g, "");
  
  for (const [category, keywords] of Object.entries(smallTalkResponses)) {
    for (const keyword of keywords) {
      if (q.includes(keyword) || q === keyword) {
        const replies = smallTalkReplies[category];
        return replies[Math.floor(Math.random() * replies.length)];
      }
    }
  }
  return null;
}

function deepSearch(question: string): string | null {
  const q = question.trim().toLowerCase();
  const words = q.split(/\s+/).filter((w) => w.length > 2);

  // Search FAQs
  for (const faq of radiologyKB.radiology_faqs) {
    const faqQ = faq.question.toLowerCase();
    const faqA = faq.answer.toLowerCase();
    if (q === faqQ || faqQ.includes(q) || q.includes(faqQ.slice(0, 20))) {
      return faq.answer;
    }
    // Flexible keyword matching
    const matchCount = words.filter((w) => faqQ.includes(w) || faqA.includes(w)).length;
    if (matchCount >= 2 || (words.length === 1 && matchCount === 1 && words[0].length > 3)) {
      return faq.answer;
    }
  }

  // Search courses
  const coursesEntries = Object.entries(radiologyKB.courses_details);
  for (const [key, value] of coursesEntries) {
    const keyLower = key.toLowerCase();
    const valLower = (value as string).toLowerCase();
    const matchCount = words.filter((w) => keyLower.includes(w) || valLower.includes(w)).length;
    if (matchCount >= 1) {
      return value as string;
    }
  }

  // Search keywords for course/instructor/academy
  if (q.includes("ct") && (q.includes("دورة") || q.includes("كورس"))) {
    return radiologyKB.courses_details.CT_Course;
  }
  if ((q.includes("x-ray") || q.includes("اكس راي") || q.includes("xray")) && (q.includes("دورة") || q.includes("كورس"))) {
    return radiologyKB.courses_details.XRay_Course;
  }
  if (q.includes("المدرب") || q.includes("المحاضر") || q.includes("عبدالله") || q.includes("عودات")) {
    return `المحاضر هو ${radiologyKB.academy_info.instructor} - ${radiologyKB.academy_info.specialty}`;
  }
  if (q.includes("الأكاديمية") || q.includes("اسم") || q.includes("aot")) {
    return `مرحباً بك في ${radiologyKB.academy_info.name}! نحن متخصصون في تدريب فنيي الأشعة.`;
  }

  // Search all string values in the entire KB recursively
  const allValues = extractAllStrings(radiologyKB);
  for (const val of allValues) {
    const valLower = val.toLowerCase();
    const matchCount = words.filter((w) => valLower.includes(w)).length;
    if (matchCount >= 2) {
      return val;
    }
  }

  return null;
}

function extractAllStrings(obj: unknown): string[] {
  const results: string[] = [];
  if (typeof obj === "string") {
    results.push(obj);
  } else if (Array.isArray(obj)) {
    for (const item of obj) results.push(...extractAllStrings(item));
  } else if (typeof obj === "object" && obj !== null) {
    for (const val of Object.values(obj)) results.push(...extractAllStrings(val));
  }
  return results;
}

function findAnswer(question: string): string {
  // 1. Small talk check
  const smallTalk = checkSmallTalk(question);
  if (smallTalk) return smallTalk;

  // 2. Deep search
  const answer = deepSearch(question);
  if (answer) {
    // Occasionally add a follow-up question
    const addFollowUp = Math.random() > 0.5;
    if (addFollowUp) {
      const followUp = followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)];
      return `${answer}\n\n${followUp}`;
    }
    return answer;
  }

  // 3. Fallback
  return `عذراً، لا أملك إجابة على هذا السؤال حالياً. 😊\nتواصل مع الأستاذ عبدالله مباشرة عبر واتساب:\n${WHATSAPP_NUMBER}`;
}

const RadiologyChat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: `أهلاً بك في ${radiologyKB.academy_info.name}! 👋\nكيف أقدر أساعدك؟` },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: Message = { role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botMsg: Message = { role: "bot", text: findAnswer(text) };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
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
            {isTyping && (
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-xl px-3 py-2 text-sm bg-[#0f3460] text-gray-400 italic">
                  يكتب... ✍️
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick questions */}
          <div className="px-3 pb-2 flex flex-wrap gap-1.5" dir="rtl">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                disabled={isTyping}
                className="text-[11px] px-2.5 py-1.5 rounded-full border border-orange-500/40 text-orange-300 hover:bg-orange-500/20 transition-colors truncate max-w-full disabled:opacity-50"
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
              disabled={isTyping}
              className="flex-1 bg-[#1a1a2e] border border-orange-500/30 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-orange-500 disabled:opacity-50"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={isTyping}
              className="w-9 h-9 rounded-lg bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors shrink-0 disabled:opacity-50"
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
