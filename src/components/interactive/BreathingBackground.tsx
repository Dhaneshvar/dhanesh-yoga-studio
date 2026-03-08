interface BreathingBackgroundProps {
  variant?: "landing" | "asanas" | "kids" | "senior" | "default";
}

const BreathingBackground = ({ variant = "default" }: BreathingBackgroundProps) => {
  const gradients: Record<string, { primary: string; secondary: string; tertiary: string }> = {
    landing: {
      primary: "hsl(32, 95%, 55%)",
      secondary: "hsl(345, 85%, 60%)",
      tertiary: "hsl(172, 70%, 55%)",
    },
    asanas: {
      primary: "hsl(172, 70%, 55%)",
      secondary: "hsl(205, 55%, 30%)",
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
      tertiary: "hsl(205, 40%, 50%)",
    },
    default: {
      primary: "hsl(205, 55%, 30%)",
      secondary: "hsl(172, 70%, 55%)",
      tertiary: "hsl(345, 85%, 60%)",
    },
  };

  const colors = gradients[variant];

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Static gradient background — no JS animations */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, ${colors.primary}15 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, ${colors.secondary}12 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, ${colors.tertiary}08 0%, transparent 70%)
          `,
        }}
      />

      {/* CSS-only animated orbs using will-change for GPU acceleration */}
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl animate-[breathe_8s_ease-in-out_infinite]"
        style={{
          background: `radial-gradient(circle, ${colors.primary}18 0%, transparent 70%)`,
          left: "10%",
          top: "20%",
        }}
      />

      <div
        className="absolute w-80 h-80 rounded-full blur-3xl animate-[breathe_10s_ease-in-out_infinite_reverse]"
        style={{
          background: `radial-gradient(circle, ${colors.secondary}15 0%, transparent 70%)`,
          right: "15%",
          top: "40%",
        }}
      />

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
