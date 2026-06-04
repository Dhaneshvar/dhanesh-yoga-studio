import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useVoiceGuide } from "@/contexts/VoiceGuideContext";
import { useSpeech } from "@/hooks/useSpeech";
import { SECTION_NARRATION, buildNarration } from "@/lib/sectionNarration";
import { extractFromElement } from "@/lib/contextExtractor";

const VoiceSectionObserver = () => {
  const { enabled, muted, hasSpoken, markSpoken, setCurrentSection, clearSpoken } = useVoiceGuide();
  const { speak, cancel } = useSpeech();
  const location = useLocation();
  const lastIdRef = useRef<string | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset per-route memory so the same anchor id on different pages re-narrates
  useEffect(() => {
    clearSpoken();
    lastIdRef.current = null;
    cancel();
  }, [location.pathname, clearSpoken, cancel]);

  useEffect(() => {
    if (!enabled || muted) {
      cancel();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick most visible
        const visible = entries
          .filter(e => e.isIntersecting && e.intersectionRatio > 0.3)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const el = visible.target as HTMLElement;
        const id = el.getAttribute("data-voice-section") || "";
        if (!id || id === lastIdRef.current) return;
        lastIdRef.current = id;
        setCurrentSection(id);

        if (hasSpoken(id)) return;
        markSpoken(id);

        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        idleTimerRef.current = setTimeout(() => {
          const active = document.activeElement as HTMLElement | null;
          if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.tagName === "SELECT" || active.isContentEditable)) return;
          const narration = SECTION_NARRATION[id] || extractFromElement(el, id);
          speak(buildNarration(narration));
        }, 600);
      },
      { threshold: [0.35, 0.6], rootMargin: "-10% 0px -30% 0px" }
    );

    // Observe existing + future
    const observeAll = () => {
      document.querySelectorAll<HTMLElement>("[data-voice-section]").forEach(el => observer.observe(el));
    };
    observeAll();
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mo.disconnect();
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [enabled, muted, hasSpoken, markSpoken, setCurrentSection, speak, cancel, location.pathname]);

  return null;
};

export default VoiceSectionObserver;
