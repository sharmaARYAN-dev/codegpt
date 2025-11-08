'use client';

import { useSearchParams } from 'next/navigation';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection } from 'firebase/firestore';
import type { Project, StudentProfile, Event, ForumPost } from '@/lib/types';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FolderKanban, Users, Calendar, MessageSquare, Search as SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/firebase';

function SearchSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-9 w-1/2" />
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardContent className="p-4 space-y-2"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-1/2" /></CardContent></Card>
          <Card><CardContent className="p-4 space-y-2"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-1/2" /></CardContent></Card>
        </div>
      </div>
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card><CardContent className="p-4 flex items-center gap-4"><Skeleton className="size-12 rounded-full" /><div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-4 w-16" /></div></CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-4"><Skeleton className="size-12 rounded-full" /><div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-4 w-16" /></div></CardContent></Card>
        </div>
      </div>
    </div>
  );
}


export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const projectsQuery = useMemo(() => db ? collection(db, 'projects') : null, [db]);
  const { data: allProjects, loading: loadingProjects } = useCollection<Project>(projectsQuery, 'projects');

  const usersQuery = useMemo(() => db ? collection(db, 'users') : null, [db]);
  const { data: allUsers, loading: loadingUsers } = useCollection<StudentProfile>(usersQuery, 'users');
  
  const eventsQuery = useMemo(() => db ? collection(db, 'events') : null, [db]);
  const { data: allEvents, loading: loadingEvents } = useCollection<Event>(eventsQuery, 'events');

  const postsQuery = useMemo(() => db ? collection(db, 'forumPosts') : null, [db]);
  const { data: allPosts, loading: loadingPosts } = useCollection<ForumPost>(postsQuery, 'forumPosts');

  const searchResults = useMemo(() => {
    if (!query) return null;
    const lowercasedQuery = query.toLowerCase();

    const projects = allProjects?.filter(p => 
        p.name.toLowerCase().includes(lowercasedQuery) ||
        p.description.toLowerCase().includes(lowercasedQuery) ||
        p.tags.some(t => t.toLowerCase().includes(lowercasedQuery))
    ) || [];

    const users = allUsers?.filter(u =>
        u.displayName.toLowerCase().includes(lowercasedQuery) ||
        u.skills.some(s => s.toLowerCase().includes(lowercasedQuery)) ||
        u.interests.some(i => i.toLowerCase().includes(lowercasedQuery))
    ) || [];

    const events = allEvents?.filter(e =>
        e.title.toLowerCase().includes(lowercasedQuery) ||
        e.description.toLowerCase().includes(lowercasedQuery) ||
        e.tags.some(t => t.toLowerCase().includes(lowercasedQuery))
    ) || [];

    const posts = allPosts?.filter(p =>
        p.title.toLowerCase().includes(lowercasedQuery) ||
        p.content.toLowerCase().includes(lowercasedQuery) ||
        p.community.toLowerCase().includes(lowercasedQuery)
    ) || [];
    
    return { projects, users, events, posts };
  }, [query, allProjects, allUsers, allEvents, allPosts]);

  const isLoading = loadingProjects || loadingUsers || loadingEvents || loadingPosts;

  const totalResults = searchResults ? 
    searchResults.projects.length + 
    searchResults.users.length + 
    searchResults.events.length + 
    searchResults.posts.length : 0;
  
  if (isLoading) {
    return <SearchSkeleton />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Search Results</h1>
        {query ? (
             <p className="mt-1 text-muted-foreground">Found {totalResults} results for &quot;{query}&quot;</p>
        ) : (
            <p className="mt-1 text-muted-foreground">Enter a term in the search bar to find projects, people, events, and posts.</p>
        )}
      </div>

      {!query ? (
        <div className="text-center py-16 text-muted-foreground">
            <SearchIcon className="mx-auto h-16 w-16" />
            <p className="mt-4 text-lg font-semibold">Search the UniVerse</p>
            <p className="mt-1 text-sm">Find exactly what you&apos;re looking for.</p>
        </div>
      ) : totalResults === 0 ? (
        <p className="text-center text-muted-foreground pt-16">No results found. Try a different search term.</p>
      ) : (
        <div className="space-y-12">
            {searchResults && searchResults.projects.length > 0 && (
                <section>
                    <h2 className="font-headline text-2xl font-bold mb-4 flex items-center gap-2"><FolderKanban className='size-6 text-primary' /> Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {searchResults.projects.map(project => (
                             <Link href={`/dashboard/projects/${project.id}`} key={project.id} className="block group">
                                <Card className="transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-primary/20 group-hover:border-primary/30">
                                    <CardHeader>
                                        <CardTitle className="font-headline text-lg">{project.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

             {searchResults && searchResults.users.length > 0 && (
                <section>
                    <h2 className="font-headline text-2xl font-bold mb-4 flex items-center gap-2"><Users className='size-6 text-primary' /> Connections</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {searchResults.users.map(user => (
                            <Link href={`/dashboard/teammates`} key={user.id} className="block group">
                                <Card className="transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-primary/20 group-hover:border-primary/30">
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <Avatar className="size-12">
                                            <AvatarImage src={user.photoURL} />
                                            <AvatarFallback>{user.displayName.substring(0, 2)}</AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <p className="font-semibold truncate">{user.displayName}</p>
                                            <p className="text-sm text-muted-foreground truncate">{user.skills.slice(0, 2).join(', ')}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {searchResults && searchResults.events.length > 0 && (
                <section>
                    <h2 className="font-headline text-2xl font-bold mb-4 flex items-center gap-2"><Calendar className='size-6 text-primary' /> Events</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {searchResults.events.map(event => (
                            <Link href={`/dashboard/events`} key={event.id} className="block group">
                                <Card className="transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-primary/20 group-hover:border-primary/30">
                                     <CardHeader>
                                        <CardTitle className="font-headline text-lg">{event.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{event.date.toDate().toLocaleDateString()} &middot; {event.location}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
            
            {searchResults && searchResults.posts.length > 0 && (
                <section>
                    <h2 className="font-headline text-2xl font-bold mb-4 flex items-center gap-2"><MessageSquare className='size-6 text-primary' /> Community Posts</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {searchResults.posts.map(post => (
                            <Link href={`/dashboard/communities/${post.id}`} key={post.id} className="block group">
                                <Card className="transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-primary/20 group-hover:border-primary/30">
                                     <CardHeader>
                                        <CardTitle className="font-headline text-lg">{post.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex items-center justify-between">
                                        <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                                        <Badge variant="secondary">{post.community}</Badge>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
      )}

    </div>
  );
}
