import { useMemo, type ReactNode } from "react";
import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";
import { MotionPressable } from "./Motion";
import { usePreferences, type AppPalette } from "../contexts/PreferencesContext";

export function FormField({ label, multiline, ...props }: TextInputProps & { label: string }) {
  const { colors } = usePreferences(); const styles = useMemo(() => createStyles(colors), [colors]);
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput {...props} multiline={multiline} placeholderTextColor={colors.muted} style={[styles.input, multiline && styles.multiline, props.style]} /></View>;
}

export function ActionButton({ title, onPress, disabled, secondary = false }: { title: string; onPress: () => void; disabled?: boolean; secondary?: boolean }) {
  const { colors } = usePreferences(); const styles = useMemo(() => createStyles(colors), [colors]);
  return <MotionPressable onPress={onPress} disabled={disabled} accessibilityRole="button" style={[styles.button, secondary && styles.secondaryButton, disabled && styles.dimmed]}><Text style={[styles.buttonText, secondary && styles.secondaryText]}>{title}</Text></MotionPressable>;
}

export function FormMessage({ children, success = false }: { children: ReactNode; success?: boolean }) { const { colors } = usePreferences(); const styles = useMemo(() => createStyles(colors), [colors]); if (!children) return null; return <Text accessibilityLiveRegion="polite" style={[styles.message, success && styles.success]}>{children}</Text>; }

const createStyles = (c: AppPalette) => StyleSheet.create({ field: { marginBottom: 16 }, label: { color: c.text, fontSize: 13, fontWeight: "700", marginBottom: 7 }, input: { backgroundColor: c.surface, borderColor: c.border, borderRadius: 12, borderWidth: 1, color: c.text, fontSize: 16, paddingHorizontal: 14, paddingVertical: 13 }, multiline: { minHeight: 110, textAlignVertical: "top" }, button: { alignItems: "center", backgroundColor: c.primary, borderRadius: 13, marginTop: 8, paddingVertical: 15, width: "100%" }, secondaryButton: { backgroundColor: "transparent", borderColor: c.primary, borderWidth: 1 }, buttonText: { color: c.background, fontSize: 15, fontWeight: "700" }, secondaryText: { color: c.primary }, dimmed: { opacity: 0.55 }, message: { color: c.danger, fontSize: 13, lineHeight: 19, marginBottom: 8 }, success: { color: c.success } });
