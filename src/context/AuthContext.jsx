import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ============================================================
     Load profile from profiles table
     ============================================================ */
  async function loadProfile(userId) {
    if (!userId) {
      setProfile(null);
      return;
    }
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.warn("loadProfile error:", error);
      setProfile(null);
      return;
    }
    setProfile(data);
  }

  /* ============================================================
     Check if user is admin
     ============================================================ */
  async function checkAdmin(userId) {
    if (!userId) {
      setIsAdmin(false);
      return;
    }
    const { data, error } = await supabase
      .from("admin_users")
      .select("id, role")
      .eq("id", userId)
      .maybeSingle();

    setIsAdmin(!!data && !error);
  }

  /* ============================================================
     On mount — load session
     ============================================================ */
  useEffect(() => {
    let mounted = true;

    async function init() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      const sessionUser = data.session?.user || null;
      setUser(sessionUser);

      if (sessionUser) {
        await Promise.all([
          loadProfile(sessionUser.id),
          checkAdmin(sessionUser.id),
        ]);
      }
      setLoading(false);
    }

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;
        const sessionUser = session?.user || null;
        setUser(sessionUser);

        if (sessionUser) {
          await Promise.all([
            loadProfile(sessionUser.id),
            checkAdmin(sessionUser.id),
          ]);
        } else {
          setProfile(null);
          setIsAdmin(false);
        }
      }
    );

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  /* ============================================================
     Sign Up (customer)
     ============================================================ */
  const signUp = async ({ email, password, name, phone }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone },
      },
    });

    if (error) throw error;

    // Create profile row (if session exists)
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email,
        name: name || "",
        phone: phone || "",
      });
    }

    return data;
  };

  /* ============================================================
     Sign In
     ============================================================ */
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  /* ============================================================
     Sign Out
     ============================================================ */
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
  };

  /* ============================================================
     Forgot Password
     ============================================================ */
  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  /* ============================================================
     Update Password (from reset link)
     ============================================================ */
  const updatePassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  };

  /* ============================================================
     Update Profile
     ============================================================ */
  const updateProfile = async (updates) => {
    if (!user) throw new Error("Not signed in");

    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, ...updates });

    if (error) throw error;
    setProfile((p) => ({ ...p, ...updates }));
  };

  /* ============================================================
     Refresh profile (manual)
     ============================================================ */
  const refreshProfile = async () => {
    if (!user) return;
    await loadProfile(user.id);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}