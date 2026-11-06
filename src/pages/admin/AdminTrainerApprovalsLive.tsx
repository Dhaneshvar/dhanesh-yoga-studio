import { useEffect, useState } from "react";
import { CheckCircle2, Clock3, Loader2, UserRound, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTrainerApplications, reviewTrainerApplication, type TrainerApplication } from "@/lib/studioApi";

const AdminTrainerApprovalsLive = () => {
  const [applications, setApplications] = useState<TrainerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [specialization, setSpecialization] = useState("Hatha Yoga");
  const [years, setYears] = useState("0");
  const [rejectionReason, setRejectionReason] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setApplications(await getTrainerApplications());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load instructor applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const review = async (application: TrainerApplication, decision: "approve" | "reject") => {
    if (decision === "approve" && !specialization.trim()) {
      setError("Choose a specialization before approving this instructor.");
      return;
    }
    if (decision === "reject" && !rejectionReason.trim()) {
      setError("Add a short reason before rejecting an application.");
      return;
    }
    setBusy(application.id);
    setError("");
    setNotice("");
    try {
      await reviewTrainerApplication({
        applicationId: application.id,
        decision,
        specialization: decision === "approve" ? specialization : undefined,
        yearsExperience: decision === "approve" ? Number(years) || 0 : 0,
        bio: decision === "approve" ? application.bio ?? undefined : rejectionReason,
      });
      setNotice(decision === "approve" ? "Instructor approved and access enabled." : "Application rejected.");
      setRejectionReason("");
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We could not update this application.");
    } finally {
      setBusy(null);
    }
  };

  const pending = applications.filter((application) => application.status === "pending");

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-primary font-semibold">Studio team</p>
        <h1 className="text-3xl font-display font-bold mt-2">Instructor approvals</h1>
        <p className="text-muted-foreground mt-1">Review real instructor requests created during registration.</p>
      </div>

      {error && <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive">{error}</div>}
      {notice && <div className="rounded-xl border border-primary/30 bg-primary/10 p-4 text-primary">{notice}</div>}

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Clock3 className="w-5 h-5 text-primary" />Pending requests ({pending.length})</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {loading ? <p className="text-muted-foreground">Loading applications…</p> : pending.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground"><CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-primary" /><p>No pending instructor applications.</p></div>
          ) : pending.map((application) => (
            <div key={application.id} className="rounded-2xl border border-border bg-background p-4 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-primary/10 grid place-items-center"><UserRound className="w-5 h-5 text-primary" /></div><div><p className="font-semibold">{application.applicant?.full_name || "Studio applicant"}</p><p className="text-sm text-muted-foreground">{application.applicant?.phone || "Phone not provided"}</p></div></div>
                <span className="text-xs uppercase tracking-wide rounded-full bg-amber-500/10 text-amber-600 px-3 py-1">Pending</span>
              </div>
              <p className="text-sm text-muted-foreground">{application.bio || "No application notes provided."}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <label className="text-sm font-medium">Specialization<input value={specialization} onChange={(event) => setSpecialization(event.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-card p-3" /></label>
                <label className="text-sm font-medium">Years of experience<input type="number" min="0" max="80" value={years} onChange={(event) => setYears(event.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-card p-3" /></label>
              </div>
              <label className="text-sm font-medium block">Rejection note (required only when rejecting)<textarea value={rejectionReason} onChange={(event) => setRejectionReason(event.target.value)} className="mt-1.5 w-full min-h-20 rounded-xl border border-border bg-card p-3" /></label>
              <div className="flex flex-wrap gap-3">
                <Button disabled={busy === application.id} onClick={() => void review(application, "approve")}><CheckCircle2 className="w-4 h-4 mr-2" />{busy === application.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Approve instructor"}</Button>
                <Button variant="outline" disabled={busy === application.id} onClick={() => void review(application, "reject")}><XCircle className="w-4 h-4 mr-2" />Reject request</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTrainerApprovalsLive;
