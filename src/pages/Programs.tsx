import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FlashNewsTicker from "@/components/interactive/FlashNewsTicker";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowRight, Baby, Sparkles, Heart, Flower2, Clock, Users, Star } from "lucide-react";

const programs = [
  {
    id: "kids",
    icon: Baby,
    title: "Kids Yoga",
    age: "5-12 years",
    tagline: "Playful poses for growing minds",
    description: "Fun, engaging sessions designed to help children develop flexibility, focus, and confidence through playful yoga poses and breathing exercises.",
    benefits: [
      "Improved concentration and focus",
      "Better flexibility and coordination",
      "Enhanced self-confidence",
      "Stress relief through play",
      "Healthy physical development",
    ],
    schedule: "Mon, Wed, Fri - 4:00 PM",
    duration: "45 minutes",
    capacity: "10 kids per batch",
    color: "sage",
    gradient: "from-sage to-forest",
  },
  {
    id: "teens",
    icon: Sparkles,
    title: "Teen Yoga",
    age: "13-19 years",
    tagline: "Strength for transformative years",
    description: "Build physical strength, manage academic stress, and develop emotional resilience during the challenging teenage years.",
    benefits: [
      "Stress and anxiety management",
      "Improved posture and strength",
      "Better sleep quality",
      "Enhanced focus for studies",
      "Emotional balance",
    ],
    schedule: "Tue, Thu - 5:00 PM",
    duration: "60 minutes",
    capacity: "12 teens per batch",
    color: "terracotta",
    gradient: "from-terracotta to-gold",
  },
  {
    id: "adults",
    icon: Heart,
    title: "Adult Yoga",
    age: "20-50 years",
    tagline: "Balance for busy lives",
    description: "Comprehensive yoga programs designed for working professionals seeking stress relief, fitness, and overall well-being.",
    benefits: [
      "Complete stress relief",
      "Weight management",
      "Improved flexibility and strength",
      "Better work-life balance",
      "Enhanced mental clarity",
    ],
    schedule: "Daily - 6:00 AM & 7:00 PM",
    duration: "75 minutes",
    capacity: "15 adults per batch",
    color: "gold",
    gradient: "from-gold to-terracotta",
  },
  {
    id: "seniors",
    icon: Flower2,
    title: "Senior Yoga",
    age: "50+ years",
    tagline: "Gentle practice for graceful aging",
    description: "Therapeutic, gentle yoga sessions focused on maintaining mobility, balance, and mental wellness for seniors.",
    benefits: [
      "Joint flexibility and mobility",
      "Improved balance and stability",
      "Pain management",
      "Social connection",
      "Mental peace and clarity",
    ],
    schedule: "Mon, Wed, Fri - 7:00 AM",
    duration: "50 minutes",
    capacity: "8 seniors per batch",
    color: "forest",
    gradient: "from-forest to-sage",
  },
];

const Programs = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Yoga Programs for Every Age"
        description="Age-specific yoga programs: Kids Yoga (5-12), Teen Yoga (13-19), Adult Yoga (20-50), Senior Yoga (50+). Expert instruction tailored to each life stage."
        keywords="kids yoga, teen yoga, adult yoga, senior yoga, yoga programs, age-wise yoga, yoga classes Bangalore"
        canonicalPath="/programs"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Yoga Programs",
            "description": "Age-wise yoga programs for all stages of life",
            "numberOfItems": 4,
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Kids Yoga (5-12 years)" },
              { "@type": "ListItem", "position": 2, "name": "Teen Yoga (13-19 years)" },
              { "@type": "ListItem", "position": 3, "name": "Adult Yoga (20-50 years)" },
              { "@type": "ListItem", "position": 4, "name": "Senior Yoga (50+ years)" }
            ]
          }
        ]}
      />
      <FlashNewsTicker />
      <Navbar />
      
      <main className="pt-32 md:pt-36">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero" />
          
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-sage-light text-sage-dark text-sm font-medium mb-4">
                Age-Wise Programs
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
                Yoga for <span className="text-gradient-sage">Every Age</span>
              </h1>
              <p className="font-body text-lg text-muted-foreground">
                Tailored programs designed to meet the unique physical, mental, and emotional 
                needs of every age group. Find the perfect class for you or your loved ones.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Programs List */}
        <section className="py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="space-y-24">
              {programs.map((program, index) => (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Content */}
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${program.gradient} flex items-center justify-center mb-6`}>
                      <program.icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    
                    <span className="inline-block px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm font-medium mb-4">
                      {program.age}
                    </span>
                    
                    <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-2">
                      {program.title}
                    </h2>
                    <p className="font-display text-xl text-primary italic mb-4">
                      {program.tagline}
                    </p>
                    <p className="font-body text-muted-foreground mb-6">
                      {program.description}
                    </p>

                    {/* Benefits */}
                    <div className="mb-8">
                      <h4 className="font-display text-lg font-semibold text-foreground mb-4">
                        Key Benefits
                      </h4>
                      <ul className="space-y-2">
                        {program.benefits.map((benefit, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-3 font-body text-muted-foreground"
                          >
                            <Star className="w-4 h-4 text-gold shrink-0" />
                            {benefit}
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Schedule Info */}
                    <div className="flex flex-wrap gap-4 mb-8">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="font-body text-sm text-foreground">{program.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
                        <span className="font-body text-sm text-foreground">{program.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="font-body text-sm text-foreground">{program.capacity}</span>
                      </div>
                    </div>

                    <Button variant="hero" size="lg" asChild>
                      <Link to={`/programs/${program.id}`}>
                        Enroll Now
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </Button>
                  </div>

                  {/* Visual */}
                  <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className="relative"
                    >
                      <div className={`aspect-square rounded-[40px] bg-gradient-to-br ${program.gradient} p-1`}>
                        <div className="w-full h-full rounded-[36px] bg-card flex items-center justify-center">
                          <div className="text-center p-8">
                            <motion.div
                              animate={{ y: [0, -10, 0] }}
                              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                              className="mb-6"
                            >
                              <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-r ${program.gradient} flex items-center justify-center`}>
                                <program.icon className="w-16 h-16 text-primary-foreground" />
                              </div>
                            </motion.div>
                            <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
                              {program.title}
                            </h3>
                            <p className="font-body text-muted-foreground">{program.age}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Floating element */}
                      <motion.div
                        animate={{ rotate: [0, 10, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl bg-gold-light shadow-card flex items-center justify-center"
                      >
                        <span className="text-3xl">🧘</span>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-sage">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-primary-foreground mb-6">
                Not Sure Which Program?
              </h2>
              <p className="font-body text-lg text-primary-foreground/80 mb-8">
                Book a free consultation call and let us help you find the perfect yoga 
                program for your needs and goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-background text-foreground hover:bg-background/90"
                  asChild
                >
                  <Link to="/register">
                    Book Free Consultation
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <Link to="/schedule">
                    View Full Schedule
                  </Link>
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
