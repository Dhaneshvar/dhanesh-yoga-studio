import {
  Users,
  UserCheck,
  Calendar,
  TrendingUp,
  Activity,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Sparkles,
  GraduationCap,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const statsCards = [
  {
    title: "Total Users",
    value: "2,847",
    change: "+12.5%",
    trend: "up" as const,
    icon: Users,
    gradient: "from-primary/20 to-primary/5",
    iconBg: "bg-primary/15",
    iconColor: "text-primary",
  },
  {
    title: "Active Trainers",
    value: "48",
    change: "+3.2%",
    trend: "up" as const,
    icon: UserCheck,
    gradient: "from-emerald-500/20 to-emerald-500/5",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-600",
  },
  {
    title: "Sessions Today",
    value: "156",
    change: "-2.4%",
    trend: "down" as const,
    icon: Calendar,
    gradient: "from-sky-500/20 to-sky-500/5",
    iconBg: "bg-sky-500/15",
    iconColor: "text-sky-600",
  },
  {
    title: "Revenue (MTD)",
    value: "$24,580",
    change: "+18.7%",
    trend: "up" as const,
    icon: DollarSign,
    gradient: "from-amber-500/20 to-amber-500/5",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-600",
  },
];

const recentActivities = [
  { id: 1, action: "New trainer registered", user: "Sarah Johnson", time: "2 min ago", type: "trainer", avatar: "S" },
  { id: 2, action: "Session completed", user: "Mike Chen", time: "15 min ago", type: "session", avatar: "M" },
  { id: 3, action: "New student signup", user: "Emily Davis", time: "32 min ago", type: "student", avatar: "E" },
  { id: 4, action: "Trainer approval pending", user: "Alex Kumar", time: "1 hour ago", type: "approval", avatar: "A" },
  { id: 5, action: "Payment received", user: "Jessica Brown", time: "2 hours ago", type: "payment", avatar: "J" },
];

const pendingApprovals = [
  { id: 1, name: "Alex Kumar", specialization: "Hatha Yoga", experience: "5 years", avatar: "A" },
  { id: 2, name: "Maria Garcia", specialization: "Vinyasa Flow", experience: "3 years", avatar: "M" },
  { id: 3, name: "David Wilson", specialization: "Power Yoga", experience: "7 years", avatar: "D" },
];

const topClasses = [
  { name: "Morning Hatha Flow", enrolled: 18, capacity: 20, trainer: "Sarah J." },
  { name: "Power Yoga Intensive", enrolled: 15, capacity: 15, trainer: "Mike C." },
  { name: "Gentle Yin Session", enrolled: 8, capacity: 12, trainer: "Emily D." },
  { name: "Vinyasa Flow", enrolled: 20, capacity: 20, trainer: "Sarah J." },
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case "trainer": return <UserCheck className="w-4 h-4" />;
    case "student": return <GraduationCap className="w-4 h-4" />;
    case "session": return <Calendar className="w-4 h-4" />;
    case "approval": return <Sparkles className="w-4 h-4" />;
    default: return <DollarSign className="w-4 h-4" />;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case "trainer": return "bg-emerald-500/15 text-emerald-600";
    case "student": return "bg-primary/15 text-primary";
    case "session": return "bg-sky-500/15 text-sky-600";
    case "approval": return "bg-amber-500/15 text-amber-600";
    default: return "bg-emerald-500/15 text-emerald-600";
  }
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <Card className="relative overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-60", stat.gradient)} />
              <CardContent className="p-3 sm:p-5 relative">
                <div className="flex items-start justify-between gap-1 sm:gap-2">
                  <div className="space-y-0.5 sm:space-y-1 min-w-0">
                    <p className="text-[11px] sm:text-sm font-medium text-muted-foreground truncate">{stat.title}</p>
                    <h3 className="text-lg sm:text-2xl font-bold text-foreground">{stat.value}</h3>
                    <div className={cn(
                      "flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm font-semibold",
                      stat.trend === "up" ? "text-emerald-600" : "text-destructive"
                    )}>
                      {stat.trend === "up" ? <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" /> : <ArrowDownRight className="w-3 h-3 sm:w-4 sm:h-4" />}
                      {stat.change}
                      <span className="text-[10px] sm:text-xs font-normal text-muted-foreground ml-0.5 sm:ml-1 hidden sm:inline">vs last month</span>
                    </div>
                  </div>
                  <div className={cn("p-2 sm:p-3 rounded-xl sm:rounded-2xl shrink-0", stat.iconBg)}>
                    <stat.icon className={cn("w-4 h-4 sm:w-5 sm:h-5", stat.iconColor)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-3 sm:pb-4 px-4 sm:px-6">
              <div>
                <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Latest actions across the platform</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-primary text-xs sm:text-sm">View All</Button>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="space-y-0.5 sm:space-y-1">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 rounded-xl hover:bg-muted/50 transition-colors group cursor-pointer"
                  >
                    <div className={cn(
                      "w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
                      getActivityColor(activity.type)
                    )}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs sm:text-sm text-foreground truncate">{activity.action}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">{activity.user}</p>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-muted-foreground shrink-0">
                      <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 hidden sm:block" />
                      <span className="whitespace-nowrap">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pending Approvals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-3 sm:pb-4 px-4 sm:px-6">
              <div>
                <CardTitle className="text-base sm:text-lg">Pending Approvals</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Trainers awaiting review</CardDescription>
              </div>
              <Badge variant="secondary" className="font-semibold text-xs">{pendingApprovals.length}</Badge>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="space-y-2 sm:space-y-3">
                {pendingApprovals.map((trainer) => (
                  <div key={trainer.id} className="p-3 sm:p-4 rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all">
                    <div className="flex items-start justify-between mb-2 sm:mb-3">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary font-semibold text-xs sm:text-sm shrink-0">
                          {trainer.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-xs sm:text-sm text-foreground truncate">{trainer.name}</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{trainer.specialization}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 shrink-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-primary">
                            <UserCheck className="w-4 h-4 mr-2" /> Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Reject</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <Badge variant="outline" className="text-[10px] sm:text-xs mb-2 sm:mb-3">{trainer.experience}</Badge>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 h-7 sm:h-8 text-[11px] sm:text-xs">Approve</Button>
                      <Button size="sm" variant="outline" className="flex-1 h-7 sm:h-8 text-[11px] sm:text-xs" onClick={() => navigate("/admin/approvals")}>Review</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Top Classes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
              <CardTitle className="text-base sm:text-lg">Top Classes Today</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Classes with highest enrollment</CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="space-y-3 sm:space-y-4">
                {topClasses.map((cls) => {
                  const percentage = Math.round((cls.enrolled / cls.capacity) * 100);
                  const isFull = cls.enrolled >= cls.capacity;
                  return (
                    <div key={cls.name} className="space-y-1.5 sm:space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-medium text-xs sm:text-sm truncate">{cls.name}</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground">by {cls.trainer}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <Badge variant={isFull ? "destructive" : "secondary"} className="text-[10px] sm:text-xs">
                            {cls.enrolled}/{cls.capacity}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-1.5 sm:h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
              <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {[
                  { icon: Users, label: "Manage Users", path: "/admin/users", color: "text-primary", bg: "bg-primary/10 hover:bg-primary/20" },
                  { icon: UserCheck, label: "Review Trainers", path: "/admin/approvals", color: "text-emerald-600", bg: "bg-emerald-500/10 hover:bg-emerald-500/20" },
                  { icon: Calendar, label: "View Sessions", path: "/admin/sessions", color: "text-sky-600", bg: "bg-sky-500/10 hover:bg-sky-500/20" },
                  { icon: Activity, label: "View Analytics", path: "/admin/analytics", color: "text-amber-600", bg: "bg-amber-500/10 hover:bg-amber-500/20" },
                ].map((action) => (
                  <button
                    key={action.label}
                    className={cn(
                      "flex flex-col items-center gap-2 sm:gap-3 py-4 sm:py-6 px-3 sm:px-4 rounded-xl transition-all border border-transparent hover:border-border",
                      action.bg
                    )}
                    onClick={() => navigate(action.path)}
                  >
                    <action.icon className={cn("w-5 h-5 sm:w-6 sm:h-6", action.color)} />
                    <span className="text-[11px] sm:text-sm font-medium text-foreground text-center">{action.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;