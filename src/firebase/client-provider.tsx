'use client';
import {
  FirebaseProvider,
  initializeFirebase,
} from '@/firebase';
import { useMemo } from 'react';

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const firebaseApp = useMemo(() => initializeFirebase(), []);

  return (
    <FirebaseProvider
      firebaseApp={firebaseApp.app}
      auth={firebaseApp.auth}
      firestore={firebaseApp.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
