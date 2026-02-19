import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "غدير البطوش ",
    
    text: "شُكرًا ع التعامل الراقي جِدًا ، وشُكرًا للكورس الفخم يلي كان لامم وشامل كُلشي بحتاجة اي فني أشعة بخصوص الCT بتستاهل كُل خير على المصداقية يلي كُنت اسمع فيها وتأكدت منها بس سجلت والحَمدُ لله مريح جِدًا من كل النواحي ، ان كان بتوصيل الافكار بطريقة جدًا رائعة ، ومريح بمراعاة الطلاب اثناء الكورس وبعد الكورس"
  },
  {
    name: "اريام عادل",
    
    text: "أستاذ عبدالله من جد ما توفيك الكلمات حقك كورسات CT معك كان نقلة نوعية بالنسبة إلي درست المادة قبل بالجامعة وما كنت أستوعب منها أشي بس مع شرحك وطريقتك قدرت أفهم كل نقطة وكأني أول مرة أدرسها...أسلوبك جداً رهيب ويفتح النفس للمعلومة ممتنة إلك كثير والله",
    rating: 5,
  },
  {
    name: "ضحى الكيلاني",
    
    text: "شكراً جداً جدًا عنجد من افضل القرارت اني اخذت خطوة الاشتراك بهاذ الكورس، كثير فرق معي بالفهم والاستفادة وخاصة انها بطريقة كثير سهلة وسلسة وبسيطة ف الحمدلله والله مبسوطة بهيك اشخاص تعرفنا عليهم ومش ندمانين بالمرة بالاشتراك وان شاء الله اي دورة او اشي بتعمله لقدام رح نكون اول المشتركين",
    rating: 5,
  },
  {
    name: "ولاء الخليفات",
    
    text: "هي الفيدباك لانه تستاهل جد والشرح ما شاءلله كثير بجنن ومفصل تفصيل ما نشرح مثله اكاديمي ابدا اشياء اول مرة اعرفها بتمنى الك المزيد من التقدم ان شاءالله بكل اشي واي حد متردد يشترك فيه يشترك ع شهادتي لانه جد راح تستفيدوا كثير وكثير راح تكونوا مبدعين ان شاءالله بتمنى الك عبدلله كل الخيروان شاءالله اي دورات بتعملها انا راح اكون اولها بإذن الله",
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
            ماذا يقول طلابنا عن تجربتهم
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
