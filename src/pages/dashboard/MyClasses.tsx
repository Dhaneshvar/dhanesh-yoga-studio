import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, User, MapPin, CheckCircle, Star, CalendarPlus, Undo2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface UpcomingClass {
  id: number;
  name: string;
  trainer: string;
  date: string;
  time: string;
  location: string;
  type: string;
  status: "confirmed" | "cancelled";
}

interface CompletedClass {
  id: number;
  name: string;
  trainer: string;
  date: string;
  time: string;
  rating: number;
}

const initialUpcoming: UpcomingClass[] = [
  { id: 1, name: "Morning Vinyasa Flow", trainer: "Priya Sharma", date: "Feb 3, 2026", time: "7:00 AM - 8:00 AM", location: "Studio A", type: "Vinyasa", status: "confirmed" },
  { id: 2, name: "Gentle Hatha Yoga", trainer: "Amit Patel", date: "Feb 4, 2026", time: "9:00 AM - 10:00 AM", location: "Studio B", type: "Hatha", status: "confirmed" },
  { id: 3, name: "Power Yoga", trainer: "Meera Krishnan", date: "Feb 5, 2026", time: "6:00 PM - 7:00 PM", location: "Studio A", type: "Power", status: "confirmed" },
];

const initialCompleted: CompletedClass[] = [
  { id: 101, name: "Sunrise Meditation", trainer: "Priya Sharma", date: "Feb 1, 2026", time: "6:00 AM - 6:45 AM", rating: 5 },
  { id: 102, name: "Restorative Yoga", trainer: "Lakshmi Rao", date: "Jan 30, 2026", time: "5:00 PM - 6:00 PM", rating: 4 },
];

const slotOptions = [
  "Feb 6, 2026 · 7:00 AM",
  "Feb 7, 2026 · 9:00 AM",
  "Feb 8, 2026 · 6:00 PM",
];

