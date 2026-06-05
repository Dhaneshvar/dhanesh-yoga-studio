import { useState, useCallback, useEffect } from "react";
import { Mic, MicOff, Pause, Play, Square, Settings as SettingsIcon, X, Volume2, VolumeX, Power, Send, Sparkles } from "lucide-react";
import { useVoiceGuide } from "@/contexts/VoiceGuideContext";
import { useSpeech } from "@/hooks/useSpeech";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { SECTION_NARRATION, buildNarration } from "@/lib/sectionNarration";
import { extractFromElement } from "@/lib/contextExtractor";
import { cn } from "@/lib/utils";
import VoiceSettingsPanel from "./VoiceSettingsPanel";

interface ChatMsg { from: "user" | "bot"; text: string; }

const STATUS_COLOR: Record<string, string> = {
  idle: "bg-muted-foreground",
  speaking: "bg-primary animate-pulse",
  paused: "bg-amber-500",
  listening: "bg-emerald-500 animate-pulse",
  disabled: "bg-destructive",
};

const VoiceGuideWidget = () => {
  const vg = useVoiceGuide();
  const { enabled, muted, status, currentSection, expanded, setEnabled, setMuted, setExpanded, setStatus } = vg;
  const { speak, cancel, pause, resume, supported: ttsSupported } = useSpeech();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (!enabled) { cancel(); setStatus("disabled"); setShowChat(false); }
    else if (status === "disabled") setStatus("idle");
  }, [enabled]); // eslint-disable-line

  const explainCurrent = useCallback(() => {
    const id = currentSection;
    let el: HTMLElement | null = id ? document.querySelector(`[data-voice-section="${id}"]`) : null;
    if (!el) el = document.querySelector("main") || document.body;
    const narration = (id && SECTION_NARRATION[id]) || extractFromElement(el, id || undefined);
    const text = buildNarration(narration);
    speak(text);
    return text;
  }, [currentSection, speak]);

  const handleCommand = useCallback((raw: string): string => {
    const q = raw.toLowerCase().trim();
    if (/^(stop|silence|quiet)/.test(q)) { cancel(); return "Stopped."; }
    if (/^(mute)/.test(q)) { setMuted(true); cancel(); return "Muted."; }
    if (/^(unmute)/.test(q)) { setMuted(false); return "Unmuted."; }
    if (/^(pause)/.test(q)) { pause(); return "Paused."; }
    if (/^(resume|continue)/.test(q)) { resume(); return "Resumed."; }
    if (/(explain|what.*here|what.*page|describe)/.test(q)) return explainCurrent();
    if (/(help|guide)/.test(q)) return "Click Explain to hear about the current page, or use the controls to pause, stop, or mute.";
    return "Try 'explain', 'pause', 'stop', or 'mute'. For specific questions, visit the Contact page.";
  }, [cancel, setMuted, pause, resume, explainCurrent]);

  const send = useCallback((textOverride?: string) => {
    const text = (textOverride ?? input).trim();
    if (!text) return;
    setInput("");
    setMessages(prev => [...prev, { from: "user", text }]);
    const reply = handleCommand(text);
    setMessages(prev => [...prev, { from: "bot", text: reply }]);
  }, [input, handleCommand]);

  const { start: startListen, stop: stopListen, listening, supported: srSupported } = useSpeechRecognition((text) => {
    setStatus("idle");
    send(text);
  });

  useEffect(() => { if (listening) setStatus("listening"); }, [listening, setStatus]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "v" || e.key === "V")) { e.preventDefault(); setEnabled(!enabled); }
      if (e.key === "Escape" && expanded) setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled, expanded, setEnabled, setExpanded]);

  if (!ttsSupported) return null;

  // Disabled: small sparkle launcher
  if (!enabled) {
    return (
      <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-50">
        <button
          onClick={() => { setEnabled(true); setExpanded(true); }}
          className="p-2 rounded-full bg-card/70 backdrop-blur-xl border border-border shadow-md hover:bg-card hover:scale-105 transition-all"
          aria-label="Enable voice guide"
          title="Enable voice guide"
        >
          <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
        </button>
      </div>
    );
  }

  // Collapsed: small sparkle pill
  if (!expanded) {
    return (
      <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-50">
        <button
          onClick={() => setExpanded(true)}
          className="relative flex items-center gap-1.5 p-2 rounded-full bg-card/70 backdrop-blur-xl border border-border shadow-md hover:scale-105 transition-transform"
          aria-label="Open voice guide"
          title="Open voice guide"
        >
          <span className={cn("absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ring-2 ring-card", STATUS_COLOR[status])} aria-hidden="true" />
          <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
        </button>
      </div>
    );
  }

  // Expanded: simple compact panel; chat appears only after Explain
  return (
    <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-50">
      <div className="w-[min(92vw,320px)] rounded-2xl bg-card/85 backdrop-blur-xl border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-background/60">
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
            <span className="text-sm font-semibold text-foreground">Voice Guide</span>
            <span className={cn("w-2 h-2 rounded-full flex-shrink-0", STATUS_COLOR[status])} aria-hidden="true" />
          </div>
          <div className="flex items-center gap-0.5">
            <button onClick={() => setShowSettings(s => !s)} className="p-1.5 rounded-md hover:bg-muted text-foreground" aria-label="Settings" title="Settings"><SettingsIcon className="w-3.5 h-3.5" /></button>
            <button onClick={() => setExpanded(false)} className="p-1.5 rounded-md hover:bg-muted text-foreground" aria-label="Close" title="Close"><X className="w-3.5 h-3.5" /></button>
          </div>
        </div>

        {/* Minimal controls: On/Off, Mute, Pause, Stop, Explain */}
        <div className="flex items-center gap-1 px-2 py-2">
          <button
            onClick={() => setEnabled(!enabled)}
            className={cn("flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium border transition-colors", enabled ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-foreground border-border")}
            aria-label={enabled ? "Turn off" : "Turn on"}
            title={enabled ? "Turn off" : "Turn on"}
          >
            <Power className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { setMuted(!muted); if (!muted) cancel(); }}
            className="p-1.5 rounded-md border border-border bg-background text-foreground hover:bg-muted"
            aria-label={muted ? "Unmute" : "Mute"}
            title={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          {status === "paused" ? (
            <button onClick={resume} className="p-1.5 rounded-md border border-border bg-background text-foreground hover:bg-muted" aria-label="Resume" title="Resume">
              <Play className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button onClick={pause} disabled={status !== "speaking"} className="p-1.5 rounded-md border border-border bg-background text-foreground hover:bg-muted disabled:opacity-40" aria-label="Pause" title="Pause">
              <Pause className="w-3.5 h-3.5" />
            </button>
          )}
          <button onClick={cancel} className="p-1.5 rounded-md border border-border bg-background text-foreground hover:bg-muted" aria-label="Stop" title="Stop">
            <Square className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { setShowChat(true); explainCurrent(); }}
            disabled={muted}
            className="ml-auto px-2.5 py-1.5 rounded-md text-xs font-semibold bg-accent text-accent-foreground hover:opacity-90 disabled:opacity-40"
            aria-label="Explain this section"
            title="Explain this section"
          >
            Explain
          </button>
        </div>

        {showSettings && <div className="p-2 border-t border-border"><VoiceSettingsPanel /></div>}

        {/* Chat + input only after Explain */}
        {showChat && (
          <>
            <div className="max-h-[40vh] overflow-y-auto p-3 space-y-2 bg-muted/20 border-t border-border min-h-[100px]">
              {messages.length === 0 ? (
                <div className="text-xs text-muted-foreground italic">Ask a question or use voice input below.</div>
              ) : messages.map((m, i) => (
                <div key={i} className={cn("flex", m.from === "user" ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed",
                    m.from === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-background border border-border text-foreground rounded-bl-sm"
                  )}>{m.text}</div>
                </div>
              ))}
            </div>
            <div className="p-2 border-t border-border bg-background/60 flex items-center gap-1.5">
              {srSupported && (
                <button
                  onClick={() => listening ? stopListen() : startListen()}
                  className={cn("p-2 rounded-full border transition-colors", listening ? "bg-destructive text-destructive-foreground border-destructive" : "bg-background border-border text-foreground hover:bg-muted")}
                  aria-label={listening ? "Stop listening" : "Start voice input"}
                  title={listening ? "Stop listening" : "Start voice input"}
                >
                  {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); send(); } }}
                placeholder="Ask about this page…"
                className="flex-1 px-3 py-2 rounded-full bg-muted text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                aria-label="Message voice assistant"
                title="Ask about this page"
              />
              <button onClick={() => send()} disabled={!input.trim()} className="p-2 rounded-full bg-primary text-primary-foreground disabled:opacity-40" aria-label="Send" title="Send">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VoiceGuideWidget;
