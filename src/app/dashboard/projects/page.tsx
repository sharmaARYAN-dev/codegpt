'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Users, GitFork } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useCollection, useFirestore } from '@/firebase';
import type { Project, StudentProfile } from '@/lib/types';
import { useMemo, useState } from 'react';
import { collection } from 'firebase/firestore';
import { CreateProjectDialog } from '@/components/create-project-dialog';

export default function ProjectsPage() {
  const firestore = useFirestore();
  const [isCreateProjectOpen, setCreateProjectOpen] = useState(false);

  const projectsQuery = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'projects');
  }, [firestore]);
  const { data: allProjects } = useCollection<Project>(projectsQuery);

  const usersQuery = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);
  const { data: users } = useCollection<StudentProfile>(usersQuery);

  const renderProjectGrid = (projectList: Project[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {projectList.map((project) => {
        const owner = users?.find(u => u.id === project.ownerId);
        const memberCount = (project.memberIds?.length || 0) + 1;

        return (
          <Link href={`/dashboard/projects/${project.id}`} key={project.id}>
            <Card className="flex h-full flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20">
              <CardHeader>
                <div className='flex items-center gap-3'>
                  <Avatar className='size-10'>
                    {owner?.photoURL && <AvatarImage src={owner.photoURL} alt={owner.displayName} />}
                    <AvatarFallback>{owner?.displayName?.substring(0, 2) ?? '??'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="font-headline text-lg">{project.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">by {owner?.displayName}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                <div className='space-y-2'>
                  <p className='text-xs font-semibold text-muted-foreground'>TECH STACK</p>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    {project.tags?.map(t => <Badge key={t} variant='secondary' className='mr-1'>{t}</Badge>)}
                  </div>
                </div>
              </CardContent>
              <div className="flex items-center justify-between p-6 pt-0">
                <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                  <div className='flex items-center gap-1'>
                    <Users className='size-4' />
                    <span>{memberCount}</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <GitFork className='size-4' />
                    <span>{project.forks || 0}</span>
                  </div>
                </div>
                <Button>View</Button>
              </div>
            </Card>
          </Link>
        );
      })}
      <Card
        onClick={() => setCreateProjectOpen(true)}
        className="flex min-h-[350px] cursor-pointer flex-col items-center justify-center border-2 border-dashed bg-card/50 transition-colors duration-300 hover:border-primary hover:text-primary hover:shadow-lg">
        <div className='flex h-20 w-20 items-center justify-center rounded-full bg-primary/10'>
          <Plus className="h-10 w-10 text-primary" />
        </div>
        <p className="mt-4 text-lg font-semibold">Create New Project</p>
      </Card>
    </div>
  );

  return (
    <>
      <CreateProjectDialog open={isCreateProjectOpen} onOpenChange={setCreateProjectOpen} />
      <div className="space-y-6">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Discover Projects</h1>
          <p className="mt-1 text-muted-foreground">Find your next big idea or the people to build it with</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button>All</Button>
          <Button variant="outline">Web Dev</Button>
          <Button variant="outline">AI/ML</Button>
          <Button variant="outline">Mobile</Button>
          <Button variant="outline">Game Dev</Button>
          <div className="flex-1"></div>
          <Button variant="ghost">Sort By: Newest</Button>
        </div>

        {allProjects && users ? renderProjectGrid(allProjects) : <div>Loading projects...</div>}
      </div>
    </>
  );
}
