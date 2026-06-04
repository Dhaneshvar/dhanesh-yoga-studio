import { useCallback, useEffect, useRef, useState } from "react";

type SRConstructor = new () => any;

export function useSpeechRecognition(onResult: (text: string) => void) {
  const SR: SRConstructor | undefined =
    typeof window !== "undefined"
      ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      : undefined;
  const supported = !!SR;
  const recRef = useRef<any>(null);
  const [listening, setListening] = useState(false);
  const cbRef = useRef(onResult);
  useEffect(() => { cbRef.current = onResult; }, [onResult]);

  const start = useCallback(() => {
    if (!supported) return;
    try {
      const rec = new SR!();
      rec.lang = "en-US";
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        cbRef.current(text);
      };
      rec.onend = () => setListening(false);
      rec.onerror = () => setListening(false);
      recRef.current = rec;
      rec.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  }, [SR, supported]);

  const stop = useCallback(() => {
    try { recRef.current?.stop(); } catch {}
    setListening(false);
  }, []);

  return { start, stop, listening, supported };
}
