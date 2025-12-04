import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MeditationModeProps {
  isOpen: boolean;
  onClose: () => void;
}

const MeditationMode = ({ isOpen, onClose }: MeditationModeProps) => {
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [timer, setTimer] = useState(0);

  // Breathing cycle: 4s inhale, 4s hold, 6s exhale
  useEffect(() => {
    if (!isOpen) return;

    const phases = [
      { phase: "inhale" as const, duration: 4000 },
      { phase: "hold" as const, duration: 4000 },
      { phase: "exhale" as const, duration: 6000 },
    ];

    let currentPhaseIndex = 0;
    
    const runPhase = () => {
      setBreathPhase(phases[currentPhaseIndex].phase);
      
      setTimeout(() => {
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        runPhase();
      }, phases[currentPhaseIndex].duration);
    };

    runPhase();

    // Timer
    const timerInterval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  }, [isOpen]);

  // Reset timer when closing
  useEffect(() => {
    if (!isOpen) {
      setTimer(0);
    }
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const breathInstructions = {
    inhale: "Breathe In",
    hold: "Hold",
    exhale: "Breathe Out",
  };

  const circleScale = {
    inhale: 1.5,
    hold: 1.5,
    exhale: 1,
  };

  const phaseDuration = {
    inhale: 4,
    hold: 4,
    exhale: 6,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{
            background: "linear-gradient(180deg, hsl(258 25% 8%) 0%, hsl(258 30% 12%) 100%)",
          }}
        >
          {/* Close button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={onClose}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </motion.button>

          {/* Sound toggle */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="absolute top-6 left-6 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-6 h-6 text-white" />
            ) : (
              <VolumeX className="w-6 h-6 text-white/50" />
            )}
          </motion.button>

          {/* Timer */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute top-6 left-1/2 -translate-x-1/2"
          >
            <p className="font-body text-white/60 text-lg tracking-widest">
              {formatTime(timer)}
            </p>
          </motion.div>

          {/* Main breathing circle */}
          <div className="relative flex items-center justify-center">
            {/* Outer glow rings */}
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 200 + i * 60,
                  height: 200 + i * 60,
                  border: `1px solid hsl(172 70% 55% / ${0.3 - i * 0.08})`,
                }}
                animate={{
                  scale: circleScale[breathPhase],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  scale: { duration: phaseDuration[breathPhase], ease: "easeInOut" },
                  opacity: { duration: 3, repeat: Infinity },
                }}
              />
            ))}

            {/* Main breathing circle */}
            <motion.div
              className="w-48 h-48 rounded-full flex items-center justify-center"
              style={{
                background: "radial-gradient(circle, hsl(172 70% 55% / 0.3) 0%, hsl(258 30% 35% / 0.2) 100%)",
                boxShadow: "0 0 60px hsl(172 70% 55% / 0.4), inset 0 0 40px hsl(172 70% 55% / 0.2)",
              }}
              animate={{
                scale: circleScale[breathPhase],
              }}
              transition={{
                duration: phaseDuration[breathPhase],
                ease: "easeInOut",
              }}
            >
              {/* Inner mandala pattern */}
              <motion.div
                className="w-32 h-32 rounded-full"
                style={{
                  background: "radial-gradient(circle, hsl(172 70% 55% / 0.5) 0%, transparent 70%)",
                }}
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full opacity-50">
                  <defs>
                    <pattern id="mandala" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                        <line
                          key={angle}
                          x1="50"
                          y1="50"
                          x2={50 + 40 * Math.cos((angle * Math.PI) / 180)}
                          y2={50 + 40 * Math.sin((angle * Math.PI) / 180)}
                          stroke="hsl(172, 70%, 55%)"
                          strokeWidth="0.5"
                        />
                      ))}
                      <circle cx="50" cy="50" r="20" fill="none" stroke="hsl(172, 70%, 55%)" strokeWidth="0.5" />
                      <circle cx="50" cy="50" r="35" fill="none" stroke="hsl(172, 70%, 55%)" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#mandala)" />
                </svg>
              </motion.div>
            </motion.div>
          </div>

          {/* Breath instruction */}
          <motion.div
            className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={breathPhase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="font-display text-3xl md:text-4xl text-white/90 tracking-wide"
              >
                {breathInstructions[breathPhase]}
              </motion.p>
            </AnimatePresence>
            
            <p className="font-body text-white/40 mt-2 text-sm">
              {breathPhase === "inhale" && "4 seconds"}
              {breathPhase === "hold" && "4 seconds"}
              {breathPhase === "exhale" && "6 seconds"}
            </p>
          </motion.div>

          {/* Bottom hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 font-body text-white/30 text-sm"
          >
            Click anywhere or press ESC to exit
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MeditationMode;