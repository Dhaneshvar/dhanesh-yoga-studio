## Voice Guide Assistant

A floating glassmorphism widget that narrates sections aloud as users scroll, with full user controls and a conversational chat fallback. Uses only the browser's built-in Web Speech APIs — no backend, no AI calls.

### What gets built

**1. New files**
- `src/contexts/VoiceGuideContext.tsx` — global state (enabled, muted, paused, rate, volume, selected voice, current section, spoken-history Set). Persisted to `localStorage` under `dyc_voice_guide_*`.
- `src/hooks/useSpeech.ts` — wraps `window.speechSynthesis`: `speak()`, `pause()`, `resume()`, `cancel()`, voice list, status (`idle | speaking | paused | listening | disabled`). Truncates narration to ~30s.
- `src/hooks/useSpeechRecognition.ts` — wraps `webkitSpeechRecognition`; graceful fallback when unsupported.
- `src/hooks/useSectionObserver.ts` — single `IntersectionObserver` over elements with `data-voice-section="..."` and `data-voice-title="..."`; picks the most-visible one, debounces, fires only once per section per session (memory in context).
- `src/lib/sectionNarration.ts` — static narration map keyed by section id, returns `{ title, summary, actions[] }`. Includes entries for every public page section + dashboards/admin landing areas. Builds the spoken string from the template: *"You're viewing X. [summary]. You can [actions joined]."*
- `src/lib/contextExtractor.ts` — fallback: if a section isn't in the map, extract `h1/h2/h3`, first paragraph, and button/link labels inside the section element to build narration on the fly.
- `src/components/voice/VoiceGuideWidget.tsx` — floating glassmorphism widget (bottom-right). Collapsed: pulsing mic/wave icon + status dot. Expanded: status label, transcript of last spoken text, controls (Mute, Pause/Resume, Stop, Mic, Settings, Close), chat input, message list.
- `src/components/voice/VoiceSettingsPanel.tsx` — sliders for rate (0.5–1.5) & volume (0–1), voice dropdown, high-contrast toggle.
- `src/components/voice/VoiceWelcomeModal.tsx` — first-visit modal with "Enable Assistant" / "Continue Without". Sets `dyc_voice_guide_onboarded=true`.
- `src/components/voice/SectionMarker.tsx` — tiny helper `<SectionMarker id="pricing" title="Pricing">{children}</SectionMarker>` that renders a wrapping `<section>` with the required `data-voice-*` attrs and a ref registered with the observer.

**2. Files edited**
- `src/App.tsx` — wrap routes with `VoiceGuideProvider`; mount `<VoiceGuideWidget />` and `<VoiceWelcomeModal />` globally (alongside existing chatbot).
- Public pages — wrap existing major sections with `<SectionMarker>` (Index: hero, programs, features, testimonials, cta; About, Programs, Asanas, Schedule, Contact, Gallery; Login/Register; dashboards & admin: header + main content area).
- `src/components/interactive/WhatsAppBubble.tsx` / `ScrollToTop.tsx` / `MeditationToggle.tsx` — shift positions slightly so the new bottom-right widget doesn't collide (per existing layout-collision memory).

**3. Behavior rules**
- Speech rules: pause/skip narration while `document.activeElement` is an input/textarea/select/contenteditable; resume only after blur + 1.5s idle.
- Each section narrates **once per session**; revisiting doesn't repeat unless user clicks "Explain this section."
- Hard cap: cancel speech after 30s.
- When toggle is OFF: status = `disabled`, observer disconnected, all queued speech cancelled, no recognition, no chat AI processing.
- Chat: keyword matcher answers "what can I do here / explain this section / how do I submit / stop talking / mute" using the same narration map + control hooks. Unknown questions get a polite fallback pointing to Contact page.
- Voice commands recognized via STT: "explain", "stop", "mute", "louder", "slower", "next" — mapped to the same handlers as buttons.

**4. Accessibility**
- All buttons get `aria-label` + `title` (per project a11y rule).
- Widget keyboard-trappable when expanded; ESC collapses; `Alt+V` toggles enable.
- Respects `prefers-reduced-motion` (drop pulse animation).
- Uses semantic tokens (`bg-card/60 backdrop-blur`, `border-border`, `text-foreground`, `ring-primary`) — no hardcoded colors.
- High-contrast mode toggle adds `.voice-hc` class boosting border + text contrast.

### Out of scope
- No Lovable Cloud / AI calls (per your choice — narration is static + DOM-extracted).
- No ElevenLabs (using free browser TTS).
- No persistence of chat history across sessions.

### Technical notes
- `speechSynthesis.getVoices()` loads async — hook listens to `voiceschanged`.
- STT only enabled in Chromium-based browsers; mic button hidden otherwise with tooltip.
- Observer uses `threshold: [0.35, 0.6]` and `rootMargin: '-10% 0px -30% 0px'` to pick the section actually centered in viewport.
- Single global observer to avoid perf hit on dashboard pages.
