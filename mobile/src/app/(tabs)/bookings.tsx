import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { BookingsTab } from "../../../App";
import { MobileFrame } from "../../components/MobileFrame";
import { cancelBooking, friendlyError, getBookings, type Booking } from "../../lib/studioApi";
import { cancelClassReminder } from "../../lib/notifications";
import { LoadingState } from "../../components/LoadingState";

export default function BookingsRoute() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    try { setError(""); setBookings(await getBookings()); }
    catch (e) { setError(friendlyError(e)); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  const cancel = async (id: string) => {
    if (cancelingId) return;
    setCancelingId(id);
    try { await cancelBooking(id); await cancelClassReminder(id).catch(() => undefined); await load(); }
    catch (e) { await load(); Alert.alert("Could not confirm the cancellation", friendlyError(e)); }
    finally { setCancelingId(null); }
  };
  const confirmCancel = (id: string) => Alert.alert("Cancel this booking?", "Your reserved place will be released and its reminder removed.", [{ text: "Keep booking", style: "cancel" }, { text: "Cancel booking", style: "destructive", onPress: () => void cancel(id) }]);
  return <MobileFrame title="My bookings">{loading ? <LoadingState message="Finding your bookings…" /> : <BookingsTab bookings={bookings} error={error} refreshing={refreshing} cancelingId={cancelingId} onCancel={confirmCancel} onRefresh={() => void load(true)} />}</MobileFrame>;
}
