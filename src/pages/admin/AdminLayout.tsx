import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, UserCheck, Calendar, BarChart3, Settings,
  Bell, LogOut, ChevronDown, Menu, X, Home, FileText, Mail, Activity,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/ThemeToggle";
import logoImg from "@/assets/logo.png";

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
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  const sidebarContent = (collapsed: boolean) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-xl overflow-hidden hover:scale-105 transition-transform"
            title="Go to home page"
          >
            <img src={logoImg} alt="Dhanesh Yoga Center" className="w-full h-full object-contain" />
          </button>
          {!collapsed && (
            <div>
              <h2 className="font-display text-base font-semibold text-foreground leading-tight">Dhanesh Yoga Center</h2>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          )}
        </div>
      </div>

      {/* Home */}
      <div className="p-4 pb-2">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-colors hover:bg-secondary text-foreground group"
          title="Go to Home"
        >
          <Home className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          {!collapsed && <span className="font-body text-sm font-medium">Home</span>}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {adminMenuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => { navigate(item.path); setIsSidebarOpen(false); }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors group",
              isActive(item.path)
                ? "bg-primary text-primary-foreground shadow-soft"
                : "hover:bg-secondary text-foreground"
            )}
          >
            <item.icon className={cn("w-5 h-5 shrink-0", isActive(item.path) ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
            {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
          title="Sign out"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="font-body text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-xl bg-card border border-border shadow-soft lg:hidden"
        title={isSidebarOpen ? "Close menu" : "Open menu"}
      >
        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-[280px] bg-card border-r border-border z-50 lg:hidden transition-transform duration-300",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {sidebarContent(false)}
      </aside>

      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:flex flex-col h-screen bg-card border-r border-border sticky top-0 transition-[width] duration-300 relative",
        isCollapsed ? "w-20" : "w-[280px]"
      )}>
        {sidebarContent(isCollapsed)}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-soft hover:scale-110 transition-transform"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform", isCollapsed && "rotate-180")} />
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="hidden lg:block">
              <h2 className="font-semibold text-lg text-foreground">
                Welcome back, {user?.name || "Admin"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Here's what's happening with your platform today.
              </p>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <ThemeToggle />

              {/* Activity Indicator */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">System Online</span>
              </div>

              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center">5</span>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-semibold text-sm">
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
                    <Settings className="w-4 h-4 mr-2" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6 pt-16 lg:pt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
