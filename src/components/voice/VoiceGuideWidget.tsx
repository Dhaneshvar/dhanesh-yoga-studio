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

const STATUS_LABEL: Record<string, string> = {
  idle: "Idle", speaking: "Speaking", paused: "Paused", listening: "Listening", disabled: "Disabled",
};

const STATUS_COLOR: Record<string, string> = {
  idle: "bg-muted-foreground",
  speaking: "bg-primary animate-pulse",
  paused: "bg-amber-500",
  listening: "bg-emerald-500 animate-pulse",
  disabled: "bg-destructive",
};

const VoiceGuideWidget = () => {
  const vg = useVoiceGuide();
  const { enabled, muted, status, currentSection, lastSpoken, expanded, setEnabled, setMuted, setExpanded, setStatus } = vg;
  const { speak, cancel, pause, resume, supported: ttsSupported } = useSpeech();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  // Reflect disabled state in status
  useEffect(() => {
    if (!enabled) { cancel(); setStatus("disabled"); }
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
    if (/^(stop|stop talking|silence|quiet)/.test(q)) { cancel(); return "Stopped."; }
    if (/^(mute)/.test(q)) { setMuted(true); cancel(); return "Muted."; }
    if (/^(unmute)/.test(q)) { setMuted(false); return "Unmuted."; }
    if (/^(pause)/.test(q)) { pause(); return "Paused."; }
    if (/^(resume|continue)/.test(q)) { resume(); return "Resumed."; }
    if (/^(disable|turn off|off)/.test(q)) { setEnabled(false); return "Assistant disabled."; }
    if (/(explain|what.*here|what.*page|what.*section|describe)/.test(q)) return explainCurrent();
    if (/(submit.*form|how.*submit)/.test(q)) return "Fill in the required fields, review your information, and click the submit button at the bottom of the form.";
    if (/(help|guide)/.test(q)) return "I can explain sections as you scroll, answer questions about this page, and respond to voice commands like 'stop' or 'mute'.";
    return "I'm here to guide you through this site. Try asking 'explain this section' or scroll to hear automatic narration. For specific questions, please visit the Contact page.";
  }, [cancel, setMuted, setEnabled, pause, resume, explainCurrent]);

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

  // Keyboard shortcut Alt+V
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "v" || e.key === "V")) { e.preventDefault(); setEnabled(!enabled); }
      if (e.key === "Escape" && expanded) setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled, expanded, setEnabled, setExpanded]);

  if (!ttsSupported) return null;

  // Opt-in only: when disabled, show a small unobtrusive launcher to enable it.
  if (!enabled) {
    return (
      <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-50">
        <button
          onClick={() => { setEnabled(true); setExpanded(true); }}
          className="p-2.5 rounded-full bg-card/60 backdrop-blur-xl border border-border shadow-md hover:bg-card/90 hover:scale-105 transition-all opacity-70 hover:opacity-100"
          aria-label="Enable voice guide"
          title="Enable voice guide"
        >
          <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-50">
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className={cn(
            "relative flex items-center gap-2 px-4 py-3 rounded-full",
            "bg-card/70 backdrop-blur-xl border border-border shadow-xl",
            "hover:scale-105 transition-transform",
          )}
          aria-label="Open voice assistant"
          title="Open voice assistant"
        >
          <span className={cn("w-2.5 h-2.5 rounded-full", STATUS_COLOR[status])} aria-hidden="true" />
          <Sparkles className="w-5 h-5 text-primary" aria-hidden="true" />
          <span className="hidden sm:inline text-sm font-medium text-foreground">Voice Guide</span>
        </button>
      ) : (
        <div className={cn(
          "w-[min(92vw,360px)] max-h-[80vh] flex flex-col",
          "rounded-2xl bg-card/80 backdrop-blur-xl border border-border shadow-2xl overflow-hidden",
        )}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/60">
            <div className="flex items-center gap-2 min-w-0">
              <span className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", STATUS_COLOR[status])} aria-hidden="true" />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-foreground leading-tight">Voice Guide</div>
                <div className="text-xs text-muted-foreground truncate">{STATUS_LABEL[status]}{currentSection ? ` • ${currentSection}` : ""}</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setShowSettings(s => !s)} className="p-1.5 rounded-md hover:bg-muted text-foreground" aria-label="Settings" title="Settings"><SettingsIcon className="w-4 h-4" /></button>
              <button onClick={() => setExpanded(false)} className="p-1.5 rounded-md hover:bg-muted text-foreground" aria-label="Close" title="Close"><X className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 border-b border-border bg-background/30">
            <button onClick={() => setEnabled(!enabled)} className={cn("flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors", enabled ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-foreground border-border")} aria-label={enabled ? "Disable assistant" : "Enable assistant"} title={enabled ? "Disable assistant" : "Enable assistant"}>
              <Power className="w-3.5 h-3.5" /> {enabled ? "On" : "Off"}
            </button>
            <button onClick={() => { setMuted(!muted); if (!muted) cancel(); }} disabled={!enabled} className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border border-border bg-background text-foreground hover:bg-muted disabled:opacity-40" aria-label={muted ? "Unmute" : "Mute"} title={muted ? "Unmute" : "Mute"}>
              {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <button onClick={pause} disabled={!enabled || status !== "speaking"} className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border border-border bg-background text-foreground hover:bg-muted disabled:opacity-40" aria-label="Pause speaking" title="Pause speaking">
              <Pause className="w-3.5 h-3.5" />
            </button>
            <button onClick={resume} disabled={!enabled || status !== "paused"} className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border border-border bg-background text-foreground hover:bg-muted disabled:opacity-40" aria-label="Resume speaking" title="Resume speaking">
              <Play className="w-3.5 h-3.5" />
            </button>
            <button onClick={cancel} disabled={!enabled} className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border border-border bg-background text-foreground hover:bg-muted disabled:opacity-40" aria-label="Stop speaking" title="Stop speaking">
              <Square className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => { explainCurrent(); }} disabled={!enabled || muted} className="ml-auto px-2.5 py-1.5 rounded-md text-xs font-medium bg-accent text-accent-foreground hover:opacity-90 disabled:opacity-40" aria-label="Explain this section" title="Explain this section">
              Explain
            </button>
          </div>

          {showSettings && <div className="p-2 border-b border-border"><VoiceSettingsPanel /></div>}

          {/* Last spoken / Chat */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-muted/20 min-h-[120px]">
            {lastSpoken && messages.length === 0 && (
              <div className="text-xs text-muted-foreground italic">Last narration: "{lastSpoken}"</div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.from === "user" ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed",
                  m.from === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-background border border-border text-foreground rounded-bl-sm"
                )}>{m.text}</div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-2 border-t border-border bg-background/60 flex items-center gap-1.5">
            {srSupported && (
              <button
                onClick={() => listening ? stopListen() : startListen()}
                disabled={!enabled}
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
        </div>
      )}
    </div>
  );
};

export default VoiceGuideWidget;
