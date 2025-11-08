'use client';

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
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

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setUser({ id: snap.id, ...snap.data() } as StudentProfile);
        } else {
          // Create new user profile if it doesn't exist
          const newUser: Omit<StudentProfile, 'id' | 'createdAt' | 'updatedAt'> = {
            displayName: firebaseUser.displayName || "New User",
            email: firebaseUser.email!,
            photoURL: firebaseUser.photoURL || "",
            skills: [],
            interests: [],
            bio: "",
            links: { github: "", linkedin: "", portfolio: "" },
            reputation: 0,
          };
          await setDoc(userRef, {
            ...newUser,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          const newSnap = await getDoc(userRef);
          setUser({ id: newSnap.id, ...newSnap.data() } as StudentProfile);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
