import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFloatingControlsVisibility } from "@/hooks/useFloatingControlsVisibility";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const controlsVisible = useFloatingControlsVisibility();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 120) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && controlsVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="widget-hover fixed bottom-20 right-4 z-[55] rounded-full bg-primary/95 p-2 text-primary-foreground shadow-lg backdrop-blur-sm hover:bg-primary sm:bottom-28 sm:right-8 sm:p-3"
          title="Scroll to top - Return to the beginning of the page"
          aria-label="Scroll to top of page"
        >
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" aria-hidden="true" />
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
