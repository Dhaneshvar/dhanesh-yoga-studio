import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

const MobileControlsToggle = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("floating-controls-visibility", { detail: { visible: true } }));
  }, []);

  const toggle = () => {
    const nextVisible = !visible;
    setVisible(nextVisible);
    window.dispatchEvent(new CustomEvent("floating-controls-visibility", { detail: { visible: nextVisible } }));
  };

  return (
    <motion.button
      type="button"
      onClick={toggle}
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-4 right-4 z-[70] grid h-10 w-10 place-items-center rounded-full border border-border bg-card/95 text-muted-foreground shadow-lg backdrop-blur-sm transition-colors hover:text-primary sm:hidden"
      title={visible ? "Hide floating controls" : "Show floating controls"}
      aria-label={visible ? "Hide floating controls" : "Show floating controls"}
    >
      {visible ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
    </motion.button>
  );
};

export default MobileControlsToggle;
