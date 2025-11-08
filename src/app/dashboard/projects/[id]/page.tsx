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
import { MessageSquare, Users, GitFork, ExternalLink, Loader2, Share2, Send } from 'lucide-react';
import Link from 'next/link';
import { useDoc } from '@/firebase/firestore/use-doc';
import { collection, doc, query, orderBy, addDoc, serverTimestamp, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import type { Project, StudentProfile, ChatMessage } from '@/lib/types';
import { useCollection } from '@/firebase/firestore/use-collection';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useMemo, useState } from 'react';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { ScrollArea } from '@/components/ui/scroll-area';

function ProjectWorkspaceSkeleton() {
  return (
     <div className="space-y-8">
        <div className='flex flex-col sm:flex-row justify-between items-start gap-4'>
            <div className='space-y-3'>
                <Skeleton className="h-10 w-64 md:w-80" />
                <div className="flex flex-wrap gap-2 mt-3">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
            </div>
            <Skeleton className="h-12 w-full sm:w-32 rounded-md" />
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-28" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <Card><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent><Skeleton className="h-24 w-full" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4"><Skeleton className="h-20 w-full" /><Skeleton className="h-20 w-full" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent><Skeleton className="h-32 w-full" /></CardContent></Card>
          </div>
          <div className="space-y-8"><Card><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></CardContent></Card></div>
        </div>
     </div>
  );
}


