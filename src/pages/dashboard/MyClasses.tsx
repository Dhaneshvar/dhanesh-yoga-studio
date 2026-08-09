import { Calendar, Clock, User, MapPin, CheckCircle, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const upcomingClasses = [
  { id: 1, name: "Morning Vinyasa Flow", trainer: "Priya Sharma", date: "Feb 3, 2026", time: "7:00 AM - 8:00 AM", location: "Studio A", type: "Vinyasa" },
  { id: 2, name: "Gentle Hatha Yoga", trainer: "Amit Patel", date: "Feb 4, 2026", time: "9:00 AM - 10:00 AM", location: "Studio B", type: "Hatha" },
  { id: 3, name: "Power Yoga", trainer: "Meera Krishnan", date: "Feb 5, 2026", time: "6:00 PM - 7:00 PM", location: "Studio A", type: "Power" },
];

const completedClasses = [
  { id: 1, name: "Sunrise Meditation", trainer: "Priya Sharma", date: "Feb 1, 2026", time: "6:00 AM - 6:45 AM", rating: 5 },
  { id: 2, name: "Restorative Yoga", trainer: "Lakshmi Rao", date: "Jan 30, 2026", time: "5:00 PM - 6:00 PM", rating: 4 },
];

const MyClasses = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">My Classes</h1>
        <p className="text-muted-foreground mt-1">View and manage your yoga sessions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Calendar, value: "3", label: "Upcoming Classes", bg: "bg-primary/10", color: "text-primary" },
          { icon: CheckCircle, value: "12", label: "Classes Completed", bg: "bg-secondary", color: "text-secondary-foreground" },
          { icon: Clock, value: "15h", label: "Total Practice Time", bg: "bg-muted", color: "text-muted-foreground" },
        ].map((stat, i) => (
          <Card
            key={stat.label}
            className="bg-card/70 backdrop-blur-xl border-border/60 hover-lift animate-fade-in"
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
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          <div className="space-y-3">
            {upcomingClasses.map((cls) => (
              <Card key={cls.id} className="bg-card/70 backdrop-blur-xl border-border/60 hover-lift">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-base text-foreground">{cls.name}</h3>
                        <Badge variant="secondary">{cls.type}</Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{cls.trainer}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{cls.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{cls.time}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{cls.location}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button variant="outline" size="sm">Reschedule</Button>
                      <Button variant="destructive" size="sm">Cancel</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <div className="space-y-3">
            {completedClasses.map((cls) => (
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
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < cls.rating ? "text-accent fill-accent" : "text-muted"}`} />
                        ))}
                      </div>
                      <Button variant="outline" size="sm">Book Again</Button>
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
