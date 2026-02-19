import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import logoImg from "@/assets/logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { label: "الدورات", href: "#courses" },
    { label: "عن المدرب", href: "#about" },
    { label: "آراء المتدربين", href: "#testimonials" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/70 backdrop-blur-xl border-b border-border shadow-lg shadow-background/50"
          : "bg-background/80 backdrop-blur-lg border-b border-border"
      }`}
    >
      <div className="container px-4 flex items-center justify-between h-16">
        <a href="#" className="flex items-center gap-2">
          <img
            src={logoImg}
            alt="أكاديمية دورات الأشعة"
            className={`transition-all duration-300 ${
              scrolled ? "h-9" : "h-12"
            }`}
          />
        </a>

        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              {l.label}
            </a>
          ))}
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background/90 backdrop-blur-xl border-b border-border px-4 py-4 space-y-3">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
