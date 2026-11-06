import { useEffect, useState } from "react";

/** Shared mobile preference for showing or hiding the floating utility controls. */
export const useFloatingControlsVisibility = () => {
  const [controlsVisible, setControlsVisible] = useState(true);

  useEffect(() => {
    const handleVisibility = (event: Event) => {
      setControlsVisible((event as CustomEvent<{ visible?: boolean }>).detail?.visible !== false);
    };
    window.addEventListener("floating-controls-visibility", handleVisibility);
    return () => window.removeEventListener("floating-controls-visibility", handleVisibility);
  }, []);

  return controlsVisible;
};
