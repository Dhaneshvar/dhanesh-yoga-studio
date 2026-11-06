import { useCallback, useEffect, useState } from "react";
import { ProgramsTab } from "../../../App";
import { MobileFrame } from "../../components/MobileFrame";
import { friendlyError, getPrograms, type Program } from "../../lib/studioApi";
import { LoadingState } from "../../components/LoadingState";

export default function ProgramsRoute() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    try { setError(""); setPrograms(await getPrograms()); }
    catch (e) { setError(friendlyError(e)); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  return <MobileFrame title="Programmes">{loading ? <LoadingState message="Gathering live programmes…" /> : <ProgramsTab programs={programs} error={error} refreshing={refreshing} onRefresh={() => void load(true)} />}</MobileFrame>;
}
