'use client';

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuth as useFirebaseAuth, useFirestore } from "@/firebase";
import type { StudentProfile } from "@/lib/types";

interface AuthContextType {
  user: StudentProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = useFirebaseAuth();
  const db = useFirestore();

  useEffect(() => {
    if (!auth || !db) {
      // Firebase might not be initialized yet
      setLoading(true);
      return;
    };

    const unsubscribeFromAuth = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        
        const unsubscribeFromFirestore = onSnapshot(userRef, (snap) => {
          if (snap.exists()) {
            setUser({ id: snap.id, ...snap.data() } as StudentProfile);
          } else {
            // This case should be handled during registration.
            // If a profile doesn't exist for a logged-in user, there might be an issue.
            // For now, we'll treat them as logged out.
            setUser(null);
          }
          setLoading(false);
        }, (error) => {
            console.error("Error listening to user document:", error);
            setUser(null);
            setLoading(false);
        });

        return () => unsubscribeFromFirestore();

      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribeFromAuth();
  }, [auth, db]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