const MyClasses = () => {
  const [upcoming, setUpcoming] = useState(initialUpcoming);
  const [completed, setCompleted] = useState(initialCompleted);
  const [rescheduling, setRescheduling] = useState<number | null>(null);

  const activeCount = useMemo(
    () => upcoming.filter((c) => c.status === "confirmed").length,
    [upcoming]
  );
  const practiceHours = useMemo(() => completed.length * 1.25, [completed]);

  const cancelClass = (cls: UpcomingClass) => {
    setUpcoming((prev) =>
      prev.map((c) => (c.id === cls.id ? { ...c, status: "cancelled" } : c))
    );
    toast({
      title: "Class cancelled",
      description: `${cls.name} on ${cls.date} has been released.`,
    });
  };

  const restoreClass = (cls: UpcomingClass) => {
    setUpcoming((prev) =>
      prev.map((c) => (c.id === cls.id ? { ...c, status: "confirmed" } : c))
    );
    toast({ title: "Booking restored", description: `${cls.name} is confirmed again.` });
  };

  const applyReschedule = (cls: UpcomingClass, slot: string) => {
    const [date, time] = slot.split(" · ");
    setUpcoming((prev) =>
      prev.map((c) =>
        c.id === cls.id ? { ...c, date, time: `${time} - 1 hr`, status: "confirmed" } : c
      )
    );
    setRescheduling(null);
    toast({ title: "Class rescheduled", description: `${cls.name} moved to ${slot}.` });
  };

  const bookAgain = (cls: CompletedClass) => {
    const id = Date.now();
    setUpcoming((prev) => [
      ...prev,
      {
        id,
        name: cls.name,
        trainer: cls.trainer,
        date: "Feb 9, 2026",
        time: cls.time,
        location: "Studio A",
        type: "Repeat",
        status: "confirmed",
      },
    ]);
    toast({ title: "Booked again", description: `${cls.name} added to your upcoming classes.` });
  };

  const rateClass = (cls: CompletedClass, rating: number) => {
    setCompleted((prev) => prev.map((c) => (c.id === cls.id ? { ...c, rating } : c)));
    toast({ title: "Thanks for the feedback", description: `You rated ${cls.name} ${rating}/5.` });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">My Classes</h1>
          <p className="text-muted-foreground mt-1">View and manage your yoga sessions</p>
        </div>
        <Button asChild className="btn-pop w-full sm:w-auto">
          <Link to="/dashboard/student-registration" title="Register for a new class" aria-label="Register for a new class">
            <CalendarPlus className="w-4 h-4 mr-2" />
            Book a class
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Calendar, value: String(activeCount), label: "Upcoming Classes", bg: "bg-primary/10", color: "text-primary" },
          { icon: CheckCircle, value: String(completed.length), label: "Classes Completed", bg: "bg-secondary", color: "text-secondary-foreground" },
          { icon: Clock, value: `${practiceHours}h`, label: "Total Practice Time", bg: "bg-muted", color: "text-muted-foreground" },
        ].map((stat, i) => (
          <Card
            key={stat.label}
            className="bg-card/70 backdrop-blur-xl border-border/60 hover-lift shine-sweep animate-fade-in"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-3 rounded-full ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Classes Tabs */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="upcoming">Upcoming ({activeCount})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          <div className="space-y-3">
            {upcoming.map((cls) => (
              <Card
                key={cls.id}
                className={`bg-card/70 backdrop-blur-xl border-border/60 hover-lift transition-opacity ${
                  cls.status === "cancelled" ? "opacity-60" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-base text-foreground">{cls.name}</h3>
                        <Badge variant="secondary">{cls.type}</Badge>
                        {cls.status === "cancelled" && <Badge variant="destructive">Cancelled</Badge>}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{cls.trainer}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{cls.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{cls.time}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{cls.location}</span>
                      </div>
                      {rescheduling === cls.id && (
                        <div className="pt-2 animate-fade-in">
                          <Select onValueChange={(slot) => applyReschedule(cls, slot)}>
                            <SelectTrigger className="w-[240px]" title="Choose a new slot" aria-label="Choose a new slot">
                              <SelectValue placeholder="Pick a new slot" />
                            </SelectTrigger>
                            <SelectContent>
                              {slotOptions.map((slot) => (
                                <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {cls.status === "confirmed" ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="btn-pop"
                            onClick={() => setRescheduling(rescheduling === cls.id ? null : cls.id)}
                            title={`Reschedule ${cls.name}`}
                            aria-label={`Reschedule ${cls.name}`}
                          >
                            Reschedule
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="btn-pop"
                            onClick={() => cancelClass(cls)}
                            title={`Cancel ${cls.name}`}
                            aria-label={`Cancel ${cls.name}`}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="btn-pop"
                          onClick={() => restoreClass(cls)}
                          title={`Restore booking for ${cls.name}`}
                          aria-label={`Restore booking for ${cls.name}`}
                        >
                          <Undo2 className="w-4 h-4 mr-1" />
                          Undo
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <div className="space-y-3">
            {completed.map((cls) => (
              <Card key={cls.id} className="bg-card/70 backdrop-blur-xl border-border/60 hover-lift">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <h3 className="font-semibold text-base text-foreground">{cls.name}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{cls.trainer}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{cls.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{cls.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            onClick={() => rateClass(cls, value)}
                            title={`Rate ${value} out of 5`}
                            aria-label={`Rate ${cls.name} ${value} out of 5`}
                            className="p-0.5 transition-transform hover:scale-125"
                          >
                            <Star
                              className={`w-4 h-4 ${value <= cls.rating ? "text-accent fill-accent" : "text-muted"}`}
                            />
                          </button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="btn-pop"
                        onClick={() => bookAgain(cls)}
                        title={`Book ${cls.name} again`}
                        aria-label={`Book ${cls.name} again`}
                      >
                        Book Again
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyClasses;
