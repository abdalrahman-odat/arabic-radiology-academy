import { motion } from "framer-motion";
import { Award, BookOpen, Stethoscope } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-secondary/5 blur-3xl" />

      <div className="container relative z-10 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-2 mb-8">
            <Award className="w-4 h-4 text-secondary" />
            <span className="text-sm text-secondary font-medium">شهادات معتمدة</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 text-glow-primary">
            <span className="text-primary">طوّر مسيرتك المهنية</span>
            <br />
            <span className="text-foreground">في مجال الأشعة التشخيصية</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            دورات تدريبية متخصصة ومعتمدة في الأشعة المقطعية والرنين المغناطيسي
            مع المدرب عبدالله عودات — ماجستير في تخصص الأشعة
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {[
              { icon: BookOpen, label: "دورة تدريبية", value: "+10" },
              { icon: Stethoscope, label: "متدرب ناجح", value: "+500" },
              { icon: Award, label: "سنوات خبرة", value: "+8" },
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
      </div>
    </section>
  );
};

export default HeroSection;
