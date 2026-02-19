import { MessageCircle, Mail, Phone } from "lucide-react";

const WHATSAPP_NUMBER = "962795418245";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/20 py-12">
      <div className="container px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-black text-primary mb-3">AOT of Radiology</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              دورات تدريبية احترافية ومعتمدة في مجال الأشعة التشخيصية مع الأستاذ عبدالله عودات
            </p>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-3">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#courses" className="text-muted-foreground hover:text-primary transition-colors">الدورات</a></li>
              <li><a href="#about" className="text-muted-foreground hover:text-primary transition-colors">عن المدرب</a></li>
              <li><a href="#testimonials" className="text-muted-foreground hover:text-primary transition-colors">آراء المتدربين</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-3">تواصل معنا</h4>
            <div className="space-y-2 text-sm">
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors">
                <MessageCircle className="w-4 h-4" />
                واتساب: 0708148303
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted-foreground">
          جميع الحقوق محفوظة © {new Date().getFullYear()} — أكاديمية دورات الأشعة | الأستاذ عبدالله عودات
        </div>
      </div>
    </footer>
  );
};

export default Footer;
