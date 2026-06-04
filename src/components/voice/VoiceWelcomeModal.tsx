import { useVoiceGuide } from "@/contexts/VoiceGuideContext";

const VoiceWelcomeModal = () => {
  const { onboarded, setOnboarded, setEnabled, setExpanded } = useVoiceGuide();
  if (onboarded) return null;

  const enable = () => { setEnabled(true); setOnboarded(true); setExpanded(true); };
  const skip = () => { setEnabled(false); setOnboarded(true); };

  return (
    <div className="fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="vg-welcome-title">
      <div className="max-w-md w-full rounded-2xl bg-card/90 backdrop-blur-xl border border-border shadow-2xl p-6">
        <h2 id="vg-welcome-title" className="text-xl font-semibold text-foreground mb-2">Meet your voice guide</h2>
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
          Welcome! I can guide you through this website and explain each section as you browse.
          You can disable me anytime using the assistant switch.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <button onClick={enable} className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity" aria-label="Enable voice assistant" title="Enable voice assistant">
            Enable assistant
          </button>
          <button onClick={skip} className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors" aria-label="Continue without assistant" title="Continue without assistant">
            Continue without
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceWelcomeModal;
