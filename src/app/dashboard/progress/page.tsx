'use client';

import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Award,
  ShieldCheck,
  Star,
  Trophy,
  BarChart,
  GitPullRequest,
  CheckCircle,
} from 'lucide-react';
import type { StudentProfile, Project } from '@/lib/types';
import { useMemo } from 'react';
import { collection, doc, query, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useCollection } from '@/firebase/firestore/use-collection';
import { Progress } from '@/components/ui/progress';

const badgeIcons = {
  'Rookie Collaborator': Trophy,
  'Reliable Partner': ShieldCheck,
  'Expert Contributor': Award,
  'Project Leader': Star,
  'Top Rated': Award,
} as const;

function ProgressSkeleton() {
  return (
    <div className="space-y-8">
       <div className="text-center">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-5 w-64 mx-auto mt-2" />
        </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card><CardHeader><Skeleton className="h-6 w-32" /></CardHeader><CardContent><Skeleton className="h-10 w-24" /></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-6 w-32" /></CardHeader><CardContent><Skeleton className="h-10 w-24" /></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-6 w-32" /></CardHeader><CardContent><Skeleton className="h-10 w-24" /></CardContent></Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card>
            <CardHeader><Skeleton className="h-7 w-40" /></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-5 w-full" /></div>
              <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-5 w-full" /></div>
              <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-5 w-full" /></div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader><Skeleton className="h-7 w-40" /></CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const { user, loading: loadingUser } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => (firestore && user) ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const { data: userProfile, loading: loadingProfile } = useDoc<StudentProfile>(userProfileRef);

  const userProjectsQuery = useMemoFirebase(() => (firestore && user) ? query(collection(firestore, 'projects'), where('memberIds', 'array-contains', user.uid)) : null, [firestore, user]);
  const { data: userProjects, loading: loadingProjects } = useCollection<Project>(userProjectsQuery);

  const level = userProfile?.level || 1;
  const xp = userProfile?.xp || 0;
  const xpForNextLevel = level * 150;
  const progressPercentage = (xp / xpForNextLevel) * 100;
  
  const averageRating = useMemo(() => {
    if (!userProjects || userProjects.length === 0) return 0;
    const totalRating = userProjects.reduce((acc, p) => acc + p.rating, 0);
    return (totalRating / userProjects.length).toFixed(1);
  }, [userProjects]);

  const skillGrowth = useMemo(() => {
    if (!userProfile || !userProfile.skills) return [];
    // This is placeholder logic. In a real app, you'd track this more granularly.
    return userProfile.skills.map(skill => ({
      name: skill,
      level: Math.floor(Math.random() * 80) + 20, // Random level between 20-100
    }))
  }, [userProfile]);

  if (loadingUser || loadingProfile || loadingProjects) {
    return <ProgressSkeleton />;
  }
  
  if (!userProfile) {
    return <p>User profile not found.</p>;
  }

  return (
    <div className="space-y-8">
      <div className='text-center'>
        <h1 className="font-headline text-4xl font-bold tracking-tight">Your Progress</h1>
        <p className="mt-2 text-lg text-muted-foreground">Level {level} &middot; {xp} / {xpForNextLevel} XP</p>
        <Progress value={progressPercentage} className="w-1/2 mx-auto mt-4 h-3" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center justify-center gap-2">
                <GitPullRequest className="size-5 text-primary"/> Projects Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{userProjects?.length || 0}</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center justify-center gap-2">
                <CheckCircle className="size-5 text-primary"/> Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{averageRating} <span className="text-2xl text-muted-foreground">/ 5.0</span></p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center justify-center gap-2">
                <BarChart className="size-5 text-primary"/> Leaderboard Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">#12</p>
            <p className="text-sm text-muted-foreground">Top 15%</p>
          </CardContent>
        </Card>
      </div>
      
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl">Skill Growth</CardTitle>
             <CardDescription>Your proficiency based on completed projects.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {skillGrowth.map(skill => (
              <div key={skill.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-base font-medium text-muted-foreground">{skill.name}</span>
                  <span className="text-sm font-medium text-primary">{skill.level}%</span>
                </div>
                <Progress value={skill.level} />
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl">Badges Earned</CardTitle>
            <CardDescription>Achievements unlocked on your journey.</CardDescription>
          </CardHeader>
          <CardContent>
            {userProfile.reputation?.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {userProfile.reputation.map(badge => {
                    const Icon = badgeIcons[badge.label as keyof typeof badgeIcons] || Star;
                    return (
                      <div key={badge.label} className="flex flex-col items-center text-center gap-2 p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                        <div className={`p-3 rounded-full bg-primary/10 ${badge.color}`}>
                           <Icon className="size-8" />
                        </div>
                        <p className="font-semibold text-sm">{badge.label}</p>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
                    <Trophy className="mx-auto h-12 w-12" />
                    <p className="mt-4 font-semibold">No badges yet.</p>
                    <p className="mt-1 text-sm">Complete projects to start earning them!</p>
                </div>
              )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
