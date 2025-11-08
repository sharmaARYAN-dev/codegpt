'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bookmark, Star, MapPin, Calendar, Home, Building } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import Image from 'next/image';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useCollection, useFirestore } from '@/firebase';
import type { Event, StudentProfile } from '@/lib/types';
import { useMemo } from 'react';
import { collection } from 'firebase/firestore';

export default function HackathonsPage() {
  const firestore = useFirestore();
  const { data: allEvents } = useCollection<Event>(firestore ? collection(firestore, 'events') : null);
  const { data: users } = useCollection<StudentProfile>(
    firestore ? collection(firestore, 'users') : null
  );
  
  const heroImage = {
      "id": "event-conference",
      "description": "Image for a conference event",
      "imageUrl": "https://images.unsplash.com/photo-1664262283644-bfbc54a88c90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxwcmVzZW50YXRpb24lMjBzdGFnZXxlbnwwfHx8fDE3NjI1MTM1MDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "imageHint": "presentation stage"
    };

  return (
    <div className="space-y-6">
      <div className="relative rounded-lg overflow-hidden p-8 flex items-end min-h-[250px] bg-gradient-to-t from-black/80 via-black/0">
        {heroImage && <Image src={heroImage.imageUrl} alt={heroImage.description} fill className="object-cover -z-10" data-ai-hint={heroImage.imageHint} />}
        <div className="text-white">
            <h1 className="font-headline text-4xl font-bold tracking-tight">Explore Hackathons & Workshops</h1>
            <p className="text-white/80 mt-1">Find your next opportunity to innovate and create.</p>
        </div>
      </div>

       <div className="flex items-center gap-2 flex-wrap">
        <Button>Tags</Button>
        <Button variant="outline">Domain</Button>
        <Button variant="outline">Sort By</Button>
        <div className="flex-1"></div>
        <p className="text-sm text-muted-foreground">Newest / Trending</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-8 items-start'>
        <aside className='md:col-span-1 md:sticky top-20 space-y-6'>
            <Card>
                <CardHeader>
                    <CardTitle className='font-headline text-lg'>Domain</CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                    <div className='flex flex-wrap gap-2'>
                        <Badge variant='secondary' className='cursor-pointer hover:bg-primary/20'>AI/ML</Badge>
                        <Badge variant='secondary' className='cursor-pointer hover:bg-primary/20'>WebDev</Badge>
                        <Badge variant='secondary' className='cursor-pointer hover:bg-primary/20'>Design</Badge>
                    </div>
                     <ToggleGroup type="single" defaultValue="online" className="w-full grid grid-cols-2 gap-2">
                        <ToggleGroupItem value="online" aria-label="Toggle online" className='gap-2'>
                            <Home className='size-4' /> Online
                        </ToggleGroupItem>
                        <ToggleGroupItem value="campus-based" aria-label="Toggle campus-based" className='gap-2'>
                            <Building className='size-4' /> Campus-Based
                        </ToggleGroupItem>
                    </ToggleGroup>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className='font-headline text-lg'>Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='text-sm text-muted-foreground'>Filter by status</p>
                </CardContent>
            </Card>
        </aside>

        <main className='md:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {allEvents?.map((event) => {
                const organizer = users?.find(u => u.id === event.organizerId);
                return (
                <Card key={event.id} className="flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-primary/20 hover:shadow-lg">
                    <CardHeader>
                        <div className='flex justify-between items-start'>
                             <div className='flex items-center gap-3'>
                                <Avatar className='size-10'>
                                    {organizer?.photoURL && <AvatarImage src={organizer.photoURL} alt={organizer.displayName} />}
                                    <AvatarFallback>{organizer?.displayName?.substring(0, 2) ?? 'EV'}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-sm">{organizer?.displayName}</p>
                                    <p className="text-xs text-muted-foreground">Organizer</p>
                                </div>
                            </div>
                            <Button variant='ghost' size='icon'>
                                <Bookmark className='size-5'/>
                            </Button>
                        </div>
                        <CardTitle className="font-headline text-lg pt-2">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-3">
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
                        <div className="flex items-center gap-1 text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`size-4 ${i < event.rating ? 'fill-current' : ''}`} />
                            ))}
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            {event.tags?.map(tag => <Badge key={tag}>{tag}</Badge>)}
                        </div>
                         <p className="text-sm text-muted-foreground pt-2 line-clamp-2">{event.description}</p>
                    </CardContent>
                    <div className='p-6 pt-0'>
                        <Button className="w-full">Join</Button>
                    </div>
                </Card>
                )
            })}
        </main>
      </div>

    </div>
  );
}
