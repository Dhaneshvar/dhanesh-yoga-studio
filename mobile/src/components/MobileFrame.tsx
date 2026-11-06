import { useMemo, type ReactNode } from "react";
import { Image, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import logo from "../../assets/studio-logo.png";
import { AnimatedEntrance } from "./Motion";
import { usePreferences, type AppPalette } from "../contexts/PreferencesContext";

export function MobileFrame({ title, children, back = false }: { title: string; children: ReactNode; back?: boolean }) {
  const { colors, isDark } = usePreferences(); const styles = useMemo(() => createStyles(colors), [colors]);
  return <SafeAreaView style={styles.safe}><StatusBar barStyle={isDark ? "light-content" : "dark-content"} /><View style={styles.header}><View style={styles.headingRow}>{back && <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Go back" style={styles.back}><Text style={styles.backText}>‹</Text></Pressable>}<AnimatedEntrance distance={6}><View><Text style={styles.eyebrow}>DHANESH YOGA</Text><Text style={styles.title}>{title}</Text></View></AnimatedEntrance></View><Image source={logo} accessibilityLabel="Dhanesh Yoga Studio logo" style={styles.logo} /></View><View style={styles.body}>{children}</View></SafeAreaView>;
}

const createStyles = (colors: AppPalette) => StyleSheet.create({ safe: { backgroundColor: colors.background, flex: 1 }, header: { alignItems: "center", backgroundColor: colors.background, borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 15 }, headingRow: { alignItems: "center", flexDirection: "row", gap: 10 }, back: { alignItems: "center", height: 40, justifyContent: "center", width: 32 }, backText: { color: colors.primary, fontSize: 36, lineHeight: 38 }, eyebrow: { color: colors.accent, fontSize: 11, fontWeight: "700", letterSpacing: 2 }, title: { color: colors.text, fontSize: 23, fontWeight: "700", marginTop: 3 }, logo: { height: 42, resizeMode: "contain", width: 42 }, body: { backgroundColor: colors.background, flex: 1 } });
