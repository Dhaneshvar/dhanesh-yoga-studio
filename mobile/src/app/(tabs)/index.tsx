import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { HomeTab } from "../../../App";
import { useAuth } from "../../contexts/AuthContext";
import { friendlyError, getPrograms, getSessions, type Program, type ClassSession } from "../../lib/studioApi";
import { MobileFrame } from "../../components/MobileFrame";
import { LoadingState } from "../../components/LoadingState";

export default function HomeRoute() {
  const router = useRouter();
  const { profile } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true); else setLoading(true);
    setError("");
    const results = await Promise.allSettled([getPrograms(), getSessions()]);
    const [programResult, sessionResult] = results;
    if (programResult.status === "fulfilled") setPrograms(programResult.value);
    if (sessionResult.status === "fulfilled") setSessions(sessionResult.value);
    const failure = results.find((result) => result.status === "rejected");
    if (failure?.status === "rejected") setError(friendlyError(failure.reason));
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { void load(); }, [load]);
  const navigate = (tab: "home" | "programs" | "schedule" | "bookings" | "profile") => { if (tab !== "home") router.push(`/(tabs)/${tab}` as never); };
  return <MobileFrame title="Your practice">{loading ? <LoadingState /> : <HomeTab profile={profile} programs={programs} sessions={sessions} error={error} refreshing={refreshing} onRefresh={() => void load(true)} onNavigate={navigate} onOpenAsanas={() => router.push("/asanas")} onOpenTrainers={() => router.push("/trainers")} />}</MobileFrame>;
}
