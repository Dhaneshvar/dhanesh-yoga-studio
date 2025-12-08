import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, VolumeX } from "lucide-react";

interface MeditationModeProps {
  isOpen: boolean;
  onClose: () => void;
}

const MeditationMode = ({ isOpen, onClose }: MeditationModeProps) => {
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timer, setTimer] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeOscillatorRef = useRef<OscillatorNode | null>(null);

  // Initialize audio context on first interaction
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    // Resume if suspended (required by browsers)
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  // Create gentle tone for breathing
  const playBreathSound = useCallback((type: "inhale" | "exhale") => {
    if (!soundEnabled) return;
    
    try {
      const ctx = initAudioContext();
      
      // Stop previous oscillator if playing
      if (activeOscillatorRef.current) {
        try {
          activeOscillatorRef.current.stop();
        } catch (e) {
          // Ignore if already stopped
        }
      }
      
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      // Different frequencies for inhale/exhale
      oscillator.frequency.value = type === "inhale" ? 220 : 165;
      oscillator.type = "sine";
      
      const duration = type === "inhale" ? 4 : 6;
      const now = ctx.currentTime;
      
      // Gentle fade in and out
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.1, now + 0.5);
      gainNode.gain.setValueAtTime(0.1, now + duration - 0.5);
      gainNode.gain.linearRampToValueAtTime(0, now + duration);
      
      oscillator.start(now);
      oscillator.stop(now + duration);
      activeOscillatorRef.current = oscillator;
    } catch (e) {
      console.log("Audio not available:", e);
    }
  }, [soundEnabled, initAudioContext]);

  // Handle close button
  const handleClose = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  }, [onClose]);

  // Handle sound toggle
  const handleSoundToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSoundEnabled(prev => !prev);
  }, []);

  // Breathing cycle: 4s inhale, 4s hold, 6s exhale
  useEffect(() => {
    if (!isOpen) return;

    const phases = [
      { phase: "inhale" as const, duration: 4000 },
      { phase: "hold" as const, duration: 4000 },
      { phase: "exhale" as const, duration: 6000 },
    ];

    let currentPhaseIndex = 0;
    let timeoutId: NodeJS.Timeout;
    
    const runPhase = () => {
      const currentPhase = phases[currentPhaseIndex];
      setBreathPhase(currentPhase.phase);
      
      // Play sound for inhale and exhale
      if (currentPhase.phase === "inhale" || currentPhase.phase === "exhale") {
        playBreathSound(currentPhase.phase);
      }
      
      timeoutId = setTimeout(() => {
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        runPhase();
      }, currentPhase.duration);
    };

    runPhase();

    // Timer
    const timerInterval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(timerInterval);
    };
  }, [isOpen, playBreathSound]);

  // Reset timer and cleanup when closing
  useEffect(() => {
    if (!isOpen) {
      setTimer(0);
      setBreathPhase("inhale");
      if (activeOscillatorRef.current) {
        try {
          activeOscillatorRef.current.stop();
        } catch (e) {
          // Ignore
        }
        activeOscillatorRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
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
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{
            background: "linear-gradient(180deg, hsl(258 25% 8%) 0%, hsl(258 30% 12%) 100%)",
          }}
        >
          {/* Close button - positioned top right */}
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onClick={handleClose}
            className="absolute top-6 right-6 p-4 rounded-full bg-white/10 hover:bg-white/30 transition-all duration-300 hover:scale-110 active:scale-95 z-[110]"
            aria-label="Close meditation mode"
          >
            <X className="w-7 h-7 text-white" />
          </motion.button>

          {/* Sound toggle - positioned top left */}
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onClick={handleSoundToggle}
            className={`absolute top-6 left-6 p-4 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 z-[110] ${
              soundEnabled 
                ? 'bg-turquoise/30 hover:bg-turquoise/50' 
                : 'bg-white/10 hover:bg-white/30'
            }`}
            aria-label={soundEnabled ? "Mute sound" : "Unmute sound"}
          >
            {soundEnabled ? (
              <Volume2 className="w-7 h-7 text-white" />
            ) : (
              <VolumeX className="w-7 h-7 text-white/50" />
            )}
          </motion.button>

          {/* Timer - centered at top */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute top-8 left-1/2 -translate-x-1/2"
          >
            <p className="font-body text-white/60 text-2xl tracking-widest tabular-nums">
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
            className="mt-16 text-center"
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
                className="font-display text-4xl md:text-5xl text-white tracking-wide"
              >
                {breathInstructions[breathPhase]}
              </motion.p>
            </AnimatePresence>
            
            <motion.p 
              className="font-body text-white/40 mt-4 text-base"
              key={`duration-${breathPhase}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {breathPhase === "inhale" && "4 seconds"}
              {breathPhase === "hold" && "4 seconds"}
              {breathPhase === "exhale" && "6 seconds"}
            </motion.p>
          </motion.div>

          {/* Sound status indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2"
          >
            <p className="font-body text-white/30 text-sm">
              Sound: {soundEnabled ? "On" : "Off"}
            </p>
          </motion.div>

          {/* Bottom hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 font-body text-white/20 text-sm"
          >
            Press ESC or click X to exit
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MeditationMode;