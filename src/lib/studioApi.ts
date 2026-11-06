import { supabase } from "@/integrations/supabase/client";

export type Program = { id: string; name: string; description: string | null; audience: string | null; duration_minutes: number | null };
export type Trainer = { id: string; display_name: string; specialization: string | null; years_experience: number | null; bio: string | null; photo_url: string | null };
export type ClassSession = {
  id: string; title: string; starts_at: string; ends_at: string; location: string; capacity: number; status: string;
  program?: Pick<Program, "name" | "audience" | "duration_minutes"> | null;
  trainer?: Pick<Trainer, "display_name" | "specialization"> | null;
};
export type Booking = { id: string; status: "confirmed" | "waitlisted" | "cancelled"; created_at: string; class_session: ClassSession | null };
export type TrainerApplication = {
  id: string;
  applicant_id: string;
  specialization: string;
  years_experience: number;
  bio: string | null;
  status: "pending" | "approved" | "rejected";
  rejection_reason: string | null;
  created_at: string;
  applicant?: { full_name: string; phone: string | null } | null;
};
export type TrainerAvailability = { id: string; weekday: number; starts_at: string; ends_at: string; effective_from: string; effective_until: string | null; is_active: boolean };
export type AdminUser = { id: string; full_name: string; phone: string | null; role: "student" | "trainer" | "admin"; email: string; created_at: string; last_active_at: string | null; visits_30_days: number; page_views_30_days: number };

const throwIfError = (error: { message: string } | null) => { if (error) throw new Error(error.message); };

export const getStudioDataError = (error: unknown, resource: "programmes" | "classes") => {
  const message = error instanceof Error ? error.message : "";
  if (/schema cache|relation .* does not exist|table .* does not exist/i.test(message)) {
    return `Live ${resource} are not configured yet. The studio administrator needs to apply the Supabase database migrations.`;
  }
  return message || `Unable to load ${resource}. Please try again.`;
};

export async function getPrograms() {
  const { data, error } = await supabase.from("programs").select("id, name, description, audience, duration_minutes").eq("is_published", true).order("name");
  throwIfError(error); return (data ?? []) as Program[];
}

export async function getPublicSessions() {
  const { data, error } = await supabase
    .from("class_sessions")
    .select("id, title, starts_at, ends_at, location, capacity, status, program:programs(name, audience, duration_minutes), trainer:trainer_profiles(display_name, specialization)")
    .eq("is_public", true).eq("status", "scheduled").gte("starts_at", new Date().toISOString()).order("starts_at");
  throwIfError(error); return (data ?? []) as ClassSession[];
}

export async function getAdminSessions() {
  const { data, error } = await supabase
    .from("class_sessions")
    .select("id, title, starts_at, ends_at, location, capacity, status, program:programs(name, audience, duration_minutes), trainer:trainer_profiles(display_name, specialization)")
    .order("starts_at", { ascending: false });
  throwIfError(error); return (data ?? []) as ClassSession[];
}

export async function getActiveTrainers() {
  const { data, error } = await supabase.from("trainer_profiles").select("id, display_name, specialization, years_experience, bio, photo_url").eq("is_active", true).order("display_name");
  throwIfError(error); return (data ?? []) as Trainer[];
}

export async function submitContact(input: { name: string; email: string; phone: string; subject: string; message: string }) {
  const { error } = await supabase.from("contact_enquiries").insert(input);
  throwIfError(error);
}

export async function submitFeedback(input: { name: string; email: string; issue_type: string; description: string }) {
  const { error } = await supabase.from("feedback").insert(input);
  throwIfError(error);
}

export async function saveIntake(input: { fullName: string; phone: string; age: number; emergencyContact: string; healthConditions: string; experience: string; goals: string }) {
  const { error: profileError } = await supabase.rpc("update_my_profile", { p_full_name: input.fullName, p_phone: input.phone });
  throwIfError(profileError);
  const { error } = await supabase.rpc("upsert_my_intake", {
    p_age: input.age, p_emergency_contact: input.emergencyContact, p_health_conditions: input.healthConditions,
    p_experience_level: input.experience, p_goals: input.goals,
  });
  throwIfError(error);
}

export async function bookSession(sessionId: string) {
  const { data, error } = await supabase.rpc("book_class_session", { p_session_id: sessionId });
  throwIfError(error); return data as { id: string; status: Booking["status"] };
}

export async function getMyBookings() {
  const { data, error } = await supabase
    .from("bookings")
    .select("id, status, created_at, class_session:class_sessions(id, title, starts_at, ends_at, location, capacity, status, program:programs(name, audience, duration_minutes), trainer:trainer_profiles(display_name, specialization))")
    .order("created_at", { ascending: false });
  throwIfError(error); return (data ?? []) as Booking[];
}

