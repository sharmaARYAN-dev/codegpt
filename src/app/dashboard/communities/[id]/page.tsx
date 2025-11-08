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
import { useDoc } from '@/firebase/firestore/use-doc';
import { db } from '@/lib/firebase';
import { doc, collection, addDoc, serverTimestamp, updateDoc, increment, query, orderBy, arrayUnion } from 'firebase/firestore';
import type { Comment, ForumPost, StudentProfile } from '@/lib/types';
import { useCollection } from '@/firebase/firestore/use-collection';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useAuth } from '@/context/AuthContext';

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
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const id = params.id;
  
  const postRef = useMemo(() => db ? doc(db, 'forumPosts', id) : null, [id]);
  const { data: post, loading: loadingPost } = useDoc<ForumPost>(postRef);

  const authorRef = useMemo(() => (db && post) ? doc(db, 'users', post.authorId) : null, [post]);
  const { data: author, loading: loadingAuthor } = useDoc<StudentProfile>(authorRef);

  const commentsPath = useMemo(() => `forumPosts/${id}/comments`, [id]);
  const commentsQuery = useMemo(() => db ? query(collection(db, commentsPath), orderBy('createdAt', 'asc')) : null, [db, commentsPath]);
  const { data: comments, loading: loadingComments } = useCollection<Comment>(commentsQuery, commentsPath);

  const usersQuery = useMemo(() => db ? collection(db, 'users') : null, [db]);
  const { data: users, loading: loadingUsers } = useCollection<StudentProfile>(usersQuery, 'users');

  const handleAddComment = async () => {
    if (!comment.trim() || !user || !db) return;
    
    setIsSubmitting(true);
    
    const commentData = {
      content: comment,
      authorId: user.id,
      createdAt: serverTimestamp(),
    };

    const collectionRef = collection(db, 'forumPosts', id, 'comments');
    const postDocRef = doc(db, 'forumPosts', id);
    
    const promise = () => addDoc(collectionRef, commentData).then(() => {
        return updateDoc(postDocRef, { comments: increment(1) });
    }).catch(async (serverError) => {
        const isWriteError = serverError.message.includes('comments');
        const permissionError = new FirestorePermissionError({
            path: isWriteError ? collectionRef.path : postDocRef.path,
            operation: isWriteError ? 'create' : 'update',
            requestResourceData: isWriteError ? commentData : { comments: 'increment' },
        });
        errorEmitter.emit('permission-error', permissionError);
        throw serverError;
    });

    toast.promise(promise, {
      loading: 'Submitting comment...',
      success: () => {
        setComment('');
        setIsSubmitting(false);
        return "Comment posted successfully!";
      },
      error: (err) => {
        setIsSubmitting(false);
        return 'There was a problem posting your comment.';
      }
    });
  }
  
  const handleUpvote = (postId: string) => {
    if (!db || !user) {
        toast.error('You must be logged in to upvote.');
        return;
    }
    const postDocRef = doc(db, 'forumPosts', postId);
    updateDoc(postDocRef, { upvotes: arrayUnion(user.id) }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: postDocRef.path,
            operation: 'update',
            requestResourceData: { upvotes: `arrayUnion(${user.id})` },
        });
        errorEmitter.emit('permission-error', permissionError);
    });
  }

  const isLoading = loadingPost || loadingAuthor || loadingComments || loadingUsers;

  if (isLoading) {
    return <PostSkeleton />;
  }

  if (!post) {
    return <div className="text-center">Post not found.</div>
  }

  const upvoteCount = post.upvotes?.length || 0;

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
                    Upvote ({upvoteCount})
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

            {comments && comments.length > 0 ? (
                <div className="space-y-4">
                    {comments.map((c) => {
                        const commentAuthor = users?.find(u => u.id === c.authorId);
                        return (
                            <Card key={c.id}>
                                <CardHeader>
                                     <div className="flex items-center gap-3">
                                        <Avatar className='size-9'>
                                            {commentAuthor?.photoURL && <AvatarImage src={commentAuthor.photoURL} alt={commentAuthor.displayName} />}
                                            <AvatarFallback>{commentAuthor?.displayName?.substring(0, 2) ?? '??'}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{commentAuthor?.displayName}</p>
                                            <p className="text-xs text-muted-foreground">{c.createdAt?.toDate()?.toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground whitespace-pre-wrap">{c.content}</p>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <p className="text-sm text-center text-muted-foreground">No comments yet. Start the discussion!</p>
            )}
            
        </div>
    </div>
  );
}
