import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Loader2, Lock, Mail, Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import FlashNewsTicker from "@/components/interactive/FlashNewsTicker";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const dashboardFor = (role: "student" | "trainer" | "admin") => role === "admin" ? "/admin" : role === "trainer" ? "/schedule" : "/dashboard/my-registrations";

const Login = () => {
  const navigate = useNavigate();
  const { login, user, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { if (!isLoading && isAuthenticated && user) navigate(dashboardFor(user.role), { replace: true }); }, [isLoading, isAuthenticated, user, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setError("");
    const result = await login(email, password);
    if (!result.success) setError(result.error ?? "Unable to sign in. Please try again.");
    setBusy(false);
  };

  return <div className="min-h-screen bg-background">
    <SEOHead title="Sign in" description="Sign in to your Dhanesh Yoga Studio account." canonicalPath="/login" />
    <FlashNewsTicker /><Navbar />
    <main className="pt-32 md:pt-36 min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-card rounded-3xl border border-border shadow-elevated p-8">
        <div className="text-center mb-7"><div className="w-16 h-16 mx-auto rounded-full bg-gradient-sage flex items-center justify-center mb-4"><Leaf className="w-8 h-8 text-primary-foreground" /></div><h1 className="font-display text-3xl font-semibold text-foreground">Welcome back</h1><p className="font-body text-muted-foreground mt-2">Sign in with your studio account.</p></div>
        {error && <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block font-body text-sm text-foreground">Email<div className="relative mt-2"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" placeholder="you@example.com" disabled={busy} /></div></label>
          <label className="block font-body text-sm text-foreground">Password<div className="relative mt-2"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /><input required type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-12 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Your password" disabled={busy} /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label="Show or hide password">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div></label>
          <Button type="submit" variant="hero" className="w-full" size="lg" disabled={busy}>{busy && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}{busy ? "Signing in…" : "Sign in"}</Button>
        </form>
        <p className="text-center mt-6 font-body text-sm text-muted-foreground">Don&apos;t have an account? <Link to="/register" className="text-primary font-medium hover:underline">Create one</Link></p>
      </div>
    </main>
  </div>;
};

export default Login;
