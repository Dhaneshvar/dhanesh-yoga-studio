import { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import { MobileFrame } from "../components/MobileFrame";
import { ActionButton, FormField, FormMessage } from "../components/FormControls";
import { usePreferences, type AppPalette } from "../contexts/PreferencesContext";
import { supabase } from "../lib/supabase";
import { friendlyError, withRequestTimeout } from "../lib/studioApi";

export default function ResetPasswordRoute() {
  const { colors } = usePreferences(); const styles = useMemo(() => createStyles(colors), [colors]);
  const [password, setPassword] = useState(""); const [confirm, setConfirm] = useState(""); const [busy, setBusy] = useState(false); const [message, setMessage] = useState(""); const [success, setSuccess] = useState(false);
  const update = async () => { if (password.length < 8) { setMessage("Use at least 8 characters for your new password."); return; } if (password !== confirm) { setMessage("The passwords do not match."); return; } setBusy(true); setMessage(""); try { const { error } = await withRequestTimeout(supabase.auth.updateUser({ password }), 20_000); if (error) throw error; setSuccess(true); setMessage("Your password has been updated securely."); } catch (e) { setMessage(friendlyError(e)); } finally { setBusy(false); } };
  return <MobileFrame title="Choose new password" back><KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"><Text style={styles.title}>Protect your account</Text><Text style={styles.copy}>Choose a password you don’t use elsewhere.</Text><FormField label="New password" value={password} onChangeText={setPassword} secureTextEntry placeholder="At least 8 characters" editable={!busy && !success} /><FormField label="Confirm password" value={confirm} onChangeText={setConfirm} secureTextEntry placeholder="Repeat the password" editable={!busy && !success} /><FormMessage success={success}>{message}</FormMessage>{success ? <ActionButton title="Return to my account" onPress={() => router.replace("/(tabs)/profile")} /> : <ActionButton title={busy ? "Updating…" : "Update password"} onPress={() => void update()} disabled={busy} />}</ScrollView></KeyboardAvoidingView></MobileFrame>;
}

const createStyles = (c: AppPalette) => StyleSheet.create({ flex: { flex: 1 }, content: { backgroundColor: c.background, flexGrow: 1, justifyContent: "center", padding: 24 }, title: { color: c.text, fontSize: 30, fontWeight: "700" }, copy: { color: c.muted, fontSize: 15, lineHeight: 23, marginBottom: 26, marginTop: 10 } });
