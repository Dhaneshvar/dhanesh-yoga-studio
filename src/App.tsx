import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import Index from "./pages/Index";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Asanas from "./pages/Asanas";
import Schedule from "./pages/Schedule";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import MeditationMode from "./components/interactive/MeditationMode";
import MeditationToggle from "./components/interactive/MeditationToggle";
import AnimatedYogaCursor from "./components/interactive/AnimatedYogaCursor";

const queryClient = new QueryClient();

// Simple page transition wrapper
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

const AppContent = () => {
  const [meditationOpen, setMeditationOpen] = useState(false);

  // Handle ESC key for meditation mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && meditationOpen) {
        setMeditationOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [meditationOpen]);

  return (
    <div className="yoga-cursor-active">
      {/* Animated yoga pose cursor */}
      <AnimatedYogaCursor />
      
      <PageTransition>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/asanas" element={<Asanas />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
      
      {/* Meditation mode toggle */}
      <MeditationToggle onClick={() => setMeditationOpen(true)} />
      
      {/* Meditation mode overlay */}
      <MeditationMode 
        isOpen={meditationOpen} 
        onClose={() => setMeditationOpen(false)} 
      />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;