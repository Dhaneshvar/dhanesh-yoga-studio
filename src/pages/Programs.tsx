import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FlashNewsTicker from "@/components/interactive/FlashNewsTicker";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowRight, Baby, Sparkles, Heart, Flower2, Clock, Users, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const programDefs = [
  { id: "kids", icon: Baby, key: "kids", color: "sage", gradient: "from-sage to-forest" },
  { id: "teens", icon: Sparkles, key: "teens", color: "terracotta", gradient: "from-terracotta to-gold" },
  { id: "adults", icon: Heart, key: "adults", color: "gold", gradient: "from-gold to-terracotta" },
  { id: "seniors", icon: Flower2, key: "seniors", color: "forest", gradient: "from-forest to-sage" },
];

const Programs = () => {
  const { t } = useLanguage();

  const programs = programDefs.map((p) => ({
    ...p,
    title: t(`programsPage.${p.key}.title`),
    age: t(`programsPage.${p.key}.age`),
    tagline: t(`programsPage.${p.key}.tagline`),
    description: t(`programsPage.${p.key}.description`),
    benefits: (() => {
      const val = t(`programsPage.${p.key}.benefits`);
      return Array.isArray(val) ? val : [val];
    })(),
    schedule: t(`programsPage.${p.key}.schedule`),
    duration: t(`programsPage.${p.key}.duration`),
    capacity: t(`programsPage.${p.key}.capacity`),
  }));

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Yoga Programs for Every Age"
        description="Age-specific yoga programs: Kids Yoga (5-12), Teen Yoga (13-19), Adult Yoga (20-50), Senior Yoga (50+)."
        keywords="kids yoga, teen yoga, adult yoga, senior yoga, yoga programs"
        canonicalPath="/programs"
        jsonLd={[{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "Yoga Programs",
          "numberOfItems": 4,
        }]}
      />
      <FlashNewsTicker />
      <Navbar />
      
      <main className="pt-32 md:pt-36">
        {/* Hero */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center max-w-3xl mx-auto">
              <span className="inline-block px-4 py-2 rounded-full bg-sage-light text-sage-dark text-sm font-medium mb-4">{t('programsPage.badge')}</span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
                {t('programsPage.title')} <span className="text-gradient-sage">{t('programsPage.titleHighlight')}</span>
              </h1>
              <p className="font-body text-lg text-muted-foreground">{t('programsPage.description')}</p>
            </motion.div>
          </div>
        </section>

        {/* Programs List */}
        <section className="py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="space-y-24">
              {programs.map((program, index) => (
                <motion.div key={program.id} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
                >
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${program.gradient} flex items-center justify-center mb-6`}>
                      <program.icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm font-medium mb-4">{program.age}</span>
                    <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-2">{program.title}</h2>
                    <p className="font-display text-xl text-primary italic mb-4">{program.tagline}</p>
                    <p className="font-body text-muted-foreground mb-6">{program.description}</p>
                    <div className="mb-8">
                      <h4 className="font-display text-lg font-semibold text-foreground mb-4">{t('programsPage.keyBenefits')}</h4>
                      <ul className="space-y-2">
                        {program.benefits.map((benefit: string, i: number) => (
                          <motion.li key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3 font-body text-muted-foreground">
                            <Star className="w-4 h-4 text-gold shrink-0" />{benefit}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-4 mb-8">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted"><Clock className="w-4 h-4 text-primary" /><span className="font-body text-sm text-foreground">{program.schedule}</span></div>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted"><span className="font-body text-sm text-foreground">{program.duration}</span></div>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted"><Users className="w-4 h-4 text-primary" /><span className="font-body text-sm text-foreground">{program.capacity}</span></div>
                    </div>
                    <Button variant="hero" size="lg" asChild><Link to={`/register?program=${program.id}`}>{t('programsPage.enrollNow')}<ArrowRight className="w-5 h-5" /></Link></Button>
                  </div>
                  <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }} className="relative">
                      <div className={`aspect-square rounded-[40px] bg-gradient-to-br ${program.gradient} p-1`}>
                        <div className="w-full h-full rounded-[36px] bg-card flex items-center justify-center">
                          <div className="text-center p-8">
                            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="mb-6">
                              <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-r ${program.gradient} flex items-center justify-center`}>
                                <program.icon className="w-16 h-16 text-primary-foreground" />
                              </div>
                            </motion.div>
                            <h3 className="font-display text-2xl font-semibold text-foreground mb-2">{program.title}</h3>
                            <p className="font-body text-muted-foreground">{program.age}</p>
                          </div>
                        </div>
                      </div>
                      <motion.div animate={{ rotate: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl bg-gold-light shadow-card flex items-center justify-center">
                        <span className="text-3xl">🧘</span>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-gradient-sage">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-primary-foreground mb-6">{t('programsPage.ctaTitle')}</h2>
              <p className="font-body text-lg text-primary-foreground/80 mb-8">{t('programsPage.ctaDesc')}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-background text-foreground hover:bg-background/90" asChild>
                  <Link to="/register">{t('programsPage.bookConsultation')}<ArrowRight className="w-5 h-5" /></Link>
                </Button>
                <Button variant="outline" size="lg" className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <Link to="/schedule">{t('programsPage.viewSchedule')}</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Programs;
