import { useState } from "react";
import { motion } from "framer-motion";
import {
  UserCheck,
  UserX,
  Clock,
  Mail,
  Phone,
  Calendar,
  Award,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface TrainerApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experience: string;
  certifications: string[];
  bio: string;
  appliedDate: string;
  status: "pending" | "approved" | "rejected";
  avatar?: string;
}

const mockApplications: TrainerApplication[] = [
  {
    id: "1",
    name: "Alex Kumar",
    email: "alex.k@example.com",
    phone: "+1 234-567-8904",
    specialization: "Hatha Yoga",
    experience: "5 years",
    certifications: ["RYT 200", "Yoga Alliance Certified"],
    bio: "Passionate yoga instructor with 5 years of experience in teaching Hatha and Vinyasa yoga. Specialized in helping beginners develop a strong foundation.",
    appliedDate: "2024-03-12",
    status: "pending",
  },
  {
    id: "2",
    name: "Maria Garcia",
    email: "maria.g@example.com",
    phone: "+1 234-567-8905",
    specialization: "Vinyasa Flow",
    experience: "3 years",
    certifications: ["RYT 500", "Prenatal Yoga"],
    bio: "Certified yoga teacher specializing in Vinyasa flow and prenatal yoga. I believe in creating a nurturing space for all practitioners.",
    appliedDate: "2024-03-10",
    status: "pending",
  },
  {
    id: "3",
    name: "David Wilson",
    email: "david.w@example.com",
    phone: "+1 234-567-8906",
    specialization: "Power Yoga",
    experience: "7 years",
    certifications: ["RYT 200", "CrossFit Level 1"],
    bio: "Dynamic instructor combining power yoga with functional fitness. My classes are designed to challenge both body and mind.",
    appliedDate: "2024-03-08",
    status: "pending",
  },
  {
    id: "4",
    name: "Lisa Chen",
    email: "lisa.c@example.com",
    phone: "+1 234-567-8907",
    specialization: "Yin Yoga",
    experience: "4 years",
    certifications: ["RYT 200", "Yin Yoga Certified"],
    bio: "Yin yoga specialist focusing on deep tissue release and meditation. I help students find stillness and inner peace.",
    appliedDate: "2024-03-05",
    status: "approved",
  },
  {
    id: "5",
    name: "Tom Brown",
    email: "tom.b@example.com",
    phone: "+1 234-567-8908",
    specialization: "Ashtanga",
    experience: "2 years",
    certifications: ["RYT 200"],
    bio: "Emerging yoga instructor passionate about the traditional Ashtanga practice.",
    appliedDate: "2024-03-01",
    status: "rejected",
  },
];

const AdminTrainerApprovals = () => {
  const [applications, setApplications] = useState(mockApplications);
  const [selectedApp, setSelectedApp] = useState<TrainerApplication | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");
  const [rejectionReason, setRejectionReason] = useState("");

  const pendingApps = applications.filter((a) => a.status === "pending");
  const approvedApps = applications.filter((a) => a.status === "approved");
  const rejectedApps = applications.filter((a) => a.status === "rejected");

  const handleAction = (app: TrainerApplication, type: "approve" | "reject") => {
    setSelectedApp(app);
    setActionType(type);
    setIsActionDialogOpen(true);
  };

  const confirmAction = () => {
    if (!selectedApp) return;
    setApplications((apps) =>
      apps.map((a) =>
        a.id === selectedApp.id
          ? { ...a, status: actionType === "approve" ? "approved" : "rejected" }
          : a
      )
    );
    setIsActionDialogOpen(false);
    setRejectionReason("");
  };

  const ApplicationCard = ({ app }: { app: TrainerApplication }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-xl border bg-card hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-xl font-bold text-primary">
            {app.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{app.name}</h3>
            <p className="text-sm text-muted-foreground">{app.specialization}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setSelectedApp(app);
                setIsViewDialogOpen(true);
              }}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Award className="w-4 h-4" />
          <span>{app.experience} experience</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Applied {new Date(app.appliedDate).toLocaleDateString()}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {app.certifications.map((cert) => (
            <Badge key={cert} variant="secondary" className="text-xs">
              {cert}
            </Badge>
          ))}
        </div>
      </div>

      {app.status === "pending" && (
        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={() => handleAction(app, "approve")}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => handleAction(app, "reject")}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Reject
          </Button>
        </div>
      )}

      {app.status === "approved" && (
        <Badge className="bg-emerald-100 text-emerald-700">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      )}

      {app.status === "rejected" && (
        <Badge className="bg-red-100 text-red-700">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </Badge>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Trainer Approvals</h1>
        <p className="text-muted-foreground">Review and manage trainer applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-50">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingApps.length}</p>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-50">
              <UserCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{approvedApps.length}</p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-red-50">
              <UserX className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{rejectedApps.length}</p>
              <p className="text-sm text-muted-foreground">Rejected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="w-4 h-4" />
            Pending ({pendingApps.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="gap-2">
            <UserCheck className="w-4 h-4" />
            Approved ({approvedApps.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-2">
            <UserX className="w-4 h-4" />
            Rejected ({rejectedApps.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {pendingApps.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg">No Pending Applications</h3>
                <p className="text-muted-foreground">All trainer applications have been reviewed.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingApps.map((app) => (
                <ApplicationCard key={app.id} app={app} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedApps.map((app) => (
              <ApplicationCard key={app.id} app={app} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rejected">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rejectedApps.map((app) => (
              <ApplicationCard key={app.id} app={app} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>Full information about this trainer application</DialogDescription>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-2xl font-bold text-primary">
                  {selectedApp.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold">{selectedApp.name}</h3>
                  <p className="text-muted-foreground">{selectedApp.specialization}</p>
                  <Badge
                    className={cn(
                      "mt-2",
                      selectedApp.status === "pending"
                        ? "bg-amber-100 text-amber-700"
                        : selectedApp.status === "approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    )}
                  >
                    {selectedApp.status.charAt(0).toUpperCase() + selectedApp.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </p>
                  <p className="font-medium">{selectedApp.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </p>
                  <p className="font-medium">{selectedApp.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Experience
                  </p>
                  <p className="font-medium">{selectedApp.experience}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Applied
                  </p>
                  <p className="font-medium">
                    {new Date(selectedApp.appliedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Certifications</p>
                <div className="flex flex-wrap gap-2">
                  {selectedApp.certifications.map((cert) => (
                    <Badge key={cert} variant="secondary">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Bio
                </p>
                <p className="text-sm bg-muted p-4 rounded-lg">{selectedApp.bio}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            {selectedApp?.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    handleAction(selectedApp, "reject");
                  }}
                >
                  Reject
                </Button>
                <Button
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    handleAction(selectedApp, "approve");
                  }}
                >
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Approve Trainer" : "Reject Application"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? `Are you sure you want to approve ${selectedApp?.name} as a trainer?`
                : `Please provide a reason for rejecting ${selectedApp?.name}'s application.`}
            </DialogDescription>
          </DialogHeader>
          {actionType === "reject" && (
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={actionType === "approve" ? "default" : "destructive"}
              onClick={confirmAction}
            >
              {actionType === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTrainerApprovals;
