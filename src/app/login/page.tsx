'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Chrome } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { StudentProfile } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);


  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
          const newUserProfile: Omit<StudentProfile, 'id' | 'createdAt' | 'updatedAt' | 'level' | 'xp' | 'connections' | 'incomingRequests' | 'sentRequests' | 'bookmarks' | 'bookmarkedEvents' | 'registeredEvents' > = {
            displayName: firebaseUser.displayName || 'New User',
            email: firebaseUser.email!,
            photoURL: firebaseUser.photoURL || '',
            skills: [],
            interests: [],
            reputation: 0,
            bio: '',
            links: { github: '', linkedin: '', portfolio: ''},
          };
          
          await setDoc(userRef, {
            ...newUserProfile,
            level: 1,
            xp: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            connections: [],
            incomingRequests: [],
            sentRequests: [],
            bookmarks: [],
            bookmarkedEvents: [],
            registeredEvents: [],
          });
      }

      router.push('/dashboard');
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('Login popup closed by user.');
        return;
      }
      console.error("Error during Google login:", error);
      toast.error("Login Failed", {
        description: error.message || "An unexpected error occurred during login.",
      });
    }
  };

  const handleEmailLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error: any) {
       console.error("Error during email login:", error);
       toast.error("Login Failed", {
        description: "Invalid email or password. Please try again.",
      });
    }
  };

  if (loading || user) {
     return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
       <div
        className="absolute inset-0 -z-10 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 25% 25%, hsl(var(--primary) / 0.2), rgba(255, 255, 255, 0) 35%), radial-gradient(circle at 75% 75%, hsl(var(--accent) / 0.2), rgba(255, 255, 255, 0) 35%)',
        }}
      />
      <div className="absolute inset-0 -z-20 h-full w-full bg-background bg-[url('https://res.cloudinary.com/dfhpkqrjw/image/upload/v1717438453/grid_y4h5x6.svg')] bg-repeat [background-position:calc(50%_+_1px)_calc(50%_+_1px)]" />

      <main className="flex-1 relative z-10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card/60 backdrop-blur-lg border-border/30">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Log in to step into your UniVerse.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailLogin} className="space-y-4">
               <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" required className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" required className="bg-background" />
              </div>
              <Button type="submit" className="w-full h-11 text-base font-bold">
                Login
              </Button>
            </form>
             <div className="my-4 flex items-center">
                <div className="flex-grow border-t border-muted-foreground/20"></div>
                <span className="mx-4 text-xs uppercase text-muted-foreground">OR</span>
                <div className="flex-grow border-t border-muted-foreground/20"></div>
            </div>
            <Button variant="outline" className="w-full h-11 text-base" onClick={handleGoogleLogin}>
              <Chrome className="mr-2 h-5 w-5" />
              Continue with Google
            </Button>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/register" className="font-medium text-primary underline-offset-4 hover:underline">
                Create Account
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
