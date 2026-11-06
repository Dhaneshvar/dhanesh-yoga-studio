import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import logoImg from "@/assets/logo.webp";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth, type UserRole } from "@/hooks/useAuth";

const navLinks = [
  { name: "nav.home", path: "/" },
  { name: "nav.about", path: "/about" },
  { name: "nav.programs", path: "/programs" },
  { name: "nav.asanas", path: "/asanas" },
  { name: "nav.schedule", path: "/schedule" },
  { name: "nav.gallery", path: "/gallery" },
  { name: "nav.contact", path: "/contact" },
];

const getDashboardRoute = (role: UserRole) => {
  switch (role) {
    case "admin":
      return "/admin";
    case "trainer":
      return "/trainer";
    case "student":
      return "/dashboard/my-registrations";
    default:
      return "/";
  }
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [tickerVisible, setTickerVisible] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();

  // Listen for ticker visibility changes
  useEffect(() => {
    const handleTickerChange = (e: CustomEvent<{ isVisible: boolean }>) => {
      setTickerVisible(e.detail.isVisible);
    };
    window.addEventListener("tickerVisibilityChange", handleTickerChange as EventListener);
    return () => window.removeEventListener("tickerVisibilityChange", handleTickerChange as EventListener);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const goToDashboard = () => {
    if (user) {
      navigate(getDashboardRoute(user.role));
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
        tickerVisible ? "top-10 md:top-11" : "top-0"
      } ${
        scrolled
          ? "bg-background/90 backdrop-blur-lg shadow-soft"
          : "border-b border-[#24483a]/10 bg-[#f7f0e5]/88 backdrop-blur-md shadow-[0_8px_28px_rgba(43,38,29,.08)] dark:border-white/10 dark:bg-[#132a23]/92"
      }`}
    >
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0" title="Go to Dhanesh Yoga Studio Homepage">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden"
            >
              <img src={logoImg} alt="Dhanesh Yoga Studio logo" className="w-full h-full object-cover" />
            </motion.div>
            <span className="font-display text-base sm:text-xl font-semibold leading-tight text-[#24483a] dark:text-[#f6efe2]">
              <span className="hidden xs:inline sm:inline">Dhanesh Yoga Studio</span>
              <span className="xs:hidden sm:hidden inline" aria-label="Dhanesh Yoga Studio">DYS</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                title={`Navigate to ${t(link.name)} page`}
                className="relative whitespace-nowrap font-body text-sm font-semibold text-[#24483a]/90 transition-colors hover:text-[#132f25] dark:text-[#f6efe2]/90 dark:hover:text-white"
              >
                {t(link.name)}
                <motion.span
                  className="absolute -bottom-1 left-0 h-0.5 bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: location.pathname === link.path ? "100%" : 0,
                  }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-4">
            <ThemeToggle />
            <LanguageSwitcher variant="navbar" />
            {isAuthenticated ? (
              <>
                <Button 
                  variant="hero" 
                  size="default" 
                  onClick={goToDashboard}
                  title="Go to Dashboard"
                  className="flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  title="Logout"
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  title={t("nav.login")}
                  className="text-[#24483a] hover:bg-[#24483a]/10 hover:text-[#132f25] dark:text-[#f6efe2] dark:hover:bg-white/10 dark:hover:text-white"
                >
                  <Link to="/login">{t("nav.login")}</Link>
                </Button>
                <Button variant="hero" size="default" asChild title={t("nav.joinNow")}>
                  <Link to="/register">{t("nav.joinNow")}</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            title={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {isOpen ? (
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="lg:hidden bg-background/95 backdrop-blur-lg border-t border-border max-h-[80vh] overflow-y-auto"
          >
            <div className="container mx-auto px-4 py-4 sm:py-6 space-y-2 sm:space-y-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={link.path}
                    title={`Navigate to ${t(link.name)} page`}
                    className={`block py-2.5 sm:py-3 px-4 rounded-lg font-body text-sm sm:text-base transition-colors ${
                      location.pathname === link.path
                        ? "bg-sage-light text-sage-dark font-medium"
                        : "text-foreground/80 hover:bg-muted"
                    }`}
                  >
                    {t(link.name)}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-3 sm:pt-4 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <LanguageSwitcher variant="navbar" />
                </div>
                {isAuthenticated ? (
                  <>
                    <Button 
                      variant="hero" 
                      className="w-full flex items-center justify-center gap-2" 
                      onClick={goToDashboard}
                      title="Go to Dashboard"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2" 
                      onClick={handleLogout}
                      title="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full" asChild title={t("nav.login")}>
                      <Link to="/login">{t("nav.login")}</Link>
                    </Button>
                    <Button variant="hero" className="w-full" asChild title={t("nav.joinNow")}>
                      <Link to="/register">{t("nav.joinNow")}</Link>
                    </Button>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
