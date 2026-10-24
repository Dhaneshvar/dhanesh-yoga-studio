import { useEffect, useState } from "react";
import { Calendar, Loader2, MapPin, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cancelBooking, getMyBookings, type Booking } from "@/lib/studioApi";
import { useToast } from "@/hooks/use-toast";

const MyRegistrations = () => {
  const [bookings, setBookings] = useState<Booking[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [busy, setBusy] = useState<string | null>(null); const { toast } = useToast();
  const load = () => { setLoading(true); void getMyBookings().then(setBookings).catch((e) => setError(e instanceof Error ? e.message : "Unable to load your bookings.")).finally(() => setLoading(false)); };
  useEffect(load, []);
  const cancel = async (id: string) => { setBusy(id); try { await cancelBooking(id); toast({ title: "Booking cancelled" }); load(); } catch (e) { toast({ title: "Unable to cancel", description: e instanceof Error ? e.message : "Please try again.", variant: "destructive" }); } finally { setBusy(null); } };
  return <div className="p-4 md:p-6 max-w-4xl mx-auto"><h1 className="text-3xl font-display font-bold">My registrations</h1><p className="text-muted-foreground mt-1 mb-6">Your live class bookings.</p>{loading && <p className="text-muted-foreground">Loading registrations…</p>}{error && <p className="rounded-xl bg-destructive/5 border border-destructive/20 text-destructive p-4">{error}</p>}{!loading && !error && bookings.length === 0 && <Card><CardContent className="py-12 text-center"><Calendar className="w-10 h-10 mx-auto text-primary mb-3" /><h2 className="font-semibold text-xl">No bookings yet</h2><p className="text-muted-foreground mt-1">Choose a class to begin your practice.</p></CardContent></Card>}<div className="grid gap-4">{bookings.map((booking) => { const session = booking.class_session; return <Card key={booking.id}><CardHeader className="flex-row justify-between gap-4"><CardTitle>{session?.title ?? "Class session"}</CardTitle><span className="capitalize text-sm px-3 py-1 rounded-full bg-primary/10 text-primary">{booking.status}</span></CardHeader><CardContent><div className="space-y-2 text-sm text-muted-foreground"><p><Calendar className="w-4 h-4 inline mr-2" />{session ? new Date(session.starts_at).toLocaleString() : "Schedule unavailable"}</p>{session && <p><MapPin className="w-4 h-4 inline mr-2" />{session.location}</p>}</div>{booking.status !== "cancelled" && <Button variant="outline" className="mt-5" disabled={busy === booking.id} onClick={() => void cancel(booking.id)}>{busy === booking.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}Cancel booking</Button>}</CardContent></Card>; })}</div></div>;
};
export default MyRegistrations;
