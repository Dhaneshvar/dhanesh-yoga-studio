import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import FlashNewsTicker from "@/components/interactive/FlashNewsTicker";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff, Leaf, Loader2, Users, GraduationCap, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

type UserRole = "student" | "trainer" | "admin";

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, loginWithGoogle } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const storedRole = localStorage.getItem("userRole") as UserRole | null;
      if (storedRole) {
        const route = getDashboardRoute(storedRole);
        navigate(route, { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  const roles = [
    { id: "student" as UserRole, label: "Student", icon: GraduationCap, description: "Access your classes and track progress", color: "bg-turquoise/20 border-turquoise/40 text-turquoise-dark" },
    { id: "trainer" as UserRole, label: "Yoga Master", icon: Users, description: "Manage schedules and sessions", color: "bg-lotus/20 border-lotus/40 text-lotus" },
    { id: "admin" as UserRole, label: "Admin", icon: Shield, description: "Full system administration", color: "bg-indigo/20 border-indigo/40 text-indigo-dark" },
  ];

  const getDashboardRoute = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "/admin";
      case "trainer":
        return "/dashboard/trainer-directory";
      case "student":
        return "/dashboard/student-registration";
      default:
        return "/dashboard/trainer-directory";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      setError("Please select a login type");
      return;
    }
    setError("");
    setIsSubmitting(true);

    const dashboardRoute = getDashboardRoute(selectedRole);

    // For demo: use dummy credentials
    if (email === "demo@yoga.com" && password === "demo123") {
      // Set demo session
      localStorage.setItem("yoga_app_session", JSON.stringify({ id: "demo", name: "Demo User", email: "demo@yoga.com" }));
      localStorage.setItem("userRole", selectedRole);
      // Dispatch custom event to notify Navbar
      window.dispatchEvent(new Event("authChange"));
      navigate(dashboardRoute);
    } else {
      const result = await login(email, password);
      if (!result.success && result.error) {
        setError(result.error);
      } else {
        localStorage.setItem("userRole", selectedRole);
        // Dispatch custom event to notify Navbar
        window.dispatchEvent(new Event("authChange"));
        navigate(dashboardRoute);
      }
    }
    setIsSubmitting(false);
  };

  const handleGoogleLogin = async () => {
    if (!selectedRole) {
      setError("Please select a login type first");
      return;
    }
    setError("");
    const result = await loginWithGoogle();
    if (!result.success && result.error) {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Login – Access Your Dashboard"
        description="Log in to your Dhanesh Yoga Center account. Access your classes, schedule, and personalized yoga journey as a student, trainer, or admin."
        keywords="yoga login, yoga studio account, student login, trainer login"
        canonicalPath="/login"
      />
      <FlashNewsTicker />
      <Navbar />
      
      <main className="pt-32 md:pt-36 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-3xl border border-border shadow-elevated p-8"
          >
            {/* Logo */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 mx-auto rounded-full bg-gradient-sage flex items-center justify-center mb-4"
              >
                <Leaf className="w-8 h-8 text-primary-foreground" />
              </motion.div>
              <h1 className="font-display text-3xl font-semibold text-foreground">Welcome Back</h1>
              <p className="font-body text-muted-foreground mt-2">Choose your login type to continue</p>
            </div>

            {/* Role Selection */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {roles.map((role, index) => (
                <motion.button
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedRole(role.id)}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all duration-300 text-center",
                    selectedRole === role.id
                      ? "border-primary bg-primary/10 shadow-soft"
                      : "border-border hover:border-primary/50"
                  )}
                  title={role.description}
                  aria-label={`Login as ${role.label}`}
                >
                  <role.icon className={cn("w-6 h-6 mx-auto mb-2", selectedRole === role.id ? "text-primary" : "text-muted-foreground")} />
                  <span className={cn("font-body text-sm font-medium", selectedRole === role.id ? "text-primary" : "text-foreground")}>
                    {role.label}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-body"
              >
                {error}
              </motion.div>
            )}

            {/* Demo Credentials Notice */}
            <div className="mb-4 p-3 rounded-xl bg-secondary border border-border">
              <p className="font-body text-xs text-muted-foreground text-center">
                <strong>Demo:</strong> email: demo@yoga.com | password: demo123
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-body text-sm text-foreground block mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    title="Enter your registered email address"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="font-body text-sm text-foreground block mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    title="Enter your account password"
                    className="w-full pl-12 pr-12 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all"
                    required
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    title={showPassword ? "Hide password" : "Show password"}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" variant="hero" className="w-full" size="lg" disabled={isSubmitting || !selectedRole} title="Sign in to your account">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center mt-6 font-body text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Login;
