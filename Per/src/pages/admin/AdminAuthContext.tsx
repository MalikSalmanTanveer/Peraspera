import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import {
  fetchOwnAdminProfile,
  signInAdmin,
  signOutAdmin,
} from '../../lib/adminAuth';
import type { AdminProfile } from '../../lib/adminRoles';

type AdminAuthContextValue = {
  loading: boolean;
  profile: AdminProfile | null;
  isAuthenticated: boolean;
  refreshProfile: () => Promise<void>;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null; profile: AdminProfile | null }>;
  signOut: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<AdminProfile | null>(null);

  const refreshProfile = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setProfile(null);
      return;
    }
    const next = await fetchOwnAdminProfile();
    if (next && !next.is_active) {
      await signOutAdmin();
      setProfile(null);
      return;
    }
    setProfile(next);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      setLoading(true);
      if (!isSupabaseConfigured || !supabase) {
        if (!cancelled) {
          setProfile(null);
          setLoading(false);
        }
        return;
      }

      await refreshProfile();
      if (!cancelled) setLoading(false);
    };

    void boot();

    if (!supabase) return;

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      void (async () => {
        await refreshProfile();
        if (!cancelled) setLoading(false);
      })();
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [refreshProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await signInAdmin(email, password);
    if (result.error) return { error: result.error, profile: null };
    setProfile(result.profile);
    return { error: null, profile: result.profile };
  }, []);

  const signOut = useCallback(async () => {
    await signOutAdmin();
    setProfile(null);
  }, []);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      loading,
      profile,
      isAuthenticated: Boolean(profile),
      refreshProfile,
      signIn,
      signOut,
    }),
    [loading, profile, refreshProfile, signIn, signOut],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return ctx;
}
