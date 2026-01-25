import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Instagram, Facebook, Youtube, Mail, MapPin, Phone } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  const footerLinks = {
    programs: [
      { name: "Kids Yoga", path: "/programs/kids" },
      { name: "Teen Yoga", path: "/programs/teens" },
      { name: "Adult Yoga", path: "/programs/adults" },
      { name: "Senior Yoga", path: "/programs/seniors" },
    ],
    resources: [
      { name: "Asana Library", path: "/asanas" },
      { name: "Class Schedule", path: "/schedule" },
      { name: "Brochure", path: "/brochure" },
      { name: "FAQs", path: "/faq" },
    ],
    company: [
      { name: "About", path: "/about" },
      { name: "Contact", path: "/contact" },
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Terms of Service", path: "/terms" },
    ],
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6" title="Go to Harmony Yoga Homepage">
              <div className="w-10 h-10 rounded-full bg-gradient-sage flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
              </div>
              <span className="font-display text-2xl font-semibold text-foreground">
                Harmony Yoga
              </span>
            </Link>
            <p className="text-muted-foreground font-body mb-6 max-w-sm">
              Balance your body, calm your mind, transform your life. Join us on a journey 
              of self-discovery through the ancient practice of yoga.
            </p>
            <div className="flex items-center gap-4">
              {[
                { Icon: Instagram, label: "Follow us on Instagram" },
                { Icon: Facebook, label: "Follow us on Facebook" },
                { Icon: Youtube, label: "Subscribe to our YouTube channel" },
              ].map(({ Icon, label }, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  title={label}
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-4">
              Programs
            </h4>
            <ul className="space-y-3">
              {footerLinks.programs.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    title={`Learn more about ${link.name}`}
                    className="text-muted-foreground hover:text-foreground transition-colors font-body text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-4">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    title={`View ${link.name}`}
                    className="text-muted-foreground hover:text-foreground transition-colors font-body text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-4">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-muted-foreground font-body text-sm">
                  123 Serenity Lane, Peaceful Valley
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground font-body text-sm">
                  +1 (555) 123-4567
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground font-body text-sm">
                  hello@harmonyyoga.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground font-body text-sm">
            © {currentYear} {t("footer.copyright")}
          </p>
          <div className="flex items-center gap-4">
            <LanguageSwitcher variant="footer" />
            <p className="text-muted-foreground font-body text-sm">
              {t("footer.tagline")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
