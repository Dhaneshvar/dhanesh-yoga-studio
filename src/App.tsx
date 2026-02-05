import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Asanas from "./pages/Asanas";
import Schedule from "./pages/Schedule";
import Login from "./pages/Login";
import Register from "./pages/Register";
 import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import MeditationMode from "./components/interactive/MeditationMode";
import MeditationToggle from "./components/interactive/MeditationToggle";
import ChatbotWidget from "./components/chatbot/ChatbotWidget";
import ScrollToTop from "./components/interactive/ScrollToTop";

// Dashboard imports (Yoga Studio)
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import RegisterTrainer from "./pages/dashboard/RegisterTrainer";
import TrainerDirectory from "./pages/dashboard/TrainerDirectory";
import TrainerSchedule from "./pages/dashboard/TrainerSchedule";
import AvailabilityOverview from "./pages/dashboard/AvailabilityOverview";
import ProfileSettings from "./pages/dashboard/ProfileSettings";
import MyClasses from "./pages/dashboard/MyClasses";

// Admin Dashboard imports (Separate)
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUserManagement from "./pages/admin/AdminUserManagement";
import AdminTrainerApprovals from "./pages/admin/AdminTrainerApprovals";
import AdminSessions from "./pages/admin/AdminSessions";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminReports from "./pages/admin/AdminReports";
import AdminCommunications from "./pages/admin/AdminCommunications";
import AdminSettings from "./pages/admin/AdminSettings";

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
           <Route path="/contact" element={<Contact />} />
          
          {/* Yoga Studio Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout userRole={userRole} />}>
            <Route path="register-trainer" element={<RegisterTrainer />} />
            <Route path="trainer-directory" element={<TrainerDirectory />} />
            <Route path="trainer-schedule" element={<TrainerSchedule />} />
            <Route path="availability" element={<AvailabilityOverview />} />
            <Route path="my-classes" element={<MyClasses />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="settings" element={<ProfileSettings />} />
          </Route>

          {/* Separate Admin Dashboard Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUserManagement />} />
            <Route path="approvals" element={<AdminTrainerApprovals />} />
            <Route path="sessions" element={<AdminSessions />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="communications" element={<AdminCommunications />} />
            <Route path="settings" element={<AdminSettings />} />
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
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
