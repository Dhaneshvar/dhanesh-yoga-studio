import { Outlet, useNavigate } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useAuth } from "@/hooks/useAuth";

interface DashboardLayoutProps {
  userRole: "trainer" | "admin" | "student";
}

const DashboardLayout = ({ userRole }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar userRole={userRole} onLogout={handleLogout} />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
