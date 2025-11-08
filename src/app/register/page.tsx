'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { StudentProfile } from '@/lib/types';

const registerSchema = z.object({
  displayName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, loading } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    if (!auth || !firestore) return;

    setIsSubmitting(true);
    const promise = async () => {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const authUser = userCredential.user;

      await updateProfile(authUser, {
        displayName: data.displayName,
      });
      
      const userRef = doc(firestore, 'users', authUser.uid);
      const newUserProfile: StudentProfile = {
        id: authUser.uid,
        displayName: data.displayName,
        email: data.email,
        photoURL: '',
        skills: [],
        interests: [],
        reputation: [],
      };
      
      await setDoc(userRef, newUserProfile);
      return authUser;
    }

    toast.promise(promise(), {
      loading: 'Creating your account...',
      success: (authUser) => {
        setTimeout(() => router.push('/dashboard'), 1000);
        return `Welcome, ${authUser.displayName}! Redirecting...`;
      },
      error: (error) => {
        console.error('Error during registration:', error);
        setIsSubmitting(false);
        return error.code === 'auth/email-already-in-use'
          ? 'This email is already registered. Please log in.'
          : 'An unexpected error occurred. Please try again.';
      }
    });
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
            'radial-gradient(circle at 25% 25%, hsl(var(--primary) / 0.3), rgba(255, 255, 255, 0) 35%), radial-gradient(circle at 75% 75%, hsl(var(--accent) / 0.3), rgba(255, 255, 255, 0) 35%)',
        }}
      />
      <div className="absolute inset-0 -z-20 h-full w-full bg-background bg-[url('https://res.cloudinary.com/dfhpkqrjw/image/upload/v1717438453/grid_y4h5x6.svg')] bg-repeat [background-position:calc(50%_+_1px)_calc(50%_+_1px)]" />


      <main className="flex-1 relative z-10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card/60 backdrop-blur-lg border-border/30">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl font-bold">Create an Account</CardTitle>
            <CardDescription>Join Universe and start your journey.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Full Name</Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Your Name"
                  {...register('displayName')}
                  className="bg-background"
                  aria-invalid={errors.displayName ? 'true' : 'false'}
                />
                {errors.displayName && <p className="text-sm text-destructive">{errors.displayName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  className="bg-background"
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  className="bg-background"
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              </div>
              <Button type="submit" className="w-full h-11 text-base font-bold" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Account'}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="underline hover:text-primary font-medium">
                Log in
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
