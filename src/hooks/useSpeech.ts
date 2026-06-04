import { useEffect, useRef, useState, useCallback } from "react";
import { useVoiceGuide } from "@/contexts/VoiceGuideContext";

const MAX_SPEECH_MS = 30000;

export function useSpeech() {
  const { rate, volume, voiceURI, enabled, muted, setStatus, setLastSpoken } = useVoiceGuide();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    if (!supported) return;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, [supported]);

  const cancel = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    if (timerRef.current) clearTimeout(timerRef.current);
    setStatus("idle");
  }, [supported, setStatus]);

  const speak = useCallback((text: string) => {
    if (!supported || !enabled || muted || !text) return;
    // Don't interrupt while user is typing in a form field
    const el = document.activeElement as HTMLElement | null;
    if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable)) {
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.volume = volume;
    const v = voices.find(v => v.voiceURI === voiceURI);
    if (v) u.voice = v;
    u.onstart = () => { setStatus("speaking"); setLastSpoken(text); };
    u.onend = () => setStatus("idle");
    u.onerror = () => setStatus("idle");
    window.speechSynthesis.speak(u);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => window.speechSynthesis.cancel(), MAX_SPEECH_MS);
  }, [supported, enabled, muted, rate, volume, voices, voiceURI, setStatus, setLastSpoken]);

  const pause = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.pause();
    setStatus("paused");
  }, [supported, setStatus]);

  const resume = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.resume();
    setStatus("speaking");
  }, [supported, setStatus]);

  return { speak, cancel, pause, resume, voices, supported };
}
