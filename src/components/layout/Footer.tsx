import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Instagram, Facebook, Youtube, Mail, MapPin, Phone } from "lucide-react";
import logoImg from "@/assets/logo.png";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  const footerLinks = {
    programs: [
      { name: t('footerSection.kidsYoga'), path: "/programs/kids" },
      { name: t('footerSection.teenYoga'), path: "/programs/teens" },
      { name: t('footerSection.adultYoga'), path: "/programs/adults" },
      { name: t('footerSection.seniorYoga'), path: "/programs/seniors" },
    ],
    resources: [
      { name: t('footerSection.asanaLibrary'), path: "/asanas" },
      { name: t('footerSection.classSchedule'), path: "/schedule" },
      { name: t('footerSection.brochure'), path: "/brochure" },
      { name: t('footerSection.faqs'), path: "/faq" },
    ],
    company: [
      { name: t('footerSection.about'), path: "/about" },
      { name: t('footerSection.contact'), path: "/contact" },
      { name: t('footerSection.privacyPolicy'), path: "/privacy" },
      { name: t('footerSection.termsOfService'), path: "/terms" },
    ],
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6" title="Go to Dhanesh Yoga Center Homepage">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img src={logoImg} alt="Dhanesh Yoga Center logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-display text-2xl font-semibold text-foreground">
                Dhanesh Yoga
              </span>
            </Link>
            <p className="text-muted-foreground font-body mb-6 max-w-sm">
              {t('footerSection.brandDesc')}
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
              {t('footerSection.programsTitle')}
            </h4>
            <ul className="space-y-3">
              {footerLinks.programs.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-muted-foreground hover:text-foreground transition-colors font-body text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-4">
              {t('footerSection.resourcesTitle')}
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-muted-foreground hover:text-foreground transition-colors font-body text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-4">
              {t('footerSection.contactTitle')}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-muted-foreground font-body text-sm">123 Serenity Lane, Peaceful Valley</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground font-body text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground font-body text-sm">hello@dhaneshyoga.com</span>
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
