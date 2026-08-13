import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface MeditationToggleProps {
  onClick: () => void;
}

const MeditationToggle = ({ onClick }: MeditationToggleProps) => {
  return (
    <motion.button
      onClick={onClick}
      className="widget-hover fixed bottom-4 left-3 sm:bottom-8 sm:left-8 z-40 p-3 sm:p-4 rounded-full glass shadow-glow group"
      title="Enter Meditation Mode - guided breathing experience"
      aria-label="Enter Meditation Mode"
      animate={{
        boxShadow: [
          "0 0 20px hsl(172 70% 55% / 0.3)",
          "0 0 40px hsl(172 70% 55% / 0.5)",
          "0 0 20px hsl(172 70% 55% / 0.3)",
        ],
      }}
      transition={{
        boxShadow: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-turquoise group-hover:text-turquoise-dark transition-colors" aria-hidden="true" />
      </motion.div>
      
      {/* Tooltip - hidden on mobile */}
      <motion.span
        className="absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-foreground text-background text-sm font-body whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block"
        initial={{ x: -10 }}
        whileHover={{ x: 0 }}
        aria-hidden="true"
      >
        Meditation Mode
      </motion.span>
    </motion.button>
  );
};

export default MeditationToggle;