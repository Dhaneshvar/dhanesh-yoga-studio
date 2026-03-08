import { Outlet, useNavigate } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
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
    <div className="min-h-screen bg-background flex w-full">
      <DashboardSidebar userRole={userRole} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col overflow-auto">
        <DashboardHeader
          userRole={userRole}
          userName={user?.name || "User"}
          userEmail={user?.email || "user@example.com"}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-auto p-4 md:p-6 pt-16 md:pt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
