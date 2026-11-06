import { useEffect, useState } from "react";
import { Download, WifiOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "dyc-pwa-install-dismissed";

export default function PwaInstallPrompt() {
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const [isOffline, setIsOffline] = useState(() => !navigator.onLine);
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISS_KEY) === "true");

  useEffect(() => {
    const onInstallable = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallPromptEvent);
    };
    const onInstalled = () => setInstallEvent(null);
    const onOnline = () => setIsOffline(false);
    const onOffline = () => setIsOffline(true);

    window.addEventListener("beforeinstallprompt", onInstallable);
    window.addEventListener("appinstalled", onInstalled);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("beforeinstallprompt", onInstallable);
      window.removeEventListener("appinstalled", onInstalled);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "true");
    setDismissed(true);
  };

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  };

  return (
    <>
      {isOffline && (
        <div className="fixed inset-x-3 bottom-3 z-[80] mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-amber-300/40 bg-card/95 px-4 py-3 text-sm text-foreground shadow-xl backdrop-blur" role="status" aria-live="polite">
          <WifiOff className="h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
          <span>You’re offline. We’ll reconnect when your network returns.</span>
        </div>
      )}
      {installEvent && !dismissed && !isOffline && (
        <div className="fixed inset-x-3 bottom-3 z-[79] mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-primary/20 bg-card/95 px-4 py-3 shadow-xl backdrop-blur" role="dialog" aria-label="Install Dhanesh Yoga">
          <img src="/favicon.svg" alt="" className="h-9 w-9 shrink-0" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">Take Dhanesh Yoga with you</p>
            <p className="text-xs text-muted-foreground">Install the studio app for faster access.</p>
          </div>
          <Button size="sm" onClick={install} className="shrink-0 gap-1.5">
            <Download className="h-4 w-4" aria-hidden="true" /> Install
          </Button>
          <Button size="icon" variant="ghost" onClick={dismiss} aria-label="Dismiss install prompt" title="Dismiss install prompt" className="h-8 w-8 shrink-0">
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      )}
    </>
  );
}
