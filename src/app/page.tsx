import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Orbit, Users, Lightbulb, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function LandingPage() {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Find Your Team',
      description: "Connect with talented students and build your dream team."
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-accent" />,
      title: 'Share Your Idea',
      description: "Get feedback on your project ideas and find collaborators."
    },
    {
      icon: <Trophy className="h-8 w-8 text-primary" />,
      title: 'Join hackathon',
      description: "Compete in exciting challenges and win amazing prizes."
    },
  ];

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

      <header className="sticky top-0 z-50 backdrop-blur-sm bg-background/50">
        <div className="container mx-auto px-4">
            <div className="flex h-20 items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Orbit className="h-7 w-7 text-primary" />
                    <span className="text-xl font-bold">Universe</span>
                </Link>
                <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
                    <Link href="#features" className="text-foreground/70 transition-colors hover:text-foreground">Features</Link>
                    <Link href="/dashboard/projects" className="text-foreground/70 transition-colors hover:text-foreground">Projects</Link>
                    <Link href="/dashboard/hackathons" className="text-foreground/70 transition-colors hover:text-foreground">Events</Link>
                </nav>
                <div className="hidden items-center gap-4 md:flex">
                    <Button variant="ghost" asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/register">Get Started</Link>
                    </Button>
                </div>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Orbit className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </div>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        <section className="container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24 text-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="text-left">
                    <h1 className="font-headline text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter !leading-[1.1]">
                        Where Students <br/>
                        <span className="text-primary">Connect</span>, <span className="text-accent">Create</span><br/>
                        & Collaborate.
                    </h1>
                    <p className="mt-6 text-lg md:text-xl max-w-md text-foreground/70">
                        The all-in-one platform for college innovators to find teammates, share ideas, and build the future.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-4">
                        <Button asChild size="lg" className="font-bold text-lg px-8 py-6">
                            <Link href="/register">Get Started for Free</Link>
                        </Button>
                         <Button asChild size="lg" variant="outline" className="font-bold text-lg px-8 py-6">
                            <Link href="/dashboard/projects">Explore Projects</Link>
                        </Button>
                    </div>
                </div>

                 <div className="hidden md:flex items-center justify-center">
                     <Image src="https://www.genkit.dev/images/gemini-orbit.svg" alt="Orbit graphic" width={500} height={500} className="opacity-70" data-ai-hint="orbit space"/>
                </div>

            </div>
        </section>

        <section id="features" className="container mx-auto px-4 pb-20 md:pb-32">
             <div className="text-center mb-12">
                <h2 className="font-headline text-4xl font-bold">Why Universe?</h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Discover a universe of opportunities. Connect with peers, build amazing projects, and launch your career in tech.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((feature) => (
                    <Card key={feature.title} className="bg-card/50 backdrop-blur-sm border-border/20 p-6 text-center transition-all duration-300 hover:border-primary/50 hover:-translate-y-2">
                        <CardContent className="p-0 flex flex-col items-center justify-center gap-4">
                            <div className="p-4 bg-background rounded-full">
                                {feature.icon}
                            </div>
                            <p className="font-semibold text-lg">{feature.title}</p>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
      </main>
      <footer className='border-t py-6'>
          <div className='container mx-auto px-4 text-center text-sm text-muted-foreground'>
              <p>&copy; {new Date().getFullYear()} Universe. All rights reserved.</p>
          </div>
      </footer>
    </div>
  );
}
