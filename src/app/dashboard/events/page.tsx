'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bookmark, Star, MapPin, Calendar, Home, Building, Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Event, StudentProfile } from '@/lib/types';
import { collection, query, where, orderBy, type QueryConstraint } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useState } from 'react';
import { CreateEventDialog } from '@/components/create-event-dialog';

function EventsSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-8 md:grid-cols-4 items-start'>
      <aside className='space-y-6 md:col-span-1 md:sticky top-24'>
        <Card><CardHeader><Skeleton className="h-6 w-3/4"/></CardHeader><CardContent className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-24 w-full" /></CardContent></Card>
      </aside>
      <main className='grid grid-cols-1 gap-6 md:col-span-3 lg:grid-cols-2'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="flex flex-col">
            <CardHeader><div className="flex items-center gap-4"><Skeleton className="size-12 rounded-full" /><div className="space-y-2"><Skeleton className="h-5 w-32" /><Skeleton className="h-4 w-20" /></div></div><Skeleton className="h-6 w-3/4 mt-4" /></CardHeader>
            <CardContent className="flex-grow space-y-4"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-4 w-1/3" /></CardContent>
            <div className='p-6 pt-2'><Skeleton className="h-10 w-full" /></div>
          </Card>
        ))}
      </main>
    </div>
  )
}

type EventType = 'All' | 'Hackathon' | 'Workshop' | 'Conference';

export default function EventsPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'event-conference');
  const firestore = useFirestore();
  const [activeType, setActiveType] = useState<EventType>('All');
  const [locationType, setLocationType] = useState('all');
  const [isCreateEventOpen, setCreateEventOpen] = useState(false);

  const eventsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    const baseColl = collection(firestore, 'events');
    const queries: QueryConstraint[] = [];

    if (activeType !== 'All') {
      queries.push(where('type', '==', activeType));
    }
    if (locationType !== 'all') {
      const isOnline = locationType === 'online';
      queries.push(where('isOnline', '==', isOnline));
    }

    return query(baseColl, ...queries, orderBy('date'));
  }, [firestore, activeType, locationType]);

  const { data: allEvents, loading: loadingEvents } = useCollection<Event>(eventsQuery);

  const usersQuery = useMemoFirebase(() => firestore ? collection(firestore, 'users') : null, [firestore]);
  const { data: users, loading: loadingUsers } = useCollection<StudentProfile>(usersQuery);

  const handleJoinEvent = (eventName: string) => {
    toast.success('Successfully Registered!', {
      description: `You have joined the event: ${eventName}.`,
    });
  }
  
  const eventTypes: EventType[] = ['All', 'Hackathon', 'Workshop', 'Conference'];

  if (loadingEvents || loadingUsers) {
    return <div className='space-y-8'><div className="relative min-h-[240px] rounded-lg bg-muted" /><EventsSkeleton /></div>
  }

  return (
    <>
      <CreateEventDialog open={isCreateEventOpen} onOpenChange={setCreateEventOpen} />
      <div className="space-y-8">
        <div className="relative flex flex-col justify-end min-h-[240px] md:min-h-[300px] overflow-hidden rounded-lg bg-gradient-to-t from-black/80 via-transparent to-black/20 p-4 sm:p-8">
          {heroImage && <Image src={heroImage.imageUrl} alt={heroImage.description} fill className="-z-10 object-cover" data-ai-hint={heroImage.imageHint} />}
          <div className="text-white relative">
            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">Explore Events</h1>
            <p className="mt-2 text-base md:text-lg text-white/80 max-w-lg">Find your next opportunity to innovate, learn, and connect with the brightest minds.</p>
          </div>
          <Button className='absolute top-4 right-4' onClick={() => setCreateEventOpen(true)}>
            <Plus className='mr-2' />
            Create Event
          </Button>
        </div>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-4 items-start'>
          <aside className='space-y-6 md:col-span-1 md:sticky top-24'>
            <Card>
              <CardHeader>
                <CardTitle className='font-headline text-lg'>Filters</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Location</h3>
                  <ToggleGroup type="single" value={locationType} onValueChange={(v) => setLocationType(v || 'all')} className="grid w-full grid-cols-2 gap-2">
                    <ToggleGroupItem value="online" aria-label="Toggle online" className='gap-2'>
                      <Home className='size-4' /> Online
                    </ToggleGroupItem>
                    <ToggleGroupItem value="campus" aria-label="Toggle campus-based" className='gap-2'>
                      <Building className='size-4' /> Campus
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Event Type</h3>
                  <div className='flex flex-col gap-2'>
                    {eventTypes.map(type => (
                      <Button 
                        key={type}
                        variant={activeType === type ? 'secondary' : 'ghost'} 
                        className='justify-start'
                        onClick={() => setActiveType(type)}
                      >
                        {type === 'All' ? 'All Types' : type}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          <main className='grid grid-cols-1 gap-6 md:col-span-3 lg:grid-cols-2'>
            {allEvents?.map((event) => {
              const organizer = users?.find(u => u.id === event.organizerId);
              return (
                <Card key={event.id} className="flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/30">
                  <CardHeader>
                    <div className='flex items-start justify-between'>
                      <div className='flex items-center gap-4'>
                        <Avatar className='size-12'>
                          {organizer?.photoURL && <AvatarImage src={organizer.photoURL} alt={organizer.displayName} />}
                          <AvatarFallback>{organizer?.displayName?.substring(0, 2) ?? 'EV'}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-semibold text-base truncate">{organizer?.displayName}</p>
                          <p className="text-sm text-muted-foreground">Organizer</p>
                        </div>
                      </div>
                      <Button variant='ghost' size='icon'>
                        <Bookmark className='size-5' />
                      </Button>
                    </div>
                    <CardTitle className="font-headline pt-4 text-xl">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                      <div className='flex items-center gap-2'>
                        <Calendar className='size-4' />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <MapPin className='size-4' />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm flex-wrap">
                      {event.tags.map(tag => <Badge key={tag} variant='secondary'>{tag}</Badge>)}
                    </div>
                    <p className="text-muted-foreground pt-2 line-clamp-2 text-sm leading-relaxed">{event.description}</p>
                  </CardContent>
                  <div className='p-6 pt-2'>
                    <Button className="w-full" onClick={() => handleJoinEvent(event.title)}>Join Event</Button>
                  </div>
                </Card>
              )
            })}
          </main>
        </div>

      </div>
    </>
  );
}
