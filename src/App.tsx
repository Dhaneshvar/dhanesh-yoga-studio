import { lazy, Suspense, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { VoiceGuideProvider } from "./contexts/VoiceGuideContext";
import { useAuth, type UserRole } from "./hooks/useAuth";
import PageLoader from "./components/feedback/PageLoader";

const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Programs = lazy(() => import("./pages/Programs"));
const Asanas = lazy(() => import("./pages/Asanas"));
const Schedule = lazy(() => import("./pages/Schedule"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Contact = lazy(() => import("./pages/Contact"));
const Gallery = lazy(() => import("./pages/Gallery"));
const AuthAccount = lazy(() => import("./pages/AuthAccount"));
const OAuthConsent = lazy(() => import("./pages/OAuthConsent"));
const NotFound = lazy(() => import("./pages/NotFound"));
const DashboardLayout = lazy(() => import("./pages/dashboard/DashboardLayout"));
const StudentRegistration = lazy(() => import("./pages/dashboard/StudentRegistration"));
const MyRegistrations = lazy(() => import("./pages/dashboard/MyRegistrations"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminSessions = lazy(() => import("./pages/admin/AdminSessions"));

// Secondary tools are intentionally downloaded after the first screen is interactive.
const MeditationMode = lazy(() => import("./components/interactive/MeditationMode"));
const MeditationToggle = lazy(() => import("./components/interactive/MeditationToggle"));
const ChatbotWidget = lazy(() => import("./components/chatbot/ChatbotWidget"));
const ScrollToTop = lazy(() => import("./components/interactive/ScrollToTop"));
const VoiceGuideWidget = lazy(() => import("./components/voice/VoiceGuideWidget"));
const VoiceSectionObserver = lazy(() => import("./components/voice/VoiceSectionObserver"));

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  // Re-trigger CSS animation on every route change via key
  return (
    <div key={location.pathname} className="animate-page-in">
      {children}
    </div>
  );
};

const ProtectedRoute = ({ children, roles }: { children: React.ReactNode; roles?: UserRole[] }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading your account…</div>;
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard/my-classes" replace />;
  return <>{children}</>;
};

const AppContent = () => {
  const [meditationOpen, setMeditationOpen] = useState(false);
  const [deferredToolsReady, setDeferredToolsReady] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const browserWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    const idleId = browserWindow.requestIdleCallback?.(() => setDeferredToolsReady(true), { timeout: 2500 });
    const timeoutId = idleId === undefined ? window.setTimeout(() => setDeferredToolsReady(true), 1200) : undefined;
    return () => {
      if (idleId !== undefined) browserWindow.cancelIdleCallback?.(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

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
      <Suspense fallback={<PageLoader />}>
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
           <Route path="/gallery" element={<Gallery />} />
           <Route path="/account" element={<AuthAccount />} />
           <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />
          
          {/* Yoga Studio Dashboard Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout userRole={user?.role ?? "student"} /></ProtectedRoute>}>
            <Route index element={<Navigate to="my-registrations" replace />} />
            <Route path="my-classes" element={<Navigate to="/dashboard/my-registrations" replace />} />
            <Route path="student-registration" element={<StudentRegistration />} />
            <Route path="my-registrations" element={<MyRegistrations />} />
          </Route>

          {/* Separate Admin Dashboard Routes */}
          <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="sessions" replace />} />
            <Route path="sessions" element={<AdminSessions />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </Suspense>

      {deferredToolsReady && (
        <Suspense fallback={null}>
          <MeditationToggle onClick={() => setMeditationOpen(true)} />
          <MeditationMode isOpen={meditationOpen} onClose={() => setMeditationOpen(false)} />
          <ChatbotWidget />
          <ScrollToTop />
          <VoiceSectionObserver />
          <VoiceGuideWidget />
        </Suspense>
      )}
    </div>
  );
};

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    <LanguageProvider>
      <VoiceGuideProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </VoiceGuideProvider>
    </LanguageProvider>
  </ThemeProvider>
);

export default App;
