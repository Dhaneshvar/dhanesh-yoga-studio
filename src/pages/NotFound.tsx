import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Leaf, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import SEOHead from "@/components/SEOHead";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <SEOHead
        title="Page Not Found (404)"
        description="The page you're looking for doesn't exist. Navigate back to Dhanesh Yoga Center to explore our yoga programs, schedule, and more."
        canonicalPath="/"
      />
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, 0],
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, hsl(172 70% 55% / 0.1) 0%, transparent 70%)" }}
          />
          <motion.div
            animate={{ 
              scale: [1.1, 1, 1.1],
              rotate: [0, -10, 0],
            }}
            transition={{ 
              duration: 18, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, hsl(32 95% 55% / 0.1) 0%, transparent 70%)" }}
          />
        </div>

        <div className="text-center relative z-10">
          {/* Animated Lotus 404 */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 1 }}
            className="mb-8"
          >
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-sage flex items-center justify-center mb-6 relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30"
              />
              <Leaf className="w-16 h-16 text-primary-foreground" aria-hidden="true" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display text-8xl md:text-9xl font-bold text-gradient-spiritual mb-4"
          >
            404
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Lost in Meditation? 🧘
            </h2>
            <p className="font-body text-lg text-muted-foreground max-w-md mx-auto mb-8">
              The path you seek doesn't exist. Perhaps it's time to return to the center 
              and find your way back to inner peace.
            </p>
          </motion.div>

          {/* Floating Om symbols */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[
              { top: "20%", left: "10%", delay: 0 },
              { top: "30%", right: "15%", delay: 0.5 },
              { bottom: "25%", left: "20%", delay: 1 },
              { bottom: "30%", right: "10%", delay: 1.5 },
            ].map((pos, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0.2, 0.5, 0.2],
                  y: [0, -20, 0],
                }}
                transition={{ 
                  delay: pos.delay, 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute text-4xl text-primary/20"
                style={{
                  top: pos.top,
                  left: pos.left,
                  right: pos.right,
                  bottom: pos.bottom,
                }}
              >
                ॐ
              </motion.span>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              variant="hero" 
              size="lg" 
              asChild
              title="Go back to homepage"
            >
              <Link to="/">
                <Home className="w-5 h-5 mr-2" aria-hidden="true" />
                Return Home
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.history.back()}
              title="Go back to previous page"
            >
              <ArrowLeft className="w-5 h-5 mr-2" aria-hidden="true" />
              Go Back
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 font-body text-sm text-muted-foreground"
          >
            "The journey of a thousand miles begins with a single step." — Lao Tzu
          </motion.p>
        </div>
      </main>
    </div>
    </>
  );
};

export default NotFound;