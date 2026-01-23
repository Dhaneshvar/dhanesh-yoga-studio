import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  BarChart3,
  Settings,
  Shield,
  Bell,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Home,
  FileText,
  Mail,
  Activity,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const adminMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Users, label: "User Management", path: "/admin/users" },
  { icon: UserCheck, label: "Trainer Approvals", path: "/admin/approvals" },
  { icon: Calendar, label: "Session Management", path: "/admin/sessions" },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
  { icon: FileText, label: "Reports", path: "/admin/reports" },
  { icon: Mail, label: "Communications", path: "/admin/communications" },
  { icon: Settings, label: "System Settings", path: "/admin/settings" },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex w-full">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? 80 : 280,
          x: isSidebarOpen ? 0 : typeof window !== "undefined" && window.innerWidth < 1024 ? -280 : 0,
        }}
        className={cn(
          "fixed lg:relative h-screen bg-slate-900 text-white z-50 flex flex-col",
          "transition-all duration-300"
        )}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            animate={{ opacity: isCollapsed ? 0 : 1 }}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-bold text-lg">Admin Panel</h1>
                <p className="text-xs text-slate-400">Yoga Studio</p>
              </div>
            )}
          </motion.div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {adminMenuItems.map((item) => (
            <motion.button
              key={item.path}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                navigate(item.path);
                setIsSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                isActive(item.path)
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </motion.button>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-700 space-y-2">
          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Back to Site</span>}
          </motion.button>
          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="hidden lg:block">
                <h2 className="font-semibold text-lg text-slate-900 dark:text-white">
                  Welcome back, {user?.name || "Admin"}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Here's what's happening with your platform today.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Activity Indicator */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  System Online
                </span>
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  5
                </span>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-semibold">
                      {(user?.name || "A")[0].toUpperCase()}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium">{user?.name || "Admin"}</p>
                      <p className="text-xs text-slate-500">Administrator</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/admin/settings")}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
