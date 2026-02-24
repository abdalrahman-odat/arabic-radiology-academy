import { motion } from "framer-motion";
import { GraduationCap, Hospital, Award, Users } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteData";

const AboutSection = () => {
  const { settings } = useSiteSettings();

  return (
    <section id="about" className="py-20 md:py-28 bg-muted/30">
      <div className="container px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-black text-primary text-glow-primary mb-6">
              عن المدرب
            </h2>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              {settings.instructor_name || "الأستاذ عبدالله عودات"}
            </h3>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {settings.instructor_bio || "مدرب متخصص في مجال الأشعة التشخيصية، يمتلك خبرة واسعة في التعليم الأكاديمي والتدريب السريري."}
            </p>

            <div className="space-y-4">
              {[
                {
                  icon: GraduationCap,
                  title: "ماجستير في تخصص الأشعة",
                  desc: "شهادة أكاديمية متقدمة في علوم الأشعة التشخيصية",
                },
                {
                  icon: Hospital,
                  title: "مدرب سريري في المستشفى السعودي",
                  desc: "خبرة عملية مباشرة في بيئة المستشفى",
                },
                {
                  icon: Users,
                  title: `أكثر من ${settings.total_students || "300"} طالب في ${settings.total_batches || "17"} دفعة`,
                  desc: "سجل حافل في تأهيل فنيي الأشعة المحترفين",
                },
                {
                  icon: Award,
                  title: "مدرب معتمد من المعهد الكندي",
                  desc: "",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 blur-2xl" />
              <div className="relative w-full h-full rounded-2xl border-2 border-secondary/30 bg-card flex flex-col items-center justify-center gap-4 border-glow">
                <GraduationCap className="w-20 h-20 text-primary" />
                <p className="text-secondary font-black mb-6 text-2xl md:text-3xl tracking-wider">
                  {settings.academy_name || "AOT of Radiology"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
