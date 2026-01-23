import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Filter,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Session {
  id: string;
  title: string;
  trainer: string;
  type: string;
  date: string;
  time: string;
  duration: string;
  capacity: number;
  enrolled: number;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  location: string;
}

const mockSessions: Session[] = [
  {
    id: "1",
    title: "Morning Hatha Flow",
    trainer: "Sarah Johnson",
    type: "Hatha",
    date: "2024-03-15",
    time: "07:00 AM",
    duration: "60 min",
    capacity: 20,
    enrolled: 18,
    status: "scheduled",
    location: "Studio A",
  },
  {
    id: "2",
    title: "Power Yoga Intensive",
    trainer: "Mike Chen",
    type: "Power",
    date: "2024-03-15",
    time: "09:00 AM",
    duration: "90 min",
    capacity: 15,
    enrolled: 15,
    status: "scheduled",
    location: "Studio B",
  },
  {
    id: "3",
    title: "Gentle Yin Session",
    trainer: "Emily Davis",
    type: "Yin",
    date: "2024-03-15",
    time: "11:00 AM",
    duration: "75 min",
    capacity: 12,
    enrolled: 8,
    status: "in-progress",
    location: "Studio A",
  },
  {
    id: "4",
    title: "Vinyasa Flow",
    trainer: "Sarah Johnson",
    type: "Vinyasa",
    date: "2024-03-14",
    time: "06:00 PM",
    duration: "60 min",
    capacity: 20,
    enrolled: 20,
    status: "completed",
    location: "Studio A",
  },
  {
    id: "5",
    title: "Beginners Basics",
    trainer: "Alex Kumar",
    type: "Hatha",
    date: "2024-03-14",
    time: "10:00 AM",
    duration: "45 min",
    capacity: 25,
    enrolled: 5,
    status: "cancelled",
    location: "Studio C",
  },
];

const AdminSessions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredSessions = mockSessions.filter((session) => {
    const matchesSearch =
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.trainer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || session.type === typeFilter;
    const matchesStatus = statusFilter === "all" || session.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: mockSessions.length,
    scheduled: mockSessions.filter((s) => s.status === "scheduled").length,
    inProgress: mockSessions.filter((s) => s.status === "in-progress").length,
    completed: mockSessions.filter((s) => s.status === "completed").length,
    cancelled: mockSessions.filter((s) => s.status === "cancelled").length,
  };

  const getStatusBadge = (status: Session["status"]) => {
    const styles = {
      scheduled: "bg-blue-100 text-blue-700",
      "in-progress": "bg-amber-100 text-amber-700",
      completed: "bg-emerald-100 text-emerald-700",
      cancelled: "bg-red-100 text-red-700",
    };
    const icons = {
      scheduled: Clock,
      "in-progress": AlertCircle,
      completed: CheckCircle,
      cancelled: XCircle,
    };
    const Icon = icons[status];
    return (
      <Badge className={cn("font-medium capitalize gap-1", styles[status])}>
        <Icon className="w-3 h-3" />
        {status.replace("-", " ")}
      </Badge>
    );
  };

  const getCapacityColor = (enrolled: number, capacity: number) => {
    const ratio = enrolled / capacity;
    if (ratio >= 1) return "text-red-600";
    if (ratio >= 0.8) return "text-amber-600";
    return "text-emerald-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Session Management</h1>
          <p className="text-muted-foreground">Manage and monitor yoga sessions</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Session
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Sessions", value: stats.total, icon: Calendar, color: "text-blue-600" },
          { label: "Scheduled", value: stats.scheduled, icon: Clock, color: "text-blue-600" },
          { label: "In Progress", value: stats.inProgress, icon: AlertCircle, color: "text-amber-600" },
          { label: "Completed", value: stats.completed, icon: CheckCircle, color: "text-emerald-600" },
          { label: "Cancelled", value: stats.cancelled, icon: XCircle, color: "text-red-600" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search sessions or trainers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Hatha">Hatha</SelectItem>
                  <SelectItem value="Vinyasa">Vinyasa</SelectItem>
                  <SelectItem value="Power">Power</SelectItem>
                  <SelectItem value="Yin">Yin</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sessions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sessions ({filteredSessions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session</TableHead>
                  <TableHead>Trainer</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSessions.map((session, index) => (
                  <motion.tr
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium">{session.title}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="secondary" className="text-xs">
                            {session.type}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {session.location}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{session.trainer}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{new Date(session.date).toLocaleDateString()}</p>
                        <p className="text-muted-foreground">
                          {session.time} • {session.duration}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className={getCapacityColor(session.enrolled, session.capacity)}>
                          {session.enrolled}/{session.capacity}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(session.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Session
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="w-4 h-4 mr-2" />
                            View Attendees
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Cancel Session
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSessions;
