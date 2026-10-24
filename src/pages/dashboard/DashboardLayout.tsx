import { lazy, Suspense, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useAuth } from "@/hooks/useAuth";

const PractitionerScene = lazy(() => import("@/components/three/PractitionerScene"));

interface DashboardLayoutProps {
  userRole: "trainer" | "admin" | "student";
}

const DashboardLayout = ({ userRole }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setSceneReady(true), 1200);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="h-screen bg-background flex w-full overflow-hidden">
      <DashboardSidebar userRole={userRole} onLogout={handleLogout} />
      <div className="relative flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {userRole === "student" && sceneReady && (
          <Suspense fallback={null}>
            <PractitionerScene />
          </Suspense>
        )}
        <DashboardHeader
          userRole={userRole}
          userName={user?.name || "User"}
          userEmail={user?.email || "user@example.com"}
          onLogout={handleLogout}
        />
        <main className="relative flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 pt-14 sm:pt-16 md:pt-6">
          <div className="relative z-10 animate-fade-in">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;
