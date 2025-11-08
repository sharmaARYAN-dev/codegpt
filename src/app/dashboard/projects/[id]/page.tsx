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
import { MessageSquare, Users, GitFork, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { allProjects, users } from '@/lib/mock-data';

export default function ProjectWorkspacePage({ params }: { params: { id: string } }) {
  const project = allProjects.find((p) => p.id === params.id);
  const teamMembers = users.filter(u => project?.memberIds.includes(u.id) || u.id === project?.ownerId)

  const openRoles = [
    {
      title: 'UI/UX Designer',
      description: 'Passionate about creating beautiful and intuitive user interfaces.',
      avatar: 'https://images.unsplash.com/photo-1643932919088-53349a7c3385?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxwb3J0cmFpdCUyMHBlcnNvbnxlbnwwfHx8fDE3NjI1NTAyNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      title: 'ML Engineer',
      description: 'Experienced in building and deploying machine learning models.',
      avatar: 'https://images.unsplash.com/photo-1561740303-a0fd9fabc646?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxwb3J0cmFpdCUyMHBlcnNvbnxlbnwwfHx8fDE3NjI1NTAyNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  if (!project) {
    return <div>Project not found.</div>
  }

  return (
    <div className="space-y-8">
        <div className='flex justify-between items-start'>
            <div>
                <h1 className="font-headline text-4xl font-bold tracking-tight">
                {project.name}
                </h1>
                <div className="flex flex-wrap gap-2 mt-3">
                {project.tags.map((tag) => (
                    <Badge
                    key={tag}
                    variant={
                        tag === 'AI/ML' || tag === 'Python' ? 'default' : 'secondary'
                    }
                    >
                    {tag}
                    </Badge>
                ))}
                </div>
            </div>
             <Button size="lg">
                Join Team
            </Button>
        </div>
      
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <div className='flex items-center gap-2'>
            <Users className='size-4' />
            <span>{teamMembers.length} Members</span>
        </div>
        <div className='flex items-center gap-2'>
            <GitFork className='size-4' />
            <span>{project.forks} Forks</span>
        </div>
         <div className='flex items-center gap-2'>
            <MessageSquare className='size-4' />
            <span>{project.comments} Comments</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">
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
              <CardTitle className="font-headline text-xl">
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {teamMembers.map((member) => {
                return (
                  <div key={member.id} className="flex items-center gap-4 p-3 rounded-md border bg-card hover:bg-muted/50 transition-colors">
                    <Avatar className="size-12">
                      <AvatarImage src={member.photoURL} alt={member.displayName} />
                      <AvatarFallback>
                        {member.displayName.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-base">{member.displayName}</p>
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
              <CardTitle className="font-headline text-xl">
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
              <CardTitle className="font-headline text-xl">
                Open Roles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {openRoles.map((role) => (
                    <div key={role.title} className="flex items-start gap-4 p-3 rounded-md border bg-card hover:bg-muted/50 transition-colors">
                       <Avatar className='mt-1'>
                            <AvatarImage src={role.avatar} />
                            <AvatarFallback>
                            {role.title.substring(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="font-semibold">{role.title}</p>
                            <p className="text-sm text-muted-foreground line-clamp-2">{role.description}</p>
                            <Button size="sm" variant="secondary" className='mt-2'>Apply</Button>
                        </div>
                    </div>
                ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle className="font-headline text-xl">
                    Project Links
                </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                <Link href="#" className='flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors'>
                    <ExternalLink className='size-4' />
                    <span>View Live Demo</span>
                </Link>
                 <Link href="#" className='flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors'>
                    <GitFork className='size-4' />
                    <span>GitHub Repository</span>
                </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
