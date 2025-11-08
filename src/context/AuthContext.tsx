'use client';

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
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
    if (!auth || !db) return;

    const unsubscribeFromAuth = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        
        // Use onSnapshot for real-time updates
        const unsubscribeFromFirestore = onSnapshot(userRef, async (snap) => {
          if (snap.exists()) {
            setUser({ id: snap.id, ...snap.data() } as StudentProfile);
          } else {
            // Create new user profile if it doesn't exist
            const newUserProfile: Omit<StudentProfile, 'id' | 'createdAt' | 'updatedAt' | 'level' | 'xp'> = {
              displayName: firebaseUser.displayName || 'New User',
              email: firebaseUser.email!,
              photoURL: firebaseUser.photoURL || '',
              skills: [],
              interests: [],
              bio: '',
              links: { github: '', linkedin: '', portfolio: ''},
              reputation: 0,
            };
            
            await setDoc(userRef, {
              ...newUserProfile,
              level: 1,
              xp: 0,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
            // The snapshot listener will automatically pick up the new user data
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
