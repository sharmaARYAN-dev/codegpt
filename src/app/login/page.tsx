'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Orbit, Chrome } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
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
        <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm border-border/20">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Enter your credentials to access your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="name@university.edu" required defaultValue="alex@university.edu" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" required defaultValue="password"/>
              </div>
              <Button type="submit" className="w-full font-bold text-lg h-12">
                Login
              </Button>
            </form>
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
            </div>
            <div className="text-center text-sm text-muted-foreground flex items-center justify-center gap-4">
              <Button variant="outline" className="w-full" onClick={handleLogin}>
                <Chrome className="mr-2 h-4 w-4" />
                Continue with Google
              </Button>
            </div>
             <div className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="#" className="font-semibold text-primary hover:underline">
                Sign Up
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