export default function ProjectWorkspacePage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const id = params.id;
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const projectRef = useMemo(() => db ? doc(db, 'projects', id) : null, [id]);
  const { data: project, loading: loadingProject } = useDoc<Project>(projectRef);

  const usersQuery = useMemo(() => db ? collection(db, 'users') : null, []);
  const { data: users, loading: loadingUsers } = useCollection<StudentProfile>(usersQuery, 'users');

  const chatQuery = useMemo(() => db ? query(collection(db, 'projects', id, 'chat'), orderBy('createdAt', 'asc')) : null, [db, id]);
  const { data: chatMessages, loading: loadingChat } = useCollection<ChatMessage>(chatQuery, `projects/${id}/chat`);

  const teamMembers = useMemo(() => {
    if (!project || !users) return [];
    const memberUids = project.members?.map(m => m.uid) || [];
    if (!memberUids.includes(project.ownerId)) {
        memberUids.push(project.ownerId);
    }
    return users.filter(u => memberUids.includes(u.id));
  }, [project, users]);

  const openRoles = [
    {
      title: 'UI/UX Designer',
      description: 'Passionate about creating beautiful and intuitive user interfaces.',
      avatar: 'https://picsum.photos/seed/role1/200/200',
    },
    {
      title: 'ML Engineer',
      description: 'Experienced in building and deploying machine learning models.',
      avatar: 'https://picsum.photos/seed/role2/200/200',
    },
  ];

  const handleJoinTeam = () => {
    if (!db || !user || !project) {
        toast.error("You must be logged in to join a team.");
        return;
    }
    
    const projectDocRef = doc(db, 'projects', project.id);
    const requestData = {
        uid: user.id,
        message: `User ${user.displayName} wants to join the project.`,
        createdAt: new Date(),
    };

    const promise = updateDoc(projectDocRef, {
        joinRequests: arrayUnion(requestData)
    });

    toast.promise(promise, {
        loading: "Sending your request...",
        success: `Your request to join ${project.name} has been sent to the project owner.`,
        error: "Failed to send join request."
    });
  }
  
  const handleApply = (role: string) => {
    toast.info("Application Sent!", {
      description: `Your application for the ${role} role has been submitted.`,
    });
  }

  const handleShareProject = async () => {
    if (!project) return;
    const shareData = {
      title: `Check out this project on uniVerse: ${project.name}`,
      text: project.description,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Project link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Could not share project.");
    }
  };

  const handleAddComment = async () => {
    if (!db || !user || !comment.trim()) return;

    setIsSubmitting(true);

    const messageData = {
        senderId: user.id,
        body: comment,
        createdAt: serverTimestamp(),
    };

    const collectionRef = collection(db, 'projects', id, 'chat');
    const projectDocRef = doc(db, 'projects', id);

    const promise = () => addDoc(collectionRef, messageData).then(() => {
        return updateDoc(projectDocRef, { commentCount: increment(1) });
    }).catch(async (serverError) => {
        const isWriteError = serverError.message.includes('chat');
        const permissionError = new FirestorePermissionError({
            path: isWriteError ? collectionRef.path : projectDocRef.path,
            operation: isWriteError ? 'create' : 'update',
            requestResourceData: isWriteError ? messageData : { commentCount: 'increment' },
        });
        errorEmitter.emit('permission-error', permissionError);
        throw serverError;
    });

    toast.promise(promise, {
        loading: "Sending message...",
        success: () => {
            setComment('');
            setIsSubmitting(false);
            return "Message sent!";
        },
        error: "Failed to send message."
    })
  }

  const isOwner = user && project && user.id === project.ownerId;
  const isLoading = loadingProject || loadingUsers || loadingChat;

  if (isLoading) {
    return <ProjectWorkspaceSkeleton />;
  }

  if (!project) {
    return <div>Project not found.</div>
  }

  return (
    <div className="space-y-8">
        <div className='flex flex-col sm:flex-row justify-between items-start gap-4'>
            <div className="flex-1">
                <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight">
                {project.name}
                </h1>
                <div className="flex flex-wrap gap-2 mt-3">
                {project.tags.map((tag) => (
                    <Badge
                    key={tag}
                    variant={
                        tag === 'ai/ml' || tag === 'python' ? 'default' : 'secondary'
                    }
                    className="capitalize"
                    >
                    {tag}
                    </Badge>
                ))}
                </div>
            </div>
            <div className='flex w-full sm:w-auto items-center gap-2'>
              {isOwner ? (
                  <>
                    <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={handleShareProject}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                    </Button>
                    <Button size="lg" className="w-full sm:w-auto" disabled>
                        Manage Project
                    </Button>
                  </>
              ) : (
                <Button size="lg" className="w-full sm:w-auto shrink-0" onClick={handleJoinTeam}>
                    Request to Join
                </Button>
              )}
            </div>
        </div>
      
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
        <div className='flex items-center gap-2'>
            <Users className='size-4' />
            <span>{teamMembers.length} Member{teamMembers.length !== 1 && 's'}</span>
        </div>
        <div className='flex items-center gap-2'>
            <GitFork className='size-4' />
            <span>{project.repo ? 'Repository' : 'No Repository'}</span>
        </div>
         <div className='flex items-center gap-2'>
            <MessageSquare className='size-4' />
            <span>{project.commentCount || 0} Comments</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>
                Project Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {project.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {teamMembers.map((member) => {
                return (
                  <div key={member.id} className="flex items-center gap-4 p-3 rounded-md border bg-card hover:bg-muted/50 transition-colors">
                    <Avatar className="size-12">
                      {member.photoURL && <AvatarImage src={member.photoURL} alt={member.displayName} />}
                      <AvatarFallback>
                        {member.displayName.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-semibold text-base truncate">{member.displayName}</p>
                      <p className="text-sm text-muted-foreground">
                        {project.ownerId === member.id ? 'Project Owner' : 'Member'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Project Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <ScrollArea className="h-[400px] w-full pr-4">
                    <div className='space-y-6'>
                        {chatMessages && chatMessages.length > 0 ? (
                            chatMessages.map(msg => {
                                const sender = users?.find(u => u.id === msg.senderId);
                                return (
                                    <div key={msg.id} className="flex items-start gap-3">
                                        <Avatar className='size-9'>
                                            {sender?.photoURL && <AvatarImage src={sender.photoURL} alt={sender.displayName} />}
                                            <AvatarFallback>{sender?.displayName?.substring(0, 2) ?? '??'}</AvatarFallback>
                                        </Avatar>
                                        <div className='flex-1'>
                                            <div className='flex items-baseline gap-2'>
                                                <p className="font-semibold">{sender?.displayName}</p>
                                                <p className="text-xs text-muted-foreground">{msg.createdAt?.toDate()?.toLocaleTimeString()}</p>
                                            </div>
                                            <p className="text-muted-foreground">{msg.body}</p>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <p className="text-sm text-center text-muted-foreground py-8">No comments yet. Be the first to share your thoughts!</p>
                        )}
                    </div>
                </ScrollArea>
               <div className='flex items-center gap-2 mt-4'>
                <Avatar className='size-9'>
                    {user?.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName ?? ''} />}
                    <AvatarFallback>{user?.displayName?.substring(0, 2) ?? '??'}</AvatarFallback>
                </Avatar>
                <Input 
                    placeholder="Add a comment..." 
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment()}}
                />
                <Button onClick={handleAddComment} disabled={isSubmitting || !comment.trim()}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
               </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8 lg:sticky top-24">
          <Card>
            <CardHeader>
              <CardTitle>
                Open Roles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {openRoles.map((role) => (
                    <div key={role.title} className="flex items-start gap-4 p-3 rounded-md border bg-card hover:bg-muted/50 transition-colors">
                       <Avatar className='mt-1'>
                            {role.avatar && <AvatarImage src={role.avatar} />}
                            <AvatarFallback>
                            {role.title.substring(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="font-semibold">{role.title}</p>
                            <p className="text-sm text-muted-foreground line-clamp-2">{role.description}</p>
                            <Button size="sm" variant="secondary" className='mt-2' onClick={() => handleApply(role.title)}>Apply</Button>
                        </div>
                    </div>
                ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle>
                    Project Links
                </CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
                {project.demoLink ? (
                  <Link href={project.demoLink} target="_blank" rel="noopener noreferrer" className='flex items-center gap-3 p-3 -mx-3 rounded-md text-sm text-muted-foreground hover:bg-muted/50 hover:text-primary transition-colors'>
                      <ExternalLink className='size-4' />
                      <span>View Live Demo</span>
                  </Link>
                ) : null}
                 {project.repo ? (
                  <Link href={project.repo} target="_blank" rel="noopener noreferrer" className='flex items-center gap-3 p-3 -mx-3 rounded-md text-sm text-muted-foreground hover:bg-muted/50 hover:text-primary transition-colors'>
                      <GitFork className='size-4' />
                      <span>GitHub Repository</span>
                  </Link>
                 ) : null}
                 {!project.demoLink && !project.repo && (
                    <p className="text-sm text-muted-foreground py-2">No links provided yet.</p>
                 )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
