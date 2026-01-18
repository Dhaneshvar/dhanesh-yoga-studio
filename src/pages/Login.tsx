import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff, Leaf, Sparkles, Star } from "lucide-react";
import LoginYogaGuardian from "@/components/interactive/LoginYogaGuardian";
import FloatingYogaElements from "@/components/interactive/FloatingYogaElements";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFormFocused, setIsFormFocused] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [progressPoints, setProgressPoints] = useState(0);

  const isEmailValid = email.includes("@") && email.includes(".");
  const hasStartedTyping = email.length > 0;

  const handleUnlock = useCallback(() => {
    setShowForm(true);
    setProgressPoints(prev => prev + 50);
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (e.target.value.length > 0 && progressPoints < 25) {
      setProgressPoints(25);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProgressPoints(100);
    console.log("Login attempt:", { email, password });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />
      <FloatingYogaElements />
      
      {/* Progress bar game element */}
      <motion.div 
        className="fixed top-20 left-0 right-0 z-30 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="font-body text-sm text-muted-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-turquoise" />
              Login Quest
            </span>
            <span className="font-body text-sm font-medium text-indigo flex items-center gap-1">
              <Star className="w-4 h-4 text-sunset" />
              {progressPoints} XP
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-turquoise to-indigo"
              initial={{ width: 0 }}
              animate={{ width: `${progressPoints}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs font-body text-muted-foreground">
            <span className={progressPoints >= 0 ? "text-turquoise" : ""}>Start</span>
            <span className={progressPoints >= 25 ? "text-turquoise" : ""}>Typing</span>
            <span className={progressPoints >= 50 ? "text-turquoise" : ""}>Unlocked</span>
            <span className={progressPoints >= 100 ? "text-turquoise" : ""}>Complete</span>
          </div>
        </div>
      </motion.div>
      
      <main className="pt-32 min-h-screen flex items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-lg">
          {/* Guardian Character Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="relative w-48 h-48">
              <LoginYogaGuardian
                isFormFocused={isFormFocused}
                hasStartedTyping={hasStartedTyping}
                isEmailValid={isEmailValid}
                onUnlock={handleUnlock}
              />
            </div>
          </motion.div>

          {/* Initial Email Challenge */}
          <AnimatePresence mode="wait">
            {!showForm ? (
              <motion.div
                key="challenge"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="bg-card/80 backdrop-blur-sm rounded-3xl border border-border shadow-elevated p-8"
              >
                <div className="text-center mb-6">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-4xl mb-3"
                  >
                    🔮
                  </motion.div>
                  <h1 className="font-display text-2xl font-semibold text-foreground">
                    Prove Your Inner Peace
                  </h1>
                  <p className="font-body text-muted-foreground mt-2">
                    Enter your email to unlock the sacred login form
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="font-body text-sm text-foreground block mb-2">
                      Your Sacred Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        onFocus={() => setIsFormFocused(true)}
                        onBlur={() => setIsFormFocused(false)}
                        placeholder="Enter your email to begin..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border border-border focus:border-turquoise focus:ring-2 focus:ring-turquoise/20 outline-none font-body transition-all"
                        required
                      />
                      {isEmailValid && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-turquoise"
                        >
                          ✓
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <motion.div
                    initial={false}
                    animate={{ 
                      opacity: isEmailValid ? 1 : 0.5,
                      scale: isEmailValid ? 1 : 0.98
                    }}
                  >
                    <Button 
                      variant="hero" 
                      className="w-full" 
                      size="lg"
                      disabled={!isEmailValid}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      {isEmailValid ? "Guardian Approves! Continue →" : "Complete Your Email..."}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="bg-card/80 backdrop-blur-sm rounded-3xl border border-border shadow-elevated p-8"
              >
                {/* Celebration badge */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-turquoise to-indigo rounded-full text-white text-sm font-body shadow-lg"
                >
                  ✨ Guardian Unlocked! +50 XP
                </motion.div>

                {/* Logo */}
                <div className="text-center mb-8 mt-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-turquoise to-indigo flex items-center justify-center mb-4 shadow-lg"
                  >
                    <Leaf className="w-8 h-8 text-white" />
                  </motion.div>
                  <h1 className="font-display text-3xl font-semibold text-foreground">Welcome Back</h1>
                  <p className="font-body text-muted-foreground mt-2">Complete your journey</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="font-body text-sm text-foreground block mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all"
                        required
                      />
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="font-body text-sm text-foreground block mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-12 pr-12 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-center justify-between"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                      <span className="font-body text-sm text-muted-foreground">Remember me</span>
                    </label>
                    <Link to="/forgot-password" className="font-body text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button type="submit" variant="hero" className="w-full" size="lg">
                      Complete Quest & Sign In 🏆
                    </Button>
                  </motion.div>
                </form>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-card font-body text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                {/* Social Login */}
                <Button variant="outline" className="w-full" size="lg">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>

                {/* Sign Up Link */}
                <p className="text-center mt-8 font-body text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-primary font-medium hover:underline">
                    Sign up
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Login;
