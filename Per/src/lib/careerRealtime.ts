import { supabase } from './supabase';

export const CAREER_APPLICATIONS_CHANNEL = 'career-applications';
export const CAREER_APPLICATIONS_EVENT = 'new';

export type ApplicationSignal = {
  id?: string;
  job_id?: string;
  candidate_name?: string;
  is_duplicate?: boolean;
  created_at?: string;
};

/** Live signal when a new application is inserted (DB trigger → Realtime broadcast). */
export function subscribeCareerApplicationSignals(
  onSignal: (payload: ApplicationSignal) => void,
): () => void {
  if (!supabase) return () => {};

  const channel = supabase
    .channel(CAREER_APPLICATIONS_CHANNEL)
    .on('broadcast', { event: CAREER_APPLICATIONS_EVENT }, ({ payload }) => {
      onSignal((payload ?? {}) as ApplicationSignal);
    })
    .subscribe();

  return () => {
    void supabase?.removeChannel(channel);
  };
}

/** @deprecated DB trigger broadcasts on insert — client emit is optional */
export async function broadcastCareerApplicationSubmitted(_signal: ApplicationSignal = {}) {
  // No-op: career_applications insert trigger publishes to Realtime.
}
