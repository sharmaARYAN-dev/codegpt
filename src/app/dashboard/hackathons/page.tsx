import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { events } from '@/lib/data';
import { Bookmark, Star, MapPin, Calendar, Home, Building } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';


export default function HackathonsPage() {
  const allEvents = events;
  const heroImage = PlaceHolderImages.find(p => p.id === 'event-conference');

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
            {allEvents.map((event) => {
                const ownerAvatar = PlaceHolderImages.find((p) => p.id === 'avatar-1');
                return (
                <Card key={event.id} className="flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-primary/20 hover:shadow-lg">
                    <CardHeader>
                        <div className='flex justify-between items-start'>
                             <div className='flex items-center gap-3'>
                                <Avatar className='size-10'>
                                    {ownerAvatar && <AvatarImage src={ownerAvatar.imageUrl} alt="Event organizer" />}
                                    <AvatarFallback>EV</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-sm">Organizers</p>
                                    <p className="text-xs text-muted-foreground">College 1st Year</p>
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
                                <span>{event.date}</span>
                            </div>
                             <div className='flex items-center gap-2'>
                                <MapPin className='size-4' />
                                <span>{event.location}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400">
                            <Star className='size-4 fill-current' />
                            <Star className='size-4 fill-current' />
                            <Star className='size-4 fill-current' />
                            <Star className='size-4' />
                            <Star className='size-4' />
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <Badge>AI/ML</Badge>
                            <Badge variant='outline'>React</Badge>
                             <Badge variant='outline'>Python</Badge>
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
