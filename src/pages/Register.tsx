import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff, Leaf, User, Phone, Loader2, X, ScrollText } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Checkbox } from "@/components/ui/checkbox";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const { register, loginWithGoogle } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await register(
      formData.name,
      formData.email,
      formData.phone,
      formData.password,
      formData.confirmPassword
    );

    if (!result.success && result.error) {
      setError(result.error);
    }

    setIsSubmitting(false);
  };

  const handleGoogleLogin = async () => {
    setError("");
    const result = await loginWithGoogle();
    if (!result.success && result.error) {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-3xl border border-border shadow-elevated p-8"
          >
            {/* Logo */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 mx-auto rounded-full bg-gradient-sage flex items-center justify-center mb-4"
              >
                <Leaf className="w-8 h-8 text-primary-foreground" />
              </motion.div>
              <h1 className="font-display text-3xl font-semibold text-foreground">Join Harmony</h1>
              <p className="font-body text-muted-foreground mt-2">Start your yoga journey today</p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-body"
              >
                {error}
              </motion.div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="font-body text-sm text-foreground block mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    title="Enter your full name as it will appear on your profile"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="font-body text-sm text-foreground block mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    title="Enter a valid email address for account verification"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="font-body text-sm text-foreground block mb-2">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    title="Enter your phone number for class reminders"
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
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password (min 6 characters)"
                    title="Create a strong password with at least 6 characters"
                    className="w-full pl-12 pr-12 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all"
                    required
                    disabled={isSubmitting}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    title={showPassword ? "Hide password" : "Show password"}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="font-body text-sm text-foreground block mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    title="Re-enter your password to confirm"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  disabled={isSubmitting}
                  onCheckedChange={() => {}}
                  className="mt-0.5"
                />
                <label htmlFor="terms" className="font-body text-sm text-muted-foreground cursor-pointer">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-primary hover:underline font-medium"
                    title="Read Terms & Conditions"
                  >
                    Terms & Conditions
                  </button>
                  {" "}and{" "}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-primary hover:underline font-medium"
                    title="Read Privacy Policy"
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>

              <Button 
                type="submit" 
                variant="hero" 
                className="w-full" 
                size="lg" 
                disabled={isSubmitting || !termsAccepted} 
                title={termsAccepted ? "Create your Harmony Yoga account" : "Please accept Terms & Conditions to continue"}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
              {!termsAccepted && (
                <p className="text-xs text-muted-foreground text-center">
                  Please read and accept the Terms & Conditions to register
                </p>
              )}
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card font-body text-muted-foreground">Or sign up with</span>
              </div>
            </div>

            {/* Social Login */}
            <Button 
              variant="outline" 
              className="w-full" 
              size="lg"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              title="Sign up with your Google account"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" aria-hidden="true">
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
              Sign up with Google
            </Button>

            {/* Login Link */}
            <p className="text-center mt-6 font-body text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </main>

      {/* Terms & Conditions Modal */}
      <AnimatePresence>
        {showTermsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowTermsModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl border border-border shadow-elevated max-w-2xl w-full max-h-[80vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <ScrollText className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    Terms & Conditions
                  </h2>
                </div>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                  title="Close Terms & Conditions"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[50vh] space-y-4 font-body text-sm text-muted-foreground">
                <h3 className="font-semibold text-foreground">1. Acceptance of Terms</h3>
                <p>
                  By creating an account with Harmony Yoga Studio, you agree to be bound by these Terms and 
                  Conditions. If you do not agree to these terms, please do not register or use our services.
                </p>

                <h3 className="font-semibold text-foreground">2. Membership & Classes</h3>
                <p>
                  • All memberships are non-transferable and for personal use only.<br />
                  • Class schedules may change with prior notice.<br />
                  • Cancellations must be made at least 4 hours before class start time.<br />
                  • Repeated no-shows may result in membership restrictions.
                </p>

                <h3 className="font-semibold text-foreground">3. Health & Safety</h3>
                <p>
                  • You confirm you are in good physical health to participate in yoga classes.<br />
                  • Please inform instructors of any injuries or medical conditions.<br />
                  • Harmony Yoga is not responsible for injuries during classes.<br />
                  • Practice at your own pace and listen to your body.
                </p>

                <h3 className="font-semibold text-foreground">4. Privacy Policy</h3>
                <p>
                  • We collect personal information only for service purposes.<br />
                  • Your data is securely stored and never sold to third parties.<br />
                  • We may send promotional emails which you can opt out of anytime.<br />
                  • Photos taken during classes may be used for promotional purposes.
                </p>

                <h3 className="font-semibold text-foreground">5. Refund Policy</h3>
                <p>
                  • Monthly memberships can be cancelled with 7 days notice.<br />
                  • No refunds for partially used memberships.<br />
                  • Special promotional packages are non-refundable.<br />
                  • Contact us for exceptional circumstances.
                </p>

                <h3 className="font-semibold text-foreground">6. Code of Conduct</h3>
                <p>
                  • Respect fellow practitioners and instructors.<br />
                  • Maintain silence in practice areas.<br />
                  • Arrive at least 5 minutes before class starts.<br />
                  • Keep personal belongings secure.
                </p>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-border bg-muted/30">
                <Button
                  variant="hero"
                  className="w-full"
                  size="lg"
                  onClick={() => {
                    setTermsAccepted(true);
                    setShowTermsModal(false);
                  }}
                  title="Accept Terms & Conditions and continue with registration"
                >
                  <Leaf className="w-5 h-5 mr-2" />
                  Yes, I Agree to the Terms
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  By clicking above, you confirm that you have read and understood these terms.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Register;
