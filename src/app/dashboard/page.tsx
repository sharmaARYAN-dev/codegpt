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
import { collection, query, limit, orderBy } from 'firebase/firestore';
import type { Project, Event, StudentProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 space-y-6">
        <Skeleton className="h-9 w-1/2" />
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Skeleton className="size-12 rounded-full" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <Card><CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader><CardContent className="space-y-3"><Skeleton className="h-20 w-full" /><Skeleton className="h-20 w-full" /></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></CardContent></Card>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth();

  const projectsQuery = useMemo(() => db ? query(collection(db, 'projects'), orderBy('createdAt', 'desc'), limit(3)) : null, [db]);
  const { data: feedProjects, loading: loadingProjects } = useCollection<Project>(projectsQuery, 'projects');
  
  const eventsQuery = useMemo(() => db ? query(collection(db, 'events'), limit(2)) : null, [db]);
  const { data: recommendedEvents, loading: loadingEvents } = useCollection<Event>(eventsQuery, 'events');

  const usersQuery = useMemo(() => db ? collection(db, 'users') : null, [db]);
  const { data: users, loading: loadingUsers } = useCollection<StudentProfile>(usersQuery, 'users');

  const suggestedTeammates = useMemo(() => {
    if (!user || !users) return [];
    return users.filter(u => u.id !== user.id).slice(0, 3);
  }, [user, users]);

  const getProjectOwner = (ownerId: string) => users?.find(u => u.id === ownerId);
  
  const isLoading = loadingProjects || loadingEvents || loadingUsers;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className='lg:col-span-2 space-y-6'>
            <h1 className="font-headline text-3xl font-bold tracking-tight">Hey {user?.displayName?.split(' ')[0]}, here&apos;s what&apos;s happening</h1>
            <div className='space-y-6'>
            {feedProjects?.map((project) => {
              const owner = getProjectOwner(project.ownerId);

              return (
                <Card key={project.id} className="transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/10">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="size-11">
                            {owner?.photoURL && <AvatarImage src={owner.photoURL} alt={owner.displayName} />}
                            <AvatarFallback>{owner?.displayName?.substring(0, 2) ?? '??'}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{owner?.displayName}</p>
                            <p className="text-sm text-muted-foreground">Project Owner</p>
                        </div>
                      </div>
                      <Button asChild size="sm" variant="secondary" className='shrink-0 w-full sm:w-auto'>
                        <Link href={`/dashboard/projects/${project.id}`}>View Project</Link>
                      </Button>
                    </div>

                    <div className='pl-0 sm:pl-[60px]'>
                      <h2 className="font-headline text-xl font-semibold">{project.name}</h2>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mt-4">
                          {project.tags?.map((tag) => (
                              <Badge key={tag} variant={tag === 'AI/ML' ? 'default' : 'secondary'}>{tag}</Badge>
                          ))}
                      </div>
                    </div>

                  </CardContent>
                </Card>
              );
            })}
            </div>
        </div>
        <div className="space-y-6 lg:sticky top-24">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg">Recommended Events</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                     {recommendedEvents?.map(event => (
                        <div key={event.id} className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                            <p className="font-semibold">{event.title}</p>
                            <p className="text-sm text-muted-foreground">{new Date(event.date.seconds * 1000).toLocaleDateString()}, {event.location}</p>
                            <Button variant="outline" size="sm" className="mt-3 w-full" asChild>
                                <Link href="/dashboard/events">Learn More</Link>
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
                     {suggestedTeammates?.map((student) => {
                        return (
                            <div key={student.id} className="flex items-center gap-4">
                            <Avatar>
                                {student.photoURL && <AvatarImage src={student.photoURL} alt={student.displayName} />}
                                <AvatarFallback>{student.displayName.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate">{student.displayName}</p>
                                <p className="text-sm text-muted-foreground truncate">{student.skills?.slice(0,2).join(', ')}</p>
                            </div>
                            <Button variant="default" size="sm" asChild>
                              <Link href="/dashboard/teammates">Connect</Link>
                            </Button>
                            </div>
                        );
                        })}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
