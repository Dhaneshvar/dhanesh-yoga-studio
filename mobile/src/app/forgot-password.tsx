import { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import { MobileFrame } from "../components/MobileFrame";
import { ActionButton, FormField, FormMessage } from "../components/FormControls";
import { usePreferences, type AppPalette } from "../contexts/PreferencesContext";
import { passwordRecoveryRedirect, supabase } from "../lib/supabase";
import { friendlyError, withRequestTimeout } from "../lib/studioApi";

export default function ForgotPasswordRoute() {
  const { colors } = usePreferences(); const styles = useMemo(() => createStyles(colors), [colors]);
  const [email, setEmail] = useState(""); const [busy, setBusy] = useState(false); const [message, setMessage] = useState(""); const [sent, setSent] = useState(false);
  const send = async () => { if (!/^\S+@\S+\.\S+$/.test(email.trim())) { setMessage("Enter a valid email address."); return; } setBusy(true); setMessage(""); try { const { error } = await withRequestTimeout(supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: passwordRecoveryRedirect() }), 20_000); if (error) throw error; setSent(true); setMessage("If an account exists for that email, a secure reset link is on its way."); } catch (e) { setMessage(friendlyError(e)); } finally { setBusy(false); } };
  return <MobileFrame title="Reset password" back><KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"><Text style={styles.title}>Return to your practice</Text><Text style={styles.copy}>Enter your account email. We’ll send a secure link that opens this app so you can choose a new password.</Text><FormField label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" editable={!busy} /><FormMessage success={sent}>{message}</FormMessage><ActionButton title={busy ? "Sending…" : "Send reset link"} onPress={() => void send()} disabled={busy} />{sent && <ActionButton title="Back to sign in" onPress={() => router.replace("/auth")} secondary />}</ScrollView></KeyboardAvoidingView></MobileFrame>;
}

const createStyles = (c: AppPalette) => StyleSheet.create({ flex: { flex: 1 }, content: { backgroundColor: c.background, flexGrow: 1, justifyContent: "center", padding: 24 }, title: { color: c.text, fontSize: 30, fontWeight: "700" }, copy: { color: c.muted, fontSize: 15, lineHeight: 23, marginBottom: 26, marginTop: 10 } });
