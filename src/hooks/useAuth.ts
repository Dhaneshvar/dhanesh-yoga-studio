import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type UserRole = "student" | "trainer" | "admin";

export interface StudioUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
}

interface AuthState {
  user: StudioUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const emptyState: AuthState = { user: null, isAuthenticated: false, isLoading: true };

const getProfile = async (id: string, email: string): Promise<StudioUser> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, phone, role")
    .eq("id", id)
    .single();

  if (error) throw error;
  return {
    id: data.id,
    name: data.full_name || email.split("@")[0],
    email,
    phone: data.phone,
    role: data.role as UserRole,
  };
};

/** Supabase-backed authentication. No credentials, roles or sessions live in browser storage. */
export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(emptyState);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!active) return;
      if (!session?.user) {
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }
      try {
        const user = await getProfile(session.user.id, session.user.email ?? "");
        if (active) setAuthState({ user, isAuthenticated: true, isLoading: false });
      } catch {
        if (active) setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      }
    };

    void load();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        if (active) setAuthState({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }
      void getProfile(session.user.id, session.user.email ?? "")
        .then((user) => active && setAuthState({ user, isAuthenticated: true, isLoading: false }))
        .catch(() => active && setAuthState({ user: null, isAuthenticated: false, isLoading: false }));
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const register = useCallback(async (name: string, email: string, phone: string, password: string, confirmPassword: string) => {
    if (!name.trim() || !email.trim() || !password) return { success: false, error: "Name, email and password are required" };
    if (password.length < 8) return { success: false, error: "Password must be at least 8 characters" };
    if (password !== confirmPassword) return { success: false, error: "Passwords do not match" };
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(), password,
      options: { data: { full_name: name.trim(), phone: phone.trim() }, emailRedirectTo: `${window.location.origin}/login` },
    });
    if (error) return { success: false, error: error.message };
    return { success: true, needsEmailConfirmation: !data.session };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    return error ? { success: false, error: error.message } : { success: true };
  }, []);

  const logout = useCallback(async () => { await supabase.auth.signOut(); }, []);

  return { ...authState, register, login, logout };
};
