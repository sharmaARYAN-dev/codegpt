'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { useCollection, useUser, useFirestore } from '@/firebase';
import type { Project, StudentProfile, Event } from '@/lib/types';
import { useMemo } from 'react';
import { collection, query, limit } from 'firebase/firestore';

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const projectsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'projects'), limit(3));
  }, [firestore]);
  const { data: feedProjects } = useCollection<Project>(projectsQuery);

  const eventsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'events'), limit(2));
  }, [firestore]);
  const { data: recommendedEvents } = useCollection<Event>(eventsQuery);

  const usersQuery = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);
  const { data: users } = useCollection<StudentProfile>(usersQuery);

  const suggestedTeammates = useMemo(() => {
    if (!users || !user) return [];
    return users.filter(u => u.id !== user.uid).slice(0, 2);
  }, [users, user]);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className='lg:col-span-2 space-y-6'>
            <h1 className="font-headline text-2xl font-bold tracking-tight">Hey {user?.displayName?.split(' ')[0]}, here&apos;s what&apos;s happening</h1>
            <div className='space-y-4'>
            {feedProjects?.map((project) => {
              const owner = users?.find(u => u.id === project.ownerId);

              return (
                <Card key={project.id} className="transition-shadow duration-300 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className='flex items-start gap-4'>
                        <Avatar>
                            {owner?.photoURL && <AvatarImage src={owner.photoURL} alt={owner.displayName} />}
                            <AvatarFallback>{owner?.displayName?.substring(0, 2) ?? '??'}</AvatarFallback>
                        </Avatar>
                        <div className='flex-1'>
                            <p className="font-semibold">{owner?.displayName}</p>
                            <p className="text-sm text-muted-foreground">Project Owner</p>
                            <h2 className="font-headline text-lg font-semibold mt-2">{project.name}</h2>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {project.tags?.map((tag) => (
                                    <Badge key={tag} variant={tag === 'AI/ML' ? 'default' : 'secondary'}>{tag}</Badge>
                                ))}
                            </div>
                            <div className='flex items-center justify-between mt-4'>
                                <div className='flex items-center gap-1 text-yellow-400'>
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} className={`size-4 ${i < project.rating ? 'fill-current' : ''}`} />
                                    ))}
                                </div>
                                <Button asChild size="sm">
                                    <Link href={`/dashboard/projects/${project.id}`}>View Project</Link>
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
                     {recommendedEvents?.map(event => (
                        <div key={event.id} className="p-3 rounded-lg border bg-card hover:bg-muted/50">
                            <p className="font-semibold">{event.title}</p>
                            <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()}, {event.location}</p>
                            <Button variant="outline" size="sm" className="mt-2 w-full" asChild>
                                <Link href="/dashboard/hackathons">Learn More</Link>
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg">Suggested Teammates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     {suggestedTeammates.map((student) => {
                        return (
                            <div key={student.id} className="flex items-center gap-4">
                            <Avatar>
                                {student.photoURL && <AvatarImage src={student.photoURL} alt={student.displayName} data-ai-hint="person portrait" />}
                                <AvatarFallback>{student.displayName.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-semibold">{student.displayName}</p>
                                <p className="text-sm text-muted-foreground truncate">{student.skills?.slice(0,2).join(', ')}</p>
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
