import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { projects, students, events, forumPosts } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MessageSquare, PlusCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function DashboardPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-2_  row-span-2 flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardHeader>
          <CardTitle>My Projects</CardTitle>
          <CardDescription>An overview of your current projects.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="space-y-6">
            {projects.map((project) => {
              const projectIcon = PlaceHolderImages.find((p) => p.id === project.icon);
              return (
                <div key={project.id}>
                    <Link href="/dashboard/project" className="block p-4 -m-4 rounded-lg hover:bg-muted/50">
                        <div className="flex items-center gap-4">
                            {projectIcon && (
                            <Image
                                src={projectIcon.imageUrl}
                                alt={project.name}
                                width={40}
                                height={40}
                                className="rounded-md"
                                data-ai-hint={projectIcon.imageHint}
                            />
                            )}
                            <div className="flex-1">
                            <p className="font-semibold">{project.name}</p>
                            <p className="text-sm text-muted-foreground">{project.description}</p>
                            </div>
                            <div className="flex -space-x-2">
                                {project.team.map(member => {
                                    const memberAvatar = PlaceHolderImages.find(p => p.id === member.avatar);
                                    return (
                                        <Avatar key={member.id} className="size-6 border-2 border-card">
                                            {memberAvatar && <AvatarImage src={memberAvatar.imageUrl} alt={member.name} />}
                                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-4">
                            <Progress value={project.progress} className="h-2" />
                            <span className="text-sm font-medium text-muted-foreground">{project.progress}%</span>
                        </div>
                    </Link>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardHeader>
          <CardTitle>Suggested Teammates</CardTitle>
          <CardDescription>Connect with students matching your skills.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students.slice(0, 3).map((student) => {
              const studentAvatar = PlaceHolderImages.find((p) => p.id === student.avatar);
              return (
                <div key={student.id} className="flex items-center gap-4">
                  <Avatar>
                    {studentAvatar && <AvatarImage src={studentAvatar.imageUrl} alt={student.name} data-ai-hint="person portrait" />}
                    <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{student.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{student.skills.join(', ')}</p>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Don&apos;t miss these opportunities.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.slice(0, 2).map(event => (
              <div key={event.id} className="flex items-start gap-4">
                <div className="text-center w-12 flex-shrink-0">
                  <p className="font-bold text-lg">{new Date(event.date).getDate()}</p>
                  <p className="text-xs text-muted-foreground uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</p>
                </div>
                <div>
                  <p className="font-semibold">{event.title}</p>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardHeader>
          <CardTitle>Community Activity</CardTitle>
          <CardDescription>Latest discussions from the forums.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {forumPosts.map((post) => (
              <li key={post.id}>
                <Link href="/dashboard/forums" className="flex items-center gap-4 group p-2 -m-2 rounded-lg hover:bg-muted/50">
                  <div className="flex-1">
                    <p className="font-semibold group-hover:text-primary">{post.title}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span>{post.community}</span>
                        <span>&middot;</span>
                        <span>by {post.author}</span>
                        <span>&middot;</span>
                        <div className='flex items-center gap-1'>
                            <MessageSquare className='size-3'/>
                            {post.comments} comments
                        </div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

    </div>
  );
}
