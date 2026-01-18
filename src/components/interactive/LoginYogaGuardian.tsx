import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Yoga poses for the guardian character
const guardianPoses = {
  blocking: {
    name: "Blocking",
    path: "M50 15 C50 10 55 5 55 10 L55 25 L45 25 L45 10 C45 5 50 10 50 15 M50 25 L50 55 M25 40 L50 35 L75 40 M50 55 L35 85 M50 55 L65 85 M35 85 L30 95 M65 85 L70 95",
  },
  welcome: {
    name: "Welcome",
    path: "M50 15 C50 10 55 5 55 10 L55 25 L45 25 L45 10 C45 5 50 10 50 15 M50 25 L50 55 M30 25 L50 35 L70 25 M50 55 L40 85 M50 55 L60 85 M40 85 L38 95 M60 85 L62 95",
  },
  namaste: {
    name: "Namaste",
    path: "M50 15 C50 10 55 5 55 10 L55 25 L45 25 L45 10 C45 5 50 10 50 15 M50 25 L50 55 M45 35 L50 45 L55 35 M45 35 L45 50 M55 35 L55 50 M50 55 L40 85 M50 55 L60 85 M40 85 L38 95 M60 85 L62 95",
  },
  thinking: {
    name: "Thinking",
    path: "M50 15 C50 10 55 5 55 10 L55 25 L45 25 L45 10 C45 5 50 10 50 15 M50 25 L50 55 M35 35 L50 30 L55 25 M55 25 L58 20 M50 55 L40 85 M50 55 L60 85 M40 85 L38 95 M60 85 L62 95",
  },
  typing: {
    name: "Typing",
    path: "M50 15 C50 10 55 5 55 10 L55 25 L45 25 L45 10 C45 5 50 10 50 15 M50 25 L50 55 M35 45 L50 40 L65 45 M35 50 L35 60 M65 50 L65 60 M50 55 L40 85 M50 55 L60 85 M40 85 L38 95 M60 85 L62 95",
  },
};

type GuardianState = "blocking" | "welcome" | "namaste" | "thinking" | "typing";

interface LoginYogaGuardianProps {
  isFormFocused: boolean;
  hasStartedTyping: boolean;
  isEmailValid: boolean;
  onUnlock: () => void;
}

const LoginYogaGuardian = ({ 
  isFormFocused, 
  hasStartedTyping, 
  isEmailValid,
  onUnlock 
}: LoginYogaGuardianProps) => {
  const [currentPose, setCurrentPose] = useState<GuardianState>("blocking");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(true);
  const [clickCount, setClickCount] = useState(0);

  const speechMessages = {
    blocking: "Hey! Show me you're worthy to enter 🧘",
    welcome: "Ah, you're curious! Start typing...",
    thinking: "Hmm, let me see your email... 🤔",
    typing: "Good energy! Keep going... ✨",
    namaste: "Namaste! 🙏 You may enter!",
  };

  useEffect(() => {
    if (isEmailValid && hasStartedTyping) {
      setCurrentPose("namaste");
      setTimeout(() => {
        setIsUnlocked(true);
        onUnlock();
      }, 800);
    } else if (hasStartedTyping) {
      setCurrentPose("typing");
    } else if (isFormFocused) {
      setCurrentPose("welcome");
    } else {
      setCurrentPose("blocking");
    }
  }, [isFormFocused, hasStartedTyping, isEmailValid, onUnlock]);

  const handleGuardianClick = () => {
    setClickCount(prev => prev + 1);
    if (clickCount >= 4) {
      setCurrentPose("thinking");
      setShowSpeechBubble(true);
    }
  };

  const pose = guardianPoses[currentPose];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Mystical background effects */}
      <motion.div
        className="absolute inset-0 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, hsl(var(--turquoise) / 0.3) 0%, hsl(var(--indigo) / 0.2) 50%, transparent 70%)`,
        }}
        animate={{
          scale: isUnlocked ? [1, 1.5, 2] : [1, 1.1, 1],
          opacity: isUnlocked ? [0.5, 0.8, 0] : [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: isUnlocked ? 1 : 4,
          repeat: isUnlocked ? 0 : Infinity,
        }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: `hsl(var(--${['turquoise', 'lotus', 'sunset'][i % 3]}))`,
            left: `${20 + (i * 12)}%`,
            top: `${30 + (i % 3) * 15}%`,
          }}
          animate={{
            y: [-10, -30, -10],
            x: [0, (i % 2 === 0 ? 10 : -10), 0],
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Speech bubble */}
      <AnimatePresence>
        {showSpeechBubble && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-elevated border border-border z-20 whitespace-nowrap"
          >
            <p className="font-body text-sm text-foreground">{speechMessages[currentPose]}</p>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-card/95 border-b border-r border-border rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guardian character */}
      <motion.div
        className="relative cursor-pointer"
        onClick={handleGuardianClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Aura glow */}
        <motion.div
          className="absolute inset-0 rounded-full blur-xl"
          style={{
            background: isUnlocked 
              ? `radial-gradient(circle, hsl(var(--turquoise) / 0.5), transparent)` 
              : `radial-gradient(circle, hsl(var(--indigo) / 0.4), transparent)`,
            width: 180,
            height: 180,
            left: -40,
            top: -40,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />

        {/* Character SVG */}
        <AnimatePresence mode="wait">
          <motion.svg
            key={currentPose}
            viewBox="0 0 100 100"
            className="w-28 h-28 relative z-10"
            initial={{ opacity: 0, rotate: -10 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 10 }}
            transition={{ duration: 0.4 }}
            style={{
              filter: `drop-shadow(0 0 20px hsl(var(--${isUnlocked ? 'turquoise' : 'indigo'}) / 0.6))`,
            }}
          >
            <motion.path
              d={pose.path}
              fill="none"
              stroke={isUnlocked ? "hsl(var(--turquoise))" : "hsl(var(--indigo))"}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </motion.svg>
        </AnimatePresence>

        {/* Pose name badge */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-body bg-card/90 border border-border shadow-soft"
        >
          <span className={isUnlocked ? "text-turquoise" : "text-indigo"}>
            {pose.name}
          </span>
        </motion.div>
      </motion.div>

      {/* Unlock celebration effect */}
      <AnimatePresence>
        {isUnlocked && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`celebrate-${i}`}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: `hsl(var(--${['turquoise', 'lotus', 'sunset', 'indigo'][i % 4]}))`,
                }}
                initial={{ 
                  x: 0, 
                  y: 0, 
                  opacity: 1,
                  scale: 0 
                }}
                animate={{ 
                  x: Math.cos(i * 45 * Math.PI / 180) * 100,
                  y: Math.sin(i * 45 * Math.PI / 180) * 100,
                  opacity: 0,
                  scale: 1.5
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginYogaGuardian;
