import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Alert, Linking } from "react-native";
import type { Session, User } from "@supabase/supabase-js";
import { acceptAuthDeepLink, supabase } from "../lib/supabase";
import { getProfile, withRequestTimeout, type Profile } from "../lib/studioApi";
import { clearPracticeReminders } from "../lib/notifications";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, accountType: "practitioner" | "instructor") => Promise<boolean>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (user: User | null) => {
    if (!user) { setProfile(null); return; }
    try { setProfile(await getProfile(user.id)); } catch { setProfile(null); }
  };

  useEffect(() => {
    void (async () => {
      try {
        const { data } = await withRequestTimeout(supabase.auth.getSession());
        setSession(data.session);
        await loadProfile(data.session?.user ?? null);
      } catch {
        // A transient storage problem must never leave the app on its splash screen.
        setSession(null);
        setProfile(null);
      } finally { setLoading(false); }
    })();
    const { data: listener } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      if (event === "SIGNED_OUT") { setProfile(null); void clearPracticeReminders().catch(() => undefined); }
      else if (nextSession?.user) void loadProfile(nextSession.user);
    });
    const openAuthLink = async (url: string) => { try { await acceptAuthDeepLink(url); } catch { Alert.alert("This link could not be opened", "The sign-in or password-reset link may have expired. Please request a new one."); } };
    const deepLinkListener = Linking.addEventListener("url", ({ url }) => { void openAuthLink(url); });
    void Linking.getInitialURL().then((url) => { if (url) return openAuthLink(url); }).catch(() => undefined);
    return () => { listener.subscription.unsubscribe(); deepLinkListener.remove(); };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    session, user: session?.user ?? null, profile, loading,
    signIn: async (email, password) => { const { error } = await withRequestTimeout(supabase.auth.signInWithPassword({ email: email.trim(), password }), 20_000); if (error) throw error; },
    signUp: async (email, password, fullName, accountType) => { const { data, error } = await withRequestTimeout(supabase.auth.signUp({ email: email.trim(), password, options: { data: { full_name: fullName.trim(), account_type: accountType } } }), 20_000); if (error) throw error; return Boolean(data.session); },
    signOut: async () => { const { error } = await withRequestTimeout(supabase.auth.signOut()); if (error) throw error; },
    refreshProfile: async () => { await loadProfile(session?.user ?? null); },
  }), [loading, profile, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error("useAuth must be used inside AuthProvider"); return value; }
