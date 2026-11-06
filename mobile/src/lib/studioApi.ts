import { supabase } from "./supabase";

export type Program = { id: string; name: string; description: string | null; audience: string | null; duration_minutes: number | null };
export type ClassSession = {
  id: string; title: string; starts_at: string; ends_at: string; location: string; capacity: number; status: string;
  program?: Pick<Program, "name" | "audience" | "duration_minutes"> | null;
  trainer?: { display_name: string; specialization: string | null } | null;
};
export type Booking = { id: string; status: "confirmed" | "waitlisted" | "cancelled"; created_at: string; class_session: ClassSession | null };
export type Profile = { id: string; full_name: string; phone: string | null; role: "student" | "trainer" | "admin"; avatar_url: string | null };
export type StudentIntake = { user_id: string; age: number | null; emergency_contact: string | null; health_conditions: string | null; experience_level: "beginner" | "intermediate" | "advanced" | null; goals: string | null };
export type Trainer = { id: string; display_name: string; specialization: string | null; years_experience: number | null; bio: string | null; photo_url: string | null };

const REQUEST_TIMEOUT_MS = 15_000;
const throwIfError = (error: { message: string; code?: string; status?: number } | null) => {
  if (!error) return;
  const next = new Error(error.message) as Error & { code?: string; status?: number };
  next.code = error.code;
  next.status = error.status;
  throw next;
};

export async function withRequestTimeout<T>(request: PromiseLike<T>, timeoutMs = REQUEST_TIMEOUT_MS) {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      Promise.resolve(request),
      new Promise<never>((_, reject) => { timeout = setTimeout(() => reject(new Error("Request timed out. Please check your connection and try again.")), timeoutMs); }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

export function friendlyError(error: unknown) {
  const details = error as { message?: string; code?: string } | null;
  const message = error instanceof Error ? error.message : details?.message ?? "";
  const code = details?.code ?? "";
  if (/schema cache|relation .* does not exist|table .* does not exist/i.test(message)) return "The studio is preparing live classes. Please check back soon.";
  if (/authentication required|jwt|401|unauthorized/i.test(message) || code === "401") return "Your session has ended. Please sign in again to continue.";
  if (/permission|not allowed|403|forbidden/i.test(message) || code === "403") return "You do not have permission to make that change.";
  if (/not available for booking|booking not found|cannot be cancelled/i.test(message)) return "This class is no longer available. Refresh the schedule to see the latest availability.";
  if (/network|fetch|offline|timeout|failed to fetch|internet/i.test(message)) return "We could not verify that request. Check your connection, then refresh before trying again.";
  if (/rate limit|too many/i.test(message) || code === "429") return "Please wait a moment, then try again.";
  return message || "Something went wrong. Please try again.";
}

export function isUncertainNetworkError(error: unknown) {
  const message = error instanceof Error ? error.message : (error as { message?: string } | null)?.message ?? "";
  return /network|fetch|offline|timeout|failed to fetch|internet/i.test(message);
}

export async function getPrograms() {
  const { data, error } = await withRequestTimeout(supabase.from("programs").select("id, name, description, audience, duration_minutes").eq("is_published", true).order("name"));
  throwIfError(error); return (data ?? []) as Program[];
}

export async function getSessions() {
  const { data, error } = await withRequestTimeout(supabase.from("class_sessions").select("id, title, starts_at, ends_at, location, capacity, status, program:programs(name, audience, duration_minutes), trainer:trainer_profiles(display_name, specialization)").eq("is_public", true).eq("status", "scheduled").gte("starts_at", new Date().toISOString()).order("starts_at"));
  throwIfError(error);
  return ((data ?? []) as unknown as Array<ClassSession & { program?: ClassSession["program"][]; trainer?: ClassSession["trainer"][] }>).map((item) => ({ ...item, program: item.program?.[0] ?? null, trainer: item.trainer?.[0] ?? null }));
}

export async function getBookings() {
  const { data, error } = await withRequestTimeout(supabase.from("bookings").select("id, status, created_at, class_session:class_sessions(id, title, starts_at, ends_at, location, capacity, status, program:programs(name, audience, duration_minutes), trainer:trainer_profiles(display_name, specialization))").order("created_at", { ascending: false }));
  throwIfError(error);
  return ((data ?? []) as unknown as Array<Booking & { class_session?: Array<ClassSession & { program?: ClassSession["program"][]; trainer?: ClassSession["trainer"][] }> }>).map((item) => ({ ...item, class_session: item.class_session?.[0] ? { ...item.class_session[0], program: item.class_session[0].program?.[0] ?? null, trainer: item.class_session[0].trainer?.[0] ?? null } : null }));
}

export async function bookSession(sessionId: string) {
  const { data, error } = await withRequestTimeout(supabase.rpc("book_class_session", { p_session_id: sessionId }), 20_000);
  throwIfError(error); return data as { id: string; status: Booking["status"] };
}

export async function cancelBooking(bookingId: string) {
  const { error } = await withRequestTimeout(supabase.rpc("cancel_my_booking", { p_booking_id: bookingId }), 20_000);
  throwIfError(error);
}

export async function getProfile(userId: string) {
  const { data, error } = await withRequestTimeout(supabase.from("profiles").select("id, full_name, phone, role, avatar_url").eq("id", userId).single());
  throwIfError(error); return data as Profile;
}

export async function getMyIntake() {
  const { data, error } = await withRequestTimeout(supabase.from("student_intakes").select("user_id, age, emergency_contact, health_conditions, experience_level, goals").maybeSingle());
  throwIfError(error); return data as StudentIntake | null;
}

export async function getActiveTrainers() {
  const { data, error } = await withRequestTimeout(supabase.from("trainer_profiles").select("id, display_name, specialization, years_experience, bio, photo_url").eq("is_active", true).order("display_name"));
  throwIfError(error); return (data ?? []) as Trainer[];
}

export async function saveProfile(input: { fullName: string; phone: string }) {
  const { data, error } = await withRequestTimeout(supabase.rpc("update_my_profile", { p_full_name: input.fullName.trim(), p_phone: input.phone.trim() || null }), 20_000);
  throwIfError(error); return data as Profile;
}

export async function saveIntake(input: { age: number; emergencyContact: string; healthConditions: string; experience: string; goals: string }) {
  const { error } = await withRequestTimeout(supabase.rpc("upsert_my_intake", { p_age: input.age, p_emergency_contact: input.emergencyContact.trim() || null, p_health_conditions: input.healthConditions.trim() || null, p_experience_level: input.experience, p_goals: input.goals.trim() || null }), 20_000);
  throwIfError(error);
}

export async function submitContact(input: { name: string; email: string; phone: string; subject: string; message: string }) {
  const { data: { user } } = await withRequestTimeout(supabase.auth.getUser());
  const { error } = await withRequestTimeout(supabase.from("contact_enquiries").insert({ name: input.name.trim(), email: input.email.trim(), phone: input.phone.trim() || null, subject: input.subject.trim(), message: input.message.trim(), user_id: user?.id ?? null }), 20_000);
  throwIfError(error);
}

export async function submitFeedback(input: { name: string; email: string; issueType: string; description: string }) {
  const { data: { user } } = await withRequestTimeout(supabase.auth.getUser());
  const { error } = await withRequestTimeout(supabase.from("feedback").insert({ name: input.name.trim(), email: input.email.trim(), issue_type: input.issueType, description: input.description.trim(), user_id: user?.id ?? null }), 20_000);
  throwIfError(error);
}
