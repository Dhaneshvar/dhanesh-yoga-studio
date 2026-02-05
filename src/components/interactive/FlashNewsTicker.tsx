import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface NewsItem {
  id: number;
  text: string;
  highlight?: string;
  link?: string;
}

const newsItems: NewsItem[] = [
  {
    id: 1,
    text: "🎉 New Year Special:",
    highlight: "50% OFF on all annual memberships!",
    link: "/programs",
  },
  {
    id: 2,
    text: "🧘 Free Trial Class:",
    highlight: "Join our beginner yoga session this weekend!",
    link: "/schedule",
  },
  {
    id: 3,
    text: "✨ Early Bird Offer:",
    highlight: "Register before Feb 15 & get 2 months free!",
    link: "/register",
  },
  {
    id: 4,
    text: "🌟 Workshop Alert:",
    highlight: "Pranayama Masterclass with Guru Ananda - Limited Seats!",
    link: "/programs",
  },
];

const FlashNewsTicker = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % newsItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Dispatch custom event when visibility changes
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("tickerVisibilityChange", { detail: { isVisible } }));
  }, [isVisible]);

  if (!isVisible) return null;

  const currentNews = newsItems[currentIndex];

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-primary via-primary/90 to-lotus overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-10 md:h-11">
          {/* Decorative sparkle */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="hidden sm:block"
          >
            <Sparkles className="w-4 h-4 text-primary-foreground/80" />
          </motion.div>

          {/* News Content */}
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentNews.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-2 text-sm md:text-base"
              >
                {currentNews.link ? (
                  <Link
                    to={currentNews.link}
                    className="flex items-center gap-2 text-primary-foreground hover:text-white transition-colors group"
                  >
                    <span className="font-medium">{currentNews.text}</span>
                    <span className="font-bold">{currentNews.highlight}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <>
                    <span className="text-primary-foreground font-medium">{currentNews.text}</span>
                    <span className="text-white font-bold">{currentNews.highlight}</span>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress dots */}
          <div className="hidden sm:flex items-center gap-1.5 mr-4">
            {newsItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-white w-4"
                    : "bg-primary-foreground/40 hover:bg-primary-foreground/60"
                }`}
                aria-label={`Go to news ${index + 1}`}
              />
            ))}
          </div>

          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors"
            title="Close announcement"
            aria-label="Close announcement bar"
          >
            <X className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>
      </div>

      {/* Animated underline */}
      <motion.div
        className="h-0.5 bg-white/30"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 5, ease: "linear" }}
        key={currentIndex}
        style={{ transformOrigin: "left" }}
      />
    </motion.div>
  );
};

export default FlashNewsTicker;
