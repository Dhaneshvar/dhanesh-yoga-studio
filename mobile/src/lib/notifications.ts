import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import type * as ExpoNotifications from "expo-notifications";
import { Platform } from "react-native";
import type { Booking, ClassSession } from "./studioApi";

const CHANNEL_ID = "practice-reminders";
const DAILY_ID_KEY = "dhanesh-yoga:daily-notification-id";
let cachedNotifications: typeof ExpoNotifications | null | undefined;
let handlerConfigured = false;

function getNotifications() {
  if (cachedNotifications !== undefined) return cachedNotifications;
  if (__DEV__ || Constants.appOwnership === "expo" || String(Constants.executionEnvironment) === "storeClient") {
    cachedNotifications = null;
    return cachedNotifications;
  }
  try {
    // Expo Go does not always bundle every notifications native module. Keeping
    // this lazy lets the rest of the app run; standalone builds load it normally.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    cachedNotifications = require("expo-notifications") as typeof ExpoNotifications;
  } catch {
    cachedNotifications = null;
  }
  return cachedNotifications;
}

export type AppNotificationResponse = ExpoNotifications.NotificationResponse;

export function getLastNotificationResponse() { return getNotifications()?.getLastNotificationResponse() ?? null; }
export function clearLastNotificationResponse() { getNotifications()?.clearLastNotificationResponse(); }
export function addNotificationResponseListener(listener: (response: AppNotificationResponse) => void) {
  return getNotifications()?.addNotificationResponseReceivedListener(listener) ?? { remove: () => undefined };
}

export async function prepareNotifications() {
  const Notifications = getNotifications();
  if (!Notifications) return;
  if (!handlerConfigured) {
    Notifications.setNotificationHandler({ handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }) });
    handlerConfigured = true;
  }
  if (Platform.OS === "android") await Notifications.setNotificationChannelAsync(CHANNEL_ID, { name: "Practice reminders", description: "Class and personal practice reminders", importance: Notifications.AndroidImportance.DEFAULT, vibrationPattern: [0, 180, 120, 180], lightColor: "#2FD8C2" });
}

export async function requestNotificationPermission() {
  const Notifications = getNotifications();
  if (!Notifications) return false;
  await prepareNotifications();
  const current = await Notifications.getPermissionsAsync();
  if (isNotificationAllowed(current)) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return isNotificationAllowed(requested);
}

function isNotificationAllowed(status: ExpoNotifications.NotificationPermissionsStatus) {
  const Notifications = getNotifications();
  if (!Notifications) return false;
  return status.granted || (Platform.OS === "ios" && status.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL);
}

export async function getNotificationPermission() { const Notifications = getNotifications(); return Notifications ? isNotificationAllowed(await Notifications.getPermissionsAsync()) : false; }

export async function scheduleClassReminder(session: ClassSession, bookingId: string, minutesBefore: number) {
  const Notifications = getNotifications();
  if (!Notifications) return false;
  const date = new Date(new Date(session.starts_at).getTime() - minutesBefore * 60_000);
  if (date.getTime() <= Date.now()) return false;
  await Notifications.scheduleNotificationAsync({ identifier: `class-${bookingId}`, content: { title: "Your yoga class is coming up", body: `Your reserved class begins ${minutesBefore >= 60 ? `in ${Math.round(minutesBefore / 60)} hour${minutesBefore >= 120 ? "s" : ""}` : `in ${minutesBefore} minutes`}. Open Dhanesh Yoga for the details.`, sound: "default", data: { route: "/(tabs)/bookings", bookingId }, threadIdentifier: "class-reminders" }, trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date, channelId: CHANNEL_ID } });
  return true;
}

export async function cancelClassReminder(bookingId: string) { const Notifications = getNotifications(); if (Notifications) await Notifications.cancelScheduledNotificationAsync(`class-${bookingId}`); }

export async function clearPracticeReminders() {
  const Notifications = getNotifications();
  if (!Notifications) return;
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(scheduled.filter((item) => item.identifier.startsWith("class-")).map((item) => Notifications.cancelScheduledNotificationAsync(item.identifier)));
  const dailyIdentifier = await AsyncStorage.getItem(DAILY_ID_KEY);
  if (dailyIdentifier) await Notifications.cancelScheduledNotificationAsync(dailyIdentifier).catch(() => undefined);
  await AsyncStorage.removeItem(DAILY_ID_KEY);
}

export async function syncBookingReminders(bookings: Booking[], enabled: boolean, minutesBefore: number) {
  const Notifications = getNotifications();
  if (!Notifications) return;
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(scheduled.filter((item) => item.identifier.startsWith("class-")).map((item) => Notifications.cancelScheduledNotificationAsync(item.identifier)));
  if (!enabled) return;
  await Promise.all(bookings.filter((booking) => booking.status !== "cancelled" && booking.class_session && new Date(booking.class_session.starts_at).getTime() > Date.now()).map((booking) => scheduleClassReminder(booking.class_session!, booking.id, minutesBefore)));
}

export async function syncDailyPracticeReminder(enabled: boolean, hour: number) {
  const Notifications = getNotifications();
  if (!Notifications) return;
  const previous = await AsyncStorage.getItem(DAILY_ID_KEY);
  if (previous) { await Notifications.cancelScheduledNotificationAsync(previous).catch(() => undefined); await AsyncStorage.removeItem(DAILY_ID_KEY); }
  if (!enabled) return;
  const identifier = await Notifications.scheduleNotificationAsync({ content: { title: "A little space for yourself", body: "Pause, breathe, and return to your yoga practice when you are ready.", sound: "default", data: { route: "/(tabs)" }, threadIdentifier: "daily-practice" }, trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute: 0, channelId: CHANNEL_ID } });
  await AsyncStorage.setItem(DAILY_ID_KEY, identifier);
}

export async function sendTestNotification() { const Notifications = getNotifications(); if (!Notifications) throw new Error("Notifications need a standalone app build on this device."); await Notifications.scheduleNotificationAsync({ content: { title: "Dhanesh Yoga reminders are ready", body: "We will gently remind you about your practice and reserved classes.", sound: "default", data: { route: "/settings" } }, trigger: null }); }
