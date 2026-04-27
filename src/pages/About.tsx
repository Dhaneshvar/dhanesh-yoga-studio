import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FlashNewsTicker from "@/components/interactive/FlashNewsTicker";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { 
  Award, BookOpen, Users, Heart, Sparkles, GraduationCap,
  Trophy, Clock, ArrowRight, Quote
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();

  const achievements = [
    { icon: GraduationCap, titleKey: 'aboutPage.achievements.certifiedInstructor', descKey: 'aboutPage.achievements.certifiedInstructorDesc' },
    { icon: Clock, titleKey: 'aboutPage.achievements.trainingHours', descKey: 'aboutPage.achievements.trainingHoursDesc' },
    { icon: Users, titleKey: 'aboutPage.achievements.studentsTransformed', descKey: 'aboutPage.achievements.studentsTransformedDesc' },
    { icon: BookOpen, titleKey: 'aboutPage.achievements.corporateWorkshops', descKey: 'aboutPage.achievements.corporateWorkshopsDesc' },
    { icon: Heart, titleKey: 'aboutPage.achievements.meditationSpecialist', descKey: 'aboutPage.achievements.meditationSpecialistDesc' },
    { icon: Trophy, titleKey: 'aboutPage.achievements.competitionExperience', descKey: 'aboutPage.achievements.competitionExperienceDesc' },
  ];

  const philosophy = [
    { titleKey: 'aboutPage.philosophy.mindBody', descKey: 'aboutPage.philosophy.mindBodyDesc' },
    { titleKey: 'aboutPage.philosophy.breathAwareness', descKey: 'aboutPage.philosophy.breathAwarenessDesc' },
    { titleKey: 'aboutPage.philosophy.consistency', descKey: 'aboutPage.philosophy.consistencyDesc' },
    { titleKey: 'aboutPage.philosophy.healing', descKey: 'aboutPage.philosophy.healingDesc' },
  ];

  const certifications = [
    { nameKey: 'aboutPage.certifications.ryt500', year: "2018" },
    { nameKey: 'aboutPage.certifications.pranayama', year: "2019" },
    { nameKey: 'aboutPage.certifications.childrenYoga', year: "2020" },
    { nameKey: 'aboutPage.certifications.seniorYoga', year: "2021" },
  ];

  const testimonials = [
    { name: "Priya Sharma", role: "Student, 3 years", content: "The best yoga instructor I've ever had. Patient, knowledgeable, and truly caring." },
    { name: "Michael Torres", role: "Corporate Client", content: "The workplace wellness sessions transformed our team's energy and focus." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="About Our Instructor"
        description="Meet your yoga instructor with 10+ years experience, RYT-500 certified."
        keywords="yoga instructor, RYT-500, certified yoga teacher"
        canonicalPath="/about"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Dhanesh Yoga Center Instructor",
          "jobTitle": "Certified Yoga Instructor (RYT-500)",
          "description": "10+ years experience teaching yoga for all age groups",
        }}
      />
      <FlashNewsTicker />
      <Navbar />
      
      <main className="pt-28 sm:pt-32 md:pt-36">
        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero" />
          <motion.div initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5 }} className="absolute -top-1/4 -right-1/4 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-sage-light/30 blur-3xl" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="relative order-2 lg:order-1">
                <div className="relative">
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="w-full max-w-xs sm:max-w-md mx-auto">
                    <div className="aspect-[3/4] rounded-[32px] sm:rounded-[40px] bg-gradient-to-b from-sage-light to-cream-dark overflow-hidden shadow-elevated">
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center p-6 sm:p-8">
                          <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="w-28 h-28 sm:w-40 sm:h-40 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-sage flex items-center justify-center">
                            <span className="text-4xl sm:text-6xl">🧘‍♀️</span>
                          </motion.div>
                          <p className="font-display text-base sm:text-xl text-sage-dark italic">{t('aboutPage.teachingQuote')}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div animate={{ y: [0, 10, 0], rotate: [0, 3, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-3 -right-2 sm:-bottom-4 sm:-right-4 lg:right-8 bg-gradient-warm text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl shadow-card">
                    <span className="font-display text-sm sm:text-lg font-semibold">{t('aboutPage.experienceBadge')}</span>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="order-1 lg:order-2 text-center lg:text-left">
                <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-sage-light text-sage-dark text-xs sm:text-sm font-medium mb-3 sm:mb-4">{t('aboutPage.badge')}</span>
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-4 sm:mb-6 leading-tight">
                  {t('aboutPage.title')} <span className="text-gradient-sage">{t('aboutPage.titleHighlight')}</span>{t('aboutPage.titleEnd')}
                </h1>
                <p className="font-body text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6 leading-relaxed">{t('aboutPage.description1')}</p>
                <p className="font-body text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed">{t('aboutPage.description2')}</p>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
                  <Button variant="hero" size="lg" asChild><Link to="/programs">{t('aboutPage.viewClasses')}<ArrowRight className="w-5 h-5" /></Link></Button>
                  <Button variant="outline" size="lg" asChild><Link to="/schedule">{t('aboutPage.bookSession')}</Link></Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="py-14 sm:py-20 md:py-24 bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-10 sm:mb-14 md:mb-16">
              <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-terracotta-light text-terracotta text-xs sm:text-sm font-medium mb-3 sm:mb-4">{t('aboutPage.achievementsBadge')}</span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-3 sm:mb-4">
                {t('aboutPage.achievementsTitle')} <span className="text-gradient-warm">{t('aboutPage.achievementsTitleHighlight')}</span> {t('aboutPage.achievementsTitleEnd')}
              </h2>
              <p className="font-body text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">{t('aboutPage.achievementsDesc')}</p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {achievements.map((achievement, index) => (
                <motion.div key={achievement.titleKey} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} whileHover={{ y: -5, transition: { duration: 0.2 } }} className="group">
                  <div className="h-full p-5 sm:p-6 rounded-2xl bg-background border border-border hover:border-primary/30 hover:shadow-elevated transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-gradient-sage flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                      <achievement.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">{t(achievement.titleKey)}</h3>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">{t(achievement.descKey)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-14 sm:py-20 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-10 sm:mb-14 md:mb-16">
              <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gold-light text-gold text-xs sm:text-sm font-medium mb-3 sm:mb-4">{t('aboutPage.certBadge')}</span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-3 sm:mb-4">
                {t('aboutPage.certTitle')} <span className="text-gradient-sage">{t('aboutPage.certTitleHighlight')}</span>
              </h2>
            </motion.div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {certifications.map((cert, index) => (
                <motion.div key={cert.nameKey} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} whileHover={{ scale: 1.05, y: -4 }} className="px-6 sm:px-8 py-5 sm:py-6 rounded-2xl bg-card border border-border shadow-card text-center min-w-[160px] flex-1 sm:flex-none sm:min-w-[200px] max-w-[260px]">
                  <Award className="w-7 h-7 sm:w-8 sm:h-8 text-gold mx-auto mb-2 sm:mb-3" />
                  <h3 className="font-display text-base sm:text-lg font-semibold text-foreground mb-1">{t(cert.nameKey)}</h3>
                  <span className="font-body text-xs sm:text-sm text-muted-foreground">{cert.year}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-14 sm:py-20 md:py-24 bg-gradient-sage relative overflow-hidden">
          <div className="absolute inset-0">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 100, repeat: Infinity, ease: "linear" }} className="absolute top-20 right-10 sm:right-20 w-48 sm:w-64 h-48 sm:h-64 border border-primary-foreground/10 rounded-full" />
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-10 sm:mb-14 md:mb-16">
              <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary-foreground/20 text-primary-foreground text-xs sm:text-sm font-medium mb-3 sm:mb-4">{t('aboutPage.philBadge')}</span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-primary-foreground mb-3 sm:mb-4">{t('aboutPage.philTitle')}</h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {philosophy.map((item, index) => (
                <motion.div key={item.titleKey} initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} whileHover={{ y: -4 }} className="p-5 sm:p-6 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 hover:bg-primary-foreground/15 transition-colors">
                  <Sparkles className="w-6 h-6 text-gold mb-3" />
                  <h3 className="font-display text-lg sm:text-xl font-semibold text-primary-foreground mb-2">{t(item.titleKey)}</h3>
                  <p className="font-body text-sm sm:text-base text-primary-foreground/80 leading-relaxed">{t(item.descKey)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-14 sm:py-20 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-10 sm:mb-14 md:mb-16">
              <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-sage-light text-sage-dark text-xs sm:text-sm font-medium mb-3 sm:mb-4">{t('aboutPage.feedbackBadge')}</span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground">{t('aboutPage.feedbackTitle')}</h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <motion.div key={testimonial.name} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.15 }} whileHover={{ y: -4 }} className="relative p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-card hover:shadow-elevated transition-shadow">
                  <div className="absolute -top-4 left-6 sm:left-8">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-soft"><Quote className="w-5 h-5 text-primary-foreground" /></div>
                  </div>
                  <p className="font-body text-sm sm:text-base text-muted-foreground mb-5 sm:mb-6 pt-2 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-sage flex items-center justify-center shrink-0">
                      <span className="font-display text-lg text-primary-foreground">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="font-display font-semibold text-foreground truncate">{testimonial.name}</div>
                      <div className="font-body text-xs sm:text-sm text-muted-foreground truncate">{testimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 sm:py-20 md:py-24 bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 sm:mb-6">{t('aboutPage.ctaTitle')}</h2>
              <p className="font-body text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">{t('aboutPage.ctaDesc')}</p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button variant="hero" size="lg" asChild><Link to="/register">{t('aboutPage.ctaButton')}<ArrowRight className="w-5 h-5" /></Link></Button>
                <Button variant="outline" size="lg" asChild><Link to="/programs">{t('aboutPage.ctaSecondary')}</Link></Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
