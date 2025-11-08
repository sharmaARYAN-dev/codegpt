'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Users, GitFork, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { CreateProjectDialog } from '@/components/create-project-dialog';
import { Input } from '@/components/ui/input';
import { useCollection } from '@/firebase/firestore/use-collection';
import type { Project, StudentProfile } from '@/lib/types';
import { collection, query, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';

function ProjectsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="flex h-full flex-col">
          <CardHeader>
            <div className='flex items-center gap-4'>
              <Skeleton className='size-12 rounded-full' />
              <div className='space-y-2'>
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            <div className='space-y-2'>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className='space-y-3'>
              <Skeleton className="h-3 w-1/4" />
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          </CardContent>
          <div className="flex items-center justify-between p-6 pt-2">
            <div className='flex items-center gap-4'>
              <Skeleton className="h-5 w-10" />
              <Skeleton className="h-5 w-10" />
            </div>
            <Skeleton className="h-9 w-20 rounded-md" />
          </div>
        </Card>
      ))}
      <Card
        className="flex min-h-[350px] flex-col items-center justify-center border-2 border-dashed bg-card/50">
          <Skeleton className="size-20 rounded-full mb-4" />
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-32" />
      </Card>
    </div>
  )
}

export default function ProjectsPage() {
  const [isCreateProjectOpen, setCreateProjectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const projectsQuery = useMemo(() => db ? query(collection(db, 'projects'), orderBy('createdAt', 'desc')) : null, []);
  const { data: allProjects, loading: loadingProjects } = useCollection<Project>(projectsQuery, 'projects');

  const usersQuery = useMemo(() => db ? collection(db, 'users') : null, []);
  const { data: users, loading: loadingUsers } = useCollection<StudentProfile>(usersQuery, 'users');

  const filters = ['All', 'Web Dev', 'AI/ML', 'Mobile', 'Game Dev'];
  
  const filteredProjects = useMemo(() => {
    if (!allProjects) return [];
    
    let projects = [...allProjects];

    if (activeFilter !== 'All') {
        const filterTerm = activeFilter.toLowerCase();
        projects = projects.filter(p => {
            const projectTags = p.tags.map(tag => tag.toLowerCase());
            return projectTags.includes(filterTerm);
        });
    }
    
    if (searchTerm) {
      projects = projects.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    projects.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

    return projects;
  }, [allProjects, searchTerm, activeFilter]);

  const renderProjectGrid = (projectList: Project[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {projectList.map((project) => {
        const owner = users?.find(u => u.id === project.ownerId);
        const memberCount = (project.members?.length || 0);

        return (
          <Link href={`/dashboard/projects/${project.id}`} key={project.id} className="block group">
            <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-primary/20 group-hover:border-primary/30">
              <CardHeader>
                <div className='flex items-center gap-4'>
                  <Avatar className='size-12'>
                    {owner?.photoURL && <AvatarImage src={owner.photoURL} alt={owner.displayName} />}
                    <AvatarFallback>{owner?.displayName?.substring(0, 2) ?? '??'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="font-headline text-xl leading-tight">{project.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">by {owner?.displayName}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
                <div className='space-y-3'>
                  <p className='text-xs font-semibold uppercase text-muted-foreground tracking-wider'>Tech Stack</p>
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    {project.tags?.map(t => <Badge key={t} variant={t === 'ai/ml' ? 'default' : 'secondary'}>{t}</Badge>)}
                  </div>
                </div>
              </CardContent>
              <div className="flex items-center justify-between p-6 pt-2">
                <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                  <div className='flex items-center gap-1.5'>
                    <Users className='size-4' />
                    <span>{memberCount}</span>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <GitFork className='size-4' />
                    <span>{project.repo ? 1 : 0}</span>
                  </div>
                </div>
                <Button variant="secondary" asChild>
                  <Link href={`/dashboard/projects/${project.id}`}>View</Link>
                </Button>
              </div>
            </Card>
          </Link>
        );
      })}
      <Card
        onClick={() => setCreateProjectOpen(true)}
        className="flex min-h-[350px] cursor-pointer flex-col items-center justify-center border-2 border-dashed bg-card/50 transition-colors duration-300 hover:border-primary/70 hover:bg-primary/5 hover:text-primary hover:shadow-xl hover:shadow-primary/10">
        <div className='flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4'>
          <Plus className="h-10 w-10 text-primary" />
        </div>
        <p className="text-lg font-semibold">Create New Project</p>
        <p className="text-sm text-muted-foreground">Bring your idea to life</p>
      </Card>
    </div>
  );

  return (
    <>
      <CreateProjectDialog open={isCreateProjectOpen} onOpenChange={setCreateProjectOpen} />
      <div className="space-y-8">
        <div className='flex flex-wrap justify-between items-center gap-4'>
          <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">Discover Projects</h1>
            <p className="mt-1 text-muted-foreground">Find your next big idea or the people to build it with.</p>
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search projects..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {filters.map(filter => (
            <Button key={filter} variant={activeFilter === filter ? 'default' : 'outline'} onClick={() => setActiveFilter(filter)}>{filter}</Button>
          ))}
        </div>

        {loadingProjects || loadingUsers ? <ProjectsSkeleton /> : renderProjectGrid(filteredProjects || [])}
      </div>
    </>
  );
}
