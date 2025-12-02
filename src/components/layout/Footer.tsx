import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Instagram, Facebook, Youtube, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

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
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-sage flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
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
              {[Instagram, Facebook, Youtube].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Icon className="w-5 h-5" />
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
            © {currentYear} Harmony Yoga Studio. All rights reserved.
          </p>
          <p className="text-muted-foreground font-body text-sm">
            Made with 🧘 for mindful living
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
