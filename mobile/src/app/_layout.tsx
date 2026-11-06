import { router, Stack } from "expo-router";
import { useEffect } from "react";
import { AuthProvider } from "../contexts/AuthContext";
import { useAuth } from "../contexts/AuthContext";
import { PreferencesProvider, usePreferences } from "../contexts/PreferencesContext";
import { addNotificationResponseListener, clearLastNotificationResponse, getLastNotificationResponse, prepareNotifications, type AppNotificationResponse } from "../lib/notifications";
import { Splash } from "../../App";

function NavigationRoot() {
  const { colors, reduceMotion } = usePreferences();
  const { session, loading } = useAuth();
  useEffect(() => {
    void prepareNotifications();
    const open = (response: AppNotificationResponse | null) => {
      const route = response?.notification.request.content.data?.route;
      const allowedRoutes = new Set(["/(tabs)", "/(tabs)/bookings", "/settings"]);
      if (typeof route === "string" && allowedRoutes.has(route)) {
        clearLastNotificationResponse();
        router.push(route as never);
      }
    };
    open(getLastNotificationResponse());
    const listener = addNotificationResponseListener(open);
    return () => listener.remove();
  }, []);
  if (loading) return <Splash />;
  return <Stack screenOptions={{ headerShown: false, animation: reduceMotion ? "none" : "fade_from_bottom", contentStyle: { backgroundColor: colors.background } }}>
    <Stack.Screen name="index" />
    <Stack.Screen name="privacy" />
    <Stack.Screen name="reset-password" />
    <Stack.Protected guard={!session}>
      <Stack.Screen name="auth" />
      <Stack.Screen name="forgot-password" />
    </Stack.Protected>
    <Stack.Protected guard={Boolean(session)} redirectTo="/auth">
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="asanas" />
      <Stack.Screen name="trainers" />
      <Stack.Screen name="contact" />
    </Stack.Protected>
  </Stack>;
}

export default function RootLayout() {
  return <PreferencesProvider><AuthProvider><NavigationRoot /></AuthProvider></PreferencesProvider>;
}
