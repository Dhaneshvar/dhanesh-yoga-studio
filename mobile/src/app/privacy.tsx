import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { MobileFrame } from "../components/MobileFrame";
import { AnimatedEntrance } from "../components/Motion";
import { usePreferences, type AppPalette } from "../contexts/PreferencesContext";

export default function PrivacyRoute() {
  const { colors } = usePreferences(); const styles = useMemo(() => createStyles(colors), [colors]);
  const sections = [
    ["Studio account data", "Your name, email, phone, health notes, emergency contact, practice experience, goals, bookings, messages, and feedback may be stored in the studio's secured Supabase project. Row-level access rules restrict private records to the signed-in account and authorized studio roles."],
    ["On this device", "Theme, reduced-motion, and reminder preferences stay in this app's local storage. Scheduled reminders are managed by your phone and can be changed or removed from Settings."],
    ["Passwords", "The app never reads or stores your password. Sign-in and password recovery are handled by Supabase Auth using encrypted network connections."],
    ["Your choices", "You can edit your profile and health details from Account. To request account deletion, data correction, or a copy of your studio information, contact the studio through the form below."],
  ];
  return <MobileFrame title="Privacy & data" back><ScrollView contentContainerStyle={styles.content}><AnimatedEntrance><Text style={styles.intro}>A clear summary of what this app uses and where it is kept.</Text></AnimatedEntrance>{sections.map(([title, body], index) => <AnimatedEntrance key={title} delay={index * 55}><View style={styles.card}><Text style={styles.title}>{title}</Text><Text style={styles.body}>{body}</Text></View></AnimatedEntrance>)}<Pressable accessibilityRole="button" onPress={() => router.push("/contact")} style={styles.button}><Text style={styles.buttonText}>Contact the studio about my data</Text></Pressable></ScrollView></MobileFrame>;
}
const createStyles = (c: AppPalette) => StyleSheet.create({ content: { backgroundColor: c.background, padding: 20, paddingBottom: 44 }, intro: { color: c.muted, fontSize: 15, lineHeight: 23, marginBottom: 18 }, card: { backgroundColor: c.surface, borderColor: c.border, borderRadius: 16, borderWidth: 1, marginBottom: 12, padding: 17 }, title: { color: c.text, fontSize: 16, fontWeight: "800" }, body: { color: c.muted, fontSize: 13, lineHeight: 21, marginTop: 7 }, button: { alignItems: "center", backgroundColor: c.primary, borderRadius: 14, marginTop: 8, padding: 15 }, buttonText: { color: c.background, fontSize: 14, fontWeight: "800" } });
