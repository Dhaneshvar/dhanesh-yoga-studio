import { useState, useEffect, useCallback } from "react";

// Simple yoga pose SVGs
const yogaPoses = {
  default: (
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="8" r="4" fill="hsl(172, 70%, 55%)" />
      <path d="M20 12 L20 28" stroke="hsl(258, 30%, 35%)" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M20 16 L12 8 M20 16 L28 8" stroke="hsl(258, 30%, 35%)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M20 28 L20 36" stroke="hsl(258, 30%, 35%)" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M20 24 L26 24" stroke="hsl(345, 85%, 60%)" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  hover: (
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="8" r="4" fill="hsl(345, 85%, 60%)" />
      <path d="M20 12 L20 24" stroke="hsl(258, 30%, 35%)" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M8 18 L32 18" stroke="hsl(258, 30%, 35%)" strokeWidth="2" strokeLinecap="round"/>
      <path d="M20 24 L12 36 M20 24 L28 36" stroke="hsl(32, 95%, 55%)" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
  click: (
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="10" r="4" fill="hsl(32, 95%, 55%)" />
      <path d="M20 14 L20 24" stroke="hsl(258, 30%, 35%)" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M12 20 L20 18 L28 20" stroke="hsl(258, 30%, 35%)" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M10 30 Q20 26 30 30" stroke="hsl(172, 70%, 55%)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    </svg>
  ),
};

const AnimatedYogaCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
    setIsVisible(true);
  }, []);

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.matches('a, button, [role="button"], input, textarea, select, .cursor-pointer')) {
      setIsHovering(true);
    }
  }, []);

  const handleMouseOut = useCallback(() => {
    setIsHovering(false);
  }, []);

  const handleMouseDown = useCallback(() => {
    setIsClicking(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsClicking(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mouseout", handleMouseOut, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseOver, handleMouseOut, handleMouseDown, handleMouseUp, handleMouseLeave]);

  const getCurrentPose = () => {
    if (isClicking) return "click";
    if (isHovering) return "hover";
    return "default";
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: position.x - 16,
        top: position.y - 16,
        transform: `scale(${isClicking ? 1.2 : isHovering ? 1.1 : 1})`,
        transition: "transform 0.1s ease-out",
      }}
    >
      {yogaPoses[getCurrentPose()]}
    </div>
  );
};

export default AnimatedYogaCursor;
