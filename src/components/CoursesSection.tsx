import { motion } from "framer-motion";
import { Clock, Users, CalendarDays, MessageCircle } from "lucide-react";

interface Course {
  title: string;
  description: string;
  price: string;
  seats: number;
  startDate: string;
  endDate: string;
  icon: string;
}

const courses: Course[] = [
  {
    title: "الأشعة المقطعية للدماغ",
    description: "دورة شاملة في تحليل وقراءة صور الأشعة المقطعية للدماغ مع حالات سريرية واقعية",
    price: "150 دينار",
    seats: 5,
    startDate: "2026-03-01",
    endDate: "2026-03-15",
    icon: "🧠",
  },
  {
    title: "الرنين المغناطيسي للبطن",
    description: "تعلم أساسيات وتقنيات التصوير بالرنين المغناطيسي لمنطقة البطن والحوض",
    price: "200 دينار",
    seats: 8,
    startDate: "2026-04-01",
    endDate: "2026-04-20",
    icon: "🫁",
  },
  {
    title: "أشعة الطوارئ",
    description: "دورة متقدمة في قراءة صور الأشعة في حالات الطوارئ والإصابات الحرجة",
    price: "180 دينار",
    seats: 3,
    startDate: "2026-05-01",
    endDate: "2026-05-18",
    icon: "🚑",
  },
];

const CoursesSection = () => {
  const handleWhatsApp = (courseTitle: string) => {
    const message = encodeURIComponent(`مرحباً، أرغب بالتسجيل في دورة: ${courseTitle}`);
    window.open(`https://wa.me/962770000000?text=${message}`, "_blank");
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-card rounded-xl border border-border p-6 card-hover relative overflow-hidden group"
            >
              {/* Glow accent on top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-l from-primary via-primary to-secondary" />

              <div className="text-5xl mb-4">{course.icon}</div>
              <h3 className="text-xl font-bold text-foreground mb-2">{course.title}</h3>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{course.description}</p>

              {/* Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-2xl font-black text-primary">{course.price}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-secondary">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">بقي {course.seats} مقاعد فقط</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="w-4 h-4" />
                  <span>يبدأ: {course.startDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>ينتهي: {course.endDate}</span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => handleWhatsApp(course.title)}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-lg transition-all hover:shadow-lg hover:shadow-primary/20"
              >
                <MessageCircle className="w-5 h-5" />
                سجل الآن عبر واتساب
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
