import { Redirect, Tabs } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { usePreferences } from "../../contexts/PreferencesContext";
import { getBookings } from "../../lib/studioApi";
import { getNotificationPermission, syncBookingReminders, syncDailyPracticeReminder } from "../../lib/notifications";

export default function TabLayout() {
  const { session, loading } = useAuth();
  const preferences = usePreferences();
  const { colors } = preferences;
  useEffect(() => {
    if (!session?.user || !preferences.ready) return;
    void (async () => {
      try {
        if (!await getNotificationPermission()) return;
        const bookings = await getBookings();
        await syncBookingReminders(bookings, preferences.classReminders, preferences.reminderMinutes);
        await syncDailyPracticeReminder(preferences.dailyReminder, preferences.dailyHour);
      } catch { /* Reminder recovery is best-effort and must not block the app. */ }
    })();
  }, [preferences.classReminders, preferences.dailyHour, preferences.dailyReminder, preferences.ready, preferences.reminderMinutes, session?.user]);
  if (loading) return null;
  if (!session) return <Redirect href="/auth" />;
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.muted, tabBarStyle: { backgroundColor: colors.tabBar, borderTopColor: colors.border }, sceneStyle: { backgroundColor: colors.background } }}>
    <Tabs.Screen name="index" options={{ title: "Home", tabBarLabel: "Home" }} />
    <Tabs.Screen name="programs" options={{ title: "Programmes", tabBarLabel: "Programmes" }} />
    <Tabs.Screen name="schedule" options={{ title: "Schedule", tabBarLabel: "Schedule" }} />
    <Tabs.Screen name="bookings" options={{ title: "Bookings", tabBarLabel: "Bookings" }} />
    <Tabs.Screen name="profile" options={{ title: "Account", tabBarLabel: "Account" }} />
  </Tabs>;
}
