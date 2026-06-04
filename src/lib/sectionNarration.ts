export interface SectionNarration {
  title: string;
  summary: string;
  actions?: string[];
}

export const SECTION_NARRATION: Record<string, SectionNarration> = {
  "home-hero": {
    title: "Welcome to Dhanesh Yoga Center",
    summary: "Our hero section introduces our mission to help you balance body and calm mind through yoga.",
    actions: ["explore programs", "start your free trial", "watch the introduction"],
  },
  "home-programs": {
    title: "Our Programs",
    summary: "We offer age-specific yoga programs for kids, teens, adults, and seniors.",
    actions: ["browse programs", "view class schedules", "register for a session"],
  },
  "home-features": {
    title: "Why Choose Us",
    summary: "Discover what makes our center special, including expert instructors and flexible schedules.",
    actions: ["learn more about features", "read student testimonials"],
  },
  "home-testimonials": {
    title: "Student Testimonials",
    summary: "Hear from students who have transformed their lives through our yoga practice.",
    actions: ["read more reviews", "share your own story"],
  },
  "home-cta": {
    title: "Get Started Today",
    summary: "Take the next step in your yoga journey with us.",
    actions: ["register now", "contact our team"],
  },
  "about-hero": {
    title: "About Dhanesh Yoga Center",
    summary: "Learn about our history, philosophy, and the values guiding our yoga community.",
    actions: ["read our story", "meet the team"],
  },
  "programs-list": {
    title: "Yoga Programs",
    summary: "Browse our complete catalog of programs categorized by age group.",
    actions: ["select an age group", "view program details", "enroll in a class"],
  },
  "asanas-library": {
    title: "Asana Library",
    summary: "Explore yoga poses with detailed instructions, benefits, and difficulty levels.",
    actions: ["search asanas", "filter by difficulty", "view pose details"],
  },
  "schedule-table": {
    title: "Class Schedule",
    summary: "View upcoming classes and book your preferred time slots.",
    actions: ["filter by day", "book a class", "view trainer details"],
  },
  "contact-form": {
    title: "Contact Us",
    summary: "Get in touch with our team for any questions or enrollment inquiries.",
    actions: ["fill out the contact form", "find our location", "call us directly"],
  },
  "gallery-grid": {
    title: "Photo Gallery",
    summary: "Browse photos of our classes, events, and serene yoga spaces.",
    actions: ["view full gallery", "filter by category"],
  },
  "login-form": {
    title: "Sign In",
    summary: "Access your account to manage classes and track your yoga journey.",
    actions: ["enter your credentials", "reset your password", "create a new account"],
  },
  "register-form": {
    title: "Create Account",
    summary: "Join our yoga community by creating your account.",
    actions: ["fill in your details", "accept terms and conditions", "submit your registration"],
  },
  "admin-dashboard": {
    title: "Admin Dashboard",
    summary: "Overview of platform statistics, user activity, and quick management actions.",
    actions: ["review analytics", "manage users", "approve trainers"],
  },
  "student-dashboard": {
    title: "Student Dashboard",
    summary: "Your personal hub for classes, registrations, and profile settings.",
    actions: ["view your classes", "register for new sessions", "update your profile"],
  },
};

export function buildNarration(n: SectionNarration): string {
  const actions = n.actions && n.actions.length ? ` You can ${n.actions.join(", ")}.` : "";
  return `You're viewing ${n.title}. ${n.summary}${actions}`;
}
