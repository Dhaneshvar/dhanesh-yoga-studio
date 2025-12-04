import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

// Simplified pose paths for nav character
const navPoses = {
  "/": {
    name: "Tadasana",
    path: "M12 4C12 3 13 2 13 3L13 7L11 7L11 3C11 2 12 3 12 4M12 7L12 14M9 9L12 8L15 9M12 14L10 22M12 14L14 22",
  },
  "/about": {
    name: "Namaste",
    path: "M12 4C12 3 13 2 13 3L13 7L11 7L11 3C11 2 12 3 12 4M12 7L12 14M11 9L12 12L13 9M11 9L11 12M13 9L13 12M12 14L10 22M12 14L14 22",
  },
  "/schedule": {
    name: "Vrikshasana",
    path: "M12 4C12 3 13 2 13 3L13 7L11 7L11 3C11 2 12 3 12 4M12 7L12 14M9 6L12 8L15 6M12 14L11 22M12 14L15 18L15 14",
  },
  "/programs": {
    name: "Warrior",
    path: "M12 4C12 3 13 2 13 3L13 7L11 7L11 3C11 2 12 3 12 4M12 7L12 14M7 8L12 10L17 8M12 14L8 20M12 14L16 20",
  },
  "/asanas": {
    name: "Lotus",
    path: "M12 4C12 3 13 2 13 3L13 7L11 7L11 3C11 2 12 3 12 4M12 7L12 13M9 9L12 8L15 9M8 18L10 14L12 13L14 14L16 18M9 19L15 19",
  },
  "/register": {
    name: "Padmasana",
    path: "M12 4C12 3 13 2 13 3L13 7L11 7L11 3C11 2 12 3 12 4M12 7L12 13M9 9L12 8L15 9M8 18L10 14L12 13L14 14L16 18M9 19L15 19",
  },
  "/login": {
    name: "Anjali",
    path: "M12 4C12 3 13 2 13 3L13 7L11 7L11 3C11 2 12 3 12 4M12 7L12 14M11 8L12 11L13 8M11 8L11 11M13 8L13 11M12 14L10 22M12 14L14 22",
  },
};

const NavYogaCharacter = () => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentPose, setCurrentPose] = useState(navPoses["/"] || navPoses["/"]);

  useEffect(() => {
    setIsTransitioning(true);
    
    const timer = setTimeout(() => {
      const pose = navPoses[location.pathname as keyof typeof navPoses] || navPoses["/"];
      setCurrentPose(pose);
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="fixed bottom-8 right-8 z-40 hidden lg:block">
      <motion.div
        className="relative"
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Glow background */}
        <motion.div
          className="absolute inset-0 rounded-full blur-xl"
          style={{
            background: "radial-gradient(circle, hsl(172 70% 55% / 0.3) 0%, transparent 70%)",
            width: 120,
            height: 120,
            left: -20,
            top: -20,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        />

        {/* Character SVG */}
        <AnimatePresence mode="wait">
          <motion.svg
            key={location.pathname}
            viewBox="0 0 24 24"
            className="w-20 h-20 relative z-10"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              filter: "drop-shadow(0 0 15px hsl(172 70% 55% / 0.6))",
            }}
          >
            <motion.path
              d={currentPose.path}
              fill="none"
              stroke="hsl(172, 70%, 55%)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </motion.svg>
        </AnimatePresence>

        {/* Pose name */}
        <AnimatePresence mode="wait">
          <motion.p
            key={currentPose.name}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-center font-body text-xs text-turquoise/80 mt-2"
          >
            {currentPose.name}
          </motion.p>
        </AnimatePresence>

        {/* Chakra ripple effect on transition */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border border-turquoise/30"
                  initial={{ width: 40, height: 40, opacity: 0.8 }}
                  animate={{ width: 100 + i * 30, height: 100 + i * 30, opacity: 0 }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default NavYogaCharacter;