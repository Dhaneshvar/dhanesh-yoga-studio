import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Yoga Student, 2 years",
    content: "Dhanesh Yoga Studio transformed my life. The instructor's patience and expertise helped me overcome anxiety and find inner peace.",
    rating: 5,
  },
  {
    name: "Rajesh Kumar",
    role: "Senior Program",
    content: "At 65, I thought yoga wasn't for me. The gentle senior classes proved me wrong – my flexibility and energy have improved dramatically.",
    rating: 5,
  },
  {
    name: "Emily Chen",
    role: "Parent of Teen Student",
    content: "My daughter's focus and confidence have improved so much since joining the teen program. Highly recommend!",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-background relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-hero opacity-50" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-gold-light text-gold text-sm font-medium mb-4">
            Student Stories
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Voices of <span className="text-shimmer">Transformation</span>
          </h2>
          <p className="font-body text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from our community members about their yoga journey with us.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative group"
            >
              <div className="h-full shine-sweep p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-card transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-elevated group-hover:border-primary/30">
                {/* Quote Icon */}
                <div className="absolute -top-4 left-6 sm:left-8">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center icon-spring animate-glow-breathe">
                    <Quote className="w-5 h-5 text-primary-foreground" />
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4 pt-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-gold text-gold transition-transform duration-300 group-hover:scale-125"
                      style={{ transitionDelay: `${i * 60}ms` }}
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="font-body text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-sage flex items-center justify-center">
                    <span className="font-display text-base sm:text-lg text-primary-foreground">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-display font-semibold text-sm sm:text-base text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="font-body text-xs sm:text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
