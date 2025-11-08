'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Orbit, Chrome } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth, useUser } from '@/firebase';
import { useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, loading } = useUser();
  const { toast } = useToast();

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
      
      const userRef = doc(firestore, 'users', user.uid);
      const userData = {
        id: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        skills: [],
        interests: [],
        reputation: [],
      };

      setDoc(userRef, userData, { merge: true }).catch(async () => {
          const permissionError = new FirestorePermissionError({
            path: userRef.path,
            operation: 'create',
            requestResourceData: userData,
          });
          errorEmitter.emit('permission-error', permissionError);
      });

      router.push('/dashboard');
    } catch (error: any) {
      console.error("Error during Google login:", error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "An unexpected error occurred during login.",
      });
    }
  };

  const handleEmailLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!auth) return;

    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error: any) {
       console.error("Error during email login:", error);
       toast({
        variant: "destructive",
        title: "Login Failed",
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
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 25% 25%, hsl(var(--primary) / 0.3), rgba(255, 255, 255, 0) 35%), radial-gradient(circle at 75% 75%, hsl(var(--accent) / 0.3), rgba(255, 255, 255, 0) 35%)',
        }}
      />
      <div className="absolute inset-0 z-0 h-full w-full bg-[url('https://res.cloudinary.com/dfhpkqrjw/image/upload/v1717438453/grid_y4h5x6.svg')] [background-position:calc(50%_+_1px)_calc(50%_+_1px)]" />

      <main className="flex-1 relative z-10 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm bg-card/50 backdrop-blur-sm border-border/20">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl font-bold">Welcome back to Universe.</CardTitle>
            <CardDescription>Step into your Universe.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailLogin} className="space-y-4">
               <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Email" required className="bg-input/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Password" required className="bg-input/50" />
              </div>
              <Button type="submit" className="w-full h-12 text-base font-bold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Login
              </Button>
            </form>
             <div className="my-4 flex items-center">
                <div className="flex-grow border-t border-muted-foreground/20"></div>
                <span className="mx-4 text-xs uppercase text-muted-foreground">OR</span>
                <div className="flex-grow border-t border-muted-foreground/20"></div>
            </div>
            <Button variant="outline" className="w-full h-12 text-base" onClick={handleGoogleLogin}>
              <Chrome className="mr-2 h-5 w-5" />
              Continue with Google
            </Button>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              <Link href="#" className="underline hover:text-primary">
                Create Account
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}