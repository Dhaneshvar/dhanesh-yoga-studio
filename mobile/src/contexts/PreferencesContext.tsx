import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SystemUI from "expo-system-ui";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AccessibilityInfo, Appearance, useColorScheme } from "react-native";

export type ThemePreference = "system" | "light" | "dark";
export type AppPalette = {
  background: string; surface: string; elevated: string; primary: string; accent: string;
  text: string; muted: string; border: string; danger: string; success: string;
  warningSurface: string; warningText: string; overlay: string; tabBar: string;
};

// Mirrors the website's deep blue, turquoise, and dark-mode design tokens.
const light: AppPalette = { background: "#f8fafb", surface: "#f3f6f7", elevated: "#ffffff", primary: "#225f77", accent: "#2fd8c2", text: "#22343a", muted: "#687982", border: "#dfe6e9", danger: "#c43f56", success: "#2f8065", warningSurface: "#fff5df", warningText: "#75551f", overlay: "rgba(16,29,36,0.62)", tabBar: "#ffffff" };
const dark: AppPalette = { background: "#101418", surface: "#181f25", elevated: "#202930", primary: "#48d2c0", accent: "#ec6090", text: "#ebeff1", muted: "#93a1a9", border: "#2c3941", danger: "#ff8fa3", success: "#78d8b0", warningSurface: "#34291d", warningText: "#f2cd86", overlay: "rgba(0,0,0,0.76)", tabBar: "#151c21" };

type StoredPreferences = { theme: ThemePreference; reduceMotionOverride: boolean | null; classReminders: boolean; reminderMinutes: number; dailyReminder: boolean; dailyHour: number };
const defaults: StoredPreferences = { theme: "system", reduceMotionOverride: null, classReminders: true, reminderMinutes: 60, dailyReminder: false, dailyHour: 8 };
const STORAGE_KEY = "dhanesh-yoga:preferences:v1";

type PreferencesValue = StoredPreferences & {
  colors: AppPalette; isDark: boolean; reduceMotion: boolean; ready: boolean;
  updatePreferences: (patch: Partial<StoredPreferences>) => Promise<void>;
};
const PreferencesContext = createContext<PreferencesValue | null>(null);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preferences, setPreferences] = useState(defaults);
  const [systemReduceMotion, setSystemReduceMotion] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value) setPreferences({ ...defaults, ...JSON.parse(value) as Partial<StoredPreferences> });
    }).catch(() => undefined).finally(() => setReady(true));
    void AccessibilityInfo.isReduceMotionEnabled().then(setSystemReduceMotion);
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", setSystemReduceMotion);
    return () => subscription.remove();
  }, []);

  const isDark = preferences.theme === "dark" || (preferences.theme === "system" && systemScheme === "dark");
  const colors = isDark ? dark : light;
  const reduceMotion = preferences.reduceMotionOverride ?? systemReduceMotion;

  useEffect(() => {
    Appearance.setColorScheme(preferences.theme === "system" ? "unspecified" : preferences.theme);
    void SystemUI.setBackgroundColorAsync(colors.background);
  }, [colors.background, preferences.theme]);

  const updatePreferences = useCallback(async (patch: Partial<StoredPreferences>) => {
    const next = { ...preferences, ...patch };
    setPreferences(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, [preferences]);

  const value = useMemo(() => ({ ...preferences, colors, isDark, reduceMotion, ready, updatePreferences }), [colors, isDark, preferences, ready, reduceMotion, updatePreferences]);
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePreferences() { const value = useContext(PreferencesContext); if (!value) throw new Error("usePreferences must be used inside PreferencesProvider"); return value; }
