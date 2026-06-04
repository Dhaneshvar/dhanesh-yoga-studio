import { useVoiceGuide } from "@/contexts/VoiceGuideContext";
import { useSpeech } from "@/hooks/useSpeech";

const VoiceSettingsPanel = () => {
  const { rate, volume, voiceURI, highContrast, setRate, setVolume, setVoiceURI, setHighContrast } = useVoiceGuide();
  const { voices } = useSpeech();
  const englishVoices = voices.filter(v => v.lang.toLowerCase().startsWith("en"));
  const list = englishVoices.length ? englishVoices : voices;

  return (
    <div className="space-y-3 p-3 rounded-lg bg-muted/50 border border-border text-sm">
      <div>
        <label className="block text-xs font-medium text-foreground mb-1" htmlFor="vg-voice">Voice</label>
        <select
          id="vg-voice"
          value={voiceURI || ""}
          onChange={e => setVoiceURI(e.target.value || null)}
          className="w-full rounded-md border border-border bg-background px-2 py-1 text-foreground"
          aria-label="Select voice"
          title="Select voice"
        >
          <option value="">Default</option>
          {list.map(v => (
            <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-foreground mb-1" htmlFor="vg-rate">Speech rate: {rate.toFixed(2)}x</label>
        <input id="vg-rate" type="range" min={0.5} max={1.5} step={0.05} value={rate} onChange={e => setRate(parseFloat(e.target.value))} className="w-full" aria-label="Speech rate" title="Speech rate" />
      </div>
      <div>
        <label className="block text-xs font-medium text-foreground mb-1" htmlFor="vg-vol">Volume: {Math.round(volume * 100)}%</label>
        <input id="vg-vol" type="range" min={0} max={1} step={0.05} value={volume} onChange={e => setVolume(parseFloat(e.target.value))} className="w-full" aria-label="Volume" title="Volume" />
      </div>
      <label className="flex items-center gap-2 text-foreground cursor-pointer">
        <input type="checkbox" checked={highContrast} onChange={e => setHighContrast(e.target.checked)} aria-label="High contrast mode" title="High contrast mode" />
        <span>High contrast</span>
      </label>
    </div>
  );
};

export default VoiceSettingsPanel;
