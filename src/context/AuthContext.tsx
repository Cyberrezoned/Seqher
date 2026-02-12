'use client';

import React, { createContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser';
import type { AppUser } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
});

function mapSupabaseUser(supaUser: User | null): AppUser | null {
  if (!supaUser) return null;
  const role = (supaUser.app_metadata?.role as AppUser['role']) || 'user';
  return {
    id: supaUser.id,
    email: supaUser.email ?? null,
    displayName: (supaUser.user_metadata as any)?.displayName ?? null,
    role,
    locale: (supaUser.user_metadata as any)?.locale ?? 'ng',
    metadata: {
      app_metadata: supaUser.app_metadata,
      user_metadata: supaUser.user_metadata,
    },
  };
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const supabase = getSupabaseBrowserClient();

    const hydrateFromSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!mounted) return;
        setUser(mapSupabaseUser(data.session?.user ?? null));
      } catch (error) {
        console.error('Supabase session bootstrap failed. Continuing as signed-out user.', error);
        try {
          await supabase.auth.signOut({ scope: 'local' });
        } catch (signOutError) {
          console.warn('Supabase local sign-out after bootstrap failure also failed.', signOutError);
        }
        if (!mounted) return;
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    hydrateFromSession();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session: Session | null) => {
      if (!mounted) return;
      setUser(mapSupabaseUser(session?.user ?? null));
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    const supabase = getSupabaseBrowserClient();
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Supabase sign-out failed.', error);
      await supabase.auth.signOut({ scope: 'local' });
    }
  };

  const isAdmin = user?.role === 'admin';
  
  if (loading) {
    return (
        <div className="w-full h-screen flex flex-col">
            <header className="border-b">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Skeleton className="h-8 w-24" />
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>
            </header>
            <div className="flex-grow container mx-auto p-4">
                <Skeleton className="h-64 w-full" />
                <div className="mt-8 grid md:grid-cols-3 gap-8">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
