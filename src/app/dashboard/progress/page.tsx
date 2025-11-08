'use client';

import { useAuth } from '@/context/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Trophy,
  Users,
  GitPullRequest,
} from 'lucide-react';
import type { StudentProfile, Project } from '@/lib/types';
import { useMemo } from 'react';
import { collection, query, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useCollection } from '@/firebase/firestore/use-collection';
import { Progress } from '@/components/ui/progress';
import { db } from '@/lib/firebase';

function ProgressSkeleton() {
  return (
    <div className="space-y-8">
       <div className="text-center">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-5 w-64 mx-auto mt-2" />
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
  const { user, loading: loadingUser } = useAuth();

  const userProfile = user;

  const userProjectsQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(collection(db, 'projects'), where('ownerId', '==', user.id));
  }, [user, db]);
  
  const { data: userProjects, loading: loadingProjects } = useCollection<Project>(userProjectsQuery, `users/${user?.id}/projects`);

  const level = userProfile?.level || 1;
  const xp = userProfile?.xp || 0;
  const xpForNextLevel = level * 150;
  const progressPercentage = (xp / xpForNextLevel) * 100;
  
  const skillGrowth = useMemo(() => {
    if (!userProfile || !userProfile.skills || !userProjects) return [];

    const projectSkillCounts = userProjects.reduce((acc, project) => {
      project.tags.forEach(tag => {
        // Normalize tags from project and user for comparison
        const normalizedTag = tag.toLowerCase().trim();
        const userHasSkill = userProfile.skills.some(s => s.toLowerCase().trim() === normalizedTag);

        if (userHasSkill) {
          acc[tag] = (acc[tag] || 0) + 1;
        }
      });
      return acc;
    }, {} as Record<string, number>);
    
    // Find the max number of projects for any single skill to set a ceiling for the progress bar
    const maxProjectsForOneSkill = Math.max(...Object.values(projectSkillCounts), 1);

    const allUserSkills = userProfile.skills.map(skill => {
      const count = projectSkillCounts[skill.toLowerCase().trim()] || 0;
      // The progress is the percentage of projects for this skill relative to the most-worked-on skill
      return {
        name: skill,
        count: count,
        level: (count / maxProjectsForOneSkill) * 100,
      };
    });

    return allUserSkills.sort((a, b) => b.count - a.count);
  }, [userProfile, userProjects]);

  if (loadingUser || loadingProjects) {
    return <ProgressSkeleton />;
  }
  
  if (!userProfile) {
    return <p>User profile not found.</p>;
  }

  return (
    <div className="space-y-8">
       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">Your Progress</h1>
            <p className="mt-1 text-muted-foreground">Level {level} &middot; {xp} / {xpForNextLevel} XP to next level</p>
          </div>
          <Progress value={progressPercentage} className="w-full sm:w-48 h-3" />
        </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
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
                <Users className="size-5 text-primary"/> Total Connections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{userProfile.connections?.length || 0}</p>
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
            {skillGrowth.length > 0 ? skillGrowth.map(skill => (
              <div key={skill.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-base font-medium text-muted-foreground capitalize">{skill.name}</span>
                   <span className="text-sm font-medium text-primary">{skill.count} project{skill.count !== 1 && 's'}</span>
                </div>
                <Progress value={skill.level} />
              </div>
            )) : (
              <p className="text-sm text-muted-foreground text-center py-4">Complete projects with skill tags to see your growth here!</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl">Badges Earned</CardTitle>
            <CardDescription>Achievements unlocked on your journey.</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
                  <Trophy className="mx-auto h-12 w-12" />
                  <p className="mt-4 font-semibold">No badges yet.</p>
                  <p className="mt-1 text-sm">Complete projects and participate in events to start earning them!</p>
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
