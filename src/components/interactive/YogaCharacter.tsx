import { useState, useEffect, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

// Yoga pose SVG paths - silhouette style
const yogaPoses = {
  tadasana: {
    name: "Tadasana",
    path: "M50 15 C50 10 55 5 55 10 L55 25 L45 25 L45 10 C45 5 50 10 50 15 M50 25 L50 55 M35 35 L50 30 L65 35 M50 55 L40 85 M50 55 L60 85 M40 85 L38 95 M60 85 L62 95",
    viewBox: "0 0 100 100",
  },
  namaste: {
    name: "Namaste",
    path: "M50 15 C50 10 55 5 55 10 L55 25 L45 25 L45 10 C45 5 50 10 50 15 M50 25 L50 55 M45 35 L50 45 L55 35 M45 35 L45 50 M55 35 L55 50 M50 55 L40 85 M50 55 L60 85 M40 85 L38 95 M60 85 L62 95",
    viewBox: "0 0 100 100",
  },
  vrikshasana: {
    name: "Vrikshasana",
    path: "M50 15 C50 10 55 5 55 10 L55 25 L45 25 L45 10 C45 5 50 10 50 15 M50 25 L50 55 M35 25 L50 30 L65 25 M50 55 L45 85 M50 55 L60 70 L60 55 M45 85 L43 95",
    viewBox: "0 0 100 100",
  },
  padmasana: {
    name: "Padmasana",
    path: "M50 15 C50 10 55 5 55 10 L55 25 L45 25 L45 10 C45 5 50 10 50 15 M50 25 L50 50 M35 35 L50 30 L65 35 M30 70 L40 55 L50 50 L60 55 L70 70 M35 75 L65 75",
    viewBox: "0 0 100 100",
  },
  anjaliMudra: {
    name: "Anjali Mudra",
    path: "M50 15 C50 10 55 5 55 10 L55 25 L45 25 L45 10 C45 5 50 10 50 15 M50 25 L50 55 M42 30 L50 40 L58 30 M42 30 L42 40 M58 30 L58 40 M50 55 L40 85 M50 55 L60 85 M40 85 L38 95 M60 85 L62 95",
    viewBox: "0 0 100 100",
  },
  suryaNamaskar: {
    name: "Surya Namaskar",
    path: "M50 20 C50 15 55 10 55 15 L55 30 L45 30 L45 15 C45 10 50 15 50 20 M50 30 L50 50 M30 20 L50 35 L70 20 M50 50 L35 80 M50 50 L65 80 M35 80 L30 90 M65 80 L70 90",
    viewBox: "0 0 100 100",
  },
};

type PoseKey = keyof typeof yogaPoses;

interface YogaCharacterProps {
  activePose?: PoseKey;
  className?: string;
  showTrails?: boolean;
  glowColor?: "indigo" | "turquoise" | "lotus" | "sunset";
}

const YogaCharacter = ({ 
  activePose = "tadasana", 
  className = "",
  showTrails = true,
  glowColor = "turquoise"
}: YogaCharacterProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPose, setCurrentPose] = useState<PoseKey>(activePose);
  const [trails, setTrails] = useState<{ x: number; y: number; id: number }[]>([]);
  const trailIdRef = useRef(0);

  // Mouse tracking with springs for smooth following
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Velocity for dynamic movements
  const [velocity, setVelocity] = useState(0);
  const lastPos = useRef({ x: 0, y: 0, time: Date.now() });

  const glowColors = {
    indigo: "hsl(258, 30%, 35%)",
    turquoise: "hsl(172, 70%, 55%)",
    lotus: "hsl(345, 85%, 60%)",
    sunset: "hsl(32, 95%, 55%)",
  };

  useEffect(() => {
    setCurrentPose(activePose);
  }, [activePose]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      mouseX.set(x * 0.1); // Subtle movement
      mouseY.set(y * 0.1);

      // Calculate velocity
      const now = Date.now();
      const dt = now - lastPos.current.time;
      if (dt > 0) {
        const dx = e.clientX - lastPos.current.x;
        const dy = e.clientY - lastPos.current.y;
        const v = Math.sqrt(dx * dx + dy * dy) / dt;
        setVelocity(Math.min(v * 10, 1)); // Normalize 0-1
      }
      lastPos.current = { x: e.clientX, y: e.clientY, time: now };

      // Add trail effect on faster movement
      if (showTrails && velocity > 0.3) {
        const newTrail = {
          x: x * 0.05 + 50,
          y: y * 0.05 + 50,
          id: trailIdRef.current++,
        };
        setTrails(prev => [...prev.slice(-5), newTrail]);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, showTrails, velocity]);

  // Clean up old trails
  useEffect(() => {
    const cleanup = setInterval(() => {
      setTrails(prev => prev.slice(-3));
    }, 1000);
    return () => clearInterval(cleanup);
  }, []);

  const pose = yogaPoses[currentPose];

  return (
    <div 
      ref={containerRef}
      className={`relative ${className}`}
    >
      {/* Aura glow background */}
      <motion.div
        className="absolute inset-0 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${glowColors[glowColor]}40 0%, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Trail effects */}
      {trails.map((trail) => (
        <motion.div
          key={trail.id}
          className="absolute w-4 h-4 rounded-full"
          style={{
            left: `${trail.x}%`,
            top: `${trail.y}%`,
            background: glowColors[glowColor],
          }}
          initial={{ opacity: 0.6, scale: 1 }}
          animate={{ opacity: 0, scale: 2 }}
          transition={{ duration: 1 }}
        />
      ))}

      {/* Main yoga character SVG */}
      <motion.svg
        viewBox={pose.viewBox}
        className="w-full h-full relative z-10"
        style={{
          x: smoothX,
          y: smoothY,
          filter: `drop-shadow(0 0 20px ${glowColors[glowColor]}80)`,
        }}
        animate={{
          scale: 1 + velocity * 0.05,
        }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        {/* Character silhouette */}
        <motion.path
          d={pose.path}
          fill="none"
          stroke={glowColors[glowColor]}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        
        {/* Glow overlay */}
        <motion.path
          d={pose.path}
          fill="none"
          stroke={glowColors[glowColor]}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.3}
          style={{ filter: "blur(4px)" }}
        />
      </motion.svg>

      {/* Chakra ripple on click */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={false}
      >
        <motion.div
          className="w-16 h-16 rounded-full border-2"
          style={{ borderColor: glowColors[glowColor] }}
          animate={{
            scale: [0.8, 1.5],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      </motion.div>
    </div>
  );
};

export default YogaCharacter;