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
import { fetchMfaStatus, type MfaStatus } from '../../lib/adminApi';
import type { AdminProfile } from '../../lib/adminRoles';

export type AdminAuthPhase = 'loading' | 'signed_out' | 'needs_mfa' | 'ready';

type AdminAuthContextValue = {
  loading: boolean;
  profile: AdminProfile | null;
  mfa: MfaStatus | null;
  phase: AdminAuthPhase;
  isAuthenticated: boolean;
  hasPasswordSession: boolean;
  refreshAuth: () => Promise<AdminAuthPhase>;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null; phase: AdminAuthPhase; profile: AdminProfile | null }>;
  signOut: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

function phaseFrom(profile: AdminProfile | null, mfa: MfaStatus | null): AdminAuthPhase {
  if (!profile) return 'signed_out';
  if (!mfa) return 'needs_mfa';
  if (mfa.mfa_verified) return 'ready';
  return 'needs_mfa';
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [mfa, setMfa] = useState<MfaStatus | null>(null);

  const refreshAuth = useCallback(async (): Promise<AdminAuthPhase> => {
    if (!isSupabaseConfigured || !supabase) {
      setProfile(null);
      setMfa(null);
      return 'signed_out';
    }

    const nextProfile = await fetchOwnAdminProfile();
    if (!nextProfile) {
      setProfile(null);
      setMfa(null);
      return 'signed_out';
    }
    if (!nextProfile.is_active) {
      await signOutAdmin();
      setProfile(null);
      setMfa(null);
      return 'signed_out';
    }

    setProfile(nextProfile);
    const status = await fetchMfaStatus();
    if (status.error || !status.data) {
      setMfa({
        mfa_verified: false,
        needs_enroll: false,
        can_use_email: true,
      });
      return 'needs_mfa';
    }
    setMfa(status.data);
    return phaseFrom(nextProfile, status.data);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      setLoading(true);
      await refreshAuth();
      if (!cancelled) setLoading(false);
    };

    void boot();

    if (!supabase) return;

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      void (async () => {
        await refreshAuth();
        if (!cancelled) setLoading(false);
      })();
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [refreshAuth]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const result = await signInAdmin(email, password);
      if (result.error || !result.profile) {
        return { error: result.error ?? 'Sign in failed', phase: 'signed_out' as const, profile: null };
      }
      setProfile(result.profile);
      const nextPhase = await refreshAuth();
      return { error: null, phase: nextPhase, profile: result.profile };
    },
    [refreshAuth],
  );

  const signOut = useCallback(async () => {
    await signOutAdmin();
    setProfile(null);
    setMfa(null);
  }, []);

  const phase = phaseFrom(profile, mfa);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      loading,
      profile,
      mfa,
      phase,
      isAuthenticated: phase === 'ready',
      hasPasswordSession: Boolean(profile),
      refreshAuth,
      signIn,
      signOut,
    }),
    [loading, profile, mfa, phase, refreshAuth, signIn, signOut],
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
