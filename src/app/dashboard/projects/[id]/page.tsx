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
import { MessageSquare, Users, GitFork, ExternalLink, Loader2, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useDoc } from '@/firebase/firestore/use-doc';
import { collection, doc } from 'firebase/firestore';
import type { Project, StudentProfile } from '@/lib/types';
import { useCollection } from '@/firebase/firestore/use-collection';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useMemo } from 'react';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

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
            <Card><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent><Skeleton className="h-16 w-full" /></CardContent></Card>
          </div>
          <div className="space-y-8"><Card><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></CardContent></Card></div>
        </div>
     </div>
  );
}


export default function ProjectWorkspacePage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const id = params.id;
  const projectRef = useMemo(() => db ? doc(db, 'projects', id) : null, [id]);
  const { data: project, loading: loadingProject } = useDoc<Project>(projectRef);

  const usersQuery = useMemo(() => db ? collection(db, 'users') : null, [db]);
  const { data: users, loading: loadingUsers } = useCollection<StudentProfile>(usersQuery, 'users');

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
    toast.info("Request Sent!", {
      description: `Your request to join ${project?.name} has been sent to the project owner.`,
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

  const isOwner = user && project && user.id === project.ownerId;

  if (loadingProject || loadingUsers) {
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
            <span>0 Comments</span>
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
                Comments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className='text-sm text-muted-foreground'>No comments yet. Be the first to share your thoughts!</p>
               <Button variant="outline">Add Comment</Button>
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
