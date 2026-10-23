import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import ProgramsPreview from "@/components/home/ProgramsPreview";
import FeaturesSection from "@/components/home/FeaturesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import BreathingBackground from "@/components/interactive/BreathingBackground";
import FloatingQuote from "@/components/interactive/FloatingQuote";
import WhatsAppBubble from "@/components/interactive/WhatsAppBubble";
import FlashNewsTicker from "@/components/interactive/FlashNewsTicker";
import Reveal from "@/components/animation/Reveal";
import SEOHead from "@/components/SEOHead";
import YogaMatConcept from "@/pages/YogaMatConcept";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <SEOHead
        title="Dhanesh Yoga Center | Balance Body, Calm Mind"
        description="Transform your life through yoga at Dhanesh Yoga Center. Age-wise programs for kids, teens, adults, and seniors. Expert instruction and flexible schedules."
        keywords="yoga studio, yoga classes, meditation, wellness, kids yoga, senior yoga, pranayama, asanas, Dhanesh Yoga"
        canonicalPath="/"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "YogaStudio",
            "name": "Dhanesh Yoga Center",
            "description": "Transform your life through yoga. Age-wise programs for everyone.",
            "url": "https://dhaneshyoga.com",
            "telephone": "+919876543210",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "123 Serenity Lane, Wellness District",
              "addressLocality": "Bangalore",
              "addressRegion": "Karnataka",
              "postalCode": "560001",
              "addressCountry": "IN"
            },
            "openingHours": ["Mo-Fr 06:00-21:00", "Sa-Su 07:00-18:00"],
            "priceRange": "$$"
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Dhanesh Yoga Center",
            "url": "https://dhaneshyoga.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://dhaneshyoga.com/asanas?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }
        ]}
      />
      {/* Flash news ticker at top */}
      <FlashNewsTicker />
      
      {/* Interactive breathing background */}
      <BreathingBackground variant="landing" />
      
      {/* Navbar */}
      <Navbar />
      
      <main>
        <div data-voice-section="home-welcome" data-voice-title="Welcome to Dhanesh Yoga Studio">
          <YogaMatConcept embedded />
        </div>

        <div data-voice-section="home-hero" data-voice-title="Welcome"><HeroSection /></div>

        {/* Floating quote between sections */}
        <Reveal as="section" className="py-16 relative" y={20}>
          <FloatingQuote interval={10000} className="max-w-3xl mx-auto px-4" />
        </Reveal>

        <Reveal>
          <div data-voice-section="home-programs" data-voice-title="Our Programs"><ProgramsPreview /></div>
        </Reveal>
        <Reveal>
          <div data-voice-section="home-features" data-voice-title="Why Choose Us"><FeaturesSection /></div>
        </Reveal>
        <Reveal>
          <div data-voice-section="home-testimonials" data-voice-title="Testimonials"><TestimonialsSection /></div>
        </Reveal>
        <Reveal>
          <div data-voice-section="home-cta" data-voice-title="Get Started"><CTASection /></div>
        </Reveal>
      </main>

      <Footer />
      
      {/* WhatsApp floating bubble */}
      <WhatsAppBubble />
    </div>
  );
};

export default Index;
