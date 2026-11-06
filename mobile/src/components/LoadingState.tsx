import { useMemo } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import logo from "../../assets/studio-logo.png";
import { PulseMark } from "./Motion";
import { usePreferences, type AppPalette } from "../contexts/PreferencesContext";

export function LoadingState({ message = "Preparing your practice…" }: { message?: string }) {
  const { colors } = usePreferences(); const styles = useMemo(() => createStyles(colors), [colors]);
  return <View accessibilityRole="progressbar" accessibilityLabel={message} style={styles.wrap}><PulseMark><View style={styles.mark}><Image source={logo} style={styles.logo} /></View></PulseMark><Text style={styles.message}>{message}</Text><View style={styles.line}><View style={styles.lineFill} /></View></View>;
}
const createStyles = (c: AppPalette) => StyleSheet.create({ wrap: { alignItems: "center", backgroundColor: c.background, flex: 1, justifyContent: "center", padding: 30 }, mark: { alignItems: "center", backgroundColor: c.surface, borderColor: c.border, borderRadius: 46, borderWidth: 1, height: 92, justifyContent: "center", width: 92 }, logo: { height: 64, resizeMode: "contain", width: 64 }, message: { color: c.muted, fontSize: 14, marginTop: 20 }, line: { backgroundColor: c.border, borderRadius: 3, height: 3, marginTop: 14, overflow: "hidden", width: 86 }, lineFill: { backgroundColor: c.accent, height: 3, width: 52 } });
