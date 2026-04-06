import { motion } from "framer-motion";
import { Clock, Users, CalendarDays, MessageCircle, Award, BookOpen } from "lucide-react";
import { useCourses, useSiteSettings } from "@/hooks/useSiteData";
import { trackClick } from "@/lib/trackClick";

const CoursesSection = () => {
  const { courses, loading } = useCourses();
  const { settings } = useSiteSettings();
  const whatsappNumber = settings.whatsapp_number || "962795130027";

  const handleWhatsApp = (message: string, courseTitle: string) => {
    trackClick(`Join Course: ${courseTitle}`, "cta");
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, "_blank");
  };
  const activeCourses = courses.filter(c => c.is_active);

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

        {loading ? (
          <p className="text-center text-muted-foreground">جارٍ التحميل...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {activeCourses.map((course, i) => {
              const isOpen = (course as any).registration_status !== "closed";
              const buttonText = (course as any).button_text || "سجل الآن عبر واتساب";

              return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-card rounded-xl border border-border p-6 card-hover relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-l from-primary via-primary to-secondary" />

                <h3 className="text-xl font-bold text-foreground mb-4 mt-2">{course.title}</h3>

                {course.stats && (
                  <div className="flex items-center gap-2 text-sm text-primary mb-4 bg-primary/10 rounded-lg px-3 py-2">
                    <BookOpen className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium">{course.stats}</span>
                  </div>
                )}

                <div className="space-y-2 mb-6">
                  {course.description.split('،').map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-secondary bg-secondary/5 rounded-lg px-3 py-2 border border-secondary/10">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      <span className="leading-relaxed">{item.trim()}</span>
                    </div>
                  ))}
                </div>

                {course.certification && (
                  <div className="flex items-center gap-2 text-sm text-secondary mb-4 bg-secondary/10 rounded-lg px-3 py-2">
                    <Award className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium">{course.certification}</span>
                  </div>
                )}

                {isOpen ? (
                  <>
                    <div className="space-y-1 mb-6 mt-4">
                      <div className="flex items-center gap-2 text-sm text-green-500 font-medium">
                        <Users className="w-4 h-4" />
                        <span>المقاعد محدودة - التسجيل متاح</span>
                      </div>
                      {course.start_date && (
                        <div className="flex items-center gap-2 text-sm text-green-500 font-medium">
                          <CalendarDays className="w-4 h-4" />
                          <span>يبدأ الكورس بتاريخ: {course.start_date}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleWhatsApp(course.whatsapp_message, course.title)}
                      className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-lg transition-all hover:shadow-lg hover:shadow-primary/20"
                    >
                      <MessageCircle className="w-5 h-5" />
                      {buttonText}
                    </button>
                  </>
                ) : (
                  <div className="mt-6 text-center">
                    <p className="text-destructive font-bold text-lg">الكورس مغلق حالياً</p>
                  </div>
                )}
              </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CoursesSection;
