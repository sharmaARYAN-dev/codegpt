import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { projects, students, events } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { Star } from 'lucide-react';

export default function DashboardPage() {
  const feedProjects = projects.slice(0, 3);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className='lg:col-span-2 space-y-6'>
            <h1 className="font-headline text-2xl font-bold tracking-tight">Hey Alex, here&apos;s what&apos;s happening</h1>
            <div className='space-y-4'>
            {feedProjects.map((project) => {
              const owner = project.team[0];
              const ownerAvatar = PlaceHolderImages.find((p) => p.id === owner.avatar);

              return (
                <Card key={project.id} className="transition-shadow duration-300 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className='flex items-start gap-4'>
                        <Avatar>
                            {ownerAvatar && <AvatarImage src={ownerAvatar.imageUrl} alt={owner.name} />}
                            <AvatarFallback>{owner.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className='flex-1'>
                            <p className="font-semibold">{owner.name}</p>
                            <p className="text-sm text-muted-foreground">College 1st Year</p>
                            <h2 className="font-headline text-lg font-semibold mt-2">{project.name}</h2>
                            <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {project.tags?.map((tag) => (
                                    <Badge key={tag} variant={tag === 'AI/ML' ? 'default' : 'secondary'}>{tag}</Badge>
                                ))}
                            </div>
                            <div className='flex items-center justify-between mt-4'>
                                <div className='flex items-center gap-2 text-muted-foreground'>
                                    <Star className='size-4'/>
                                    <Star className='size-4'/>
                                    <Star className='size-4'/>
                                    <Star className='size-4 text-primary'/>
                                    <Star className='size-4 text-primary'/>
                                </div>
                                <Button asChild size="sm">
                                    <Link href="/dashboard/project">Join</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            </div>
        </div>
        <div className="space-y-6 lg:sticky top-20">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg">Recommended Events</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     {events.slice(0, 2).map(event => (
                        <div key={event.id} className="p-3 rounded-lg border bg-card hover:bg-muted/50">
                            <p className="font-semibold">{event.title}</p>
                            <p className="text-sm text-muted-foreground">{event.date}, {event.location}</p>
                            <Button variant="outline" size="sm" className="mt-2 w-full">Learn More</Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg">Suggested Teammates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     {students.slice(0, 2).map((student) => {
                        const studentAvatar = PlaceHolderImages.find((p) => p.id === student.avatar);
                        return (
                            <div key={student.id} className="flex items-center gap-4">
                            <Avatar>
                                {studentAvatar && <AvatarImage src={studentAvatar.imageUrl} alt={student.name} data-ai-hint="person portrait" />}
                                <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-semibold">{student.name}</p>
                                <p className="text-sm text-muted-foreground truncate">{student.skills.slice(0,2).join(', ')}</p>
                            </div>
                            <Button variant="default" size="sm">Connect</Button>
                            </div>
                        );
                        })}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
