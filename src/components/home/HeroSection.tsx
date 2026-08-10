import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import YogaCharacter from "@/components/interactive/YogaCharacter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCountUp } from "@/hooks/useCountUp";

const CountStat = ({
  value,
  suffix,
  label,
  color,
}: {
  value: number;
  suffix: string;
  label: string;
  color: string;
}) => {
  const { ref, value: current } = useCountUp<HTMLDivElement>(value);
  return (
    <motion.div ref={ref} className="text-center lg:text-left" whileHover={{ scale: 1.06 }}>
      <div className={`font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-${color}`}>
        {current}
        {suffix}
      </div>
      <div className="font-body text-xs sm:text-sm text-muted-foreground mt-1">{label}</div>
    </motion.div>
  );
};

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Multi-color animated background - responsive sizes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, 15, 0], x: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -right-1/4 w-[300px] sm:w-[500px] lg:w-[800px] h-[300px] sm:h-[500px] lg:h-[800px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, hsl(32 95% 55% / 0.15) 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [0, -15, 0], y: [0, -30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-1/4 -left-1/4 w-[250px] sm:w-[400px] lg:w-[600px] h-[250px] sm:h-[400px] lg:h-[600px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, hsl(345 85% 60% / 0.12) 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] lg:w-[700px] h-[300px] sm:h-[500px] lg:h-[700px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, hsl(172 70% 55% / 0.1) 0%, transparent 60%)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [-20, 20, -20] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/3 w-[200px] sm:w-[300px] lg:w-[400px] h-[200px] sm:h-[300px] lg:h-[400px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, hsl(205 55% 30% / 0.1) 0%, transparent 70%)" }}
        />
      </div>

      {/* Decorative floating elements - hidden on very small screens */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden sm:block">
        {[
          { color: "turquoise", size: 4, top: "15%", left: "8%", delay: 0 },
          { color: "lotus", size: 6, top: "25%", right: "12%", delay: 0.3 },
          { color: "sunset", size: 3, bottom: "30%", left: "15%", delay: 0.6 },
          { color: "indigo", size: 5, top: "60%", right: "8%", delay: 0.9 },
          { color: "mint", size: 4, bottom: "20%", right: "25%", delay: 1.2 },
        ].map((dot, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0.4, 0.8, 0.4], scale: 1, y: [0, -15, 0] }}
            transition={{ delay: dot.delay, duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute w-${dot.size} h-${dot.size} rounded-full bg-${dot.color}/50`}
            style={{
              top: dot.top, left: dot.left, right: dot.right, bottom: dot.bottom,
              width: dot.size * 4, height: dot.size * 4,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 md:pt-36 relative z-10">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-turquoise/10 border border-turquoise/20 text-turquoise-dark text-xs sm:text-sm font-medium mb-4 sm:mb-6"
            >
              {t('heroSection.welcome')}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-foreground leading-[1.1] mb-4 sm:mb-6"
            >
              {t('heroSection.title')}{" "}
              <span className="text-gradient-spiritual">{t('heroSection.titleHighlight')}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="font-body text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-6 sm:mb-8"
            >
              {t('heroSection.description')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <Button variant="hero" size="xl" asChild title={t('heroSection.enterStudio')}>
                <Link to="/login" className="group">
                  {t('heroSection.enterStudio')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Link>
              </Button>
              <Button variant="glass" size="xl" asChild title={t('heroSection.viewPrograms')}>
                <Link to="/programs" className="group">
                  <Play className="w-5 h-5" aria-hidden="true" />
                  {t('heroSection.viewPrograms')}
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="mt-4"
            >
              <Link to="/register" className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">
                {t('heroSection.newHere')}
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="grid grid-cols-3 gap-4 sm:gap-8 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border/50"
            >
              {[
                { value: 500, suffix: "+", label: t('heroSection.students'), color: "turquoise" },
                { value: 10, suffix: "+", label: t('heroSection.yearsExperience'), color: "sunset" },
                { value: 50, suffix: "+", label: t('heroSection.yogaAsanas'), color: "lotus" },
              ].map((stat, index) => (
                <CountStat
                  key={index}
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                  color={stat.color}
                />
              ))}

            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="relative w-[500px] h-[600px]">
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="absolute w-[400px] h-[400px] rounded-full animate-aura-pulse" />
                <YogaCharacter activePose="suryaNamaskar" className="w-80 h-80" glowColor="turquoise" showTrails={true} />
              </motion.div>

              <motion.div
                animate={{ y: [0, 15, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 px-4 py-3 rounded-2xl glass shadow-glow flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sunset to-lotus flex items-center justify-center">
                  <span className="text-xl">🌅</span>
                </div>
                <div>
                  <p className="font-body text-xs text-muted-foreground">{t('heroSection.dailyPractice')}</p>
                  <p className="font-display text-sm font-medium">{t('heroSection.suryaNamaskar')}</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-4 px-4 py-3 rounded-2xl glass shadow-glow flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-turquoise to-mint flex items-center justify-center">
                  <span className="text-xl">🧘</span>
                </div>
                <div>
                  <p className="font-body text-xs text-muted-foreground">{t('heroSection.allLevels')}</p>
                  <p className="font-display text-sm font-medium">{t('heroSection.ageRange')}</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10"
              >
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {[0, 30, 60, 90, 120, 150].map((angle) => (
                    <ellipse key={angle} cx="100" cy="60" rx="15" ry="40" fill="none" stroke="hsl(172, 70%, 55%)" strokeWidth="0.5" transform={`rotate(${angle} 100 100)`} />
                  ))}
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
        onClick={() => window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" })}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-turquoise/50 flex justify-center pt-2"
        >
          <motion.div animate={{ height: [6, 12, 6] }} transition={{ duration: 2, repeat: Infinity }} className="w-1 bg-turquoise/50 rounded-full" />
        </motion.div>
        <p className="font-body text-xs text-muted-foreground mt-2 text-center hidden sm:block">{t('heroSection.scroll')}</p>
      </motion.div>
    </section>
  );
};

export default HeroSection;