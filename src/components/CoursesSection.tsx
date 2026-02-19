import { motion } from "framer-motion";
import { Clock, Users, CalendarDays, MessageCircle, Award, BookOpen } from "lucide-react";

interface Course {
  title: string;
  description: string;
  price: string;
  totalSeats: number;
  startDate: string;
  registrationEnd: string;
  duration: string;
  icon: string;
  stats?: string;
  certification: string;
  whatsappMessage: string;
}

const courses: Course[] = [
  {
    title: "دورة CT 1 الاحترافية",
    description: "تعلم بناء بروتوكولات التصوير، فهم فيزياء جهاز الـ CT بعمق، التعرف على اكثر من 40 مرض",
    price: "$80",
    totalSeats: 40,
    startDate: "1/3/2026",
    registrationEnd: "19/2/2026",
    duration: "شهرين",
    icon: "☢️",
    stats: "تم تقديمها 13 مرة لـ 200+ طالب",
    certification: "شهادة معتمدة من المعهد الكندي",
    whatsappMessage: "مرحباً، أرغب بالتسجيل في دورة CT 1 الاحترافية",
  },
  {
    title: "دورة X-Ray الشاملة",
    description: "إتقان 166 وضعية تصوير + شرح اناتومي العظام، التعرف على 140 مرض وكسر، تقييم جوده الصور لجميع الوضعيات",
    price: "$60",
    totalSeats: 40,
    startDate: "1/3/2026",
    registrationEnd: "19/2/2026",
    duration: "شهرين",
    icon: "🦴",
    certification: "",
    stats: "تم تقديمها 4 مرات لـ 80+ طالب",
    whatsappMessage: "مرحباً، أرغب بالتسجيل في دورة X-Ray الشاملة",
  },
];

const WHATSAPP_NUMBER = "962795418245";

const CoursesSection = () => {
  const handleWhatsApp = (message: string) => {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, "_blank");
  };

  return (
    <section id="courses" className="py-20 md:py-28">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black text-primary text-glow-primary mb-4">
            الدورات المتاحة
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            اختر الدورة المناسبة لك وابدأ رحلتك في عالم الأشعة التشخيصية
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {courses.map((course, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-card rounded-xl border border-border p-6 card-hover relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-l from-primary via-primary to-secondary" />

              <div className="text-5xl mb-4">{course.icon}</div>
              <h3 className="text-xl font-bold text-foreground mb-2">{course.title}</h3>

              {/* 1. البوكس البرتقالي (Stats) */}
              {course.stats && (
                <div className="flex items-center gap-2 text-sm text-primary mb-4 bg-primary/10 rounded-lg px-3 py-2">
                  <BookOpen className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">{course.stats}</span>
                </div>
              )}

              {/* 2. مربعات الوصف الخضراء المنفصلة */}
              <div className="space-y-2 mb-6">
                {course.description.split('،').map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-secondary bg-secondary/5 rounded-lg px-3 py-2 border border-secondary/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    <span className="leading-relaxed">{item.trim()}</span>
                  </div>
                ))}
              </div>

              {/* 3. بوكس الشهادة الأخضر */}
              {course.certification && (
                <div className="flex items-center gap-2 text-sm text-secondary mb-4 bg-secondary/10 rounded-lg px-3 py-2">
                  <Award className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">{course.certification}</span>
                </div>
              )}

              {/* 4. الشرط الذكي للفصل بين X-Ray و CT */}
              {course.title.includes('X-Ray') ? (
                <div className="flex items-center gap-2 text-sm text-red-500 bg-red-500/10 rounded-lg px-3 py-2 mt-4">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">التسجيل مغلق حالياً</span>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-2xl font-black text-primary">{course.price}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-secondary">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">المقاعد محدودة - التسجيل متاح</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleWhatsApp(course.whatsappMessage)}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-lg transition-all hover:shadow-lg hover:shadow-primary/20"
                  >
                    <MessageCircle className="w-5 h-5" />
                    سجل الآن عبر واتساب
                  </button>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
