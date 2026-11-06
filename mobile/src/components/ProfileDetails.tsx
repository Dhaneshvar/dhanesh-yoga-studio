import { useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { ActionButton, FormField, FormMessage } from "./FormControls";
import { friendlyError, getMyIntake, saveIntake, saveProfile, type Profile } from "../lib/studioApi";
import { usePreferences, type AppPalette } from "../contexts/PreferencesContext";
import { AnimatedEntrance } from "./Motion";

type Experience = "beginner" | "intermediate" | "advanced";

export function ProfileDetails({ profile, email, onSaved, onSignOut }: { profile: Profile | null; email: string; onSaved: () => Promise<void>; onSignOut: () => Promise<void> }) {
  const { colors } = usePreferences(); const styles = useMemo(() => createStyles(colors), [colors]);
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [age, setAge] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [healthConditions, setHealthConditions] = useState("");
  const [experience, setExperience] = useState<Experience>("beginner");
  const [goals, setGoals] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setFullName(profile?.full_name ?? "");
    setPhone(profile?.phone ?? "");
  }, [profile]);

  useEffect(() => {
    let active = true;
    getMyIntake().then((intake) => {
      if (!active || !intake) return;
      setAge(intake.age ? String(intake.age) : "");
      setEmergencyContact(intake.emergency_contact ?? "");
      setHealthConditions(intake.health_conditions ?? "");
      setExperience(intake.experience_level ?? "beginner");
      setGoals(intake.goals ?? "");
    }).catch((error) => {
      if (active) setNotice(friendlyError(error));
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const save = async () => {
    const numericAge = Number(age);
    if (fullName.trim().length < 2) { setSuccess(false); setNotice("Please enter your full name."); return; }
    if (!Number.isInteger(numericAge) || numericAge < 5 || numericAge > 120) { setSuccess(false); setNotice("Please enter an age between 5 and 120."); return; }
    setBusy(true); setNotice("");
    try {
      await saveProfile({ fullName, phone });
      await saveIntake({ age: numericAge, emergencyContact, healthConditions, experience, goals });
      await onSaved();
      setSuccess(true); setNotice("Your profile and practice preferences are saved.");
    } catch (error) { setSuccess(false); setNotice(friendlyError(error)); }
    finally { setBusy(false); }
  };

  const links = [
    { title: "Settings", subtitle: "Theme, reminders, accessibility, and account", route: "/settings" },
    { title: "Asana library", subtitle: "Explore pose instructions and safety guidance", route: "/asanas" },
    { title: "Meet the trainers", subtitle: "View active studio teachers", route: "/trainers" },
    { title: "Contact & feedback", subtitle: "Message the studio or share feedback", route: "/contact" },
    { title: "Change password", subtitle: "Update your account password securely", route: "/reset-password" },
  ];

  return <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <AnimatedEntrance><View style={styles.account}><View style={styles.avatar}><Text style={styles.avatarText}>{(profile?.full_name || email || "Y").trim().charAt(0).toUpperCase()}</Text></View><View style={styles.accountText}><Text style={styles.name}>{profile?.full_name || "Yoga student"}</Text><Text style={styles.email}>{email}</Text></View></View></AnimatedEntrance>
    <Text style={styles.sectionTitle}>Personal details</Text>
    <FormField label="Full name" value={fullName} onChangeText={setFullName} autoComplete="name" placeholder="Your full name" />
    <FormField label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" autoComplete="tel" placeholder="Phone number" />
    <FormField label="Age" value={age} onChangeText={(value) => setAge(value.replace(/\D/g, ""))} keyboardType="number-pad" placeholder="Your age" />
    <FormField label="Emergency contact" value={emergencyContact} onChangeText={setEmergencyContact} keyboardType="phone-pad" placeholder="Name and phone number" />
    <Text style={styles.label}>Experience level</Text>
    <View style={styles.chips}>{(["beginner", "intermediate", "advanced"] as Experience[]).map((item) => <Pressable accessibilityRole="radio" accessibilityState={{ checked: experience === item }} key={item} onPress={() => setExperience(item)} style={[styles.chip, experience === item && styles.chipActive]}><Text style={[styles.chipText, experience === item && styles.chipTextActive]}>{item}</Text></Pressable>)}</View>
    <FormField label="Health notes (optional)" value={healthConditions} onChangeText={setHealthConditions} multiline placeholder="Share anything your instructor should know" />
    <FormField label="Practice goals (optional)" value={goals} onChangeText={setGoals} multiline placeholder="What would you like to work toward?" />
    <FormMessage success={success}>{notice}</FormMessage>
    <ActionButton title={busy ? "Saving…" : loading ? "Loading profile…" : "Save profile"} onPress={() => void save()} disabled={busy || loading} />
    <Text style={styles.sectionTitle}>More</Text>
    <View style={styles.linkGroup}>{links.map((item) => <Pressable accessibilityRole="button" key={item.route} onPress={() => router.push(item.route as never)} style={({ pressed }) => [styles.link, pressed && styles.pressed]}><View style={styles.linkText}><Text style={styles.linkTitle}>{item.title}</Text><Text style={styles.linkSubtitle}>{item.subtitle}</Text></View><Text style={styles.chevron}>›</Text></Pressable>)}</View>
    <ActionButton title="Sign out" secondary onPress={() => void onSignOut()} />
  </ScrollView></KeyboardAvoidingView>;
}

const createStyles = (c: AppPalette) => StyleSheet.create({
  flex: { flex: 1 }, content: { backgroundColor: c.background, padding: 22, paddingBottom: 48 }, account: { alignItems: "center", backgroundColor: c.surface, borderColor: c.border, borderRadius: 18, borderWidth: 1, flexDirection: "row", marginBottom: 26, padding: 16 }, avatar: { alignItems: "center", backgroundColor: c.primary, borderRadius: 25, height: 50, justifyContent: "center", width: 50 }, avatarText: { color: c.background, fontSize: 21, fontWeight: "800" }, accountText: { flex: 1, marginLeft: 13 }, name: { color: c.text, fontSize: 18, fontWeight: "700" }, email: { color: c.muted, fontSize: 13, marginTop: 3 }, sectionTitle: { color: c.text, fontSize: 20, fontWeight: "800", marginBottom: 16, marginTop: 10 }, label: { color: c.text, fontSize: 13, fontWeight: "700", marginBottom: 8 }, chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 18 }, chip: { borderColor: c.border, borderRadius: 999, borderWidth: 1, paddingHorizontal: 13, paddingVertical: 9 }, chipActive: { backgroundColor: c.primary, borderColor: c.primary }, chipText: { color: c.muted, fontSize: 12, fontWeight: "700", textTransform: "capitalize" }, chipTextActive: { color: c.background }, linkGroup: { backgroundColor: c.surface, borderColor: c.border, borderRadius: 16, borderWidth: 1, marginBottom: 18, overflow: "hidden" }, link: { alignItems: "center", borderBottomColor: c.border, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: "row", padding: 16 }, pressed: { opacity: 0.62 }, linkText: { flex: 1 }, linkTitle: { color: c.text, fontSize: 15, fontWeight: "700" }, linkSubtitle: { color: c.muted, fontSize: 12, lineHeight: 17, marginTop: 3 }, chevron: { color: c.primary, fontSize: 27, marginLeft: 10 },
});
