import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Home,
  ArrowLeft,
  User,
  Settings,
  Bell,
  ChevronDown,
  LogOut,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  userRole: "trainer" | "admin" | "student";
  userName?: string;
  userEmail?: string;
  onLogout: () => void;
}

const DashboardHeader = ({
  userRole,
  userName = "User",
  userEmail = "user@example.com",
  onLogout,
}: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);

  const getRoleDisplayName = () => {
    switch (userRole) {
      case "trainer":
        return "Yoga Master";
      case "admin":
        return "Administrator";
      case "student":
        return "Student";
      default:
        return "User";
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border px-4 md:px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section - Navigation */}
        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
              title="Go back"
              aria-label="Go back to previous page"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
              title="Go to home page"
              aria-label="Go to home page"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </motion.div>
        </div>

        {/* Right Section - User Profile & Settings */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              title="Notifications"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
          </motion.div>

          {/* Settings Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Settings"
                  aria-label="Open settings menu"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
                <User className="w-4 h-4 mr-2" />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/dashboard/settings")}>
                <Settings className="w-4 h-4 mr-2" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-secondary transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-indigo-turquoise flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="font-body text-sm font-medium text-foreground">
                    {userName}
                  </p>
                  <p className="font-body text-xs text-muted-foreground">
                    {getRoleDisplayName()}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-indigo-turquoise flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground">
                      {userName}
                    </p>
                    <p className="font-body text-xs text-primary">
                      {getRoleDisplayName()}
                    </p>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-3 h-3" />
                    <span className="font-body text-xs">{userEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-3 h-3" />
                    <span className="font-body text-xs">+91 98765 43210</span>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
                  <User className="w-4 h-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/dashboard/settings")}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
