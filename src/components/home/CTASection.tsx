import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Download } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-sage" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20 w-60 sm:w-80 h-60 sm:h-80 border border-primary-foreground/10 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -left-20 w-72 sm:w-96 h-72 sm:h-96 border border-primary-foreground/10 rounded-full"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-primary-foreground mb-4 sm:mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="font-body text-sm sm:text-base md:text-lg lg:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8 sm:mb-10 px-2">
            Take the first step towards a balanced, peaceful, and healthier life. 
            Join our community of mindful practitioners today.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button 
              size="xl" 
              className="bg-background text-foreground hover:bg-background/90 shadow-elevated animate-glow-breathe"
              asChild
              title="Register for a free trial class"
            >
              <Link to="/register">
                Start Free Trial
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="xl"
              className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10"
              asChild
              title="View our weekly class schedule"
            >
              <Link to="/schedule">
                <Calendar className="w-5 h-5" aria-hidden="true" />
                View Schedule
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              size="xl"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              asChild
              title="Request the yoga studio brochure"
            >
              <Link to="/contact">
                <Download className="w-5 h-5" aria-hidden="true" />
                Request Brochure
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
