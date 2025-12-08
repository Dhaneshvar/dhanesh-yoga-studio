import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";

// Yoga pose SVG paths for cursor
const yogaPoses = {
  default: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      {/* Person in tree pose */}
      <circle cx="20" cy="8" r="4" fill="hsl(172, 70%, 55%)" />
      <path 
        d="M20 12 L20 28" 
        stroke="hsl(258, 30%, 35%)" 
        strokeWidth="2.5" 
        strokeLinecap="round"
      />
      {/* Arms up in V */}
      <path 
        d="M20 16 L12 8 M20 16 L28 8" 
        stroke="hsl(258, 30%, 35%)" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      {/* Standing leg */}
      <path 
        d="M20 28 L20 36" 
        stroke="hsl(258, 30%, 35%)" 
        strokeWidth="2.5" 
        strokeLinecap="round"
      />
      {/* Bent leg */}
      <path 
        d="M20 24 L26 24" 
        stroke="hsl(345, 85%, 60%)" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      {/* Energy aura */}
      <circle cx="20" cy="20" r="18" stroke="hsl(172, 70%, 55%)" strokeWidth="1" opacity="0.3" fill="none" />
    </svg>
  ),
  hover: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      {/* Person in warrior pose */}
      <circle cx="20" cy="8" r="4" fill="hsl(345, 85%, 60%)" />
      <path 
        d="M20 12 L20 24" 
        stroke="hsl(258, 30%, 35%)" 
        strokeWidth="2.5" 
        strokeLinecap="round"
      />
      {/* Arms spread wide */}
      <path 
        d="M8 18 L32 18" 
        stroke="hsl(258, 30%, 35%)" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      {/* Lunge legs */}
      <path 
        d="M20 24 L12 36 M20 24 L28 36" 
        stroke="hsl(32, 95%, 55%)" 
        strokeWidth="2.5" 
        strokeLinecap="round"
      />
      {/* Energy glow */}
      <circle cx="20" cy="20" r="16" stroke="hsl(345, 85%, 60%)" strokeWidth="1.5" opacity="0.4" fill="none" />
      <circle cx="20" cy="20" r="12" stroke="hsl(32, 95%, 55%)" strokeWidth="1" opacity="0.3" fill="none" />
    </svg>
  ),
  click: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      {/* Person in lotus pose */}
      <circle cx="20" cy="10" r="4" fill="hsl(32, 95%, 55%)" />
      <path 
        d="M20 14 L20 24" 
        stroke="hsl(258, 30%, 35%)" 
        strokeWidth="2.5" 
        strokeLinecap="round"
      />
      {/* Hands in meditation */}
      <path 
        d="M12 20 L20 18 L28 20" 
        stroke="hsl(258, 30%, 35%)" 
        strokeWidth="2" 
        strokeLinecap="round"
        fill="none"
      />
      {/* Crossed legs */}
      <path 
        d="M10 30 Q20 26 30 30" 
        stroke="hsl(172, 70%, 55%)" 
        strokeWidth="2.5" 
        strokeLinecap="round"
        fill="none"
      />
      {/* Lotus petals */}
      <path 
        d="M20 32 Q16 28 14 32 Q16 36 20 34 Q24 36 26 32 Q24 28 20 32" 
        fill="hsl(345, 85%, 60%)" 
        opacity="0.6"
      />
      {/* Chakra rings */}
      <circle cx="20" cy="20" r="16" stroke="hsl(32, 95%, 55%)" strokeWidth="2" opacity="0.5" fill="none" />
      <circle cx="20" cy="20" r="12" stroke="hsl(172, 70%, 55%)" strokeWidth="1.5" opacity="0.4" fill="none" />
    </svg>
  ),
};

const AnimatedYogaCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const trailsRef = useRef<Array<{ x: number; y: number; id: number }>>([]);
  const [trails, setTrails] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const trailId = useRef(0);
  
  // Smooth spring animation for cursor
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    let lastTrailTime = 0;
    
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
      
      // Create trails while moving fast
      const now = Date.now();
      if (now - lastTrailTime > 50) {
        lastTrailTime = now;
        const newTrail = { x: e.clientX, y: e.clientY, id: trailId.current++ };
        trailsRef.current = [...trailsRef.current.slice(-5), newTrail];
        setTrails([...trailsRef.current]);
        
        // Remove old trails
        setTimeout(() => {
          trailsRef.current = trailsRef.current.filter(t => t.id !== newTrail.id);
          setTrails([...trailsRef.current]);
        }, 500);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('a, button, [role="button"], input, textarea, select, .cursor-pointer')) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [cursorX, cursorY]);

  const getCurrentPose = () => {
    if (isClicking) return "click";
    if (isHovering) return "hover";
    return "default";
  };

  return (
    <>
      {/* Trail effects */}
      <AnimatePresence>
        {trails.map((trail) => (
          <motion.div
            key={trail.id}
            initial={{ opacity: 0.4, scale: 0.8 }}
            animate={{ opacity: 0, scale: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed pointer-events-none z-[9998]"
            style={{
              left: trail.x - 8,
              top: trail.y - 8,
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "radial-gradient(circle, hsl(172 70% 55% / 0.5), transparent)",
            }}
          />
        ))}
      </AnimatePresence>

      {/* Main cursor */}
      <motion.div
        className="fixed pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <AnimatePresence mode="wait">
          {isVisible && (
            <motion.div
              key={getCurrentPose()}
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ 
                scale: isClicking ? 1.3 : isHovering ? 1.2 : 1, 
                opacity: 1, 
                rotate: 0 
              }}
              exit={{ scale: 0.5, opacity: 0, rotate: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {/* Glow effect behind cursor */}
              <motion.div
                className="absolute inset-0 rounded-full blur-md"
                style={{
                  background: isClicking 
                    ? "radial-gradient(circle, hsl(32 95% 55% / 0.4), transparent)"
                    : isHovering 
                    ? "radial-gradient(circle, hsl(345 85% 60% / 0.4), transparent)"
                    : "radial-gradient(circle, hsl(172 70% 55% / 0.3), transparent)",
                  width: 50,
                  height: 50,
                  left: -5,
                  top: -5,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* The yoga pose SVG */}
              <motion.div
                animate={{
                  y: [0, -2, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {yogaPoses[getCurrentPose()]}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default AnimatedYogaCursor;
