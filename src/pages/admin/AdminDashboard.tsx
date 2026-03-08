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
import { cn } from "@/lib/utils";

const statsCards = [
  {
    title: "Total Users",
    value: "2,847",
    change: "+12.5%",
    trend: "up" as const,
    icon: Users,
    bgColor: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    title: "Active Trainers",
    value: "48",
    change: "+3.2%",
    trend: "up" as const,
    icon: UserCheck,
    bgColor: "bg-accent/20",
    iconColor: "text-accent-foreground",
  },
  {
    title: "Sessions Today",
    value: "156",
    change: "-2.4%",
    trend: "down" as const,
    icon: Calendar,
    bgColor: "bg-secondary",
    iconColor: "text-secondary-foreground",
  },
  {
    title: "Revenue (MTD)",
    value: "$24,580",
    change: "+18.7%",
    trend: "up" as const,
    icon: TrendingUp,
    bgColor: "bg-muted",
    iconColor: "text-muted-foreground",
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
  { id: 1, name: "Alex Kumar", specialization: "Hatha Yoga", experience: "5 years" },
  { id: 2, name: "Maria Garcia", specialization: "Vinyasa Flow", experience: "3 years" },
  { id: 3, name: "David Wilson", specialization: "Power Yoga", experience: "7 years" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1.5 text-foreground">{stat.value}</h3>
                  <div className={cn(
                    "flex items-center gap-1 mt-1.5 text-sm font-medium",
                    stat.trend === "up" ? "text-primary" : "text-destructive"
                  )}>
                    {stat.trend === "up" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {stat.change}
                  </div>
                </div>
                <div className={cn("p-3 rounded-xl", stat.bgColor)}>
                  <stat.icon className={cn("w-5 h-5", stat.iconColor)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions across the platform</CardDescription>
            </div>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                    "bg-secondary text-secondary-foreground"
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
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.user}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Trainers awaiting review</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/approvals")}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingApprovals.map((trainer) => (
                <div key={trainer.id} className="p-4 rounded-xl border border-border hover:shadow-soft transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{trainer.name}</p>
                      <p className="text-sm text-muted-foreground">{trainer.specialization}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{trainer.experience}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
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
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="flex-1">Approve</Button>
                    <Button size="sm" variant="outline" className="flex-1">Review</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Users, label: "Manage Users", path: "/admin/users" },
              { icon: UserCheck, label: "Review Trainers", path: "/admin/approvals" },
              { icon: Calendar, label: "View Sessions", path: "/admin/sessions" },
              { icon: Activity, label: "View Analytics", path: "/admin/analytics" },
            ].map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="h-auto py-5 flex flex-col gap-2"
                onClick={() => navigate(action.path)}
              >
                <action.icon className="w-5 h-5" />
                <span className="text-xs sm:text-sm">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
