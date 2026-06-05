import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from "react";

type Status = "idle" | "speaking" | "paused" | "listening" | "disabled";

interface VoiceGuideState {
  enabled: boolean;
  muted: boolean;
  rate: number;
  volume: number;
  voiceURI: string | null;
  highContrast: boolean;
  onboarded: boolean;
  status: Status;
  currentSection: string | null;
  lastSpoken: string;
  expanded: boolean;
  spoken: Set<string>;
}

interface VoiceGuideCtx extends VoiceGuideState {
  setEnabled: (v: boolean) => void;
  setMuted: (v: boolean) => void;
  setRate: (v: number) => void;
  setVolume: (v: number) => void;
  setVoiceURI: (v: string | null) => void;
  setHighContrast: (v: boolean) => void;
  setOnboarded: (v: boolean) => void;
  setStatus: (v: Status) => void;
  setCurrentSection: (v: string | null) => void;
  setLastSpoken: (v: string) => void;
  setExpanded: (v: boolean) => void;
  markSpoken: (id: string) => void;
  hasSpoken: (id: string) => boolean;
  clearSpoken: () => void;
}

const Ctx = createContext<VoiceGuideCtx | null>(null);

const LS = {
  enabled: "dyc_voice_guide_enabled",
  muted: "dyc_voice_guide_muted",
  rate: "dyc_voice_guide_rate",
  volume: "dyc_voice_guide_volume",
  voice: "dyc_voice_guide_voice",
  hc: "dyc_voice_guide_hc",
  onboarded: "dyc_voice_guide_onboarded",
};

const readBool = (k: string, def: boolean) => {
  const v = localStorage.getItem(k);
  return v === null ? def : v === "true";
};
const readNum = (k: string, def: number) => {
  const v = localStorage.getItem(k);
  return v === null ? def : parseFloat(v);
};

export const VoiceGuideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enabled, setEnabledState] = useState(false);
  const [muted, setMutedState] = useState(false);
  const [rate, setRateState] = useState(1);
  const [volume, setVolumeState] = useState(1);
  const [voiceURI, setVoiceURIState] = useState<string | null>(null);
  const [highContrast, setHCState] = useState(false);
  const [onboarded, setOnboardedState] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [lastSpoken, setLastSpoken] = useState("");
  const [expanded, setExpanded] = useState(false);
  const spokenRef = useRef<Set<string>>(new Set());
  const [, force] = useState(0);

  useEffect(() => {
    setEnabledState(readBool(LS.enabled, false));
    setMutedState(readBool(LS.muted, false));
    setRateState(readNum(LS.rate, 1));
    setVolumeState(readNum(LS.volume, 1));
    setVoiceURIState(localStorage.getItem(LS.voice));
    setHCState(readBool(LS.hc, false));
    setOnboardedState(readBool(LS.onboarded, false));
  }, []);

  const persist = (k: string, v: string) => localStorage.setItem(k, v);

  const setEnabled = (v: boolean) => { setEnabledState(v); persist(LS.enabled, String(v)); };
  const setMuted = (v: boolean) => { setMutedState(v); persist(LS.muted, String(v)); };
  const setRate = (v: number) => { setRateState(v); persist(LS.rate, String(v)); };
  const setVolume = (v: number) => { setVolumeState(v); persist(LS.volume, String(v)); };
  const setVoiceURI = (v: string | null) => { setVoiceURIState(v); if (v) persist(LS.voice, v); else localStorage.removeItem(LS.voice); };
  const setHighContrast = (v: boolean) => { setHCState(v); persist(LS.hc, String(v)); document.documentElement.classList.toggle("voice-hc", v); };
  const setOnboarded = (v: boolean) => { setOnboardedState(v); persist(LS.onboarded, String(v)); };

  const markSpoken = useCallback((id: string) => { spokenRef.current.add(id); force(n => n + 1); }, []);
  const hasSpoken = useCallback((id: string) => spokenRef.current.has(id), []);
  const clearSpoken = useCallback(() => { spokenRef.current.clear(); force(n => n + 1); }, []);

  useEffect(() => { document.documentElement.classList.toggle("voice-hc", highContrast); }, [highContrast]);

  const value = useMemo<VoiceGuideCtx>(() => ({
    enabled, muted, rate, volume, voiceURI, highContrast, onboarded,
    status, currentSection, lastSpoken, expanded, spoken: spokenRef.current,
    setEnabled, setMuted, setRate, setVolume, setVoiceURI, setHighContrast, setOnboarded,
    setStatus, setCurrentSection, setLastSpoken, setExpanded,
    markSpoken, hasSpoken, clearSpoken,
  }), [enabled, muted, rate, volume, voiceURI, highContrast, onboarded, status, currentSection, lastSpoken, expanded, markSpoken, hasSpoken, clearSpoken]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useVoiceGuide = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useVoiceGuide must be used within VoiceGuideProvider");
  return c;
};
