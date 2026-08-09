import { Outlet, useNavigate } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import PractitionerScene from "@/components/three/PractitionerScene";
import { useAuth } from "@/hooks/useAuth";


interface DashboardLayoutProps {
  userRole: "trainer" | "admin" | "student";
}

const DashboardLayout = ({ userRole }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="h-screen bg-background flex w-full overflow-hidden">
      <DashboardSidebar userRole={userRole} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <DashboardHeader
          userRole={userRole}
          userName={user?.name || "User"}
          userEmail={user?.email || "user@example.com"}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 pt-14 sm:pt-16 md:pt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;