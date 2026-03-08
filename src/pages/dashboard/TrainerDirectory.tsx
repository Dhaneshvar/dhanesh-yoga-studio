import { useState, useMemo } from "react";
import { Search, Grid, List, Calendar, Clock, User, Phone, Mail, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  status: "active" | "retired" | "not_active";
  availability: string[];
  nextSlot: string;
  rating: number;
  experience: number;
  avatar?: string;
}

// Mock data
const mockTrainers: Trainer[] = [
  {
    id: "1",
    name: "Master Dhan",
    email: "dhan@yogastudio.com",
    phone: "+1 555-0101",
    specialization: "Hatha Yoga",
    status: "active",
    availability: ["Mon", "Wed", "Fri"],
    nextSlot: "Today, 10:00 AM",
    rating: 4.9,
    experience: 15,
  },
  {
    id: "2",
    name: "Master Rani",
    email: "rani@yogastudio.com",
    phone: "+1 555-0102",
    specialization: "Vinyasa Flow",
    status: "active",
    availability: ["Tue", "Thu", "Sat"],
    nextSlot: "Tomorrow, 3:00 PM",
    rating: 4.8,
    experience: 12,
  },
  {
    id: "3",
    name: "Master Arjun",
    email: "arjun@yogastudio.com",
    phone: "+1 555-0103",
    specialization: "Ashtanga Yoga",
    status: "active",
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    nextSlot: "Today, 2:00 PM",
    rating: 4.7,
    experience: 10,
  },
  {
    id: "4",
    name: "Master Priya",
    email: "priya@yogastudio.com",
    phone: "+1 555-0104",
    specialization: "Yin Yoga",
    status: "not_active",
    availability: [],
    nextSlot: "N/A",
    rating: 4.6,
    experience: 8,
  },
  {
    id: "5",
    name: "Master Vikram",
    email: "vikram@yogastudio.com",
    phone: "+1 555-0105",
    specialization: "Kundalini Yoga",
    status: "retired",
    availability: [],
    nextSlot: "N/A",
    rating: 4.9,
    experience: 25,
  },
  {
    id: "6",
    name: "Master Lakshmi",
    email: "lakshmi@yogastudio.com",
    phone: "+1 555-0106",
    specialization: "Power Yoga",
    status: "active",
    availability: ["Mon", "Wed", "Fri", "Sat"],
    nextSlot: "Today, 5:00 PM",
    rating: 4.8,
    experience: 9,
  },
];

const TrainerDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [availableThisWeek, setAvailableThisWeek] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const filteredTrainers = useMemo(() => {
    return mockTrainers.filter((trainer) => {
      const matchesSearch = trainer.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || trainer.status === statusFilter;
      const matchesAvailability = !availableThisWeek || trainer.availability.length > 0;
      return matchesSearch && matchesStatus && matchesAvailability;
    });
  }, [searchQuery, statusFilter, availableThisWeek]);

  const getStatusBadge = (status: Trainer["status"]) => {
    const styles = {
      active: "bg-turquoise/20 text-turquoise-dark border-turquoise/30",
      retired: "bg-muted text-muted-foreground border-border",
      not_active: "bg-sunset/20 text-sunset border-sunset/30",
    };
    const labels = {
      active: "Active",
      retired: "Retired",
      not_active: "Not Active",
    };
    return (
      <span className={cn("px-3 py-1 rounded-full text-xs font-medium border", styles[status])}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-2">
            Trainer Directory
          </h1>
          <p className="text-muted-foreground font-body">
            Browse and manage all yoga instructors
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-card rounded-2xl border border-border shadow-card p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trainers by name..."
                title="Search for trainers by name"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={availableThisWeek ? "default" : "outline"}
                onClick={() => setAvailableThisWeek(!availableThisWeek)}
                title="Filter trainers available this week"
                className="whitespace-nowrap"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Available This Week
              </Button>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                title="Filter trainers by status"
                className="px-4 py-2 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body transition-all"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="retired">Retired</option>
                <option value="not_active">Not Active</option>
              </select>

              {/* View Toggle */}
              <div className="flex bg-background border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                  title="Grid view"
                  aria-label="Switch to grid view"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                  title="Table view"
                  aria-label="Switch to table view"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-4 font-body">
          Showing {filteredTrainers.length} of {mockTrainers.length} trainers
        </p>

        {/* Grid View */}
        {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredTrainers.map((trainer) => (
                <div
                  key={trainer.id}
                  className="bg-card rounded-2xl border border-border shadow-card p-5 hover:shadow-elevated transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-indigo-turquoise flex items-center justify-center">
                      <User className="w-7 h-7 text-primary-foreground" />
                    </div>
                    {getStatusBadge(trainer.status)}
                  </div>

                  <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                    {trainer.name}
                  </h3>
                  <p className="text-primary font-body text-sm mb-3">{trainer.specialization}</p>

                  <div className="flex items-center gap-1 mb-4">
                    <Star className="w-4 h-4 text-sunset fill-sunset" />
                    <span className="font-body text-sm font-medium">{trainer.rating}</span>
                    <span className="text-muted-foreground text-sm">• {trainer.experience} yrs exp</span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span className="font-body truncate">{trainer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span className="font-body">{trainer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="font-body">
                        Next: <span className="text-foreground">{trainer.nextSlot}</span>
                      </span>
                    </div>
                  </div>

                  {trainer.availability.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1">
                      {trainer.availability.map((day) => (
                        <span
                          key={day}
                          className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs font-body"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Table View */
            <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="px-6 py-4 text-left font-body text-sm font-medium text-foreground">Trainer Name</th>
                      <th className="px-6 py-4 text-left font-body text-sm font-medium text-foreground">Specialization</th>
                      <th className="px-6 py-4 text-left font-body text-sm font-medium text-foreground">Status</th>
                      <th className="px-6 py-4 text-left font-body text-sm font-medium text-foreground">Availability</th>
                      <th className="px-6 py-4 text-left font-body text-sm font-medium text-foreground">Next Slot</th>
                      <th className="px-6 py-4 text-left font-body text-sm font-medium text-foreground">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredTrainers.map((trainer) => (
                      <tr
                        key={trainer.id}
                        className="hover:bg-secondary/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-indigo-turquoise flex items-center justify-center">
                              <User className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <div>
                              <p className="font-body font-medium text-foreground">{trainer.name}</p>
                              <p className="font-body text-xs text-muted-foreground">{trainer.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-body text-sm text-foreground">{trainer.specialization}</td>
                        <td className="px-6 py-4">{getStatusBadge(trainer.status)}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {trainer.availability.length > 0 ? (
                              trainer.availability.map((day) => (
                                <span
                                  key={day}
                                  className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-xs font-body"
                                >
                                  {day}
                                </span>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-sm">—</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-body text-sm text-foreground">{trainer.nextSlot}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-sunset fill-sunset" />
                            <span className="font-body text-sm font-medium">{trainer.rating}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default TrainerDirectory;
