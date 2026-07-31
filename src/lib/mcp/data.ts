// Static studio content exposed through the MCP server.
// Mirrors the public pages of Dhanesh Yoga Center.

export interface Program {
  id: string;
  title: string;
  ageRange: string;
  tagline: string;
  description: string;
  duration: string;
  capacity: string;
  schedule: string;
}

export const programs: Program[] = [
  {
    id: "kids",
    title: "Kids Yoga",
    ageRange: "5-12 years",
    tagline: "Playful movement, calm minds",
    description:
      "Story-led yoga that builds flexibility, focus and confidence through games, animal poses and simple breathing.",
    duration: "45 min",
    capacity: "10 students",
    schedule: "Mon, Wed, Fri - 4:00 PM",
  },
  {
    id: "teens",
    title: "Teen Yoga",
    ageRange: "13-19 years",
    tagline: "Strength, focus and stress relief",
    description:
      "Dynamic sequences plus mindfulness practices that help teenagers manage exam stress, posture and energy levels.",
    duration: "60 min",
    capacity: "12 students",
    schedule: "Tue, Thu - 5:00 PM",
  },
  {
    id: "adults",
    title: "Adult Yoga",
    ageRange: "20-50 years",
    tagline: "Balance for a busy life",
    description:
      "Vinyasa, power and restorative classes designed around desk-work recovery, stamina and deep relaxation.",
    duration: "75 min",
    capacity: "15 students",
    schedule: "Daily - 6:00 AM & 7:00 PM",
  },
  {
    id: "seniors",
    title: "Senior Yoga",
    ageRange: "50+ years",
    tagline: "Gentle, mobile, sustainable",
    description:
      "Chair-supported and gentle floor practice focused on joint mobility, balance and breath work.",
    duration: "50 min",
    capacity: "8 students",
    schedule: "Mon, Wed, Fri - 7:00 AM",
  },
];

export interface ClassSlot {
  time: string;
  name: string;
  audience: string;
  duration: string;
  instructor: string;
  spots: number;
}

export const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export type WeekDay = (typeof weekDays)[number];

export const schedule: Record<WeekDay, ClassSlot[]> = {
  Monday: [
    { time: "6:00 AM", name: "Morning Flow", audience: "Adults", duration: "75 min", instructor: "Main Instructor", spots: 15 },
    { time: "7:00 AM", name: "Senior Gentle", audience: "Seniors", duration: "50 min", instructor: "Main Instructor", spots: 8 },
    { time: "4:00 PM", name: "Kids Yoga", audience: "Kids", duration: "45 min", instructor: "Main Instructor", spots: 10 },
    { time: "7:00 PM", name: "Evening Relaxation", audience: "Adults", duration: "75 min", instructor: "Main Instructor", spots: 15 },
  ],
  Tuesday: [
    { time: "6:00 AM", name: "Power Yoga", audience: "Adults", duration: "75 min", instructor: "Main Instructor", spots: 15 },
    { time: "5:00 PM", name: "Teen Strength", audience: "Teens", duration: "60 min", instructor: "Main Instructor", spots: 12 },
    { time: "7:00 PM", name: "Stress Relief", audience: "Adults", duration: "75 min", instructor: "Main Instructor", spots: 15 },
  ],
  Wednesday: [
    { time: "6:00 AM", name: "Morning Flow", audience: "Adults", duration: "75 min", instructor: "Main Instructor", spots: 15 },
    { time: "7:00 AM", name: "Senior Gentle", audience: "Seniors", duration: "50 min", instructor: "Main Instructor", spots: 8 },
    { time: "4:00 PM", name: "Kids Yoga", audience: "Kids", duration: "45 min", instructor: "Main Instructor", spots: 10 },
    { time: "7:00 PM", name: "Meditation Focus", audience: "Adults", duration: "60 min", instructor: "Main Instructor", spots: 20 },
  ],
  Thursday: [
    { time: "6:00 AM", name: "Vinyasa Flow", audience: "Adults", duration: "75 min", instructor: "Main Instructor", spots: 15 },
    { time: "5:00 PM", name: "Teen Mindfulness", audience: "Teens", duration: "60 min", instructor: "Main Instructor", spots: 12 },
    { time: "7:00 PM", name: "Deep Stretch", audience: "Adults", duration: "75 min", instructor: "Main Instructor", spots: 15 },
  ],
  Friday: [
    { time: "6:00 AM", name: "Morning Flow", audience: "Adults", duration: "75 min", instructor: "Main Instructor", spots: 15 },
    { time: "7:00 AM", name: "Senior Gentle", audience: "Seniors", duration: "50 min", instructor: "Main Instructor", spots: 8 },
    { time: "4:00 PM", name: "Kids Yoga", audience: "Kids", duration: "45 min", instructor: "Main Instructor", spots: 10 },
    { time: "7:00 PM", name: "Weekend Prep", audience: "Adults", duration: "75 min", instructor: "Main Instructor", spots: 15 },
  ],
  Saturday: [
    { time: "8:00 AM", name: "Weekend Special", audience: "Adults", duration: "90 min", instructor: "Main Instructor", spots: 20 },
    { time: "10:00 AM", name: "Family Yoga", audience: "All Ages", duration: "60 min", instructor: "Main Instructor", spots: 25 },
    { time: "5:00 PM", name: "Restorative Yoga", audience: "Adults", duration: "75 min", instructor: "Main Instructor", spots: 15 },
  ],
  Sunday: [
    { time: "9:00 AM", name: "Sunday Slow Flow", audience: "Adults", duration: "90 min", instructor: "Main Instructor", spots: 20 },
    { time: "11:00 AM", name: "Meditation & Pranayama", audience: "All Levels", duration: "60 min", instructor: "Main Instructor", spots: 25 },
  ],
};

