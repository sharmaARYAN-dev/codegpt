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
import { ArrowBigUp, MessageSquare, Loader2, Bot } from 'lucide-react';
import { useDoc } from '@/firebase/firestore/use-doc';
import { db } from '@/lib/firebase';
import { doc, collection, addDoc, serverTimestamp, updateDoc, increment, query, orderBy, arrayUnion, deleteDoc, writeBatch } from 'firebase/firestore';
import type { Comment, ForumPost, StudentProfile } from '@/lib/types';
import { useCollection } from '@/firebase/firestore/use-collection';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useAuth } from '@/context/AuthContext';
import { ItemOptionsMenu } from '@/components/item-options-menu';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { useRouter } from 'next/navigation';

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

function EditPostForm({ post, onCancel }: { post: ForumPost, onCancel: () => void }) {
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSave = async () => {
        if (!db) return;
        setIsSubmitting(true);
        const postRef = doc(db, 'forumPosts', post.id);
        const updatedData = { title, content, updatedAt: serverTimestamp() };

        const promise = () => updateDoc(postRef, updatedData).catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({ path: postRef.path, operation: 'update', requestResourceData: updatedData });
            errorEmitter.emit('permission-error', permissionError);
            throw serverError;
        });

        toast.promise(promise, {
            loading: 'Saving changes...',
            success: () => {
                onCancel();
                setIsSubmitting(false);
                return "Post updated successfully!";
            },
            error: () => {
                setIsSubmitting(false);
                return "Failed to update post.";
            }
        });
    }

    return (
        <div className="space-y-4">
             <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="font-headline text-3xl md:text-4xl font-bold tracking-tight bg-transparent border-b-2 border-primary/20 w-full focus:outline-none focus:border-primary" />
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="leading-loose text-muted-foreground whitespace-pre-wrap min-h-[150px]" />
            <div className="flex gap-2 justify-end">
                <Button variant="ghost" onClick={onCancel}>Cancel</Button>
                <Button onClick={handleSave} disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </div>
        </div>
    )
}

function CommentItem({ comment, users, postId }: { comment: Comment, users: StudentProfile[] | null, postId: string }) {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [content, setContent] = useState(comment.content);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const commentAuthor = users?.find(u => u.id === comment.authorId);

    const handleDeleteComment = async () => {
        if (!db) return;
        const commentRef = doc(db, 'forumPosts', postId, 'comments', comment.id);
        const postRef = doc(db, 'forumPosts', postId);

        const promise = () => deleteDoc(commentRef)
            .then(() => updateDoc(postRef, { comments: increment(-1) }))
            .catch(async (serverError) => {
                const permissionError = new FirestorePermissionError({ path: commentRef.path, operation: 'delete' });
                errorEmitter.emit('permission-error', permissionError);
                throw serverError;
            });
        
        toast.promise(promise, {
            loading: 'Deleting comment...',
            success: 'Comment deleted.',
            error: 'Failed to delete comment.'
        });
    }

    const handleUpdateComment = async () => {
        if (!db) return;
        setIsSubmitting(true);
        const commentRef = doc(db, 'forumPosts', postId, 'comments', comment.id);
        const updatedData = { content, updatedAt: serverTimestamp() };

        const promise = () => updateDoc(commentRef, updatedData).catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({ path: commentRef.path, operation: 'update', requestResourceData: updatedData });
            errorEmitter.emit('permission-error', permissionError);
            throw serverError;
        });

        toast.promise(promise, {
            loading: 'Saving changes...',
            success: () => {
                setIsEditing(false);
                setIsSubmitting(false);
                return 'Comment updated.';
            },
            error: () => {
                setIsSubmitting(false);
                return 'Failed to update comment.';
            }
        })
    }

    return (
        <>
            <DeleteConfirmationDialog 
                isOpen={isDeleting}
                onOpenChange={setIsDeleting}
                onConfirm={handleDeleteComment}
                itemName="comment"
            />
            <Card>
                <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className='size-9'>
                                    {commentAuthor?.photoURL && <AvatarImage src={commentAuthor.photoURL} alt={commentAuthor.displayName} />}
                                    <AvatarFallback>{commentAuthor?.displayName?.substring(0, 2) ?? '??'}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{commentAuthor?.displayName}</p>
                                    <p className="text-xs text-muted-foreground">{comment.createdAt?.toDate()?.toLocaleDateString()}</p>
                                </div>
                            </div>
                            {user && user.id === comment.authorId && (
                                <ItemOptionsMenu onEdit={() => setIsEditing(true)} onDelete={() => setIsDeleting(true)} />
                            )}
                        </div>
                </CardHeader>
                <CardContent>
                    {isEditing ? (
                        <div className="space-y-2">
                             <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="min-h-[80px]" />
                             <div className="flex gap-2 justify-end">
                                <Button variant="ghost" size="sm" onClick={() => {setIsEditing(false); setContent(comment.content)}}>Cancel</Button>
                                <Button size="sm" onClick={handleUpdateComment} disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save
                                </Button>
                             </div>
                        </div>
                    ) : (
                        <p className="text-muted-foreground whitespace-pre-wrap">{comment.content}</p>
                    )}
                </CardContent>
            </Card>
        </>
    )
}

