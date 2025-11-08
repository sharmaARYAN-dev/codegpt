'use client';

import { useMemo, type ReactNode } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

import { firebaseConfig } from './config';
import { FirebaseProvider } from './provider';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const { app, db } = useMemo(() => {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    return { app, db };
  }, []);

  return (
    <FirebaseProvider app={app} db={db}>
      {children}
    </FirebaseProvider>
  );
}
