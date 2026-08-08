import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Clock, User, Edit3, Trash2, Search,
  CheckCircle, XCircle, AlertCircle, Filter, Plus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Registration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  age: string;
  trainerName: string;
  programName: string;
  programTime: string;
  programDays: string;
  experience: string;
  registeredAt: string;
  status: "active" | "paused" | "cancelled";
  goals?: string;
}

const MyRegistrations = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "paused" | "cancelled">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Registration>>({});

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("studentRegistrations") || "[]");
    setRegistrations(data);
  }, []);

  const saveRegistrations = (updated: Registration[]) => {
    setRegistrations(updated);
    localStorage.setItem("studentRegistrations", JSON.stringify(updated));
  };

  const handleStatusChange = (id: string, newStatus: Registration["status"]) => {
    const updated = registrations.map(r => r.id === id ? { ...r, status: newStatus } : r);
    saveRegistrations(updated);
    toast({ title: `Registration ${newStatus}`, description: `Your class registration has been ${newStatus}.` });
  };

  const handleDelete = (id: string) => {
    const updated = registrations.filter(r => r.id !== id);
    saveRegistrations(updated);
    toast({ title: "Registration Deleted", description: "Your registration has been removed.", variant: "destructive" });
  };

  const startEdit = (reg: Registration) => {
    setEditingId(reg.id);
    setEditData({ fullName: reg.fullName, email: reg.email, phone: reg.phone, goals: reg.goals });
  };

  const saveEdit = (id: string) => {
    const updated = registrations.map(r => r.id === id ? { ...r, ...editData } : r);
    saveRegistrations(updated);
    setEditingId(null);
    toast({ title: "Registration Updated", description: "Your details have been saved." });
  };

  const filtered = registrations.filter(r => {
    const matchSearch = r.programName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.trainerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusColors: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    paused: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  const stats = {
    active: registrations.filter(r => r.status === "active").length,
    paused: registrations.filter(r => r.status === "paused").length,
    total: registrations.length,
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold text-foreground">My Registrations</h1>
        <p className="text-muted-foreground mt-1">View, edit, and manage your class registrations</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Active Classes", value: stats.active, icon: CheckCircle, color: "text-emerald-500" },
          { label: "Paused Classes", value: stats.paused, icon: AlertCircle, color: "text-amber-500" },
          { label: "Total Registrations", value: stats.total, icon: Calendar, color: "text-primary" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <stat.icon className={cn("w-8 h-8", stat.color)} />
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by program or trainer..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm" />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "paused", "cancelled"] as const).map(s => (
            <Button key={s} variant={statusFilter === s ? "default" : "outline"} size="sm"
              onClick={() => setStatusFilter(s)} className="capitalize">
              {s}
            </Button>
          ))}
        </div>
      </div>

      {/* Registration List */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">
              {registrations.length === 0 ? "No Registrations Yet" : "No Registrations Found"}
            </h3>
            <p className="text-muted-foreground mt-1">
              {registrations.length === 0
                ? "You haven't registered for any classes yet. Register now to begin your practice."
                : "No results match your search."}
            </p>
            {registrations.length === 0 ? (
              <Button
                className="mt-5"
                onClick={() => navigate("/dashboard/student-registration")}
                title="Register for a class"
                aria-label="Register for a class"
              >
                <Plus className="w-4 h-4 mr-2" /> Register for a Class
              </Button>
            ) : (
              <Button
                variant="outline"
                className="mt-5"
                onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}
                title="Clear filters"
                aria-label="Clear filters"
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((reg, index) => (
              <motion.div
                key={reg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-soft transition-shadow">
                  <CardContent className="p-5">
                    {editingId === reg.id ? (
                      /* Edit Mode */
                      <div className="space-y-3">
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                          <Edit3 className="w-4 h-4 text-primary" /> Editing Registration
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <input value={editData.fullName || ""} onChange={e => setEditData(p => ({ ...p, fullName: e.target.value }))}
                            placeholder="Full Name" className="px-3 py-2 rounded-lg border border-border bg-background text-sm" />
                          <input value={editData.email || ""} onChange={e => setEditData(p => ({ ...p, email: e.target.value }))}
                            placeholder="Email" className="px-3 py-2 rounded-lg border border-border bg-background text-sm" />
                          <input value={editData.phone || ""} onChange={e => setEditData(p => ({ ...p, phone: e.target.value }))}
                            placeholder="Phone" className="px-3 py-2 rounded-lg border border-border bg-background text-sm" />
                        </div>
                        <textarea value={editData.goals || ""} onChange={e => setEditData(p => ({ ...p, goals: e.target.value }))}
                          placeholder="Your goals..." className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm min-h-[60px] resize-none" />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => saveEdit(reg.id)}>Save Changes</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      /* View Mode */
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-lg text-foreground">{reg.programName}</h3>
                            <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", statusColors[reg.status])}>
                              {reg.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {reg.trainerName}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {reg.programTime}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {reg.programDays}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Registered: {new Date(reg.registeredAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <Button size="sm" variant="outline" onClick={() => startEdit(reg)}>
                            <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit
                          </Button>
                          {reg.status === "active" && (
                            <Button size="sm" variant="outline" onClick={() => handleStatusChange(reg.id, "paused")}>
                              Pause
                            </Button>
                          )}
                          {reg.status === "paused" && (
                            <Button size="sm" variant="outline" onClick={() => handleStatusChange(reg.id, "active")}>
                              Resume
                            </Button>
                          )}
                          {reg.status !== "cancelled" && (
                            <Button size="sm" variant="outline" className="text-destructive hover:text-destructive"
                              onClick={() => handleStatusChange(reg.id, "cancelled")}>
                              <XCircle className="w-3.5 h-3.5 mr-1" /> Cancel
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(reg.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;