export async function cancelBooking(bookingId: string) {
  const { error } = await supabase.rpc("cancel_my_booking", { p_booking_id: bookingId });
  throwIfError(error);
}

export async function getAdminPrograms() {
  const { data, error } = await supabase.from("programs").select("id, name, description, audience, duration_minutes, is_published").order("name");
  throwIfError(error); return (data ?? []) as Array<Program & { is_published: boolean }>;
}

export async function createProgram(input: { name: string; audience: string; durationMinutes: number; description: string; published: boolean }) {
  const { data, error } = await supabase.from("programs").insert({ name: input.name.trim(), audience: input.audience.trim() || null, duration_minutes: input.durationMinutes || null, description: input.description.trim() || null, is_published: input.published }).select("id").single();
  throwIfError(error); return data as { id: string };
}

export async function createSession(input: { title: string; programId: string | null; startsAt: string; endsAt: string; location: string; capacity: number }) {
  const { error } = await supabase.from("class_sessions").insert({ title: input.title.trim(), program_id: input.programId, starts_at: new Date(input.startsAt).toISOString(), ends_at: new Date(input.endsAt).toISOString(), location: input.location.trim(), capacity: input.capacity, is_public: true, status: "scheduled" });
  throwIfError(error);
}

export async function getTrainerApplications() {
  const { data, error } = await supabase
    .from("trainer_applications")
    .select("id, applicant_id, specialization, years_experience, bio, status, rejection_reason, created_at, applicant:profiles!trainer_applications_applicant_id_fkey(full_name, phone)")
    .order("created_at", { ascending: false });
  throwIfError(error);
  return (data ?? []) as TrainerApplication[];
}

export async function reviewTrainerApplication(input: {
  applicationId: string;
  decision: "approve" | "reject";
  specialization?: string;
  yearsExperience?: number;
  bio?: string;
}) {
  const { data, error } = await supabase.rpc("review_trainer_application", {
    p_application_id: input.applicationId,
    p_decision: input.decision,
    p_specialization: input.specialization?.trim() || null,
    p_years_experience: input.yearsExperience ?? 0,
    p_bio: input.bio?.trim() || null,
  });
  throwIfError(error);
  return data as TrainerApplication;
}

export async function getMyTrainerProfile() {
  const { data, error } = await supabase.from("trainer_profiles").select("id, display_name, specialization, years_experience, bio, photo_url, is_active").single();
  throwIfError(error);
  return data as Trainer & { is_active: boolean };
}

export async function updateMyTrainerProfile(input: { displayName: string; specialization: string; yearsExperience: number; bio: string; photoUrl?: string }) {
  const { data, error } = await supabase.rpc("update_my_trainer_profile", {
    p_display_name: input.displayName, p_specialization: input.specialization,
    p_years_experience: input.yearsExperience, p_bio: input.bio, p_photo_url: input.photoUrl || null,
  });
  throwIfError(error); return data as Trainer;
}

export async function getMyAvailability() {
  const { data, error } = await supabase.from("trainer_availability").select("id, weekday, starts_at, ends_at, effective_from, effective_until, is_active").order("weekday").order("starts_at");
  throwIfError(error); return (data ?? []) as TrainerAvailability[];
}

export async function addMyAvailability(input: { weekday: number; startsAt: string; endsAt: string }) {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Authentication required");
  const { error } = await supabase.from("trainer_availability").insert({ trainer_id: auth.user.id, weekday: input.weekday, starts_at: input.startsAt, ends_at: input.endsAt });
  throwIfError(error);
}

export async function removeMyAvailability(id: string) {
  const { error } = await supabase.from("trainer_availability").delete().eq("id", id);
  throwIfError(error);
}

export async function getMyTrainerSessions() {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Authentication required");
  const { data, error } = await supabase.from("class_sessions").select("id, title, starts_at, ends_at, location, capacity, status").eq("trainer_id", auth.user.id).order("starts_at");
  throwIfError(error); return (data ?? []) as ClassSession[];
}

export async function createMyTrainerSession(input: { title: string; startsAt: string; endsAt: string; location: string; capacity: number }) {
  const { error } = await supabase.rpc("create_my_class_session", { p_title: input.title, p_starts_at: input.startsAt, p_ends_at: input.endsAt, p_location: input.location, p_capacity: input.capacity, p_program_id: null });
  throwIfError(error);
}

export async function getAdminUsers() {
  const { data, error } = await supabase.rpc("admin_list_users");
  throwIfError(error); return (data ?? []) as AdminUser[];
}
