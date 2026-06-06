import { ReactNode, CSSProperties } from "react";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number; // ms
  as?: "div" | "section" | "article";
  y?: number; // px translate
}

const Reveal = ({ children, className, delay = 0, as: Tag = "div", y = 24 }: RevealProps) => {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const style: CSSProperties = {
    transitionDelay: `${delay}ms`,
    transform: visible ? "translateY(0)" : `translateY(${y}px)`,
    opacity: visible ? 1 : 0,
    transitionProperty: "opacity, transform",
    transitionDuration: "700ms",
    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
    willChange: "opacity, transform",
  };
  return (
    <Tag ref={ref as any} className={cn(className)} style={style}>
      {children}
    </Tag>
  );
};

export default Reveal;
