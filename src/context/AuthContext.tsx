'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import type { AppUser, UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirebase } from './FirebaseContext';

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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { auth, db } = useFirebase();
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // This function needs to run on the client, so we can't use the admin SDK here.
  // It checks if a 'users' collection exists and has any documents.
  const isFirstUserClient = async (): Promise<boolean> => {
      if (!db) return false;
      const userCountRef = doc(db, 'internal', 'user_count');
      const docSnap = await getDoc(userCountRef);
      return !docSnap.exists() || docSnap.data().count === 0;
  }

  useEffect(() => {
    if (!auth || !db) {
        // Firebase might not be initialized yet
        return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        
        const unsubSnapshot = onSnapshot(userRef, async (docSnap) => {
            if (docSnap.exists()) {
                const userProfile = docSnap.data() as UserProfile;
                setUser({ ...firebaseUser, ...userProfile });
            } else {
                const firstUser = await isFirstUserClient();
                const newUserProfile: UserProfile = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    role: firstUser ? 'admin' : 'user',
                };
                await setDoc(userRef, newUserProfile);
                // Also update the count
                const userCountRef = doc(db, 'internal', 'user_count');
                const countSnap = await getDoc(userCountRef);
                const currentCount = countSnap.exists() ? countSnap.data().count : 0;
                await setDoc(userCountRef, { count: currentCount + 1 }, { merge: true });

                setUser({ ...firebaseUser, ...newUserProfile });
            }
            setLoading(false);
        });

        return () => unsubSnapshot();

      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const signOut = async () => {
    if (auth) {
        await firebaseSignOut(auth);
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
