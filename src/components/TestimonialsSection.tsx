import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const hardcodedTestimonials = [
  {
    id: "static-1",
    name: "غدير البطوش",
    content: "شُكرًا ع التعامل الراقي جِدًا ، وشُكرًا للكورس الفخم يلي كان لامم وشامل كُلشي بحتاجة اي فني أشعة بخصوص الCT بتستاهل كُل خير على المصداقية يلي كُنت اسمع فيها وتأكدت منها بس سجلت والحَمدُ لله مريح جِدًا من كل النواحي ، ان كان بتوصيل الافكار بطريقة جدًا رائعة ، ومريح بمراعاة الطلاب اثناء الكورس وبعد الكورس",
    rating: 5,
  },
  {
    id: "static-2",
    name: "فرح الربيعي",
    content: "إذا بتسمح اريد انطي رأيي عن الكورس ماشاء الله وانا من اول نا أطلقت الكورس كان ببالي اشترك بس ماصارت الفرصه وكان نصيبي بالنسخه الجديده من الكورس صراحه حلال بي كل فلس مدفوع ويستاهل أكثر والله من التصميم للشرح وكيف تتعب عليه والتزامك بالوقت واحترامك وتقديرك اله ماشاء الله",
    rating: 5,
  },
  {
    id: "static-3",
    name: "يقين الفقيه",
    content: "من أفضل القرارات بحياتي هو قرار اشتراك بالكورس زمان ما كنت احب الct ومتعقدة منه وبحسه ما بنفهم وكفيل هالجهاز يحبطك ويقلل من ثقتك بنفسك بالتخصص ويكرهك اياه كمان 🥲💔 بس معك ومع الكورس كثيييير فرق معي عنجد الله يباركلك ويعطيك الف عافية على كل كلمة وكل معلومة حكيتها",
    rating: 5,
  },
  {
    id: "static-4",
    name: "مرام ابو قطنة",
    content: "هاد اول كورس اونلاين باخده والحمدلله الحمدلله اللي ما ترددت وسجلت وان شاءالله مش المرة الاخيررة انا معك بكله انا حرفياً كنت متعقدة بالCT ومش قادرة افهمه ولا احبه كل اللي كنت بعرفه اكم اشي واصلاً كنت حافظة حفظ بس لحتى انجح وامشي بالمادة",
    rating: 5,
  },
  {
    id: "static-5",
    name: "مريم الهاشمي",
    content: "دكتورنا العزيز، حابة أشكرك من قلبي على شرحك الرائع والمميز لمادة الـ CT 🌟بصراحة من أول محاضرة وأنا حاسة إن الماده بتكون سهلة وممتعة بفضلك، لأن أسلوبك في الشرح بسيط وواضح، وتوصل المعلومة بطريقة تخلي حتى الأمور الصعبة تنفهم بسهولة.",
    rating: 5,
  },
  {
    id: "static-6",
    name: "أريام عادل",
    content: "أستاذ عبدالله من جد ما توفيك الكلمات حقك كورسات CT معك كان نقلة نوعية بالنسبة إلي درست المادة قبل بالجامعة وما كنت استوعب منها شي بس مع شرحك وطريقتك قدرت أفهم كل نقطة وكأني أول مرة أدرسها... أسلوبك جداً رهيب ويفتح النفس للمعلومة ممتنة إلك كثير والله.",
    rating: 5,
  },
  {
    id: "static-7",
    name: "ضحى الكيلاني",
    content: "شكراً جداً عنجد من أفضل القرارات إني أخذت خطوة الاشتراك بهاذ الكورس، كثير فرق معي بالفهم والاستفادة وخاصة إنها بطريقة كثير سهلة وسلسة وبسيطة ف الحمدلله والله مبسوطة بهيك أشخاص تعرفنا عليهم.",
    rating: 5,
  },
  {
    id: "static-8",
    name: "ولاء الخليفات",
    content: "هي الفيدباك لأنه تستاهل جد والشرح ما شاء الله كثير بجنن ومفصل تفصيل ما نشرح مثله أكاديمي أبداً أشياء أول مرة أعرفها بتمنى إلك المزيد من التقدم إن شاء الله بكل إشي وأي حد متردد يشترك فيه يشترك ع ضمانتي.",
    rating: 5,
  },
];

interface Testimonial {
  id: string;
  name: string;
  content: string;
  rating: number;
}

const TestimonialsSection = () => {
  const [showAll, setShowAll] = useState(false);
  const [dbTestimonials, setDbTestimonials] = useState<Testimonial[]>([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });
      if (data) setDbTestimonials(data);
    };
    fetchTestimonials();

    const channel = supabase
      .channel("testimonials-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "testimonials" },
        (payload) => {
          const newItem = payload.new as Testimonial & { is_approved?: boolean };
          if (newItem.is_approved) {
            setDbTestimonials((prev) => [newItem, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const allTestimonials = [...dbTestimonials, ...hardcodedTestimonials];
  const visibleTestimonials = showAll ? allTestimonials : allTestimonials.slice(0, 4);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedContent = content.trim();
    if (!trimmedName || !trimmedContent) return;

    setSubmitting(true);
    const { error } = await supabase
      .from("testimonials")
      .insert({ name: trimmedName, content: trimmedContent, rating: 5 });

    setSubmitting(false);
    if (!error) {
      setName("");
      setContent("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section id="testimonials" className="py-20 bg-background/50">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-primary text-glow-primary mb-4">
            آراء المتدربين
          </h2>
          <p className="text-muted-foreground text-lg">
            ماذا يقول طلابنا عن تجربتهم
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <AnimatePresence mode="popLayout">
            {visibleTestimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-card rounded-xl border border-border p-6 relative group h-full flex flex-col card-hover"
              >
                <Quote className="absolute top-4 left-4 w-8 h-8 text-primary/10 group-hover:text-primary/20 transition-colors" />
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground leading-relaxed mb-6 italic flex-grow">
                  "{testimonial.content}"
                </p>
                <div className="flex flex-col mt-auto pt-4 border-t border-border/50">
                  <span className="font-bold text-lg text-foreground border-r-2 border-primary pr-3">
                    {testimonial.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-secondary/10 hover:bg-secondary/20 text-secondary font-bold py-3 px-8 rounded-full border border-secondary/20 transition-all hover:scale-105"
          >
            {showAll ? "عرض أقل" : "اقرأ المزيد من التعليقات"}
          </button>
        </div>

        {/* Add Comment Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mt-16"
        >
          <div className="bg-card rounded-xl border border-border p-6 card-hover">
            <h3 className="text-xl font-bold text-foreground mb-6 text-center">
              أضف تعليقك
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="الاسم"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  required
                  className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              <div>
                <textarea
                  placeholder="شاركنا رأيك في الدورة..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={1000}
                  required
                  rows={4}
                  className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-lg transition-all hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                {submitting ? "جارٍ الإرسال..." : "أرسل تعليقك"}
              </button>
              {submitted && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-secondary text-center font-medium"
                >
                  ✓ شكراً لك! تم إرسال تعليقك وسيظهر بعد المراجعة
                </motion.p>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
