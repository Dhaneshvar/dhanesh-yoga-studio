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
import ChatbotWidget from "./components/chatbot/ChatbotWidget";
import ScrollToTop from "./components/interactive/ScrollToTop";

// Dashboard imports
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import RegisterTrainer from "./pages/dashboard/RegisterTrainer";
import TrainerDirectory from "./pages/dashboard/TrainerDirectory";
import TrainerSchedule from "./pages/dashboard/TrainerSchedule";
import AvailabilityOverview from "./pages/dashboard/AvailabilityOverview";
import ProfileSettings from "./pages/dashboard/ProfileSettings";
import AdminUsers from "./pages/dashboard/AdminUsers";

const queryClient = new QueryClient();

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
  const userRole = (localStorage.getItem("userRole") as "trainer" | "admin" | "student") || "trainer";

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
    <div>
      <PageTransition>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/asanas" element={<Asanas />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout userRole={userRole} />}>
            <Route path="register-trainer" element={<RegisterTrainer />} />
            <Route path="trainer-directory" element={<TrainerDirectory />} />
            <Route path="trainer-schedule" element={<TrainerSchedule />} />
            <Route path="availability" element={<AvailabilityOverview />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="settings" element={<ProfileSettings />} />
            <Route path="admin/users" element={<AdminUsers />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
      
      <MeditationToggle onClick={() => setMeditationOpen(true)} />
      <MeditationMode isOpen={meditationOpen} onClose={() => setMeditationOpen(false)} />
      <ChatbotWidget />
      <ScrollToTop />
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
