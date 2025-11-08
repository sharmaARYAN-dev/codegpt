import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Orbit, Users, Lightbulb, Trophy, Menu } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { SolarSystem } from '@/components/solar-system';

// Helper function to generate random box-shadows for stars
const generateStars = (count: number, size: number) => {
  let boxShadow = '';
  for (let i = 0; i < count; i++) {
    boxShadow += `${Math.random() * 2000}px ${Math.random() * 2000}px hsl(var(--primary-foreground)), `;
  }
  return boxShadow.slice(0, -2);
};


export default function LandingPage() {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Find Your Team',
      description: "Connect with talented students and build your dream team for any project."
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-accent" />,
      title: 'Spark Your Idea',
      description: "Get AI-powered project suggestions and find collaborators to join you."
    },
    {
      icon: <Trophy className="h-8 w-8 text-primary" />,
      title: 'Join an Event',
      description: "Compete in exciting hackathons and workshops to win amazing prizes."
    },
  ];

  const smallStars = { '--size': '1px', '--box-shadow': generateStars(700, 1) } as React.CSSProperties;
  const mediumStars = { '--size': '2px', '--box-shadow': generateStars(200, 2) } as React.CSSProperties;
  const largeStars = { '--size': '3px', '--box-shadow': generateStars(100, 3) } as React.CSSProperties;


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/20 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-20 items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Orbit className="h-7 w-7 text-primary" />
                    <span className="text-xl font-bold tracking-tighter">Progress</span>
                </Link>
                <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
                    <Link href="#features" className="text-foreground/70 transition-colors hover:text-foreground">Features</Link>
                    <Link href="/dashboard/projects" className="text-foreground/70 transition-colors hover:text-foreground">Projects</Link>
                    <Link href="/dashboard/events" className="text-foreground/70 transition-colors hover:text-foreground">Events</Link>
                </nav>
                <div className="hidden items-center gap-2 md:flex">
                    <Button variant="ghost" asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/register">Get Started</Link>
                    </Button>
                </div>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-32 md:pb-24 text-center overflow-hidden">
             <div className="absolute inset-0 -z-10 opacity-20"
                style={{
                backgroundImage:
                    'radial-gradient(circle at 25% 25%, hsl(var(--primary) / 0.3), rgba(255, 255, 255, 0) 35%), radial-gradient(circle at 75% 75%, hsl(var(--accent) / 0.3), rgba(255, 255, 255, 0) 35%)',
                }}
            />
            <div className='stars-bg' style={smallStars}></div>
            <div className='stars-bg-2' style={mediumStars}></div>
            <div className='stars-bg-3' style={largeStars}></div>

            <div className="grid grid-cols-1 gap-12 items-center md:grid-cols-2">
                <div className="text-center md:text-left">
                    <h1 className="font-headline text-5xl font-extrabold tracking-tighter !leading-[1.1] sm:text-6xl lg:text-7xl">
                        Where Students <br/>
                        <span className="text-primary">Connect</span>, <span className="text-accent">Create</span><br/>
                        & Collaborate.
                    </h1>
                    <p className="mt-6 text-lg max-w-xl text-foreground/80 md:text-xl mx-auto md:mx-0">
                        The all-in-one platform for college innovators to find teammates, share ideas, and build the future.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
                        <Button asChild size="lg" className="font-bold text-base sm:text-lg px-8 py-6">
                            <Link href="/register">Get Started for Free</Link>
                        </Button>
                         <Button asChild size="lg" variant="outline" className="font-bold text-base sm:text-lg px-8 py-6">
                            <Link href="/dashboard/projects">Explore Projects</Link>
                        </Button>
                    </div>
                </div>

                 <div className="hidden md:flex items-center justify-center">
                    <SolarSystem />
                </div>

            </div>
        </section>

        <section id="features" className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
             <div className="text-center mb-16">
                <h2 className="font-headline text-4xl font-bold">Why Progress?</h2>
                <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-lg">Discover a universe of opportunities. Connect with peers, build amazing projects, and launch your career in tech.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature) => (
                    <Card key={feature.title} className="bg-card/50 backdrop-blur-sm border-border/20 p-8 text-center transition-all duration-300 hover:border-primary/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10">
                        <CardContent className="p-0 flex flex-col items-center justify-center gap-4">
                            <div className="p-4 bg-background rounded-full border-2 border-primary/20">
                                {feature.icon}
                            </div>
                            <p className="font-semibold text-xl font-headline">{feature.title}</p>
                            <p className="text-base text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
      </main>
      <footer className='border-t border-border/20 py-8 mt-16'>
          <div className='container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground'>
              <p>&copy; {new Date().getFullYear()} Progress. All rights reserved.</p>
          </div>
      </footer>
    </div>
  );
}
