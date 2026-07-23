import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export type QuoteInquiryInsert = {
  full_name: string | null;
  company: string | null;
  email: string;
  service: string;
  details: string;
};

export type QuoteInquiry = QuoteInquiryInsert & {
  id: string;
  created_at: string;
};

function createSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) {
    return null;
  }

  return createClient(supabaseUrl!, supabaseAnonKey!);
}

export const supabase = createSupabaseClient();

export async function submitQuoteInquiry(
  inquiry: QuoteInquiryInsert,
): Promise<{ error: string | null }> {
  if (!supabase) {
    return {
      error:
        'Quote form is not connected yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.',
    };
  }

  const { error } = await supabase.from('quote_inquiries').insert(inquiry);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
