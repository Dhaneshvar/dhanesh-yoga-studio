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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 sm:mb-6" title="Go to Dhanesh Yoga Center Homepage">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden">
                <img src={logoImg} alt="Dhanesh Yoga Center logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-display text-lg sm:text-xl font-semibold text-foreground leading-tight">
                Dhanesh Yoga Center
              </span>
            </Link>
            <p className="text-muted-foreground font-body text-sm mb-4 sm:mb-6 max-w-sm">
              {t('footerSection.brandDesc')}
            </p>
            <div className="flex items-center gap-3 sm:gap-4">
              {[
                { Icon: Instagram, label: "Follow us on Instagram" },
                { Icon: Facebook, label: "Follow us on Facebook" },
                { Icon: Youtube, label: "Subscribe to our YouTube channel" },
              ].map(({ Icon, label }, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  title={label}
                  aria-label={label}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-display text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
              {t('footerSection.programsTitle')}
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.programs.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-muted-foreground hover:text-foreground transition-colors font-body text-xs sm:text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
              {t('footerSection.resourcesTitle')}
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-muted-foreground hover:text-foreground transition-colors font-body text-xs sm:text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="font-display text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
              {t('footerSection.contactTitle')}
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground font-body text-xs sm:text-sm">123 Serenity Lane, Peaceful Valley</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                <span className="text-muted-foreground font-body text-xs sm:text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                <span className="text-muted-foreground font-body text-xs sm:text-sm">hello@dhaneshyoga.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground font-body text-xs sm:text-sm text-center sm:text-left">
            © {currentYear} {t("footer.copyright")}
          </p>
          <div className="flex items-center gap-3 sm:gap-4">
            <LanguageSwitcher variant="footer" />
            <p className="text-muted-foreground font-body text-xs sm:text-sm">
              {t("footer.tagline")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;