'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeFirebase, type Auth, type Firestore, type FirebaseApp } from '@/lib/firebase';

interface FirebaseContextType {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
}

const FirebaseContext = createContext<FirebaseContextType>({
  app: null,
  auth: null,
  db: null,
});

export const FirebaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [firebase, setFirebase] = useState<FirebaseContextType>({ app: null, auth: null, db: null });

  useEffect(() => {
    // This effect runs only once on the client-side after the component mounts.
    const instances = initializeFirebase();
    if (instances) {
      setFirebase(instances);
    }
  }, []);

  return (
    <FirebaseContext.Provider value={firebase}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);
