import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "أحمد الشمري",
    course: "دورة CT 1 الاحترافية",
    text: "دورة ممتازة، الأستاذ عبدالله عودات شرح المادة بطريقة عملية وسهلة. أنصح بها كل فني أشعة.",
    rating: 5,
  },
  {
    name: "سارة العتيبي",
    course: "دورة X-Ray الشاملة",
    text: "استفدت كثيراً من المحتوى الغني المستخلص من مراجع متعددة. المحتوى منظم بشكل احترافي.",
    rating: 5,
  },
  {
    name: "محمد القحطاني",
    course: "دورة CT 1 الاحترافية",
    text: "أفضل دورة حضرتها في مجال الأشعة المقطعية. الأستاذ عبدالله متمكن والمادة العلمية قوية جداً.",
    rating: 5,
  },
  {
    name: "نورة الحربي",
    course: "دورة X-Ray الشاملة",
    text: "أسلوب التدريس رائع، والشهادة الكندية المعتمدة أضافت قيمة كبيرة. شكراً للأستاذ عبدالله.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 md:py-28">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black text-primary text-glow-primary mb-4">
            آراء المتدربين
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            ماذا يقول طلابنا عن تجربتهم مع أكاديمية دورات الأشعة
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card rounded-xl border border-border p-6 relative"
            >
              <Quote className="absolute top-4 left-4 w-8 h-8 text-primary/20" />
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground mb-4 leading-relaxed">"{t.text}"</p>
              <div>
                <span className="font-bold text-foreground">{t.name}</span>
                <span className="text-sm text-secondary mr-2">— {t.course}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
