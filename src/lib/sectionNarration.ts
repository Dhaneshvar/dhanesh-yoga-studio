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
};

// Whole-page narrations keyed by route. Used on route change so every page
// gets a proper introduction without needing per-section tagging.
export const ROUTE_NARRATION: Record<string, SectionNarration> = {
  "/": {
    title: "the Dhanesh Yoga Center home page",
    summary: "This is our welcome page introducing our yoga programs, instructors, and student stories.",
    actions: ["scroll to explore programs", "read testimonials", "register for a free trial"],
  },
  "/about": {
    title: "the About page",
    summary: "Learn about our founder Dhanesh, his certifications, teaching philosophy, and the values that guide our yoga community.",
    actions: ["read the instructor story", "view achievements and certifications", "explore our teaching philosophy"],
  },
  "/programs": {
    title: "the Programs page",
    summary: "Browse our four age-specific yoga programs designed for kids, teens, adults, and seniors. Each program has its own schedule, benefits, and capacity.",
    actions: ["choose an age group", "view program benefits", "check class schedules"],
  },
  "/asanas": {
    title: "the Asana Library",
    summary: "Explore yoga poses with detailed instructions, benefits, difficulty levels, and step-by-step guidance.",
    actions: ["search for a pose", "filter by difficulty", "open a pose for full details"],
  },
  "/schedule": {
    title: "the Class Schedule",
    summary: "View all upcoming yoga classes, instructors, and timings. You can book your preferred slot directly from this page.",
    actions: ["filter by day or program", "view trainer details", "book a class"],
  },
  "/contact": {
    title: "the Contact page",
    summary: "Reach out to our team for enrollment, partnership, or general questions. You can also find our location and direct phone number here.",
    actions: ["fill out the contact form", "find our address", "call us directly"],
  },
  "/gallery": {
    title: "the Photo Gallery",
    summary: "Browse photos from our classes, retreats, workshops, and serene yoga spaces.",
    actions: ["scroll through images", "filter by category"],
  },
  "/login": {
    title: "the Sign In page",
    summary: "Sign in to access your dashboard, manage your classes, and track your yoga journey.",
    actions: ["enter your credentials", "reset your password", "create a new account"],
  },
  "/register": {
    title: "the Account Registration page",
    summary: "Create a new account to join our yoga community. You will need to accept our terms and conditions before completing registration.",
    actions: ["fill in your personal details", "accept terms and conditions", "submit your registration"],
  },
  // Dashboard
  "/dashboard": {
    title: "your Dashboard",
    summary: "This is your personal hub for classes, registrations, profile, and quick actions tailored to your role.",
    actions: ["use the sidebar to navigate", "open your classes", "update your profile"],
  },
  "/dashboard/my-classes": {
    title: "My Classes",
    summary: "Here are all the classes you are enrolled in, along with their schedules and instructors.",
    actions: ["join a class", "view class details", "cancel a booking"],
  },
  "/dashboard/my-registrations": {
    title: "My Registrations",
    summary: "View and manage all your program registrations from one place.",
    actions: ["review status", "download receipts", "register for a new program"],
  },
  "/dashboard/student-registration": {
    title: "Student Registration",
    summary: "Register a new student for one of our programs by filling in their details and selecting a class.",
    actions: ["enter student information", "choose a program", "submit the registration"],
  },
  "/dashboard/register-trainer": {
    title: "Register Trainer",
    summary: "Submit a new trainer profile for admin approval, including credentials and availability.",
    actions: ["fill in trainer information", "upload certifications", "submit for approval"],
  },
  "/dashboard/trainer-directory": {
    title: "Trainer Directory",
    summary: "Browse all approved trainers along with their specializations and contact details.",
    actions: ["search trainers", "filter by specialization", "view a trainer profile"],
  },
  "/dashboard/trainer-schedule": {
    title: "Trainer Schedule",
    summary: "View and manage trainer schedules across the week.",
    actions: ["select a trainer", "view weekly slots", "assign a class"],
  },
  "/dashboard/availability": {
    title: "Availability Overview",
    summary: "See the combined availability of all trainers to plan classes efficiently.",
    actions: ["filter by day", "spot open slots", "assign a session"],
  },
  "/dashboard/profile": {
    title: "Profile Settings",
    summary: "Update your personal information, preferences, and account security.",
    actions: ["edit your details", "change your password", "save your changes"],
  },
  "/dashboard/settings": {
    title: "Account Settings",
    summary: "Manage your account preferences and notification settings.",
    actions: ["update preferences", "save changes"],
  },
  // Admin
  "/admin": {
    title: "the Admin Dashboard",
    summary: "Overview of platform statistics, user activity, trainer approvals, and quick management actions.",
    actions: ["review analytics", "manage users", "approve trainers"],
  },
  "/admin/users": {
    title: "User Management",
    summary: "View, edit, and manage all users on the platform including students, trainers, and admins.",
    actions: ["search users", "edit roles", "deactivate accounts"],
  },
  "/admin/approvals": {
    title: "Trainer Approvals",
    summary: "Review pending trainer applications and approve or reject them.",
    actions: ["open an application", "approve a trainer", "reject with feedback"],
  },
  "/admin/sessions": {
    title: "Session Management",
    summary: "Manage all yoga sessions across the platform, including scheduling, attendance, and cancellations.",
    actions: ["create a session", "edit timings", "view attendance"],
  },
  "/admin/analytics": {
    title: "Analytics",
    summary: "Detailed insights on user growth, class attendance, revenue, and engagement metrics.",
    actions: ["change the time range", "filter by program", "export reports"],
  },
  "/admin/reports": {
    title: "Reports",
    summary: "Generate and download operational and financial reports.",
    actions: ["choose a report type", "pick a date range", "download as PDF"],
  },
  "/admin/communications": {
    title: "Communications",
    summary: "Send announcements, emails, and notifications to users.",
    actions: ["compose a message", "select recipients", "schedule a broadcast"],
  },
  "/admin/settings": {
    title: "Admin Settings",
    summary: "Configure platform-wide settings, branding, and system preferences.",
    actions: ["edit platform settings", "update branding", "save changes"],
  },
};

export function getRouteNarration(pathname: string): SectionNarration | null {
  if (ROUTE_NARRATION[pathname]) return ROUTE_NARRATION[pathname];
  // Match dynamic sub-routes by longest-prefix
  const keys = Object.keys(ROUTE_NARRATION).sort((a, b) => b.length - a.length);
  for (const k of keys) {
    if (k !== "/" && pathname.startsWith(k)) return ROUTE_NARRATION[k];
  }
  return null;
}

export function buildNarration(n: SectionNarration): string {
  const actions = n.actions && n.actions.length ? ` You can ${n.actions.join(", ")}.` : "";
  return `You're viewing ${n.title}. ${n.summary}${actions}`;
}
