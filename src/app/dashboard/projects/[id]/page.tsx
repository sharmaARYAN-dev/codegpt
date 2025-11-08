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
import { projects } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { MessageSquare, Users, GitFork, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function ProjectWorkspacePage({ params }: { params: { id: string } }) {
  const project = projects.find(p => p.id === params.id) || projects[0];
  const teamMembers = project.team;

  const openRoles = [
    {
      title: 'UI/UX Designer',
      description: 'Passionate about creating beautiful and intuitive user interfaces.',
      avatar: 'avatar-3',
    },
    {
      title: 'ML Engineer',
      description: 'Experienced in building and deploying machine learning models.',
      avatar: 'avatar-5',
    },
  ];

  return (
    <div className="space-y-6">
        <div className='flex justify-between items-start'>
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight">
                {project.name}
                </h1>
                <div className="flex flex-wrap gap-2 mt-2">
                {project.tags?.map((tag) => (
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
             <Button>
                Join Team
            </Button>
        </div>
      
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className='flex items-center gap-2'>
            <Users className='size-4' />
            <span>{project.team.length} Members</span>
        </div>
        <div className='flex items-center gap-2'>
            <GitFork className='size-4' />
            <span>1.2k Forks</span>
        </div>
         <div className='flex items-center gap-2'>
            <MessageSquare className='size-4' />
            <span>34 Comments</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">
                Project Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {project.description} This project aims to create an intelligent platform that uses machine learning to generate personalized learning paths for students. By analyzing user-provided lecture notes and study materials, the application will create interactive flashcards, quizzes, and summaries to enhance the learning experience.
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
                const avatar = PlaceHolderImages.find(
                  (p) => p.id === member.avatar
                );
                return (
                  <div key={member.id} className="flex items-center gap-3 p-3 rounded-md border bg-card hover:bg-muted/50">
                    <Avatar className="size-10">
                      {avatar && <AvatarImage src={avatar.imageUrl} alt={member.name} />}
                      <AvatarFallback>
                        {member.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Project Owner
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
              {/* Comment section can be built out here */}
              <p className='text-sm text-muted-foreground'>No comments yet. Be the first to share your thoughts!</p>
               <Button variant="outline">Add Comment</Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:sticky top-20">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">
                Open Roles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {openRoles.map((role) => (
                    <div key={role.title} className="flex items-center gap-3 p-3 rounded-md border bg-card hover:bg-muted/50">
                       <Avatar>
                            <AvatarImage
                            src={
                                PlaceHolderImages.find((p) => p.id === role.avatar)
                                ?.imageUrl
                            }
                            />
                            <AvatarFallback>
                            {role.title.substring(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="font-semibold">{role.title}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">{role.description}</p>
                        </div>
                         <Button size="sm" variant="secondary">Apply</Button>
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
            <CardContent className='space-y-3'>
                <Link href="#" className='flex items-center gap-2 text-sm text-muted-foreground hover:text-primary'>
                    <ExternalLink className='size-4' />
                    <span>View Live Demo</span>
                </Link>
                 <Link href="#" className='flex items-center gap-2 text-sm text-muted-foreground hover:text-primary'>
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
