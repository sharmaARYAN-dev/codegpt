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
import { allEvents, users } from '@/lib/mock-data';
import Image from 'next/image';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function HackathonsPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'event-conference');

  return (
    <div className="space-y-6">
      <div className="relative flex min-h-[250px] items-end overflow-hidden rounded-lg bg-gradient-to-t from-black/80 via-black/0 p-8">
        {heroImage && <Image src={heroImage.imageUrl} alt={heroImage.description} fill className="-z-10 object-cover" data-ai-hint={heroImage.imageHint} />}
        <div className="text-white">
          <h1 className="font-headline text-4xl font-bold tracking-tight">Explore Events</h1>
          <p className="mt-1 text-white/80">Find your next opportunity to innovate and create.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button>Tags</Button>
        <Button variant="outline">Domain</Button>
        <Button variant="outline">Sort By</Button>
        <div className="flex-1"></div>
        <p className="text-sm text-muted-foreground">Newest / Trending</p>
      </div>

      <div className='grid grid-cols-1 gap-8 md:grid-cols-4 items-start'>
        <aside className='space-y-6 md:col-span-1 md:sticky top-20'>
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
              <ToggleGroup type="single" defaultValue="online" className="grid w-full grid-cols-2 gap-2">
                <ToggleGroupItem value="online" aria-label="Toggle online" className='gap-2'>
                  <Home className='size-4' /> Online
                </ToggleGroupItem>
                <ToggleGroupItem value="campus-based" aria-label="Toggle campus-based" className='gap-2'>
                  <Building className='size-4' /> Campus
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

        <main className='grid grid-cols-1 gap-6 md:col-span-3 lg:grid-cols-2'>
          {allEvents.map((event) => {
            const organizer = users.find(u => u.id === event.organizerId);
            return (
              <Card key={event.id} className="flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20">
                <CardHeader>
                  <div className='flex items-start justify-between'>
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
                      <Bookmark className='size-5' />
                    </Button>
                  </div>
                  <CardTitle className="font-headline pt-2 text-lg">{event.title}</CardTitle>
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
                    {event.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
                  </div>
                  <p className="text-muted-foreground pt-2 line-clamp-2 text-sm">{event.description}</p>
                </CardContent>
                <div className='p-6 pt-0'>
                  <Button className="w-full">Join Event</Button>
                </div>
              </Card>
            )
          })}
        </main>
      </div>

    </div>
  );
}
