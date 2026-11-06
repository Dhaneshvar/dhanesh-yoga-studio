import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { ScheduleTab } from "../../../App";
import { MobileFrame } from "../../components/MobileFrame";
import { bookSession, friendlyError, getBookings, getSessions, isUncertainNetworkError, type ClassSession } from "../../lib/studioApi";
import { usePreferences } from "../../contexts/PreferencesContext";
import { requestNotificationPermission, scheduleClassReminder } from "../../lib/notifications";
import { LoadingState } from "../../components/LoadingState";

export default function ScheduleRoute() {
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const preferences = usePreferences();
  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    try { setError(""); setSessions(await getSessions()); }
    catch (e) { setError(friendlyError(e)); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  const scheduleReminderInBackground = (session: ClassSession, id: string) => { void (async () => { try { const allowed = await requestNotificationPermission(); if (allowed) await scheduleClassReminder(session, id, preferences.reminderMinutes); } catch { /* Booking remains valid even when a device reminder cannot be set. */ } })(); };
  const book = async (id: string) => {
    if (bookingId) return;
    setBookingId(id);
    try {
      const booking = await bookSession(id);
      const session = sessions.find((item) => item.id === id);
      if (preferences.classReminders && session) scheduleReminderInBackground(session, booking.id);
      Alert.alert(booking.status === "waitlisted" ? "You’re on the waitlist" : "You’re booked", booking.status === "waitlisted" ? "We’ll keep your place in line." : preferences.classReminders ? "Your place is reserved. We’ll set your reminder in the background." : "Your place has been reserved.");
      router.push("/(tabs)/bookings");
    } catch (e) {
      if (isUncertainNetworkError(e)) {
        try {
          const booking = (await getBookings()).find((item) => item.class_session?.id === id && item.status !== "cancelled");
          if (booking) { Alert.alert("Your booking is confirmed", "The connection dropped after we received your request, but your booking is safely recorded."); router.push("/(tabs)/bookings"); return; }
        } catch { /* The user receives the safer uncertainty message below. */ }
      }
      Alert.alert("Could not book this class", friendlyError(e));
      await load(true);
    } finally { setBookingId(null); }
  };
  return <MobileFrame title="Class schedule">{loading ? <LoadingState message="Opening the live schedule…" /> : <ScheduleTab sessions={sessions} error={error} bookingId={bookingId} refreshing={refreshing} onBook={(id) => void book(id)} onRefresh={() => void load(true)} />}</MobileFrame>;
}
