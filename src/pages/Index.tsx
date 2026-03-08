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
import SEOHead from "@/components/SEOHead";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <SEOHead
        title="Harmony Yoga Studio | Balance Body, Calm Mind"
        description="Transform your life through yoga at Harmony Yoga Studio. Age-wise programs for kids, teens, adults, and seniors. Expert instruction and flexible schedules."
        keywords="yoga studio, yoga classes, meditation, wellness, kids yoga, senior yoga, pranayama, asanas, Harmony Yoga"
        canonicalPath="/"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "YogaStudio",
            "name": "Harmony Yoga Studio",
            "description": "Transform your life through yoga. Age-wise programs for everyone.",
            "url": "https://harmonyyoga.com",
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
            "name": "Harmony Yoga Studio",
            "url": "https://harmonyyoga.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://harmonyyoga.com/asanas?q={search_term_string}",
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
        <HeroSection />
        
        {/* Floating quote between sections */}
        <section className="py-16 relative">
          <FloatingQuote interval={10000} className="max-w-3xl mx-auto px-4" />
        </section>
        
        <ProgramsPreview />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      
      <Footer />
      
      {/* WhatsApp floating bubble */}
      <WhatsAppBubble />
    </div>
  );
};

export default Index;
