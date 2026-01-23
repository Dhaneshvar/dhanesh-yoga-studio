import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface Report {
  id: string;
  name: string;
  description: string;
  category: string;
  lastGenerated: string;
  icon: React.ElementType;
  color: string;
}

const reports: Report[] = [
  {
    id: "1",
    name: "User Activity Report",
    description: "Detailed breakdown of user registrations, logins, and engagement metrics",
    category: "Users",
    lastGenerated: "2 hours ago",
    icon: Users,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: "2",
    name: "Revenue Summary",
    description: "Monthly revenue breakdown by subscription type and one-time purchases",
    category: "Financial",
    lastGenerated: "1 day ago",
    icon: DollarSign,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    id: "3",
    name: "Session Analytics",
    description: "Session attendance, completion rates, and popular time slots",
    category: "Sessions",
    lastGenerated: "3 hours ago",
    icon: Calendar,
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: "4",
    name: "Trainer Performance",
    description: "Individual trainer metrics including ratings, sessions conducted, and earnings",
    category: "Trainers",
    lastGenerated: "5 hours ago",
    icon: TrendingUp,
    color: "bg-amber-100 text-amber-600",
  },
  {
    id: "5",
    name: "Attendance Trends",
    description: "Weekly and monthly attendance patterns across all session types",
    category: "Sessions",
    lastGenerated: "1 hour ago",
    icon: Clock,
    color: "bg-pink-100 text-pink-600",
  },
  {
    id: "6",
    name: "Subscription Report",
    description: "Active subscriptions, renewals, cancellations, and churn rate",
    category: "Financial",
    lastGenerated: "4 hours ago",
    icon: FileText,
    color: "bg-indigo-100 text-indigo-600",
  },
];

const scheduledReports = [
  { name: "Weekly User Summary", schedule: "Every Monday", nextRun: "Mar 18, 2024" },
  { name: "Monthly Revenue Report", schedule: "1st of month", nextRun: "Apr 1, 2024" },
  { name: "Daily Session Stats", schedule: "Daily at 11 PM", nextRun: "Today" },
];

const AdminReports = () => {
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredReports =
    categoryFilter === "all"
      ? reports
      : reports.filter((r) => r.category === categoryFilter);

  const handleDownload = (reportName: string) => {
    // Simulate download
    console.log(`Downloading ${reportName}...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Generate and download platform reports</p>
        </div>
        <Button>
          <FileText className="w-4 h-4 mr-2" />
          Create Custom Report
        </Button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Users">Users</SelectItem>
            <SelectItem value="Financial">Financial</SelectItem>
            <SelectItem value="Sessions">Sessions</SelectItem>
            <SelectItem value="Trainers">Trainers</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl ${report.color}`}>
                    <report.icon className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary">{report.category}</Badge>
                </div>
                <CardTitle className="mt-4">{report.name}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Last generated: {report.lastGenerated}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(report.name)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Scheduled Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Scheduled Reports
          </CardTitle>
          <CardDescription>Automatically generated reports on a schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduledReports.map((report) => (
              <div
                key={report.name}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-muted">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-muted-foreground">{report.schedule}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Next run</p>
                    <p className="font-medium">{report.nextRun}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Export */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Export</CardTitle>
          <CardDescription>Download data exports in various formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-6 flex flex-col gap-2">
              <Users className="w-6 h-6" />
              <span>All Users</span>
              <span className="text-xs text-muted-foreground">CSV Export</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex flex-col gap-2">
              <Calendar className="w-6 h-6" />
              <span>Sessions</span>
              <span className="text-xs text-muted-foreground">CSV Export</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex flex-col gap-2">
              <DollarSign className="w-6 h-6" />
              <span>Transactions</span>
              <span className="text-xs text-muted-foreground">CSV Export</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex flex-col gap-2">
              <TrendingUp className="w-6 h-6" />
              <span>Analytics</span>
              <span className="text-xs text-muted-foreground">PDF Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReports;
