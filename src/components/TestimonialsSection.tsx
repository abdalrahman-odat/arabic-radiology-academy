import { useState } from "react"; // استيراد الحالة
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  // التعليقات الـ 4 الأساسية (اللي بتظهر أول ما يفتح الموقع)
  {
    name: "غدير البطوش",
    role: "دورة CT 1 الاحترافية",
    content: "شُكرًا ع التعامل الراقي جِدًا ، وشُكرًا للكورس الفخم يلي كان لامم وشامل كُلشي بحتاجة اي فني أشعة بخصوص الCT بتستاهل كُل خير على المصداقية يلي كُنت اسمع فيها وتأكدت منها بس سجلت والحَمدُ لله مريح جِدًا من كل النواحي ، ان كان بتوصيل الافكار بطريقة جدًا رائعة ، ومريح بمراعاة الطلاب اثناء الكورس وبعد الكورس",
    rating: 5,
  },
  {
    name: "أحمد الشمري",
    role: "دورة CT 1 الاحترافية",
    content: "دورة ممتازة، الأستاذ عبدالله عودات شرح المادة بطريقة عملية وسهلة. أنصح بها كل فني أشعة.",
    rating: 5,
  },
  {
    name: "سارة العتيبي",
    role: "دورة X-Ray الشاملة",
    content: "استفدت كثيراً من المحتوى الفني المستخلص من مراجع متعددة. المحتوى منظم بشكل احترافي.",
    rating: 5,
  },
  {
    name: "محمد القحطاني",
    role: "دورة CT 1 الاحترافية",
    content: "أفضل دورة حضرتها في مجال الأشعة المقطعية. الأستاذ عبدالله متمكن والمادة العلمية قوية جداً.",
    rating: 5,
  },
  // الـ 4 تعليقات الجديدة (اللي بتظهر لما يضغط اقرأ المزيد)
  {
    name: "نورة الحربي",
    role: "دورة X-Ray الشاملة",
    content: "أسلوب التدريس رائع، والشهادة الكندية المعتمدة أضافت قيمة كبيرة. شكراً للأستاذ عبدالله.",
    rating: 5,
  },
  {
    name: "أريام عادل",
    role: "دورة CT 1 الاحترافية",
    content: "أستاذ عبدالله من جد ما توفيك الكلمات حقك كورسات CT معك كان نقلة نوعية بالنسبة إلي درست المادة قبل بالجامعة وما كنت استوعب منها شي بس مع شرحك وطريقتك قدرت أفهم كل نقطة وكأني أول مرة أدرسها... أسلوبك جداً رهيب ويفتح النفس للمعلومة ممتنة إلك كثير والله.",
    rating: 5,
  },
  {
    name: "ضحى الكيلاني",
    role: "دورة X-Ray الشاملة",
    content: "شكراً جداً عنجد من أفضل القرارات إني أخذت خطوة الاشتراك بهاذ الكورس، كثير فرق معي بالفهم والاستفادة وخاصة إنها بطريقة كثير سهلة وسلسة وبسيطة ف الحمدلله والله مبسوطة بهيك أشخاص تعرفنا عليهم ومش ندمانين بالمرة بالاشتراك وإن شاء الله أي دورة أو إشي بتعمله لقدام رح نكون أول المشتركين.",
    rating: 5,
  },
  {
    name: "ولاء الخليفات",
    role: "دورة CT 1 الاحترافية",
    content: "هي الفيدباك لأنه تستاهل جد والشرح ما شاء الله كثير بجنن ومفصل تفصيل ما نشرح مثله أكاديمي أبداً أشياء أول مرة أعرفها بتمنى إلك المزيد من التقدم إن شاء الله بكل إشي وأي حد متردد يشترك فيه يشترك ع ضمانتي لأنه جد رح تستفيدوا كثير وكثير رح تكونوا مبدعين إن شاء الله بتمنى إلك عبدالله كل الخير وإن شاء الله أي دورات بتعملها أنا رح أكون أولها بإذن الله.",
    rating: 5,
  }
];

const TestimonialsSection = () => {
  const [showAll, setShowAll] = useState(false); // الحالة للتحكم بالعرض

  // تحديد التعليقات المعروضة (4 إذا كانت showAll خطأ، والكل إذا كانت صح)
  const visibleTestimonials = showAll ? testimonials : testimonials.slice(0, 4);

  return (
    <section id="testimonials" className="py-20 bg-background/50">
      <div className="container px-4">
          <h2 className="text-3xl md:text-5xl font-black text-primary text-glow-primary mb-4">
            آراء المتدربين
          </h2>
          <p className="text-muted-foreground text-lg">ماذا يقول طلابنا عن تجربتهم مع أكاديمية دورات الأشعة</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <AnimatePresence mode="popLayout">
            {visibleTestimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-card rounded-xl border border-border p-6 relative group"
              >
                <Quote className="absolute top-4 left-4 w-8 h-8 text-primary/10 group-hover:text-primary/20 transition-colors" />
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground leading-relaxed mb-6 italic">"{testimonial.content}"</p>
                <div className="flex flex-col">
                  <span className="font-bold text-lg">{testimonial.name}</span>
                  <span className="text-secondary text-sm font-medium">— {testimonial.role}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* كبسة اقرأ المزيد */}
        <div className="text-center mt-12">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-secondary/10 hover:bg-secondary/20 text-secondary font-bold py-3 px-8 rounded-full border border-secondary/20 transition-all hover:scale-105"
          >
            {showAll ? "عرض أقل" : "اقرأ المزيد من التعليقات"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
