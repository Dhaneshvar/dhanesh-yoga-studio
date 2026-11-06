import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Calendar, CheckCircle, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { bookSession, getPublicSessions, getStudioDataError, saveIntake, type ClassSession } from "@/lib/studioApi";
import { useAuth } from "@/hooks/useAuth";

const StudentRegistration = () => {
  const { user } = useAuth(); const { toast } = useToast(); const [params] = useSearchParams();
  const [sessions, setSessions] = useState<ClassSession[]>([]); const [selectedSession, setSelectedSession] = useState(params.get("session") ?? "");
  const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [error, setError] = useState("");
  const [form, setForm] = useState({ fullName: user?.name ?? "", phone: user?.phone ?? "", age: "", emergencyContact: "", healthConditions: "", experience: "beginner", goals: "" });
  useEffect(() => { setForm((previous) => ({ ...previous, fullName: user?.name ?? previous.fullName, phone: user?.phone ?? previous.phone })); }, [user]);
  useEffect(() => { void getPublicSessions().then(setSessions).catch((e) => setError(getStudioDataError(e, "classes"))).finally(() => setLoading(false)); }, []);
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); if (!selectedSession) return setError("Choose a class before booking.");
    if (!form.fullName.trim() || !form.phone.trim() || !form.age) return setError("Name, phone and age are required.");
    setSaving(true); setError("");
    try {
      await saveIntake({ ...form, age: Number(form.age) });
      const booking = await bookSession(selectedSession);
      toast({ title: booking.status === "confirmed" ? "Class booked" : "You are on the waitlist", description: booking.status === "confirmed" ? "Your place is confirmed." : "The class is full; we will notify you if a place opens." });
      setSelectedSession("");
    } catch (e) { setError(e instanceof Error ? e.message : "We could not save your booking."); }
    finally { setSaving(false); }
  };
  return <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6"><div><h1 className="text-3xl font-display font-bold">Book a class</h1><p className="text-muted-foreground mt-1">Your profile and booking are securely saved to the studio database.</p></div>
    {error && <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-destructive">{error}</div>}
    <form onSubmit={submit} className="space-y-6"><Card><CardHeader><CardTitle className="flex gap-2 items-center"><User className="w-5 h-5 text-primary" />Your details</CardTitle></CardHeader><CardContent className="grid md:grid-cols-2 gap-4"><Field label="Full name" value={form.fullName} onChange={(value) => update("fullName", value)} required /><Field label="Phone" value={form.phone} onChange={(value) => update("phone", value)} required /><Field label="Age" value={form.age} type="number" onChange={(value) => update("age", value)} required /><Field label="Emergency contact" value={form.emergencyContact} onChange={(value) => update("emergencyContact", value)} /><label className="md:col-span-2 text-sm font-medium">Experience<select value={form.experience} onChange={(e) => update("experience", e.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-background p-3"><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></label><Textarea label="Health conditions or limitations" value={form.healthConditions} onChange={(value) => update("healthConditions", value)} /><Textarea label="Your yoga goals" value={form.goals} onChange={(value) => update("goals", value)} /></CardContent></Card>
    <Card><CardHeader><CardTitle className="flex gap-2 items-center"><Calendar className="w-5 h-5 text-primary" />Choose a class</CardTitle></CardHeader><CardContent>{loading ? <p className="text-muted-foreground">Loading classes…</p> : sessions.length === 0 ? <p className="text-muted-foreground">No bookable classes are available yet.</p> : <div className="grid gap-3">{sessions.map((session) => <button type="button" key={session.id} onClick={() => setSelectedSession(session.id)} className={`text-left rounded-xl border-2 p-4 transition-colors ${selectedSession === session.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}><div className="flex justify-between gap-4"><span className="font-semibold">{session.title}</span>{selectedSession === session.id && <CheckCircle className="w-5 h-5 text-primary" />}</div><p className="text-sm text-muted-foreground mt-1">{new Date(session.starts_at).toLocaleString()} · {session.location}</p><p className="text-xs text-muted-foreground mt-1">{session.trainer?.display_name ?? "Studio instructor"}</p></button>)}</div>}</CardContent></Card>
    <Button type="submit" size="lg" className="w-full" disabled={saving || loading || !sessions.length}>{saving && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}{saving ? "Saving…" : "Confirm booking"}</Button></form></div>;
};
const Field = ({ label, value, onChange, required, type = "text" }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; type?: string }) => <label className="text-sm font-medium">{label}{required ? " *" : ""}<input required={required} type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-background p-3" /></label>;
const Textarea = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => <label className="md:col-span-2 text-sm font-medium">{label}<textarea value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 min-h-24 w-full rounded-xl border border-border bg-background p-3" /></label>;
export default StudentRegistration;
