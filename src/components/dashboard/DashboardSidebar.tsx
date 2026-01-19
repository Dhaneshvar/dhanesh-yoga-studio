import { useState } from "react";
import { motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import {
  UserPlus,
  Users,
  Calendar,
  Clock,
  LogOut,
  Menu,
  X,
  Leaf,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  userRole: "trainer" | "admin" | "student";
  onLogout: () => void;
}

const DashboardSidebar = ({ userRole, onLogout }: DashboardSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const trainerMenuItems = [
    { icon: UserPlus, label: "Register Trainer", path: "/dashboard/register-trainer" },
    { icon: Users, label: "Trainer Directory", path: "/dashboard/trainer-directory" },
    { icon: Calendar, label: "Trainer Schedule", path: "/dashboard/trainer-schedule" },
    { icon: Clock, label: "Availability Overview", path: "/dashboard/availability" },
  ];

  const adminMenuItems = [
    { icon: Users, label: "All Users", path: "/dashboard/admin/users" },
    { icon: UserPlus, label: "Register Trainer", path: "/dashboard/register-trainer" },
    { icon: Users, label: "Trainer Directory", path: "/dashboard/trainer-directory" },
    { icon: Calendar, label: "Trainer Schedule", path: "/dashboard/trainer-schedule" },
    { icon: Clock, label: "Availability Overview", path: "/dashboard/availability" },
  ];

  const studentMenuItems = [
    { icon: Calendar, label: "My Classes", path: "/dashboard/my-classes" },
    { icon: Users, label: "Find Trainers", path: "/dashboard/trainer-directory" },
    { icon: Clock, label: "Schedule", path: "/dashboard/trainer-schedule" },
  ];

  const menuItems = userRole === "admin" ? adminMenuItems : userRole === "trainer" ? trainerMenuItems : studentMenuItems;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo & Header */}
      <div className="p-4 border-b border-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-indigo-turquoise flex items-center justify-center">
            <Leaf className="w-5 h-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="font-display text-lg font-semibold text-foreground">
                Yoga Studio
              </h2>
              <p className="text-xs text-muted-foreground capitalize">{userRole} Portal</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <NavLink
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "hover:bg-secondary text-foreground hover:text-foreground"
                )}
                title={item.label}
                aria-label={`Navigate to ${item.label}`}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
                  )}
                />
                {!isCollapsed && (
                  <span className="font-body text-sm font-medium">{item.label}</span>
                )}
              </NavLink>
            </motion.div>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-border">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onLogout}
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

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-xl bg-card border border-border shadow-soft md:hidden"
        title={isMobileOpen ? "Close menu" : "Open menu"}
        aria-label={isMobileOpen ? "Close navigation menu" : "Open navigation menu"}
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </motion.button>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isMobileOpen ? 0 : -280 }}
        transition={{ type: "spring", damping: 25 }}
        className="fixed top-0 left-0 h-full w-[280px] bg-card border-r border-border z-50 md:hidden"
      >
        {sidebarContent}
      </motion.aside>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ type: "spring", damping: 25 }}
        className="hidden md:flex flex-col h-screen bg-card border-r border-border sticky top-0"
      >
        {sidebarContent}
        
        {/* Collapse Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-soft"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform", isCollapsed && "rotate-180")} />
        </motion.button>
      </motion.aside>
    </>
  );
};

export default DashboardSidebar;
