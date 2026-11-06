import { motion } from "framer-motion";
import { ArrowRight, BookOpen, HeartPulse, Leaf, Moon, Mountain, Shield, Sparkles, Sun, TreePine, Wind } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FlashNewsTicker from "@/components/interactive/FlashNewsTicker";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";

const WHATSAPP_NUMBER = "919876543210";

const featuredPoses = [
  { name: "Tadasana", english: "Mountain Pose", level: "Beginner friendly", focus: "Grounding & posture", description: "A steady foundation for posture, breath awareness and confidence in standing poses.", Icon: Mountain },
  { name: "Vrikshasana", english: "Tree Pose", level: "Beginner friendly", focus: "Balance & focus", description: "A calming balance practice that builds concentration, ankle strength and inner steadiness.", Icon: TreePine },
  { name: "Adho Mukha Svanasana", english: "Downward Dog", level: "Guided in class", focus: "Full-body release", description: "An energising stretch for the back body, shoulders and legs—adapted to your comfort.", Icon: Wind },
  { name: "Virabhadrasana", english: "Warrior Pose", level: "All-level options", focus: "Strength & confidence", description: "A strong standing sequence that develops stability, mobility and purposeful movement.", Icon: Shield },
  { name: "Bhujangasana", english: "Cobra Pose", level: "Gentle backbend", focus: "Chest opening", description: "A supported backbend that encourages spinal awareness and an open, easy breath.", Icon: Sun },
  { name: "Savasana", english: "Deep Rest", level: "For every body", focus: "Stress relief", description: "The closing pause that helps the nervous system settle and the practice integrate.", Icon: Moon },
];

const ageSupport = [
  { title: "Children & teens", description: "Playful movement, posture habits and calm focus for growing bodies.", Icon: Sparkles },
  { title: "Adults & beginners", description: "Practical strength, flexibility and stress relief at a comfortable pace.", Icon: HeartPulse },
  { title: "Seniors & gentle yoga", description: "Thoughtful mobility, balance and breath-led options with individual care.", Icon: Leaf },
];

const Asanas = () => {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello! I would like the Dhanesh Yoga Studio pose and programme brochure.")}`;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Yoga Poses & Guided Practice | Dhanesh Yoga Center"
        description="Explore a small selection of guided yoga poses for beginners, adults, children and seniors at Dhanesh Yoga Center."
        keywords="beginner yoga poses, guided yoga classes, yoga for seniors, kids yoga, stress relief yoga"
        canonicalPath="/asanas"
      />
      <FlashNewsTicker />
      <Navbar />

      <main className="pt-32 md:pt-36">
        <section className="relative overflow-hidden py-16 sm:py-20">
          <div className="absolute inset-0 bg-gradient-hero" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-sage-light/25 blur-3xl" aria-hidden="true" />
          <div className="container relative z-10 mx-auto max-w-4xl px-4 text-center lg:px-8">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/70 px-4 py-2 text-sm font-medium text-primary shadow-sm backdrop-blur-sm">
                <Leaf className="h-4 w-4" aria-hidden="true" /> Guided practice, not a pose catalogue
              </span>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
                Explore yoga <span className="text-gradient-sage">with guidance.</span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl font-body text-lg leading-relaxed text-muted-foreground">
                Every body is different. Here is a small glimpse of the postures we adapt and teach in class—your instructor will help you find the right variation.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="container mx-auto max-w-6xl px-4 lg:px-8">
            <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">A small sample</p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-foreground sm:text-4xl">Postures we explore together</h2>
              </div>
              <p className="max-w-md font-body text-sm leading-relaxed text-muted-foreground">We teach safe alignment and personal variations in class rather than expecting you to learn from a screen.</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPoses.map(({ name, english, level, focus, description, Icon }, index) => (
                <motion.article
                  key={name}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="group rounded-3xl border border-border bg-card p-6 shadow-card transition-shadow hover:border-primary/30 hover:shadow-elevated"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-7 w-7" strokeWidth={1.65} aria-hidden="true" />
                    </div>
                    <span className="rounded-full bg-sage-light px-3 py-1 text-xs font-semibold text-sage-dark">{level}</span>
                  </div>
                  <h3 className="mt-6 font-display text-xl font-semibold text-foreground">{name}</h3>
                  <p className="mt-1 font-body text-sm font-medium text-primary">{english}</p>
                  <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">{description}</p>
                  <p className="mt-5 border-t border-border pt-4 text-sm font-medium text-foreground"><span className="text-muted-foreground">Focus:</span> {focus}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-muted/35 py-16 sm:py-20">
          <div className="container mx-auto max-w-6xl px-4 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Practice for every stage</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-foreground sm:text-4xl">A class that meets you where you are</h2>
              <p className="mt-4 font-body leading-relaxed text-muted-foreground">From first-time practitioners to experienced movers, every session can be adjusted to support your age, energy and goals.</p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {ageSupport.map(({ title, description, Icon }, index) => (
                <motion.article key={title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: index * 0.08 }} className="rounded-3xl border border-border bg-card p-6 text-center shadow-card">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-terracotta-light text-terracotta"><Icon className="h-6 w-6" strokeWidth={1.7} aria-hidden="true" /></div>
                  <h3 className="mt-4 font-display text-xl font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">{description}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="container mx-auto max-w-4xl px-4 lg:px-8">
            <div className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-10 text-primary-foreground shadow-elevated sm:px-10 sm:py-12">
              <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full border-[24px] border-primary-foreground/10" aria-hidden="true" />
              <div className="relative max-w-2xl">
                <BookOpen className="h-8 w-8 text-gold-light" aria-hidden="true" />
                <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">Want the full studio guide?</h2>
                <p className="mt-4 font-body leading-relaxed text-primary-foreground/80">Tell us your age group, experience and goal. We will share the right programme details and help you choose a class that feels comfortable.</p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" variant="secondary" asChild><Link to="/contact">Request the brochure <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></Button>
                  <Button size="lg" variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" asChild><a href={whatsappUrl} target="_blank" rel="noreferrer">Chat with the studio</a></Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Asanas;
