import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type NotificationRole = "student" | "trainer" | "admin";

type NotificationSummary = {
  count: number;
  items: string[];
  isLoading: boolean;
};

const emptySummary: NotificationSummary = { count: 0, items: [], isLoading: true };

/** Builds a live activity summary from records the current role can read. */
export const useNotificationCount = (role: NotificationRole, userId?: string): NotificationSummary => {
  const [summary, setSummary] = useState<NotificationSummary>(emptySummary);

  const refresh = useCallback(async () => {
    try {
      if (role === "admin") {
        const [contactResult, feedbackResult, trainerResult] = await Promise.all([
          supabase.from("contact_enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
          supabase.from("feedback").select("id", { count: "exact", head: true }).eq("status", "new"),
          supabase.from("trainer_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
        ]);
        const error = [contactResult.error, feedbackResult.error, trainerResult.error].find(Boolean);
        if (error) throw error;

        const contactCount = contactResult.count ?? 0;
        const feedbackCount = feedbackResult.count ?? 0;
        const trainerCount = trainerResult.count ?? 0;
        const items = [
          contactCount > 0 ? `${contactCount} new contact ${contactCount === 1 ? "enquiry" : "enquiries"}` : "",
          feedbackCount > 0 ? `${feedbackCount} new feedback ${feedbackCount === 1 ? "item" : "items"}` : "",
          trainerCount > 0 ? `${trainerCount} trainer ${trainerCount === 1 ? "application" : "applications"} awaiting review` : "",
        ].filter(Boolean);
        setSummary({ count: contactCount + feedbackCount + trainerCount, items, isLoading: false });
        return;
      }

      if (role === "trainer") {
        if (!userId) {
          setSummary({ count: 0, items: [], isLoading: false });
          return;
        }
        const result = await supabase
          .from("class_sessions")
          .select("id", { count: "exact", head: true })
          .eq("trainer_id", userId)
          .eq("status", "scheduled");
        if (result.error) throw result.error;
        const count = result.count ?? 0;
        setSummary({ count, items: count ? [`${count} scheduled ${count === 1 ? "class" : "classes"} assigned to you`] : [], isLoading: false });
        return;
      }

      const result = await supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .in("status", ["confirmed", "waitlisted"]);
      if (result.error) throw result.error;
      const count = result.count ?? 0;
      setSummary({ count, items: count ? [`${count} active ${count === 1 ? "booking" : "bookings"}`] : [], isLoading: false });
    } catch {
      // Notifications must never block a dashboard if a table is unavailable.
      setSummary((current) => ({ ...current, count: 0, items: [], isLoading: false }));
    }
  }, [role, userId]);

  useEffect(() => {
    void refresh();

    const tables = role === "admin"
      ? ["contact_enquiries", "feedback", "trainer_applications"]
      : role === "trainer"
        ? ["class_sessions"]
        : ["bookings"];
    const channel = supabase.channel(`notification-count:${role}:${userId ?? "anonymous"}`);
    tables.forEach((table) => {
      channel.on("postgres_changes", { event: "*", schema: "public", table }, () => void refresh());
    });
    channel.subscribe();

    const onFocus = () => void refresh();
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);
    const pollId = window.setInterval(() => void refresh(), 30_000);

    return () => {
      window.clearInterval(pollId);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      void supabase.removeChannel(channel);
    };
  }, [refresh, role, userId]);

  return summary;
};
