import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Rocket, Users, BrainCircuit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'landing-hero');

  const features = [
    {
      icon: <Rocket className="h-8 w-8 text-accent" />,
      title: 'Launch Your Ideas',
      description: 'Generate innovative project ideas with AI and find the resources to bring them to life.',
    },
    {
      icon: <Users className="h-8 w-8 text-accent" />,
      title: 'Build Your Team',
      description: 'Connect with students who have the skills and passion to build something great with you.',
    },
    {
      icon: <BrainCircuit className="h-8 w-8 text-accent" />,
      title: 'Expand Your Universe',
      description: 'Discover hackathons, workshops, and community events to grow your network and knowledge.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow">
        <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="relative z-10 p-4 max-w-4xl mx-auto">
            <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter !leading-[1.1]">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">UniVerse</span>: Your Cosmos of Creation
            </h1>
            <p className="mt-4 md:mt-6 text-base md:text-xl max-w-2xl mx-auto text-foreground/80">
              The ultimate platform for students to connect, collaborate on projects, and discover exciting opportunities. Your next big idea starts here.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg" className="font-bold text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/dashboard">Enter the UniVerse</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">Everything You Need to Succeed</h2>
              <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                UniVerse provides a complete ecosystem for student developers and innovators.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <Card key={feature.title} className="text-center bg-card/50 border-border/50 hover:border-accent/50 hover:bg-card transition-all duration-300 transform hover:-translate-y-2">
                  <CardHeader className="items-center">
                    <div className="p-4 bg-accent/10 rounded-full mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 border-t border-border/50">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} UniVerse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
