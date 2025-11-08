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
import { ArrowBigUp, MessageSquare, FolderKanban } from 'lucide-react';
import { collection, query, limit, orderBy, where, Timestamp } from 'firebase/firestore';
import type { Project, Event, StudentProfile, ForumPost } from '@/lib/types';
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
        {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}><CardHeader><div className="flex gap-4"><Skeleton className="size-12 rounded-full" /><div className="flex-1 space-y-3"><Skeleton className="h-5 w-1/4" /><Skeleton className="h-4 w-1/3" /></div></div></CardHeader><CardContent className="space-y-4"><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" /><div className="flex gap-4 pt-2"><Skeleton className="h-9 w-24" /><Skeleton className="h-9 w-24" /></div></CardContent></Card>
        ))}
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

  const postsQuery = useMemo(() => db ? query(collection(db, 'forumPosts'), orderBy('createdAt', 'desc'), limit(5)) : null, []);
  const { data: feedPosts, loading: loadingPosts } = useCollection<ForumPost>(postsQuery, 'forumPosts');

  const projectsQuery = useMemo(() => db ? query(collection(db, 'projects'), orderBy('createdAt', 'desc'), limit(5)) : null, []);
  const { data: hotProjects, loading: loadingProjects } = useCollection<Project>(projectsQuery, 'projects');
  
  const eventsQuery = useMemo(() => {
    if (!db) return null;
    const today = Timestamp.now();
    return query(collection(db, 'events'), where('date', '>=', today), orderBy('date', 'asc'), limit(2));
  }, []);
  const { data: recommendedEvents, loading: loadingEvents } = useCollection<Event>(eventsQuery, 'events');

  const usersQuery = useMemo(() => db ? collection(db, 'users') : null, []);
  const { data: users, loading: loadingUsers } = useCollection<StudentProfile>(usersQuery, 'users');

  const suggestedTeammates = useMemo(() => {
    if (!user || !users) return [];
    
    const currentUserSkills = new Set(user.skills || []);
    const currentUserInterests = new Set(user.interests || []);

    const scoredUsers = users
      .filter(u => u.id !== user.id)
      .map(u => {
        let score = 0;
        const sharedSkills = u.skills?.filter(skill => currentUserSkills.has(skill)) || [];
        const sharedInterests = u.interests?.filter(interest => currentUserInterests.has(interest)) || [];
        
        score += sharedSkills.length * 2;
        score += sharedInterests.length;

        return { ...u, score };
      })
      .filter(u => u.score > 0);

    return scoredUsers.sort((a, b) => b.score - a.score).slice(0, 3);
  }, [user, users]);

  const combinedFeed = useMemo(() => {
    if (!feedPosts || !hotProjects) return [];
    const typedPosts = feedPosts.map(p => ({...p, type: 'post'}));
    const typedProjects = hotProjects.map(p => ({...p, type: 'project'}));

    return [...typedPosts, ...typedProjects].sort((a, b) => {
        const dateA = a.createdAt?.toMillis() || 0;
        const dateB = b.createdAt?.toMillis() || 0;
        return dateB - dateA;
    })

  }, [feedPosts, hotProjects]);
  
  const isLoading = loadingPosts || loadingProjects || loadingEvents || loadingUsers;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className='lg:col-span-2 space-y-6'>
            <h1 className="font-headline text-3xl font-bold tracking-tight">Hey {user?.displayName?.split(' ')[0]}, here&apos;s what&apos;s happening</h1>
            <div className='space-y-6'>
            {combinedFeed?.map((item) => {
              if (item.type === 'post') {
                const post = item as ForumPost;
                const author = users?.find(u => u.id === post.authorId);
                return (
                    <Card key={`post-${post.id}`} className="transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/10">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <Avatar className="size-11">
                                    {author?.photoURL && <AvatarImage src={author.photoURL} alt={author.displayName} />}
                                    <AvatarFallback>{author?.displayName?.substring(0, 2) ?? '??'}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{author?.displayName}</p>
                                    <p className="text-sm text-muted-foreground">Posted in <Link href="/dashboard/communities" className="font-medium text-primary hover:underline">{post.community}</Link></p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Link href={`/dashboard/communities/${post.id}`}>
                                <h2 className="font-headline text-xl font-semibold hover:text-primary transition-colors">{post.title}</h2>
                            </Link>
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{post.content}</p>
                            <div className="flex items-center gap-6 text-sm text-muted-foreground pt-2">
                                <div className='flex items-center gap-1.5'>
                                    <ArrowBigUp className="size-4" />
                                    <span>{post.upvotes?.length || 0} Upvotes</span>
                                </div>
                                <div className='flex items-center gap-1.5'>
                                    <MessageSquare className="h-4 w-4" />
                                    <span>{post.comments} Comments</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
              } else if (item.type === 'project') {
                const project = item as Project;
                const owner = users?.find(u => u.id === project.ownerId);
                return (
                    <Card key={`project-${project.id}`} className="transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/10">
                         <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className='p-2.5 rounded-full bg-secondary'>
                                  <FolderKanban className='size-6 text-secondary-foreground' />
                                </div>
                                <div>
                                    <p className="font-semibold">New Project</p>
                                    <p className="text-sm text-muted-foreground">by <Link href="/dashboard/teammates" className="font-medium text-primary hover:underline">{owner?.displayName}</Link></p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                          <Link href={`/dashboard/projects/${project.id}`}>
                              <h2 className="font-headline text-xl font-semibold hover:text-primary transition-colors">{project.name}</h2>
                          </Link>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{project.description}</p>
                          <div className='mt-4'>
                            <Button asChild>
                              <Link href={`/dashboard/projects/${project.id}`}>View Project</Link>
                            </Button>
                          </div>
                        </CardContent>
                    </Card>
                )
              }
              return null;
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
                            <p className="font-semibold text-sm">{event.title}</p>
                            <p className="text-xs text-muted-foreground">{new Date(event.date.seconds * 1000).toLocaleDateString()}, {event.location}</p>
                            <Button variant="outline" size="sm" className="mt-3 w-full" asChild>
                                <Link href="/dashboard/events">Learn More</Link>
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg">Suggested Connections</CardTitle>
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
