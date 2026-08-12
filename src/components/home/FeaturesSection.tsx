import { motion } from "framer-motion";
import { Wind, Clock, Users, Award, Leaf, Heart } from "lucide-react";

const features = [
  {
    icon: Wind,
    title: "Breath Awareness",
    description: "Master pranayama techniques for stress relief and energy.",
  },
  {
    icon: Clock,
    title: "Flexible Schedule",
    description: "Morning, evening, and weekend classes to fit your lifestyle.",
  },
  {
    icon: Users,
    title: "Small Groups",
    description: "Personalized attention with intimate class sizes.",
  },
  {
    icon: Award,
    title: "Certified Instructor",
    description: "Learn from an experienced, internationally certified teacher.",
  },
  {
    icon: Leaf,
    title: "Holistic Approach",
    description: "Balance physical practice with meditation and philosophy.",
  },
  {
    icon: Heart,
    title: "Supportive Community",
    description: "Join a welcoming community of fellow practitioners.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-card relative overflow-hidden">
      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-40 h-40 border border-foreground rounded-full animate-float-slow" />
        <div className="absolute top-10 left-10 w-60 h-60 border border-foreground rounded-full" />
        <div className="absolute bottom-10 right-10 w-32 h-32 border border-foreground rounded-full animate-float-slow" />
        <div className="absolute bottom-10 right-10 w-52 h-52 border border-foreground rounded-full" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-terracotta-light text-terracotta text-sm font-medium mb-4">
            Why Choose Us
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4">
            The <span className="text-shimmer">Dhanesh</span> Difference
          </h2>
          <p className="font-body text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience yoga the way it was meant to be – mindful, transformative, and deeply personal.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ scale: 1.02 }}

              className="group shine-sweep p-5 sm:p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:shadow-soft transition-all duration-500 hover:-translate-y-1"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-sage flex items-center justify-center shrink-0 icon-spring">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-base sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">
                    {feature.title}
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;