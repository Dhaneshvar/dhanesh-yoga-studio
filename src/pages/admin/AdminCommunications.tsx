import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Bell,
  Send,
  Users,
  UserCheck,
  User,
  Clock,
  CheckCircle,
  Eye,
  Trash2,
  Plus,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  subject: string;
  content: string;
  recipients: string;
  sentAt: string;
  status: "sent" | "scheduled" | "draft";
  openRate?: number;
}

const mockMessages: Message[] = [
  {
    id: "1",
    subject: "Welcome to Dhanesh Yoga Center!",
    content: "Thank you for joining our community...",
    recipients: "All Users",
    sentAt: "2024-03-14 10:00 AM",
    status: "sent",
    openRate: 78,
  },
  {
    id: "2",
    subject: "New Morning Classes Available",
    content: "We're excited to announce new morning sessions...",
    recipients: "Students",
    sentAt: "2024-03-13 2:00 PM",
    status: "sent",
    openRate: 65,
  },
  {
    id: "3",
    subject: "Trainer Certification Reminder",
    content: "Please ensure your certifications are up to date...",
    recipients: "Trainers",
    sentAt: "2024-03-16 9:00 AM",
    status: "scheduled",
  },
  {
    id: "4",
    subject: "Monthly Newsletter Draft",
    content: "March highlights and upcoming events...",
    recipients: "All Users",
    sentAt: "",
    status: "draft",
  },
];

const templates = [
  { id: "1", name: "Welcome Email", category: "Onboarding" },
  { id: "2", name: "Session Reminder", category: "Notifications" },
  { id: "3", name: "Payment Confirmation", category: "Transactions" },
  { id: "4", name: "Class Cancelled", category: "Notifications" },
  { id: "5", name: "Monthly Newsletter", category: "Marketing" },
];

const AdminCommunications = () => {
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState({
    subject: "",
    content: "",
    recipients: "all",
  });

  const handleSend = () => {
    toast.success("Message sent successfully!");
    setIsComposeOpen(false);
    setNewMessage({ subject: "", content: "", recipients: "all" });
  };

  const filteredMessages = mockMessages.filter(
    (msg) =>
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.recipients.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: Message["status"]) => {
    const styles = {
      sent: "bg-emerald-100 text-emerald-700",
      scheduled: "bg-blue-100 text-blue-700",
      draft: "bg-slate-100 text-slate-700",
    };
    const icons = {
      sent: CheckCircle,
      scheduled: Clock,
      draft: Mail,
    };
    const Icon = icons[status];
    return (
      <Badge className={cn("font-medium capitalize gap-1", styles[status])}>
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Communications</h1>
          <p className="text-muted-foreground">Send messages and notifications to users</p>
        </div>
        <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Compose Message
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Compose Message</DialogTitle>
              <DialogDescription>Send an email to your users</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Recipients</Label>
                <Select
                  value={newMessage.recipients}
                  onValueChange={(value) =>
                    setNewMessage({ ...newMessage, recipients: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        All Users
                      </div>
                    </SelectItem>
                    <SelectItem value="students">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Students Only
                      </div>
                    </SelectItem>
                    <SelectItem value="trainers">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4" />
                        Trainers Only
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input
                  placeholder="Enter email subject..."
                  value={newMessage.subject}
                  onChange={(e) =>
                    setNewMessage({ ...newMessage, subject: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                  placeholder="Write your message..."
                  value={newMessage.content}
                  onChange={(e) =>
                    setNewMessage({ ...newMessage, content: e.target.value })
                  }
                  rows={8}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
                Save as Draft
              </Button>
              <Button onClick={handleSend}>
                <Send className="w-4 h-4 mr-2" />
                Send Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Sent", value: "1,284", icon: Send, color: "text-emerald-600" },
          { label: "Scheduled", value: "12", icon: Clock, color: "text-blue-600" },
          { label: "Drafts", value: "5", icon: Mail, color: "text-slate-600" },
          { label: "Avg. Open Rate", value: "72%", icon: Eye, color: "text-teal-600" },
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

      <Tabs defaultValue="messages" className="space-y-6">
        <TabsList>
          <TabsTrigger value="messages" className="gap-2">
            <Mail className="w-4 h-4" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="templates" className="gap-2">
            <Bell className="w-4 h-4" />
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Messages List */}
          <div className="space-y-4">
            {filteredMessages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{message.subject}</h3>
                          {getStatusBadge(message.status)}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {message.content}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {message.recipients}
                          </span>
                          {message.sentAt && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {message.sentAt}
                            </span>
                          )}
                          {message.openRate && (
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {message.openRate}% opened
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <Mail className="w-6 h-6 text-primary" />
                      </div>
                      <Badge variant="secondary">{template.category}</Badge>
                    </div>
                    <h3 className="font-semibold mt-4">{template.name}</h3>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        Edit
                      </Button>
                      <Button size="sm" className="flex-1">
                        Use
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            <Card className="border-dashed hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
                <div className="p-3 rounded-xl bg-muted">
                  <Plus className="w-6 h-6" />
                </div>
                <p className="font-medium mt-4">Create Template</p>
                <p className="text-sm text-muted-foreground">Add a new email template</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminCommunications;
