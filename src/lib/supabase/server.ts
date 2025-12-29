import 'server-only';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function getSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase server client: Missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_ANON_KEY/NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }

  const cookieStore = cookies();

  return createServerClient(supabaseUrl || '', supabaseAnonKey || '', {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components may not allow setting cookies; ignore.
        }
      },
    },
  });
}

