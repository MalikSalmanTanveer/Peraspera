import { supabase, isSupabaseConfigured } from './supabase';
import type { AdminProfile } from './adminRoles';

const PROFILE_SELECT = 'id, username, role, is_active, created_at, updated_at';

export async function signInAdmin(
  email: string,
  password: string,
): Promise<{ error: string | null; profile: AdminProfile | null }> {
  if (!supabase || !isSupabaseConfigured) {
    return { error: 'Supabase is not configured', profile: null };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) {
    return { error: error.message, profile: null };
  }

  if (!data.user) {
    return { error: 'Incorrect email or password', profile: null };
  }

  const profile = await fetchOwnAdminProfile();
  if (!profile) {
    await supabase.auth.signOut();
    return { error: 'No admin profile found for this account', profile: null };
  }

  if (!profile.is_active) {
    await supabase.auth.signOut();
    return {
      error: 'This account is disabled. Contact a Super Admin.',
      profile: null,
    };
  }

  return { error: null, profile };
}

export async function signOutAdmin(opts?: { scope?: 'local' | 'global' }): Promise<void> {
  if (!supabase) return;
  // Default local: MFA deny on web must not revoke the phone app session.
  await supabase.auth.signOut({ scope: opts?.scope ?? 'local' });
}

export async function requestAdminPasswordReset(
  email: string,
): Promise<{ error: string | null }> {
  if (!supabase || !isSupabaseConfigured) {
    return { error: 'Supabase is not configured' };
  }

  const redirectTo = `${window.location.origin}/admin/reset-password`;
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo,
  });

  if (error) return { error: error.message };
  return { error: null };
}

export async function updateAdminPassword(
  password: string,
): Promise<{ error: string | null }> {
  if (!supabase || !isSupabaseConfigured) {
    return { error: 'Supabase is not configured' };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  return { error: null };
}

export async function fetchOwnAdminProfile(): Promise<AdminProfile | null> {
  if (!supabase) return null;

  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session?.user) return null;

  const { data, error } = await supabase
    .from('admin_profiles')
    .select(PROFILE_SELECT)
    .eq('id', sessionData.session.user.id)
    .maybeSingle();

  if (error || !data) return null;
  return data as AdminProfile;
}

export async function getAdminSessionUserId(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id ?? null;
}

export async function getAdminAccessToken(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}
