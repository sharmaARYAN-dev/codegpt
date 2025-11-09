'use client';

import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, ShieldCheck, Star, Github, Linkedin, Loader2, FileCode2, Trash2, Bookmark, Calendar } from 'lucide-react';
import type { StudentProfile, Project, Event } from '@/lib/types';
import { useMemo, useState } from 'react';
import { EditProfileDialog } from '@/components/edit-profile-dialog';
import { collection, doc, query, where, deleteDoc, arrayRemove, updateDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useDoc } from '@/firebase/firestore/use-doc';
import { db } from '@/lib/firebase';
import { ItemOptionsMenu } from '@/components/item-options-menu';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { toast } from 'sonner';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { CreateProjectDialog } from '@/components/create-project-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { notFound } from 'next/navigation';

function ProfileSkeleton() {
    return (
        <div className="space-y-8">
             <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">My Profile</h1>
                <p className="mt-1 text-muted-foreground">This is your personal space. Customize it to reflect who you are.</p>
            </div>
            <Card className="overflow-hidden">
                <Skeleton className="h-24 md:h-36" />
                <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-end -mt-16 sm:-mt-20">
                    <Skeleton className="h-28 w-28 sm:h-32 sm:w-32 rounded-full border-4 border-background" />
                    <div className="mt-4 sm:ml-6 flex-grow space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-5 w-64" />
                    </div>
                    <Skeleton className="h-10 w-32 mt-4 sm:mt-0" />
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                       <Card><CardHeader><Skeleton className="h-7 w-32"/></CardHeader><CardContent><Skeleton className="h-16 w-full"/></CardContent></Card>
                       <Card><CardHeader><Skeleton className="h-7 w-32"/></CardHeader><CardContent><Skeleton className="h-12 w-full"/></CardContent></Card>
                    </div>
                    <div className="space-y-8">
                        <Card><CardHeader><Skeleton className="h-7 w-32"/></CardHeader><CardContent className="flex flex-wrap gap-2"><Skeleton className="h-6 w-20 rounded-full" /><Skeleton className="h-6 w-24 rounded-full" /></CardContent></Card>

                        <Card><CardHeader><Skeleton className="h-7 w-32"/></CardHeader><CardContent className="flex flex-wrap gap-2"><Skeleton className="h-6 w-16 rounded-full" /><Skeleton className="h-6 w-16 rounded-full" /></CardContent></Card>
                        <Card><CardHeader><Skeleton className="h-7 w-32"/></CardHeader><CardContent className="space-y-4"><Skeleton className="h-6 w-full" /><Skeleton className="h-6 w-full" /></CardContent></Card>
                    </div>
                </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  const { user: currentUser } = useAuth();
  const userId = params.id;
  const isCurrentUserProfile = currentUser?.id === userId;

  const [isEditProfileOpen, setEditProfileOpen] = useState(false);
  const [isCreateProjectOpen, setCreateProjectOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{ id: string, name: string } | null>(null);

  const userProfileRef = useMemo(() => db ? doc(db, 'users', userId) : null, [userId]);
  const { data: userProfile, loading: loadingUser } = useDoc<StudentProfile>(userProfileRef);

  const userProjectsQuery = useMemo(() => (db && userId) ? query(collection(db, 'projects'), where('ownerId', '==', userId)) : null, [userId]);
  const { data: userProjects, loading: loadingProjects } = useCollection<Project>(userProjectsQuery, `projects_user_${userId}`);

  const bookmarkedProjectsQuery = useMemo(() => (db && userProfile && userProfile.bookmarks && userProfile.bookmarks.length > 0) ? query(collection(db, 'projects'), where('__name__', 'in', userProfile.bookmarks)) : null, [userProfile]);
  const { data: bookmarkedProjects, loading: loadingBookmarkedProjects } = useCollection<Project>(bookmarkedProjectsQuery, `users/${userId}/bookmarks`);
  
  const bookmarkedEventsQuery = useMemo(() => (db && userProfile && userProfile.bookmarkedEvents && userProfile.bookmarkedEvents.length > 0) ? query(collection(db, 'events'), where('__name__', 'in', userProfile.bookmarkedEvents)) : null, [userProfile]);
  const { data: bookmarkedEvents, loading: loadingBookmarkedEvents } = useCollection<Event>(bookmarkedEventsQuery, `users/${userId}/bookmarkedEvents`);


  const handleDeleteProject = (project: { id: string, name: string }) => {
    setProjectToDelete(project);
  }

  const confirmDeleteProject = async () => {
    if (!db || !projectToDelete) return;

    const projectRef = doc(db, 'projects', projectToDelete.id);
    const promise = () => deleteDoc(projectRef).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({ path: projectRef.path, operation: 'delete' });
        errorEmitter.emit('permission-error', permissionError);
        throw serverError;
    });

    toast.promise(promise, {
        loading: `Deleting ${projectToDelete.name}...`,
        success: 'Project deleted successfully.',
        error: 'Failed to delete project.'
    });
    setProjectToDelete(null);
  }
  
  const handleUnbookmark = (projectId: string, projectName: string) => {
    if (!db || !currentUser) return;
    
    const userRef = doc(db, 'users', currentUser.id);
    const promise = () => updateDoc(userRef, {
        bookmarks: arrayRemove(projectId)
    }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: userRef.path,
            operation: 'update',
            requestResourceData: { bookmarks: `arrayRemove(${projectId})` },
        });
        errorEmitter.emit('permission-error', permissionError);
        throw serverError;
    });

    toast.promise(promise, {
        loading: `Removing ${projectName} from bookmarks...`,
        success: 'Project unbookmarked.',
        error: 'Failed to unbookmark project.'
    });
  }
  
  const handleUnbookmarkEvent = (eventId: string, eventName: string) => {
    if (!db || !currentUser) return;
    
    const userRef = doc(db, 'users', currentUser.id);
    const promise = () => updateDoc(userRef, {
        bookmarkedEvents: arrayRemove(eventId)
    }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: userRef.path,
            operation: 'update',
            requestResourceData: { bookmarkedEvents: `arrayRemove(${eventId})` },
        });
        errorEmitter.emit('permission-error', permissionError);
        throw serverError;
    });

    toast.promise(promise, {
        loading: `Removing ${eventName} from bookmarks...`,
        success: 'Event unbookmarked.',
        error: 'Failed to unbookmark event.'
    });
  }

  if (loadingUser) {
    return <ProfileSkeleton />;
  }

  if (!userProfile) {
    return notFound();
  }

  const isLoading = loadingProjects || loadingBookmarkedProjects || loadingBookmarkedEvents;

  return (
    <>
    {isCurrentUserProfile && (
      <>
        <EditProfileDialog 
            isOpen={isEditProfileOpen} 
            onOpenChange={setEditProfileOpen} 
            userProfile={userProfile} 
        />
         <CreateProjectDialog 
            open={isCreateProjectOpen} 
            onOpenChange={setCreateProjectOpen} 
        />
        <DeleteConfirmationDialog 
            isOpen={!!projectToDelete}
            onOpenChange={() => setProjectToDelete(null)}
            onConfirm={confirmDeleteProject}
            itemName={projectToDelete?.name ?? 'project'}
        />
      </>
    )}
    <div className="space-y-8">
        <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">
              <span className="animate-twinkle bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {isCurrentUserProfile ? "My Profile" : userProfile.displayName}
              </span>
            </h1>
            <p className="mt-1 text-muted-foreground">{isCurrentUserProfile ? "This is your personal space. Customize it to reflect who you are." : `Viewing ${userProfile.displayName}'s profile.`}</p>
        </div>
      <Card className="overflow-hidden">
        <div className="h-24 md:h-36 bg-gradient-to-r from-primary/70 to-accent/70" />
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-end -mt-16 sm:-mt-20">
            <Avatar className="h-28 w-28 sm:h-32 sm:w-32 border-4 border-background shrink-0">
              {userProfile.photoURL && (
                <AvatarImage src={userProfile.photoURL} alt={userProfile.displayName || 'User'} />
              )}
              <AvatarFallback className="text-4xl sm:text-5xl">
                {userProfile.displayName
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('') || '??'}
              </AvatarFallback>
            </Avatar>
            <div className="mt-4 sm:ml-6 flex-grow min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold font-headline truncate">
                {userProfile.displayName}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground truncate">{userProfile.email}</p>
                <div className="flex items-center gap-1 sm:gap-3 mt-2 -ml-2">
                    {userProfile.links?.github && (
                        <Button variant="ghost" size="icon" asChild>
                            <a href={userProfile.links.github} target="_blank" rel="noopener noreferrer"><Github className="h-5 w-5 text-muted-foreground" /></a>
                        </Button>
                    )}
                    {userProfile.links?.linkedin && (
                        <Button variant="ghost" size="icon" asChild>
                            <a href={userProfile.links.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin className="h-5 w-5 text-muted-foreground" /></a>
                        </Button>
                    )}
                </div>
            </div>
            {isCurrentUserProfile && (
              <Button variant="outline" className="mt-4 sm:mt-0 w-full sm:w-auto shrink-0" onClick={() => setEditProfileOpen(true)}>
                Edit Profile
              </Button>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-xl">About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {userProfile.bio || 'No bio added yet.'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingProjects ? <Loader2 className="animate-spin" /> : 
                    !userProjects || userProjects.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                        <FileCode2 className="mx-auto h-12 w-12" />
                        <p className="mt-4 font-semibold">No projects yet.</p>
                        {isCurrentUserProfile ? (
                            <>
                                <p className="mt-1 text-sm">Start creating and share your work!</p>
                                <Button asChild variant="secondary" className="mt-4" onClick={() => setCreateProjectOpen(true)}>
                                   <p>Create a Project</p>
                                </Button>
                            </>
                        ) : (
                            <p className="mt-1 text-sm">{userProfile.displayName} hasn't added any projects yet.</p>
                        )}
                      </div>
                    ) : (
                      <div className='space-y-4'>
                        {userProjects.map(project => (
                            <div key={project.id} className="group flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 hover:border-primary/30 transition-colors">
                                <Link href={`/dashboard/projects/${project.id}`} className="flex-1 min-w-0">
                                    <h3 className="font-semibold truncate">{project.name}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                                </Link>
                                {isCurrentUserProfile && (
                                    <div className='opacity-0 group-hover:opacity-100 transition-opacity pl-2'>
                                        <ItemOptionsMenu 
                                            onEdit={() => { toast.info("Edit your project from the project page.")}} 
                                            onDelete={() => handleDeleteProject({id: project.id, name: project.name})}
                                        />
                                    </div>
                                )}
                          </div>
                        ))}
                      </div>
                    )
                  }
                </CardContent>
              </Card>
              
               {isCurrentUserProfile && (<Card>
                <CardHeader>
                  <CardTitle className="font-headline text-xl">My Bookmarks</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="projects">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="projects">Projects</TabsTrigger>
                      <TabsTrigger value="events">Events</TabsTrigger>
                    </TabsList>
                    <TabsContent value="projects" className='mt-4'>
                        {loadingBookmarkedProjects ? <Loader2 className="animate-spin" /> : 
                        !bookmarkedProjects || bookmarkedProjects.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                            <Bookmark className="mx-auto h-12 w-12" />
                            <p className="mt-4 font-semibold">No bookmarked projects.</p>
                            <p className="mt-1 text-sm">Explore projects and bookmark your favorites!</p>
                            <Button asChild variant="secondary" className="mt-4">
                              <Link href="/dashboard/projects">Explore Projects</Link>
                            </Button>
                          </div>
                        ) : (
                          <div className='space-y-4'>
                            {bookmarkedProjects.map(project => (
                                <div key={project.id} className="group flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 hover:border-primary/30 transition-colors">
                                    <Link href={`/dashboard/projects/${project.id}`} className="flex-1 min-w-0">
                                        <h3 className="font-semibold truncate">{project.name}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                                    </Link>
                                    <div className='opacity-0 group-hover:opacity-100 transition-opacity pl-2'>
                                        <Button size="icon" variant="ghost" className='h-8 w-8' onClick={() => handleUnbookmark(project.id, project.name)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                              </div>
                            ))}
                          </div>
                        )
                      }
                    </TabsContent>
                    <TabsContent value="events" className='mt-4'>
                      {loadingBookmarkedEvents ? <Loader2 className="animate-spin" /> : 
                        !bookmarkedEvents || bookmarkedEvents.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                            <Calendar className="mx-auto h-12 w-12" />
                            <p className="mt-4 font-semibold">No bookmarked events.</p>
                            <p className="mt-1 text-sm">Explore events and bookmark the ones you're interested in!</p>
                            <Button asChild variant="secondary" className="mt-4">
                              <Link href="/dashboard/events">Explore Events</Link>
                            </Button>
                          </div>
                        ) : (
                          <div className='space-y-4'>
                            {bookmarkedEvents.map(event => (
                                <div key={event.id} className="group flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 hover:border-primary/30 transition-colors">
                                    <Link href={`/dashboard/events`} className="flex-1 min-w-0">
                                        <h3 className="font-semibold truncate">{event.title}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{event.date.toDate().toLocaleDateString()}</p>
                                    </Link>
                                    <div className='opacity-0 group-hover:opacity-100 transition-opacity pl-2'>
                                        <Button size="icon" variant="ghost" className='h-8 w-8' onClick={() => handleUnbookmarkEvent(event.id, event.title)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                              </div>
                            ))}
                          </div>
                        )
                      }
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>)}

            </div>
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Skills</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {userProfile.skills?.length > 0 ? userProfile.skills?.map((skill) => (
                    <Badge key={skill} variant="secondary" className='text-sm capitalize'>
                      {skill}
                    </Badge>
                  )) : <p className="text-sm text-muted-foreground">No skills added yet.</p>}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Interests</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {userProfile.interests?.length > 0 ? userProfile.interests?.map((interest) => (
                    <Badge key={interest} variant="outline" className='text-sm capitalize'>
                      {interest}
                    </Badge>
                  )) : <p className="text-sm text-muted-foreground">No interests added yet.</p>}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
}
