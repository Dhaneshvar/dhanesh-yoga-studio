import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BreathingBackgroundProps {
  variant?: "landing" | "asanas" | "kids" | "senior" | "default";
  enableSound?: boolean;
  enableClickBreath?: boolean;
}

const BreathingBackground = ({ 
  variant = "default",
  enableSound = false,
  enableClickBreath = true,
}: BreathingBackgroundProps) => {
  const [isBreathingIn, setIsBreathingIn] = useState(true);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const [rippleId, setRippleId] = useState(0);

  // Breathing cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBreathingIn(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Click handler for breath interaction
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!enableClickBreath) return;
    
    const newRipple = {
      x: e.clientX,
      y: e.clientY,
      id: rippleId,
    };
    setRipples(prev => [...prev, newRipple]);
    setRippleId(prev => prev + 1);

    // Play sound if enabled
    if (enableSound) {
      // Create subtle breath sound using Web Audio API
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.frequency.value = isBreathingIn ? 220 : 180;
        oscillator.type = "sine";
        
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
        
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.5);
      } catch (e) {
        // Audio not supported
      }
    }

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 2000);
  }, [enableClickBreath, enableSound, isBreathingIn, rippleId]);

  const gradients = {
    landing: {
      primary: "hsl(32, 95%, 55%)",
      secondary: "hsl(345, 85%, 60%)",
      tertiary: "hsl(172, 70%, 55%)",
    },
    asanas: {
      primary: "hsl(172, 70%, 55%)",
      secondary: "hsl(258, 30%, 35%)",
      tertiary: "hsl(150, 50%, 92%)",
    },
    kids: {
      primary: "hsl(32, 95%, 55%)",
      secondary: "hsl(345, 85%, 60%)",
      tertiary: "hsl(42, 65%, 55%)",
    },
    senior: {
      primary: "hsl(150, 50%, 92%)",
      secondary: "hsl(172, 60%, 80%)",
      tertiary: "hsl(258, 25%, 55%)",
    },
    default: {
      primary: "hsl(258, 30%, 35%)",
      secondary: "hsl(172, 70%, 55%)",
      tertiary: "hsl(345, 85%, 60%)",
    },
  };

  const colors = gradients[variant];

  return (
    <div 
      className="fixed inset-0 pointer-events-auto -z-10 overflow-hidden"
      onClick={handleClick}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          scale: isBreathingIn ? 1.02 : 1,
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
        }}
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, ${colors.primary}15 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, ${colors.secondary}12 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, ${colors.tertiary}08 0%, transparent 70%)
          `,
        }}
      />

      {/* Floating orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${colors.primary}20 0%, transparent 70%)`,
          left: "10%",
          top: "20%",
        }}
        animate={{
          scale: isBreathingIn ? [1, 1.15] : [1.15, 1],
          x: [0, 20, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-80 h-80 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${colors.secondary}18 0%, transparent 70%)`,
          right: "15%",
          top: "40%",
        }}
        animate={{
          scale: isBreathingIn ? [1.1, 1] : [1, 1.1],
          x: [0, -15, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-64 h-64 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${colors.tertiary}15 0%, transparent 70%)`,
          left: "50%",
          bottom: "10%",
        }}
        animate={{
          scale: isBreathingIn ? [1, 1.2] : [1.2, 1],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Click ripples */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
          >
            {/* Multiple expanding rings */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border-2"
                style={{
                  borderColor: colors.primary,
                  left: "50%",
                  top: "50%",
                }}
                initial={{ 
                  width: 0, 
                  height: 0, 
                  x: "-50%", 
                  y: "-50%",
                  opacity: 0.8 
                }}
                animate={{ 
                  width: 300 + i * 50, 
                  height: 300 + i * 50, 
                  opacity: 0 
                }}
                transition={{ 
                  duration: 1.5, 
                  delay: i * 0.15,
                  ease: "easeOut" 
                }}
              />
            ))}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(${colors.primary}30 1px, transparent 1px),
            linear-gradient(90deg, ${colors.primary}30 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  );
};

export default BreathingBackground;