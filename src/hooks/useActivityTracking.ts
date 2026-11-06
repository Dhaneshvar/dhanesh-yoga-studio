import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

/** Records aggregate engagement only: visits, page views and last-active time. */
export const useActivityTracking = () => {
  const location = useLocation();
  const lastRecorded = useRef(0);

  useEffect(() => {
    const now = Date.now();
    if (now - lastRecorded.current < 15_000) return;
    lastRecorded.current = now;
    void (async () => {
      try {
        // Supabase query builders are awaitable, but are not native Promises.
        // Keep telemetry non-blocking and make a failed analytics call harmless.
        await supabase.rpc("record_my_activity");
      } catch {
        // Analytics must never interfere with navigation or the studio workflow.
      }
    })();
  }, [location.pathname]);
};