export default function PostPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const id = params.id;
  
  const postRef = useMemo(() => db ? doc(db, 'forumPosts', id) : null, [id]);
  const { data: post, loading: loadingPost } = useDoc<ForumPost>(postRef);

  const authorRef = useMemo(() => (db && post) ? doc(db, 'users', post.authorId) : null, [post]);
  const { data: author, loading: loadingAuthor } = useDoc<StudentProfile>(authorRef);

  const commentsPath = useMemo(() => `forumPosts/${id}/comments`, [id]);
  const commentsQuery = useMemo(() => db ? query(collection(db, commentsPath), orderBy('createdAt', 'asc')) : null, [commentsPath]);
  const { data: comments, loading: loadingComments } = useCollection<Comment>(commentsQuery, commentsPath);

  const usersQuery = useMemo(() => db ? collection(db, 'users') : null, []);
  const { data: users, loading: loadingUsers } = useCollection<StudentProfile>(usersQuery, 'users');

  const handleDeletePost = async () => {
    if (!db || !post) return;
    const postRef = doc(db, 'forumPosts', post.id);

    const promise = () => deleteDoc(postRef).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({ path: postRef.path, operation: 'delete' });
        errorEmitter.emit('permission-error', permissionError);
        throw serverError;
    });

    toast.promise(promise, {
        loading: "Deleting post...",
        success: () => {
            router.push('/dashboard/communities');
            return "Post deleted successfully.";
        },
        error: "Failed to delete post."
    })
  }

  const handleAddComment = async () => {
    if (!comment.trim() || !user || !db) return;
    
    setIsSubmitting(true);
    
    const commentData = {
      content: comment,
      authorId: user.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
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
  const isOwner = user && user.id === post.authorId;

  return (
    <>
    <DeleteConfirmationDialog 
        isOpen={isDeleting}
        onOpenChange={setIsDeleting}
        onConfirm={handleDeletePost}
        itemName="post and all its comments"
    />
    <div className="max-w-4xl mx-auto space-y-8">
        {isEditing && post ? <EditPostForm post={post} onCancel={() => setIsEditing(false)} /> : (
            <div>
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{post.community}</Badge>
                          {post.isAiGenerated && (
                              <Badge variant="outline" className='border-primary/50 text-primary'>
                                  <Bot className="mr-1.5 h-3 w-3" />
                                  AI Generated
                              </Badge>
                          )}
                        </div>
                        <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight mt-2">{post.title}</h1>
                    </div>
                    {isOwner && <ItemOptionsMenu onEdit={() => setIsEditing(true)} onDelete={() => setIsDeleting(true)} />}
                </div>
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
        )}

        {!isEditing && (
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
        )}

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
                    {comments.map((c) => (
                        <CommentItem key={c.id} comment={c} users={users} postId={id} />
                    ))}
                </div>
            ) : (
                <p className="text-sm text-center text-muted-foreground">No comments yet. Start the discussion!</p>
            )}
            
        </div>
    </div>
    </>
  );
}