export interface Asana {
  name: string;
  english: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  duration: string;
  description: string;
  benefits: string[];
  breathing: string;
  howTo: string;
}

export const asanas: Asana[] = [
  {
    name: "Tadasana",
    english: "Mountain Pose",
    difficulty: "Beginner",
    category: "Standing",
    duration: "30-60 seconds",
    description: "The foundation of all standing poses. Improves posture and body awareness.",
    benefits: ["Improves posture", "Strengthens thighs", "Increases awareness"],
    breathing: "Breathe deeply and evenly through the nose.",
    howTo: "Stand with feet together, ground through all four corners of your feet. Engage thighs, tuck tailbone, extend through the crown of your head.",
  },
  {
    name: "Vrikshasana",
    english: "Tree Pose",
    difficulty: "Beginner",
    category: "Balance",
    duration: "30-60 seconds each side",
    description: "A balancing pose that promotes focus and mental clarity.",
    benefits: ["Improves balance", "Strengthens legs", "Opens hips"],
    breathing: "Steady, deep breaths to maintain balance.",
    howTo: "Stand on one leg, place the other foot on the inner thigh or calf (never the knee). Hands in prayer or raised overhead.",
  },
  {
    name: "Adho Mukha Svanasana",
    english: "Downward Facing Dog",
    difficulty: "Beginner",
    category: "Inversion",
    duration: "1-3 minutes",
    description: "A rejuvenating pose that stretches the entire body.",
    benefits: ["Full body stretch", "Calms the mind", "Energizes the body"],
    breathing: "Breathe deeply, pressing heels toward the floor on each exhale.",
    howTo: "From all fours, lift the hips up and back, straighten the legs and press the hands into the mat to form an inverted V.",
  },
  {
    name: "Virabhadrasana I",
    english: "Warrior I",
    difficulty: "Intermediate",
    category: "Standing",
    duration: "30-60 seconds each side",
    description: "A powerful standing pose that builds strength and stamina.",
    benefits: ["Strengthens legs", "Opens chest", "Builds focus"],
    breathing: "Inhale as you raise the arms, exhale to deepen the lunge.",
    howTo: "Step one foot back, bend the front knee to 90 degrees, square the hips forward and raise the arms overhead.",
  },
  {
    name: "Balasana",
    english: "Child's Pose",
    difficulty: "Beginner",
    category: "Resting",
    duration: "1-5 minutes",
    description: "A gentle resting pose that calms the mind and relieves tension.",
    benefits: ["Relaxes body", "Calms nervous system", "Stretches back"],
    breathing: "Slow, deep belly breaths. Let go with each exhale.",
    howTo: "Kneel on the floor, sit back on the heels, fold forward and rest the forehead on the mat.",
  },
  {
    name: "Bhujangasana",
    english: "Cobra Pose",
    difficulty: "Beginner",
    category: "Backbend",
    duration: "15-30 seconds",
    description: "A gentle backbend that opens the chest and strengthens the spine.",
    benefits: ["Strengthens spine", "Opens chest", "Relieves back stiffness"],
    breathing: "Inhale as you lift, exhale as you lower.",
    howTo: "Lie face down, hands under the shoulders, press lightly and lift the chest while keeping the elbows soft.",
  },
  {
    name: "Setu Bandhasana",
    english: "Bridge Pose",
    difficulty: "Beginner",
    category: "Backbend",
    duration: "30-60 seconds",
    description: "A restorative backbend that opens the hips and chest.",
    benefits: ["Strengthens glutes", "Opens hip flexors", "Relieves mild anxiety"],
    breathing: "Inhale to lift the hips, exhale to lower slowly.",
    howTo: "Lie on your back, knees bent and feet hip-width. Press into the feet and lift the hips, interlacing the hands beneath you.",
  },
  {
    name: "Trikonasana",
    english: "Triangle Pose",
    difficulty: "Intermediate",
    category: "Standing",
    duration: "30-60 seconds each side",
    description: "A lateral stretch that lengthens the side body and opens the hips.",
    benefits: ["Stretches hamstrings", "Opens side body", "Improves stability"],
    breathing: "Long, even breaths through the nose.",
    howTo: "Step the feet wide, turn the front foot out, hinge sideways and place the lower hand on the shin while reaching the top arm up.",
  },
  {
    name: "Savasana",
    english: "Corpse Pose",
    difficulty: "Beginner",
    category: "Resting",
    duration: "5-10 minutes",
    description: "The final relaxation pose that integrates the entire practice.",
    benefits: ["Deep relaxation", "Lowers stress", "Improves sleep quality"],
    breathing: "Natural, unforced breathing.",
    howTo: "Lie flat on the back, arms relaxed by the sides, palms up, and release all effort.",
  },
  {
    name: "Sukhasana",
    english: "Easy Seated Pose",
    difficulty: "Beginner",
    category: "Seated",
    duration: "3-10 minutes",
    description: "A comfortable seat for pranayama and meditation.",
    benefits: ["Calms the mind", "Opens hips", "Improves posture"],
    breathing: "Slow nostril breathing, lengthening the exhale.",
    howTo: "Sit cross-legged on a cushion, lengthen the spine and rest the hands on the knees.",
  },
];

export const studioInfo = {
  name: "Dhanesh Yoga Center",
  tagline: "Age-specific yoga for every stage of life",
  description:
    "Dhanesh Yoga Center offers age-segmented yoga programs for kids, teens, adults and seniors, plus an asana library, guided meditation and a weekly class timetable.",
  offerings: [
    "Age-specific yoga programs (Kids, Teens, Adults, Seniors)",
    "Weekly class schedule with morning and evening slots",
    "Asana library with instructions, benefits and breathing cues",
    "Guided meditation and pranayama sessions",
  ],
  pages: {
    home: "/",
    about: "/about",
    programs: "/programs",
    asanas: "/asanas",
    schedule: "/schedule",
    gallery: "/gallery",
    contact: "/contact",
  },
  contact: {
    page: "/contact",
    note: "Use the contact form on the website to reach the studio team.",
  },
};
