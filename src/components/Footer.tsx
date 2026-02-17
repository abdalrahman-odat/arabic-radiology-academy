import { MessageCircle, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/20 py-12">
      <div className="container px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-black text-primary mb-3">أكاديمية دورات الأشعة</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              دورات تدريبية احترافية ومعتمدة في مجال الأشعة التشخيصية مع المدرب عبدالله عودات
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-foreground mb-3">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#courses" className="text-muted-foreground hover:text-primary transition-colors">الدورات</a></li>
              <li><a href="#about" className="text-muted-foreground hover:text-primary transition-colors">عن المدرب</a></li>
              <li><a href="#testimonials" className="text-muted-foreground hover:text-primary transition-colors">آراء المتدربين</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-foreground mb-3">تواصل معنا</h4>
            <div className="space-y-2 text-sm">
              <a href="https://wa.me/962770000000" className="flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors">
                <MessageCircle className="w-4 h-4" />
                واتساب
              </a>
              <a href="mailto:info@radiology-courses.com" className="flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors">
                <Mail className="w-4 h-4" />
                info@radiology-courses.com
              </a>
              <a href="tel:+962770000000" className="flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors">
                <Phone className="w-4 h-4" />
                +962 77 000 0000
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted-foreground">
          جميع الحقوق محفوظة © {new Date().getFullYear()} — أكاديمية دورات الأشعة
        </div>
      </div>
    </footer>
  );
};

export default Footer;
