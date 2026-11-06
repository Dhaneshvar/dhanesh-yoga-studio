import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import MeditationMark from "@/components/interactive/MeditationMark";

interface MeditationToggleProps {
  onClick: () => void;
}

const MeditationToggle = ({ onClick }: MeditationToggleProps) => {
  return (
    <motion.button
      onClick={onClick}
      className="widget-hover fixed bottom-24 left-4 z-[60] rounded-full border border-primary/40 bg-card/95 p-3 text-primary shadow-glow backdrop-blur-sm group sm:bottom-28 sm:left-8 sm:p-4"
      title="Open guided meditation sounds"
      aria-label="Open guided meditation sounds"
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
        className="relative grid place-items-center"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Volume2 className="h-5 w-5 transition-colors group-hover:text-primary/70 sm:h-6 sm:w-6" aria-hidden="true" />
        <span className="absolute -bottom-1 -right-1 grid h-3.5 w-3.5 place-items-center rounded-full border border-card bg-primary text-primary-foreground sm:h-4 sm:w-4">
          <MeditationMark className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
        </span>
      </motion.div>
      
      {/* Tooltip - hidden on mobile */}
      <motion.span
        className="absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-foreground text-background text-sm font-body whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block"
        initial={{ x: -10 }}
        whileHover={{ x: 0 }}
        aria-hidden="true"
      >
        Meditation sounds
      </motion.span>
    </motion.button>
  );
};

export default MeditationToggle;
