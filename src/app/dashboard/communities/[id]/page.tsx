'use client';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowBigUp, MessageSquare, Loader2 } from 'lucide-react';
import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { doc, collection, addDoc, serverTimestamp, updateDoc, increment } from 'firebase/firestore';
import type { ForumPost, StudentProfile } from '@/lib/types';
import { useCollection } from '@/firebase/firestore/use-collection';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

function PostSkeleton() {
  return (
     <div className="max-w-4xl mx-auto space-y-8">
        <div className='space-y-4'>
            <Skeleton className="h-10 w-3/4" />
            <div className="flex items-center gap-4">
                <Skeleton className="size-10 rounded-full" />
                <div className='space-y-2'>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>
        </div>
        <Card>
            <CardContent className="p-6 space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </CardContent>
        </Card>
        <div className="space-y-6">
            <Skeleton className="h-8 w-32" />
            <Card><CardContent className="p-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
            <Card><CardContent className="p-6"><Skeleton className="h-16 w-full" /></CardContent></Card>
        </div>
     </div>
  );
}


export default function PostPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  const { user } = useUser();
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const postRef = useMemoFirebase(() => firestore ? doc(firestore, 'forumPosts', params.id) : null, [firestore, params.id]);
  const { data: post, loading: loadingPost } = useDoc<ForumPost>(postRef);

  const authorRef = useMemoFirebase(() => (firestore && post) ? doc(firestore, 'users', post.authorId) : null, [firestore, post]);
  const { data: author, loading: loadingAuthor } = useDoc<StudentProfile>(authorRef);

  // Note: For a real app, comments would be a subcollection. For simplicity, we'll just show a textarea.
  const handleAddComment = () => {
    if (!comment.trim()) return;
    setIsSubmitting(true);
    toast.info("Submitting comment...");
    
    // Simulate API call
    setTimeout(() => {
        toast.success("Comment posted successfully!");
        setComment('');
        setIsSubmitting(false);
    }, 1000);
  }
  
  const handleUpvote = (postId: string) => {
    if (!firestore) return;
    const postDocRef = doc(firestore, 'forumPosts', postId);
    updateDoc(postDocRef, { upvotes: increment(1) }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: postDocRef.path,
            operation: 'update',
            requestResourceData: { upvotes: 'increment' },
        });
        errorEmitter.emit('permission-error', permissionError);
    });
  }

  if (loadingPost || loadingAuthor) {
    return <PostSkeleton />;
  }

  if (!post) {
    return <div className="text-center">Post not found.</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
        <div>
            <Badge variant="secondary">{post.community}</Badge>
            <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight mt-2">{post.title}</h1>
            <div className="flex items-center gap-3 mt-4 text-sm">
                <Avatar className='size-9'>
                    {author?.photoURL && <AvatarImage src={author.photoURL} alt={author.displayName} />}
                    <AvatarFallback>{author?.displayName?.substring(0, 2) ?? '??'}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{author?.displayName}</p>
                    <p className="text-muted-foreground">{post.createdAt?.toDate()?.toLocaleDateString()}</p>
                </div>
            </div>
        </div>

        <Card className="p-0">
            <CardContent className="p-6">
                <p className="leading-loose text-muted-foreground whitespace-pre-wrap">{post.content}</p>
            </CardContent>
            <div className="px-6 pb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <Button variant='outline' size='sm' className='text-primary border-primary/50 hover:bg-primary/10 hover:text-primary' onClick={() => handleUpvote(post.id)}>
                    <ArrowBigUp className="mr-2 h-4 w-4" />
                    Upvote ({post.upvotes})
                </Button>
                <div className='flex items-center gap-1.5'>
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.comments} Comments</span>
                </div>
            </div>
        </Card>

        <div className="space-y-6">
            <h2 className="font-headline text-2xl font-bold">Comments ({post.comments})</h2>
             <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Avatar className='size-9'>
                            {user?.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName ?? ''} />}
                            <AvatarFallback>{user?.displayName?.substring(0, 2) ?? '??'}</AvatarFallback>
                        </Avatar>
                        <p className="font-semibold">{user?.displayName}</p>
                    </div>
                </CardHeader>
                <CardContent>
                    <Textarea 
                        placeholder="Add your comment..." 
                        className="min-h-[100px]"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </CardContent>
                <div className="p-6 pt-0">
                     <Button onClick={handleAddComment} disabled={isSubmitting || !comment.trim()}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Add Comment
                    </Button>
                </div>
            </Card>

            <p className="text-sm text-center text-muted-foreground">No comments yet. Start the discussion!</p>
            
        </div>
    </div>
  );
}
