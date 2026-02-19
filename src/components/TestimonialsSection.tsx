import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "غدير البطوش",
    content: "شُكرًا ع التعامل الراقي جِدًا ، وشُكرًا للكورس الفخم يلي كان لامم وشامل كُلشي بحتاجة اي فني أشعة بخصوص الCT بتستاهل كُل خير على المصداقية يلي كُنت اسمع فيها وتأكدت منها بس سجلت والحَمدُ لله مريح جِدًا من كل النواحي ، ان كان بتوصيل الافكار بطريقة جدًا رائعة ، ومريح بمراعاة الطلاب اثناء الكورس وبعد الكورس",
    rating: 5,
  },
  {
    name: "فرح",
    content: "إذا بتسمح اريد انطي رأيي عن الكورس ماشاء الله وانا من اول نا أطلقت الكورس كان ببالي اشترك بس ماصارت الفرصه وكان نصيبي بالنسخه الجديده من الكورس صراحه حلال بي كل فلس مدفوع ويستاهل أكثر والله من التصميم للشرح وكيف تتعب عليه والتزامك بالوقت واحترامك وتقديرك اله ماشاء الله وانا اصلا من زمان كنت ادور على احد يقدم الكورس بهاي الطريقه انت اجيت إنقاذ اقسم بالله صرت اعملك اعلان يم زملائي من كد ماعجبني الكورس وكنت ارجع للبيت قبل ربع ساعه من بداية المحاضره وكنت احاول احضرها اونلاين وبعدين ارجع للتسجيل اكتب كل الملاحظات الحمدلله الله على كلشي الله يكتب أجرنا ",
    rating: 5,
  },
  {
    name: "يقين",
    content: "من أفضل القرارات بحياتي هو قرار اشتراك بالكورس زمان ما كنت احب الct ومتعقدة منه وبحسه ما بنفهم وكفيل هالجهاز يحبطك ويقلل من ثقتك بنفسك بالتخصص ويكرهك اياه كمان 🥲💔 بس معك ومع الكورس كثيييير فرق معي عنجد الله يباركلك ويعطيك الف عافية على كل كلمة وكل معلومة حكيتها وشكرًا لشرحك المُبسط السهل  للمعلومات لكبيرة يلي الواحد بكون حاس حاله مستحيل ييجي يوم ويفهم بسهولة وسلاسة بس الحمدلله الحمدلله معك غيرت النظرة وشلت العقدة وبالعكس حببتني فيه كثير وبالتخصص 🤍",
    rating: 5,
  },
  {
    name: "Maram aboqutnah",
    content: "هاد اول كورس اونلاين باخده والحمدلله الحمدلله اللي ما ترددت وسجلت وان شاءالله مش المرة الاخيررة انا معك بكله انا حرفياً كنت متعقدة بالCT ومش قادرة افهمه ولا احبه كل اللي كنت بعرفه اكم اشي واصلاً كنت حافظة حفظ بس لحتى انجح وامشي بالمادة حتى تدريب المستشفى رحت السي تي  اكم شفت هيك رفع عتب ، جدد جد شكراً من قلبيي ع كل اشي قدمته وكل اشي اعطيتنا اياه سواء طريقة الشرح والسلايدات والمعلومات القوية اللي اعطيتنا اياها كله كان بيرفيكتت ولا غلطة كنت تجاوب عالسؤال قبل ما اسأله 😅😅 ، حببتنا بالتخصص كثيرر كمية الاستفادة اللي وصلتلها جدد حاسة حالي حالياً بقدر اقعد مع اي حد واناقش بالسي تي وعن فهم",
    rating: 5,
  },
  {
    name: "نورة الحربي",
    content: "أسلوب التدريس رائع، والشهادة الكندية المعتمدة أضافت قيمة كبيرة. شكراً للأستاذ عبدالله.",
    rating: 5,
  },
  {
    name: "أريام عادل",
    content: "أستاذ عبدالله من جد ما توفيك الكلمات حقك كورسات CT معك كان نقلة نوعية بالنسبة إلي درست المادة قبل بالجامعة وما كنت استوعب منها شي بس مع شرحك وطريقتك قدرت أفهم كل نقطة وكأني أول مرة أدرسها... أسلوبك جداً رهيب ويفتح النفس للمعلومة ممتنة إلك كثير والله.",
    rating: 5,
  },
  {
    name: "ضحى الكيلاني",
    content: "شكراً جداً عنجد من أفضل القرارات إني أخذت خطوة الاشتراك بهاذ الكورس، كثير فرق معي بالفهم والاستفادة وخاصة إنها بطريقة كثير سهلة وسلسة وبسيطة ف الحمدلله والله مبسوطة بهيك أشخاص تعرفنا عليهم ومش ندمانين بالمرة بالاشتراك وإن شاء الله أي دورة أو إشي بتعمله لقدام رح نكون أول المشتركين.",
    rating: 5,
  },
  {
    name: "ولاء الخليفات",
    content: "هي الفيدباك لأنه تستاهل جد والشرح ما شاء الله كثير بجنن ومفصل تفصيل ما نشرح مثله أكاديمي أبداً أشياء أول مرة أعرفها بتمنى إلك المزيد من التقدم إن شاء الله بكل إشي وأي حد متردد يشترك فيه يشترك ع ضمانتي لأنه جد رح تستفيدوا كثير وكثير رح تكونوا مبدعين إن شاء الله بتمنى إلك عبدالله كل الخير وإن شاء الله أي دورات بتعملها أنا رح أكون أولها بإذن الله.",
    rating: 5,
  }
];

const TestimonialsSection = () => {
  const [showAll, setShowAll] = useState(false);
  const visibleTestimonials = showAll ? testimonials : testimonials.slice(0, 4);

  return (
    <section id="testimonials" className="py-20 bg-background/50">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-primary text-glow-primary mb-4">
            آراء المتدربين
          </h2>
          <p className="text-muted-foreground text-lg">ماذا يقول طلابنا عن تجربتهم مع أكاديمية دورات الأشعة</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <AnimatePresence mode="popLayout">
            {visibleTestimonials.map((testimonial) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-card rounded-xl border border-border p-6 relative group h-full flex flex-col"
              >
                <Quote className="absolute top-4 left-4 w-8 h-8 text-primary/10 group-hover:text-primary/20 transition-colors" />
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground leading-relaxed mb-6 italic flex-grow">"{testimonial.content}"</p>
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
      </div>
    </section>
  );
};

export default TestimonialsSection;
