import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { events } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Calendar, MapPin } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function EventsPage() {
    const allEvents = events;
    const hackathons = events.filter(e => e.type === 'Hackathon');
    const workshops = events.filter(e => e.type === 'Workshop');
    const conferences = events.filter(e => e.type === 'Conference');

    const renderEventGrid = (eventList: typeof events) => (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {eventList.map((event) => {
            const eventImage = PlaceHolderImages.find((p) => p.id === event.image);
            return (
              <Card key={event.id} className="flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-primary/20 hover:shadow-lg">
                {eventImage && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={eventImage.imageUrl}
                      alt={event.title}
                      fill
                      className="object-cover"
                      data-ai-hint={eventImage.imageHint}
                    />
                     <Badge className="absolute top-2 right-2" variant={event.type === 'Hackathon' ? 'destructive' : 'secondary'}>{event.type}</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="font-headline">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow space-y-2">
                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                    </div>
                  <CardDescription className="pt-2">{event.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">View Details</Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
    );

  return (
    <div className="space-y-6">
       <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Discover Events</h1>
        <p className="text-muted-foreground mt-1">Find your next challenge, learning opportunity, or networking event.</p>
      </div>
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="hackathons">Hackathons</TabsTrigger>
          <TabsTrigger value="workshops">Workshops</TabsTrigger>
          <TabsTrigger value="conferences">Conferences</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">{renderEventGrid(allEvents)}</TabsContent>
        <TabsContent value="hackathons" className="mt-6">{renderEventGrid(hackathons)}</TabsContent>
        <TabsContent value="workshops" className="mt-6">{renderEventGrid(workshops)}</TabsContent>
        <TabsContent value="conferences" className="mt-6">{renderEventGrid(conferences)}</TabsContent>
      </Tabs>
    </div>
  );
}
