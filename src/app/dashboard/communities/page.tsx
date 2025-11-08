'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowBigUp, MessageSquare, Bot } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { CreatePostDialog } from '@/components/create-post-dialog';
import { useCollection } from '@/firebase/firestore/use-collection';
import type { ForumPost, Project, StudentProfile } from '@/lib/types';
import { collection, query, orderBy, doc, updateDoc, arrayUnion, limit, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

function CommunitiesSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-0">
            <CardContent className="p-6">
              <div className='mb-4 flex items-center gap-3'>
                <Skeleton className='size-9 rounded-full' />
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-24' />
                  <Skeleton className='h-3 w-16' />
                </div>
                <Skeleton className='h-6 w-20 rounded-full ml-auto' />
              </div>
              <Skeleton className='h-6 w-3/4 mb-2' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-5/6 mt-1' />
            </CardContent>
            <div className="px-6 pb-4 flex items-center gap-4">
              <Skeleton className='h-9 w-28 rounded-md' />
              <Skeleton className='h-5 w-24' />
            </div>
          </Card>
        ))}
      </div>
      <div className="space-y-6 lg:sticky top-24">
        <Card><CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-28 w-full" /><Skeleton className="h-28 w-full" /></CardContent></Card>
      </div>
    </div>
  )
}

export default function CommunitiesPage() {
  const { user } = useAuth();
  const [isCreatePostOpen, setCreatePostOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'AI/ML', 'WebDev', 'Design', 'Startups', 'Gaming', 'General'];

  const postsQuery = useMemo(() => {
    if (!db) return null;
    const coll = collection(db, 'forumPosts');
    if (activeFilter !== 'All') {
      return query(coll, where('community', '==', activeFilter), orderBy('createdAt', 'desc'));
    }
    return query(coll, orderBy('createdAt', 'desc'));
  }, [activeFilter]);
  const { data: forumPosts, loading: loadingPosts } = useCollection<ForumPost>(postsQuery, 'forumPosts');

  const projectsQuery = useMemo(() => db ? query(collection(db, 'projects'), orderBy('createdAt', 'desc'), limit(2)) : null, []);
  const { data: suggestedProjects, loading: loadingProjects } = useCollection<Project>(projectsQuery, 'projects');

  const usersQuery = useMemo(() => db ? collection(db, 'users') : null, []);
  const { data: users, loading: loadingUsers } = useCollection<StudentProfile>(usersQuery, 'users');

  const handleUpvote = (postId: string) => {
    if (!db || !user) {
        toast.error('You must be logged in to upvote.');
        return;
    }
    const postRef = doc(db, 'forumPosts', postId);
    updateDoc(postRef, { upvotes: arrayUnion(user.id) }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: postRef.path,
            operation: 'update',
            requestResourceData: { upvotes: `arrayUnion(${user.id})` },
        });
        errorEmitter.emit('permission-error', permissionError);
    });
  }
  
  const isLoading = loadingPosts || loadingProjects || loadingUsers;

  return (
    <>
      <CreatePostDialog open={isCreatePostOpen} onOpenChange={setCreatePostOpen} />
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">Community</h1>
            <p className="mt-1 text-muted-foreground">Connect, discuss, and grow with other innovators.</p>
          </div>
          <Button onClick={() => setCreatePostOpen(true)}>+ Start a Discussion</Button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {filters.map((filter) => (
            <Button key={filter} variant={activeFilter === filter ? 'default' : 'outline'} size="sm" onClick={() => setActiveFilter(filter)}>
              {filter}
            </Button>
          ))}
        </div>

        {isLoading ? <CommunitiesSkeleton /> :
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-6">
              {forumPosts?.map((post) => {
                const author = users?.find(u => u.id === post.authorId);
                const upvoteCount = post.upvotes?.length || 0;
                return (
                  <Card key={post.id} className="p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20">
                    <Link href={`/dashboard/communities/${post.id}`} className="block p-6" onClick={(e) => {
                       if ((e.target as HTMLElement).closest('button')) {
                          e.preventDefault();
                       }
                    }}>
                      <div className='mb-4 flex items-start sm:items-center gap-3 flex-wrap'>
                        <Avatar className='size-9'>
                          {author?.photoURL && <AvatarImage src={author.photoURL} alt={author.displayName} />}
                          <AvatarFallback>{author?.displayName?.substring(0, 2) ?? '??'}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">{author?.displayName}</p>
                          <p className="text-xs text-muted-foreground">{post.createdAt?.toDate()?.toLocaleDateString()}</p>
                        </div>
                        <div className='ml-auto flex items-center gap-2'>
                          {post.isAiGenerated && (
                              <Badge variant="outline" className='border-primary/50 text-primary'>
                                  <Bot className="mr-1.5 h-3 w-3" />
                                  AI Generated
                              </Badge>
                          )}
                          <Badge variant="secondary" className='shrink-0'>{post.community}</Badge>
                        </div>
                      </div>
                      <h2 className="font-headline text-xl font-semibold">{post.title}</h2>
                      <p className='text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed'>{post.content}</p>
                    </Link>
                    <div className="px-6 pb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <Button variant='outline' size='sm' className='text-primary border-primary/50 hover:bg-primary/10 hover:text-primary' onClick={(e) => {e.stopPropagation(); handleUpvote(post.id)}}>
                        <ArrowBigUp className="mr-2 h-4 w-4" />
                        Upvote ({upvoteCount})
                      </Button>
                      <div className='flex items-center gap-1.5'>
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.comments} Comments</span>
                      </div>
                      <div className="flex-1 min-w-[10px]"></div>
                      <Button size='sm' asChild>
                        <Link href={`/dashboard/communities/${post.id}`} onClick={(e) => e.stopPropagation()}>Join Discussion</Link>
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>

            <div className="space-y-6 lg:sticky top-24">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-lg">Hot Projects</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {suggestedProjects?.map((project) => {
                    const owner = users?.find(u => u.id === project.ownerId);
                    return (
                      <div key={project.id} className="p-3 border rounded-md bg-card hover:bg-muted/50 transition-colors">
                        <div className='flex items-center gap-3'>
                          <Avatar className='size-8'>
                            {owner?.photoURL && <AvatarImage src={owner.photoURL} alt={owner.displayName} />}
                            <AvatarFallback>{owner?.displayName?.substring(0, 2) ?? '??'}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm truncate">{project.name}</p>
                            <p className="text-xs text-muted-foreground truncate">by {owner?.displayName}</p>
                          </div>
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
                        <Button asChild size="sm" variant="secondary" className='mt-3 w-full'>
                          <Link href={`/dashboard/projects/${project.id}`}>View Project</Link>
                        </Button>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          </div>
        }
      </div>
    </>
  );
}
