'use client';

import { useCollection, useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, ShieldCheck, Star, Github, Linkedin, Loader2, FileCode2 } from 'lucide-react';
import type { StudentProfile, Project } from '@/lib/types';
import { useMemo, useState } from 'react';
import { EditProfileDialog } from '@/components/edit-profile-dialog';
import { collection, doc, query, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

const reputationIcons = {
  'Top Contributor': Award,
  'Bug Squasher': ShieldCheck,
  'Rising Star': Star,
  'Hackathon Winner': Award,
  'Code Guardian': ShieldCheck,
  'Community Helper': Star
} as const;

function ProfileSkeleton() {
    return (
        <div className="container mx-auto max-w-5xl px-0 sm:px-4 py-2">
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
                        <Card><CardHeader><Skeleton className="h-7 w-32"/></CardHeader><CardContent className="flex flex-wrap gap-2"><Skeleton className="h-6 w-20 rounded-full" /><Skeleton className="h-6 w-16 rounded-full" /></CardContent></Card>
                        <Card><CardHeader><Skeleton className="h-7 w-32"/></CardHeader><CardContent className="space-y-4"><Skeleton className="h-6 w-full" /><Skeleton className="h-6 w-full" /></CardContent></Card>
                    </div>
                </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function ProfilePage() {
  const { user, loading: loadingUser } = useUser();
  const firestore = useFirestore();
  const [isEditProfileOpen, setEditProfileOpen] = useState(false);

  const userProfileRef = useMemoFirebase(() => (firestore && user) ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const { data: userProfile, loading: loadingProfile } = useDoc<StudentProfile>(userProfileRef);

  const userProjectsQuery = useMemoFirebase(() => (firestore && user) ? query(collection(firestore, 'projects'), where('ownerId', '==', user.uid)) : null, [firestore, user]);
  const { data: userProjects, loading: loadingProjects } = useCollection<Project>(userProjectsQuery);

  if (loadingUser || loadingProfile || !userProfile) {
    return <ProfileSkeleton />;
  }

  return (
    <>
    <EditProfileDialog 
        isOpen={isEditProfileOpen} 
        onOpenChange={setEditProfileOpen} 
        userProfile={userProfile} 
    />
    <div className="container mx-auto max-w-5xl px-0 sm:px-4 py-2">
      <Card className="overflow-hidden">
        <div className="h-24 md:h-36 bg-gradient-to-r from-primary/70 to-accent/70" />
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-end -mt-16 sm:-mt-20">
            <Avatar className="h-28 w-28 sm:h-32 sm:w-32 border-4 border-background">
              {userProfile.photoURL && (
                <AvatarImage src={userProfile.photoURL} alt={userProfile.displayName || 'User'} />
              )}
              <AvatarFallback className="text-4xl sm:text-5xl">
                {userProfile.displayName
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="mt-4 sm:ml-6 flex-grow">
              <h1 className="text-2xl sm:text-3xl font-bold font-headline">
                {userProfile.displayName}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">{userProfile.email}</p>
                <div className="flex items-center gap-3 mt-2">
                    {userProfile.socialLinks?.github && (
                        <Button variant="ghost" size="icon" asChild>
                            <a href={userProfile.socialLinks.github} target="_blank" rel="noopener noreferrer"><Github className="h-5 w-5 text-muted-foreground" /></a>
                        </Button>
                    )}
                    {userProfile.socialLinks?.linkedin && (
                        <Button variant="ghost" size="icon" asChild>
                            <a href={userProfile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin className="h-5 w-5 text-muted-foreground" /></a>
                        </Button>
                    )}
                </div>
            </div>
            <Button variant="outline" className="mt-4 sm:mt-0 w-full sm:w-auto" onClick={() => setEditProfileOpen(true)}>
              Edit Profile
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-xl">About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Aspiring full-stack developer and AI enthusiast. Passionate
                    about building products that make a difference. Currently a
                    1st year Computer Science student.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-xl">My Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingProjects ? <Loader2 className="animate-spin" /> : 
                    !userProjects || userProjects.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No projects yet. Start creating!</p>
                    ) : (
                      <div className='space-y-4'>
                        {userProjects.map(project => (
                          <Link href={`/dashboard/projects/${project.id}`} key={project.id}>
                            <div className="p-3 border rounded-md hover:bg-muted/50 transition-colors">
                              <h3 className="font-semibold">{project.name}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )
                  }
                </CardContent>
              </Card>
            </div>
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Skills</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {userProfile.skills?.map((skill) => (
                    <Badge key={skill} variant="secondary" className='text-sm'>
                      {skill}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Interests</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {userProfile.interests?.map((interest) => (
                    <Badge key={interest} variant="outline" className='text-sm'>
                      {interest}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Reputation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userProfile.reputation?.map((rep) => {
                    const Icon = reputationIcons[rep.label as keyof typeof reputationIcons] || Star;
                    return (
                      <div key={rep.label} className="flex items-center gap-3 text-sm">
                        <Icon className={`h-5 w-5 ${rep.color}`} />
                        <span className='font-medium'>{rep.label}</span>
                      </div>
                    )
                  })}
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
