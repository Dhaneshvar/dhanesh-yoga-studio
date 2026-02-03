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

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Flash news ticker at top */}
      <FlashNewsTicker />
      
      {/* Interactive breathing background */}
      <BreathingBackground variant="landing" enableClickBreath={true} />
      
      {/* Add top padding to account for flash news ticker */}
      <div className="pt-10 md:pt-11">
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
      </div>
      
      {/* WhatsApp floating bubble */}
      <WhatsAppBubble />
    </div>
  );
};

export default Index;