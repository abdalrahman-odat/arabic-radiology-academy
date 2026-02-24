import { motion } from "framer-motion";
import { Award, BookOpen, Users } from "lucide-react";
import instructorImg from "@/assets/instructor.png";
import { useSiteSettings } from "@/hooks/useSiteData";

const HeroSection = () => {
  const { settings } = useSiteSettings();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30" />
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-secondary/5 blur-3xl" />

      <div className="container relative z-10 px-4">
        <div className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center md:text-right"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-2 mb-8">
              <Award className="w-4 h-4 text-secondary" />
              <span className="text-sm text-secondary font-medium">
                {settings.hero_tagline || "الموقع الرسمي الاول المخصص للاشعة"}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 text-glow-primary">
              <span className="text-primary">{settings.academy_name || "AOT of Radiology"}</span>
              <br />
              <span className="text-foreground">طوّر مسيرتك المهنية في التصوير الطبي</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto md:mx-0 mb-10 leading-relaxed">
              {settings.hero_description || "دورات تدريبية احترافية في CT و X-Ray مع الأستاذ عبدالله عودات — ماجستير في تخصص الأشعة ومدرب سريري في مستشفى السعودي"}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-8 md:gap-12">
              {[
                { icon: Users, label: "طالب ناجح", value: settings.total_students || "+300" },
                { icon: BookOpen, label: "دفعة ناجحة", value: settings.total_batches || "17" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
                  className="text-center"
                >
                  <stat.icon className="w-6 h-6 text-secondary mx-auto mb-2" />
                  <div className="text-3xl font-black text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-shrink-0"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-full bg-primary/30 blur-3xl scale-110" />
              <img
                src={instructorImg}
                alt={settings.instructor_name || "الأستاذ عبدالله عودات"}
                className="relative w-56 h-56 md:w-80 md:h-80 rounded-full object-cover border-4 border-primary/40 shadow-2xl shadow-primary/20"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
