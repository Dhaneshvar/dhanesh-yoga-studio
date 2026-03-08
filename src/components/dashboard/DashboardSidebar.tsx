import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  UserPlus, Users, Calendar, Clock, LogOut, Menu, X,
  ChevronLeft, Home, User, Settings, Shield, ClipboardList, BookOpen, GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import logoImg from "@/assets/logo.png";

interface DashboardSidebarProps {
  userRole: "trainer" | "admin" | "student";
  onLogout: () => void;
}

const DashboardSidebar = ({ userRole, onLogout }: DashboardSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const trainerMenuItems = [
    { icon: UserPlus, label: "Register Trainer", path: "/dashboard/register-trainer" },
    { icon: Users, label: "Trainer Directory", path: "/dashboard/trainer-directory" },
    { icon: Calendar, label: "Trainer Schedule", path: "/dashboard/trainer-schedule" },
    { icon: Clock, label: "Availability Overview", path: "/dashboard/availability" },
  ];

  const adminMenuItems = [
    { icon: Shield, label: "User Management", path: "/dashboard/admin/users" },
    { icon: UserPlus, label: "Register Trainer", path: "/dashboard/register-trainer" },
    { icon: Users, label: "Trainer Directory", path: "/dashboard/trainer-directory" },
    { icon: Calendar, label: "Trainer Schedule", path: "/dashboard/trainer-schedule" },
    { icon: Clock, label: "Availability Overview", path: "/dashboard/availability" },
  ];

  const studentMenuItems = [
    { icon: GraduationCap, label: "Register for Class", path: "/dashboard/student-registration" },
    { icon: ClipboardList, label: "My Registrations", path: "/dashboard/my-registrations" },
    { icon: BookOpen, label: "My Classes", path: "/dashboard/my-classes" },
    { icon: Users, label: "Find Trainers", path: "/dashboard/trainer-directory" },
    { icon: Clock, label: "Schedule", path: "/dashboard/trainer-schedule" },
  ];

  const bottomMenuItems = [
    { icon: User, label: "Profile", path: "/dashboard/profile" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  const menuItems = userRole === "admin" ? adminMenuItems : userRole === "trainer" ? trainerMenuItems : studentMenuItems;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo & Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform"
            title="Go to home page"
          >
            <img src={logoImg} alt="Dhanesh Yoga Center" className="w-full h-full object-contain" />
          </button>
          {!isCollapsed && (
            <div>
              <h2 className="font-display text-base font-semibold text-foreground leading-tight">Dhanesh Yoga Center</h2>
              <p className="text-xs text-muted-foreground capitalize">{userRole} Portal</p>
            </div>
          )}
        </div>
      </div>

      {/* Home Link */}
      <div className="p-4 pb-2">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors hover:bg-secondary text-foreground group"
          title="Go to Home"
        >
          <Home className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          {!isCollapsed && <span className="font-body text-sm font-medium">Home</span>}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "hover:bg-secondary text-foreground"
              )}
              title={item.label}
            >
              <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
              {!isCollapsed && <span className="font-body text-sm font-medium">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Profile & Settings */}
      <div className="p-4 pt-2 space-y-1 border-t border-border">
        {bottomMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "hover:bg-secondary text-foreground"
              )}
              title={item.label}
            >
              <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
              {!isCollapsed && <span className="font-body text-sm font-medium">{item.label}</span>}
            </NavLink>
          );
        })}
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
          title="Sign out"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="font-body text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-xl bg-card border border-border shadow-soft md:hidden"
        title={isMobileOpen ? "Close menu" : "Open menu"}
        aria-label={isMobileOpen ? "Close navigation menu" : "Open navigation menu"}
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-[280px] bg-card border-r border-border z-50 md:hidden transition-transform duration-300",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col h-screen bg-card border-r border-border sticky top-0 transition-[width] duration-300",
          isCollapsed ? "w-20" : "w-[280px]"
        )}
      >
        {sidebarContent}

        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-soft hover:scale-110 transition-transform"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform", isCollapsed && "rotate-180")} />
        </button>
      </aside>
    </>
  );
};

export default DashboardSidebar;
