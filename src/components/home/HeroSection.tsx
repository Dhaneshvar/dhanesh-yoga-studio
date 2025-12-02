import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, 0],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-sage-light/30 blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [0, -10, 0],
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-terracotta-light/20 blur-3xl"
        />
      </div>

      {/* Decorative Circles */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute top-20 left-10 w-4 h-4 rounded-full bg-primary/40"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="absolute top-40 right-20 w-6 h-6 rounded-full bg-accent/30"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="absolute bottom-40 left-1/4 w-3 h-3 rounded-full bg-gold/50"
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 pt-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
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
              className="inline-block px-4 py-2 rounded-full bg-sage-light text-sage-dark text-sm font-medium mb-6"
            >
              ✨ Welcome to Inner Peace
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-foreground leading-[1.1] mb-6"
            >
              Balance Your Body,{" "}
              <span className="text-gradient-sage">Calm Your Mind</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="font-body text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8"
            >
              Transform your life through the ancient practice of yoga. Join our 
              community and discover harmony in every breath, strength in every pose.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button variant="hero" size="xl" asChild>
                <Link to="/register" className="group">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="glass" size="xl" asChild>
                <Link to="/programs" className="group">
                  <Play className="w-5 h-5" />
                  View Programs
                </Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-border/50"
            >
              {[
                { number: "500+", label: "Students" },
                { number: "10+", label: "Years Experience" },
                { number: "50+", label: "Yoga Asanas" },
              ].map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="font-display text-3xl md:text-4xl font-semibold text-primary">
                    {stat.number}
                  </div>
                  <div className="font-body text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main Image Container */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <div className="w-[500px] h-[600px] rounded-[60px] bg-gradient-to-b from-sage-light/50 to-cream-dark overflow-hidden shadow-elevated">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center p-8">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                        className="w-32 h-32 mx-auto mb-6 rounded-full border-4 border-dashed border-primary/30 flex items-center justify-center"
                      >
                        <div className="w-24 h-24 rounded-full bg-gradient-sage animate-breathe flex items-center justify-center">
                          <span className="text-4xl">🧘</span>
                        </div>
                      </motion.div>
                      <p className="font-display text-2xl text-sage-dark italic">
                        "Inhale peace, exhale stress"
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, 15, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-8 -right-8 w-24 h-24 rounded-2xl bg-gradient-warm shadow-card flex items-center justify-center"
              >
                <span className="text-3xl">🌿</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-8 w-20 h-20 rounded-2xl bg-gold-light shadow-card flex items-center justify-center"
              >
                <span className="text-2xl">☀️</span>
              </motion.div>

              {/* Background Blob */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] blob-shape bg-sage-light/30" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-primary/50 flex justify-center pt-2"
        >
          <motion.div
            animate={{ height: [6, 12, 6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 bg-primary/50 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
