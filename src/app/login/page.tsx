'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Orbit, Chrome } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useAuth, useUser } from '@/firebase';
import { useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);


  const handleGoogleLogin = async () => {
    if (!auth || !firestore) return;
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Create or update user profile in Firestore
      const userRef = doc(firestore, 'users', user.uid);
      await setDoc(userRef, {
        id: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      }, { merge: true });

      router.push('/dashboard');
    } catch (error) {
      console.error("Error during Google login:", error);
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
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 25% 25%, hsl(var(--primary) / 0.3), rgba(255, 255, 255, 0) 35%), radial-gradient(circle at 75% 75%, hsl(var(--accent) / 0.3), rgba(255, 255, 255, 0) 35%)',
        }}
      />
      <div className="absolute inset-0 z-0 h-full w-full bg-[url('https://res.cloudinary.com/dfhpkqrjw/image/upload/v1717438453/grid_y4h5x6.svg')] [background-position:calc(50%_+_1px)_calc(50%_+_1px)]" />

      <header className="sticky top-0 z-50">
        <div className="container mx-auto px-4">
            <div className="flex h-20 items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Orbit className="h-7 w-7 text-primary" />
                    <span className="text-xl font-bold">Universe</span>
                </Link>
            </div>
        </div>
      </header>

      <main className="flex-1 relative z-10 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm bg-card/50 backdrop-blur-sm border-border/20">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl font-bold">Join Universe</CardTitle>
            <CardDescription>Sign in to connect, create, and collaborate.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full h-12 text-base" onClick={handleGoogleLogin}>
              <Chrome className="mr-2 h-5 w-5" />
              Continue with Google
            </Button>
            <div className="mt-4 text-center text-xs text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
