import { useEffect, useState } from "react";
import { CalendarPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createProgram, createSession, getAdminPrograms, getAdminSessions, getStudioDataError, type ClassSession, type Program } from "@/lib/studioApi";
import { useToast } from "@/hooks/use-toast";

const AdminSessions = () => {
  const { toast } = useToast(); const [programs, setPrograms] = useState<Array<Program & { is_published: boolean }>>([]); const [sessions, setSessions] = useState<ClassSession[]>([]); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [error, setError] = useState("");
  const [program, setProgram] = useState({ name: "", audience: "", durationMinutes: "", description: "", published: true });
  const [session, setSession] = useState({ title: "", programId: "", startDate: "", startTime: "", endDate: "", endTime: "", location: "", capacity: "" });
  const toLocalDate = (date: Date) => new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const minimumDate = toLocalDate(new Date());
  const latestDate = new Date(); latestDate.setFullYear(latestDate.getFullYear() + 5);
  const maximumDate = toLocalDate(latestDate);
  const load = () => { setLoading(true); Promise.all([getAdminPrograms(), getAdminSessions()]).then(([p, s]) => { setPrograms(p); setSessions(s); }).catch((e) => setError(getStudioDataError(e, "classes"))).finally(() => setLoading(false)); };
  useEffect(load, []);
  const addProgram = async (event: React.FormEvent) => { event.preventDefault(); setSaving(true); try { await createProgram({ ...program, durationMinutes: Number(program.durationMinutes) }); setProgram({ name: "", audience: "", durationMinutes: "", description: "", published: true }); toast({ title: "Programme saved", description: "The programme is now available in the studio catalogue.", className: "border-emerald-500/40 bg-emerald-600 text-white shadow-lg" }); load(); } catch (e) { setError(e instanceof Error ? e.message : "Unable to save programme."); } finally { setSaving(false); } };
  const addSession = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    const timePattern = /^\d{2}:\d{2}$/;
    if (!datePattern.test(session.startDate) || !datePattern.test(session.endDate) || !timePattern.test(session.startTime) || !timePattern.test(session.endTime)) {
      setError("Please enter a valid start and end date and time.");
      return;
    }
    if (session.startDate < minimumDate || session.startDate > maximumDate || session.endDate < minimumDate || session.endDate > maximumDate) {
      setError("Please choose dates within the next five years.");
      return;
    }
    const startsAt = new Date(`${session.startDate}T${session.startTime}`);
    const endsAt = new Date(`${session.endDate}T${session.endTime}`);
    const capacity = Number(session.capacity);
    if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
      setError("Please enter both a valid start and end time.");
      return;
    }
    if (endsAt <= startsAt) {
      setError("The end time must be after the start time.");
      return;
    }
    if (!Number.isInteger(capacity) || capacity < 1) {
      setError("Capacity must be a whole number greater than zero.");
      return;
    }
    setSaving(true);
    try {
      await createSession({ title: session.title, programId: session.programId || null, startsAt: `${session.startDate}T${session.startTime}`, endsAt: `${session.endDate}T${session.endTime}`, location: session.location, capacity });
      setSession({ title: "", programId: "", startDate: "", startTime: "", endDate: "", endTime: "", location: "", capacity: "" });
      toast({ title: "Class published", description: "The class is now listed in your studio schedule.", className: "border-emerald-500/40 bg-emerald-600 text-white shadow-lg" });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to create class.");
    } finally { setSaving(false); }
  };
  return <div className="space-y-6"><div><h1 className="text-2xl font-bold">Studio classes</h1><p className="text-muted-foreground">Add your real programmes and upcoming classes. Nothing on this page is sample data.</p></div>{error && <p role="alert" className="rounded-xl bg-destructive/5 border border-destructive/20 text-destructive p-4">{error}</p>}<div className="grid xl:grid-cols-2 gap-6"><Card><CardHeader><CardTitle>Add a programme</CardTitle></CardHeader><CardContent><form onSubmit={addProgram} className="space-y-3"><Input label="Programme name" value={program.name} onChange={(v) => setProgram({ ...program, name: v })} required /><Input label="Audience" value={program.audience} onChange={(v) => setProgram({ ...program, audience: v })} placeholder="Adults, Kids, All levels…" /><Input label="Duration (minutes)" value={program.durationMinutes} onChange={(v) => setProgram({ ...program, durationMinutes: v })} type="number" min="1" /><label className="block text-sm font-medium">Description<textarea value={program.description} onChange={(e) => setProgram({ ...program, description: e.target.value })} className="mt-1 w-full min-h-20 rounded-lg border border-border bg-background p-2" /></label><Button disabled={saving} type="submit" className="w-full">{saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Save programme</Button></form></CardContent></Card><Card><CardHeader><CardTitle>Create a class</CardTitle></CardHeader><CardContent><form onSubmit={addSession} className="space-y-3"><Input label="Class title" value={session.title} onChange={(v) => setSession({ ...session, title: v })} required /><label className="block text-sm font-medium">Programme<select value={session.programId} onChange={(e) => setSession({ ...session, programId: e.target.value })} className="mt-1 w-full rounded-lg border border-border bg-background p-2"><option value="">No programme selected</option>{programs.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><div className="grid grid-cols-2 gap-3"><Input label="Start date" value={session.startDate} onChange={(v) => setSession({ ...session, startDate: v, endDate: session.endDate || v })} type="date" min={minimumDate} max={maximumDate} required /><Input label="Start time" value={session.startTime} onChange={(v) => setSession({ ...session, startTime: v })} type="time" step="300" required /></div><div className="grid grid-cols-2 gap-3"><Input label="End date" value={session.endDate} onChange={(v) => setSession({ ...session, endDate: v })} type="date" min={session.startDate || minimumDate} max={maximumDate} required /><Input label="End time" value={session.endTime} onChange={(v) => setSession({ ...session, endTime: v })} type="time" step="300" required /></div><Input label="Location" value={session.location} onChange={(v) => setSession({ ...session, location: v })} required /><Input label="Capacity" value={session.capacity} onChange={(v) => setSession({ ...session, capacity: v })} type="number" min="1" step="1" required /><Button disabled={saving} type="submit" className="w-full"><CalendarPlus className="w-4 h-4 mr-2" />Publish class</Button></form></CardContent></Card></div><Card><CardHeader><CardTitle>Studio classes ({sessions.length})</CardTitle></CardHeader><CardContent>{loading ? <p className="text-muted-foreground">Loading…</p> : sessions.length === 0 ? <p className="text-muted-foreground">No real class data has been entered yet.</p> : <div className="divide-y divide-border">{sessions.map((item) => <div key={item.id} className="py-3"><div className="flex items-center justify-between gap-3"><p className="font-medium">{item.title}</p><span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium capitalize text-primary">{item.status}</span></div><p className="text-sm text-muted-foreground">{new Date(item.starts_at).toLocaleString()} · {item.location} · capacity {item.capacity}</p></div>)}</div>}</CardContent></Card></div>;
};
const Input = ({ label, value, onChange, type = "text", required, placeholder, min, max, step }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; placeholder?: string; min?: string; max?: string; step?: string }) => <label className="block text-sm font-medium">{label}{required ? " *" : ""}<input value={value} onChange={(e) => onChange(e.target.value)} type={type} required={required} placeholder={placeholder} min={min} max={max} step={step} className="mt-1 w-full rounded-lg border border-border bg-background p-2" /></label>;
export default AdminSessions;
