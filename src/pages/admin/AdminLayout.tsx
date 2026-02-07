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
  ChevronLeft,
  Leaf,
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
import ThemeToggle from "@/components/ThemeToggle";

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

// Extracted sidebar content component
interface AdminSidebarContentProps {
  isCollapsed: boolean;
  adminMenuItems: typeof adminMenuItems;
  isActive: (path: string) => boolean;
  navigate: ReturnType<typeof useNavigate>;
  setIsSidebarOpen: (open: boolean) => void;
  handleLogout: () => void;
}

const AdminSidebarContent = ({
  isCollapsed,
  adminMenuItems,
  isActive,
  navigate,
  setIsSidebarOpen,
  handleLogout,
}: AdminSidebarContentProps) => (
  <div className="flex flex-col h-full">
    {/* Logo Section */}
    <div className="p-4 border-b border-border">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-3"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center cursor-pointer"
          title="Go to home page"
          aria-label="Go to home page"
        >
          <Leaf className="w-5 h-5 text-primary-foreground" />
        </motion.button>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="font-display text-lg font-semibold text-foreground">
              Admin Panel
            </h2>
            <p className="text-xs text-muted-foreground">Yoga Studio</p>
          </motion.div>
        )}
      </motion.div>
    </div>

    {/* Home Link */}
    <div className="p-4 pb-2">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300 hover:bg-secondary text-foreground hover:text-foreground group"
          title="Go to Home"
          aria-label="Navigate to Home page"
        >
          <Home className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-transform duration-300 group-hover:scale-110" />
          {!isCollapsed && (
            <span className="font-body text-sm font-medium">Home</span>
          )}
        </button>
      </motion.div>
    </div>

    {/* Navigation */}
    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
      {adminMenuItems.map((item, index) => (
        <motion.button
          key={item.path}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            navigate(item.path);
            setIsSidebarOpen(false);
          }}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
            isActive(item.path)
              ? "bg-primary text-primary-foreground shadow-md"
              : "hover:bg-secondary text-foreground hover:text-foreground"
          )}
        >
          <item.icon
            className={cn(
              "w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110",
              isActive(item.path) ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
            )}
          />
          {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
        </motion.button>
      ))}
    </nav>

    {/* Logout Button */}
    <div className="p-4 border-t border-border">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleLogout}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all duration-300"
        title="Sign out of your account"
        aria-label="Logout"
      >
        <LogOut className="w-5 h-5" />
        {!isCollapsed && <span className="font-body text-sm font-medium">Logout</span>}
      </motion.button>
    </div>
  </div>
);

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
    <div className="min-h-screen bg-background flex w-full">
      {/* Mobile Menu Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-xl bg-card border border-border shadow-soft lg:hidden"
        title={isSidebarOpen ? "Close menu" : "Open menu"}
        aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
      >
        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </motion.button>

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

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isSidebarOpen ? 0 : -280 }}
        transition={{ type: "spring", damping: 25 }}
        className="fixed top-0 left-0 h-full w-[280px] bg-card border-r border-border z-50 lg:hidden"
      >
        <AdminSidebarContent 
          isCollapsed={false}
          adminMenuItems={adminMenuItems}
          isActive={isActive}
          navigate={navigate}
          setIsSidebarOpen={setIsSidebarOpen}
          handleLogout={handleLogout}
        />
      </motion.aside>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ type: "spring", damping: 25 }}
        className="hidden lg:flex flex-col h-screen bg-card border-r border-border sticky top-0"
      >
        <AdminSidebarContent 
          isCollapsed={isCollapsed}
          adminMenuItems={adminMenuItems}
          isActive={isActive}
          navigate={navigate}
          setIsSidebarOpen={setIsSidebarOpen}
          handleLogout={handleLogout}
        />
        
        {/* Collapse Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform", isCollapsed && "rotate-180")} />
        </motion.button>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-card border-b border-border px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="hidden lg:block">
              <h2 className="font-semibold text-lg text-foreground">
                Welcome back, {user?.name || "Admin"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Here's what's happening with your platform today.
              </p>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Activity Indicator */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-full">
                <Activity className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  System Online
                </span>
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                  5
                </span>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-semibold">
                      {(user?.name || "A")[0].toUpperCase()}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium">{user?.name || "Admin"}</p>
                      <p className="text-xs text-muted-foreground">Administrator</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
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
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
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
