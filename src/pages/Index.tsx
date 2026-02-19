import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CoursesSection from "@/components/CoursesSection";
import AboutSection from "@/components/AboutSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Background watermark logo */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
        <img src="/logo.png" alt="" className="w-[60vw] max-w-[800px] opacity-[0.04] select-none" draggable={false} />
      </div>
      <Navbar />
      <main className="pt-16 relative z-10">
        <HeroSection />
        <CoursesSection />
        <AboutSection />
        <TestimonialsSection />
        <Footer />
      </main>
    </div>
  );
};

export default Index;
