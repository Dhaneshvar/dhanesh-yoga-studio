import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import FlashNewsTicker from "@/components/interactive/FlashNewsTicker";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { getPublicSessions, type ClassSession } from "@/lib/studioApi";

const formatDate = (value: string) => new Intl.DateTimeFormat(undefined, { weekday: "long", day: "numeric", month: "long" }).format(new Date(value));
const formatTime = (value: string) => new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(value));

const Schedule = () => {
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { void getPublicSessions().then(setSessions).catch((e) => setError(e instanceof Error ? e.message : "Unable to load classes.")).finally(() => setLoading(false)); }, []);
  const grouped = useMemo(() => sessions.reduce<Record<string, ClassSession[]>>((result, session) => { const day = new Date(session.starts_at).toDateString(); (result[day] ??= []).push(session); return result; }, {}), [sessions]);

  return <div className="min-h-screen bg-background">
    <SEOHead title="Class Schedule" description="See upcoming Dhanesh Yoga Studio classes and book your place." canonicalPath="/schedule" />
    <FlashNewsTicker /><Navbar />
    <main className="pt-32 md:pt-36 pb-20">
      <section className="relative py-16 overflow-hidden"><div className="absolute inset-0 bg-gradient-hero" /><div className="container mx-auto px-4 relative z-10 text-center max-w-3xl"><span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">Live timetable</span><h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">Find your next practice</h1><p className="text-muted-foreground">Classes below are loaded directly from the studio schedule.</p></div></section>
      <section className="container mx-auto px-4 py-12 max-w-5xl">
        {loading && <p className="text-center text-muted-foreground py-16">Loading available classes…</p>}
        {error && <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center"><p className="text-destructive font-medium">We could not load the schedule.</p><p className="text-sm text-muted-foreground mt-2">{error}</p></div>}
        {!loading && !error && sessions.length === 0 && <div className="rounded-2xl border border-border bg-card p-10 text-center"><Calendar className="w-10 h-10 text-primary mx-auto mb-3" /><h2 className="font-display text-2xl font-semibold">No classes are scheduled yet</h2><p className="text-muted-foreground mt-2">Please check back soon or contact the studio for upcoming classes.</p><Button asChild className="mt-6"><Link to="/contact">Contact the studio</Link></Button></div>}
        {Object.entries(grouped).map(([day, daySessions]) => <div key={day} className="mb-10"><h2 className="font-display text-2xl font-semibold mb-4">{formatDate(daySessions[0].starts_at)}</h2><div className="grid md:grid-cols-2 gap-4">{daySessions.map((session) => <article key={session.id} className="p-6 rounded-2xl bg-card border border-border shadow-sm"><div className="flex justify-between gap-3"><div><p className="text-sm text-primary font-medium">{session.program?.audience ?? "All levels"}</p><h3 className="font-display text-xl font-semibold mt-1">{session.title}</h3></div><span className="text-sm font-semibold whitespace-nowrap">{formatTime(session.starts_at)}</span></div><div className="mt-5 space-y-2 text-sm text-muted-foreground"><p className="flex items-center gap-2"><Clock className="w-4 h-4" />{formatTime(session.starts_at)} – {formatTime(session.ends_at)}</p><p className="flex items-center gap-2"><MapPin className="w-4 h-4" />{session.location}</p><p className="flex items-center gap-2"><Users className="w-4 h-4" />Capacity {session.capacity}{session.trainer?.display_name ? ` · ${session.trainer.display_name}` : ""}</p></div><Button asChild className="w-full mt-5"><Link to={`/dashboard/student-registration?session=${session.id}`}>Book this class</Link></Button></article>)}</div></div>)}
      </section>
    </main><Footer />
  </div>;
};
export default Schedule;
