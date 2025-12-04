import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const yogaQuotes = [
  "Yoga is the journey of the self, through the self, to the self.",
  "Inhale the future, exhale the past.",
  "The body benefits from movement, the mind benefits from stillness.",
  "Yoga is not about touching your toes, it's about what you learn on the way down.",
  "Peace comes from within. Do not seek it without.",
  "The pose begins when you want to leave it.",
  "Breath is the bridge which connects life to consciousness.",
  "Yoga is the art of awareness on the canvas of body, mind, and soul.",
  "Where there is peace and meditation, there is neither anxiety nor doubt.",
  "True yoga is not about the shape of your body, but the shape of your life.",
];

interface FloatingQuoteProps {
  interval?: number;
  className?: string;
}

const FloatingQuote = ({ interval = 8000, className = "" }: FloatingQuoteProps) => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentQuote((prev) => (prev + 1) % yogaQuotes.length);
        setIsVisible(true);
      }, 500);
    }, interval);

    return () => clearInterval(quoteInterval);
  }, [interval]);

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={currentQuote}
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <motion.div
              className="relative inline-block"
              animate={{
                textShadow: [
                  "0 0 20px hsl(172 70% 55% / 0.3)",
                  "0 0 40px hsl(172 70% 55% / 0.5)",
                  "0 0 20px hsl(172 70% 55% / 0.3)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {/* Decorative lotus */}
              <span className="text-turquoise text-xl mb-2 block">❁</span>
              
              <p className="font-display text-lg md:text-xl lg:text-2xl text-foreground/80 italic max-w-2xl mx-auto leading-relaxed">
                "{yogaQuotes[currentQuote]}"
              </p>
              
              <span className="text-turquoise text-xl mt-2 block">❁</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingQuote;