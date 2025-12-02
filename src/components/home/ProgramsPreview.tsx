import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Baby, Sparkles, Heart, Flower2 } from "lucide-react";

const programs = [
  {
    icon: Baby,
    title: "Kids Yoga",
    age: "5-12 years",
    description: "Fun, playful sessions designed to improve focus, flexibility, and confidence in young minds.",
    color: "bg-sage-light text-sage-dark",
    iconBg: "bg-sage",
    path: "/programs/kids",
  },
  {
    icon: Sparkles,
    title: "Teen Yoga",
    age: "13-19 years",
    description: "Build strength, manage stress, and develop mindfulness during transformative years.",
    color: "bg-terracotta-light text-terracotta",
    iconBg: "bg-terracotta",
    path: "/programs/teens",
  },
  {
    icon: Heart,
    title: "Adult Yoga",
    age: "20-50 years",
    description: "Comprehensive programs for stress relief, fitness, and overall well-being.",
    color: "bg-gold-light text-gold",
    iconBg: "bg-gold",
    path: "/programs/adults",
  },
  {
    icon: Flower2,
    title: "Senior Yoga",
    age: "50+ years",
    description: "Gentle, therapeutic practices for flexibility, balance, and peaceful aging.",
    color: "bg-muted text-forest",
    iconBg: "bg-forest",
    path: "/programs/seniors",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const ProgramsPreview = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-sage-light/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-terracotta-light/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-sage-light text-sage-dark text-sm font-medium mb-4">
            Age-Wise Programs
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Yoga for <span className="text-gradient-sage">Every Stage</span> of Life
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Tailored programs designed to meet the unique needs of every age group, 
            from playful kids to graceful seniors.
          </p>
        </motion.div>

        {/* Programs Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {programs.map((program, index) => (
            <motion.div
              key={program.title}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group"
            >
              <Link to={program.path}>
                <div className="h-full p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-elevated transition-all duration-300">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl ${program.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <program.icon className="w-7 h-7 text-primary-foreground" />
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                    {program.title}
                  </h3>
                  <span className={`inline-block px-2 py-1 rounded-md ${program.color} text-xs font-medium mb-3`}>
                    {program.age}
                  </span>
                  <p className="font-body text-sm text-muted-foreground mb-4">
                    {program.description}
                  </p>

                  {/* Link */}
                  <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button variant="hero" size="lg" asChild>
            <Link to="/programs">
              View All Programs
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProgramsPreview;
