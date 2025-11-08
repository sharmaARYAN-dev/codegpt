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
import { allProjects, users } from '@/lib/mock-data';
import { useState } from 'react';
import { CreateProjectDialog } from '@/components/create-project-dialog';
import { Input } from '@/components/ui/input';

export default function ProjectsPage() {
  const [isCreateProjectOpen, setCreateProjectOpen] = useState(false);

  const renderProjectGrid = (projectList: typeof allProjects) => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {projectList.map((project) => {
        const owner = users.find(u => u.id === project.ownerId);
        const memberCount = (project.memberIds?.length || 0) + 1;

        return (
          <Link href={`/dashboard/projects/${project.id}`} key={project.id}>
            <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/30">
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
                    {project.tags?.map(t => <Badge key={t} variant={t === 'AI/ML' ? 'default' : 'secondary'}>{t}</Badge>)}
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
                    <span>{project.forks || 0}</span>
                  </div>
                </div>
                <Button variant="secondary">View</Button>
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
            <Input placeholder="Search projects..." className="pl-10" />
          </div>
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

        {renderProjectGrid(allProjects)}
      </div>
    </>
  );
}
