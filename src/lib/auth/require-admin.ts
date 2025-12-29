import 'server-only';

import { getSupabaseServerClient } from '@/lib/supabase/server';
import type { AppUser } from '@/lib/types';

function mapSupabaseUserToAppUser(supaUser: any): AppUser {
  return {
    id: supaUser.id,
    email: supaUser.email ?? null,
    displayName: supaUser.user_metadata?.displayName ?? null,
    role: (supaUser.app_metadata?.role as AppUser['role']) || 'user',
    locale: supaUser.user_metadata?.locale ?? 'ng',
    metadata: {
      app_metadata: supaUser.app_metadata,
      user_metadata: supaUser.user_metadata,
    },
  };
}

export async function getServerUser(): Promise<AppUser | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return null;
  return mapSupabaseUserToAppUser(data.user);
}

export async function requireAdmin(): Promise<AppUser | null> {
  const user = await getServerUser();
  if (!user || user.role !== 'admin') return null;
  return user;
}

export async function assertAdmin(): Promise<AppUser> {
  const user = await requireAdmin();
  if (!user) throw new Error('Unauthorized: admin access required.');
  return user;
}

