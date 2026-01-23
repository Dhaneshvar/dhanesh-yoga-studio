import { motion } from "framer-motion";
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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

const statsCards = [
  {
    title: "Total Users",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "bg-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    title: "Active Trainers",
    value: "48",
    change: "+3.2%",
    trend: "up",
    icon: UserCheck,
    color: "bg-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  {
    title: "Sessions Today",
    value: "156",
    change: "-2.4%",
    trend: "down",
    icon: Calendar,
    color: "bg-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    title: "Revenue (MTD)",
    value: "$24,580",
    change: "+18.7%",
    trend: "up",
    icon: TrendingUp,
    color: "bg-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
  },
];

const recentActivities = [
  { id: 1, action: "New trainer registered", user: "Sarah Johnson", time: "2 min ago", type: "trainer" },
  { id: 2, action: "Session completed", user: "Mike Chen", time: "15 min ago", type: "session" },
  { id: 3, action: "New student signup", user: "Emily Davis", time: "32 min ago", type: "student" },
  { id: 4, action: "Trainer approval pending", user: "Alex Kumar", time: "1 hour ago", type: "approval" },
  { id: 5, action: "Payment received", user: "Jessica Brown", time: "2 hours ago", type: "payment" },
];

const pendingApprovals = [
  { id: 1, name: "Alex Kumar", specialization: "Hatha Yoga", experience: "5 years", status: "pending" },
  { id: 2, name: "Maria Garcia", specialization: "Vinyasa Flow", experience: "3 years", status: "pending" },
  { id: 3, name: "David Wilson", specialization: "Power Yoga", experience: "7 years", status: "pending" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                    <div className={cn(
                      "flex items-center gap-1 mt-2 text-sm font-medium",
                      stat.trend === "up" ? "text-emerald-600" : "text-red-600"
                    )}>
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                  <div className={cn("p-3 rounded-xl", stat.bgColor)}>
                    <stat.icon className={cn("w-6 h-6 text-white", stat.color.replace("bg-", "text-").replace("-500", "-600"))} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions across the platform</CardDescription>
              </div>
              <Button variant="ghost" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      activity.type === "trainer" ? "bg-emerald-100 text-emerald-600" :
                      activity.type === "session" ? "bg-blue-100 text-blue-600" :
                      activity.type === "student" ? "bg-purple-100 text-purple-600" :
                      activity.type === "approval" ? "bg-amber-100 text-amber-600" :
                      "bg-green-100 text-green-600"
                    )}>
                      {activity.type === "trainer" || activity.type === "student" ? (
                        <Users className="w-5 h-5" />
                      ) : activity.type === "session" ? (
                        <Calendar className="w-5 h-5" />
                      ) : activity.type === "approval" ? (
                        <UserCheck className="w-5 h-5" />
                      ) : (
                        <TrendingUp className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.user}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {activity.time}
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
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Trainers awaiting review</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/admin/approvals")}
              >
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingApprovals.map((trainer) => (
                  <div
                    key={trainer.id}
                    className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{trainer.name}</p>
                        <p className="text-sm text-muted-foreground">{trainer.specialization}</p>
                        <p className="text-xs text-muted-foreground mt-1">{trainer.experience}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-emerald-600">
                            <UserCheck className="w-4 h-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Reject</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="flex-1">Approve</Button>
                      <Button size="sm" variant="outline" className="flex-1">Review</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col gap-2"
                onClick={() => navigate("/admin/users")}
              >
                <Users className="w-6 h-6" />
                <span>Manage Users</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col gap-2"
                onClick={() => navigate("/admin/approvals")}
              >
                <UserCheck className="w-6 h-6" />
                <span>Review Trainers</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col gap-2"
                onClick={() => navigate("/admin/sessions")}
              >
                <Calendar className="w-6 h-6" />
                <span>View Sessions</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col gap-2"
                onClick={() => navigate("/admin/analytics")}
              >
                <Activity className="w-6 h-6" />
                <span>View Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

// Helper function
const cn = (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(" ");

export default AdminDashboard;
