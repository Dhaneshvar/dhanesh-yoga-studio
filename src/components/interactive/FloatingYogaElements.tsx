import { motion } from "framer-motion";

const yogaIcons = [
  // Lotus
  "M12 2C12 2 8 6 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 6 12 2 12 2Z",
  // Om symbol simplified
  "M12 4C8 4 6 7 6 10C6 13 8 14 10 14C12 14 13 12 13 10C13 8 12 6 10 6M14 8C16 8 18 10 18 12C18 14 16 16 12 16M18 12L20 16",
  // Yin Yang simplified
  "M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2M12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20M12 8C10.34 8 9 9.34 9 11C9 12.66 10.34 14 12 14C13.66 14 15 15.34 15 17C15 18.66 13.66 20 12 20",
  // Chakra circle
  "M12 8L12 4M12 20L12 16M8 12L4 12M20 12L16 12M9.17 9.17L6.34 6.34M17.66 17.66L14.83 14.83M9.17 14.83L6.34 17.66M17.66 6.34L14.83 9.17",
];

const FloatingYogaElements = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Large floating elements */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`float-${i}`}
          className="absolute opacity-10"
          style={{
            left: `${10 + i * 20}%`,
            top: `${15 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [0, (i % 2 === 0 ? 15 : -15), 0],
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15 + i * 2,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-16 h-16 md:w-24 md:h-24"
            fill="none"
            stroke={`hsl(var(--${['turquoise', 'indigo', 'lotus', 'sunset'][i % 4]}))`}
            strokeWidth="1"
            strokeLinecap="round"
          >
            <path d={yogaIcons[i % yogaIcons.length]} />
          </svg>
        </motion.div>
      ))}

      {/* Smaller sparkles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: `hsl(var(--${['turquoise', 'lotus', 'sunset', 'indigo'][i % 4]}) / 0.4)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Gradient orbs */}
      <motion.div
        className="absolute w-64 h-64 rounded-full blur-3xl opacity-20"
        style={{
          background: "radial-gradient(circle, hsl(var(--turquoise)), transparent)",
          right: "-5%",
          top: "20%",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute w-48 h-48 rounded-full blur-3xl opacity-15"
        style={{
          background: "radial-gradient(circle, hsl(var(--lotus)), transparent)",
          left: "5%",
          bottom: "15%",
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
      />
    </div>
  );
};

export default FloatingYogaElements;
