import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { forumPosts, projects } from '@/lib/data';
import { ArrowBigUp, MessageSquare, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';

export default function CommunitiesPage() {
  const filters = ['All', 'AI/ML', 'WebDev', 'Design', 'Startups', 'Gaming'];
  const suggestedProjects = projects.slice(0, 2);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">Communities</h1>
            <p className="text-muted-foreground mt-1">Connect, discuss, and grow</p>
        </div>
        <Button className="bg-gradient-to-r from-accent to-primary text-primary-foreground font-bold">
          + Start a Discussion
        </Button>
      </div>

       <div className="flex items-center gap-2 flex-wrap">
        {filters.map((filter, index) => (
            <Button key={filter} variant={index === 0 ? 'default' : 'outline'}>
                {filter}
            </Button>
        ))}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          {forumPosts.map((post) => {
            const authorAvatar = PlaceHolderImages.find((p) => p.id === 'avatar-2');
            return (
            <Card key={post.id} className="transition-shadow duration-300 hover:shadow-lg p-4 border-primary/40 hover:border-primary">
               <div className='flex items-center gap-3 mb-3'>
                    <Avatar className='size-8'>
                        {authorAvatar && <AvatarImage src={authorAvatar.imageUrl} alt={post.author} />}
                        <AvatarFallback>{post.author.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-sm">{post.author}</p>
                        <p className="text-xs text-muted-foreground">{post.createdAt}</p>
                    </div>
                </div>
              <h2 className="font-headline text-xl font-semibold mt-1">{post.title}</h2>
              <p className='text-muted-foreground text-sm mt-2'>An intelligent platform that uses machine learning to optimize...</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
                 <Button variant='outline' size='sm' className='border-primary/50 text-primary hover:bg-primary/10 hover:text-primary'>
                    <ArrowBigUp className="h-4 w-4 mr-2" />
                    Upvote {post.upvotes}
                 </Button>
                 <div className='flex items-center gap-1'>
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.comments}</span>
                 </div>
                 <div className="flex-1"></div>
                 <Button size='sm' className='bg-gradient-to-r from-accent to-primary text-primary-foreground'>Join</Button>
              </div>
            </Card>
          )})}
        </div>

        <div className="space-y-6 lg:sticky top-20">
          {suggestedProjects.map((project) => {
            const owner = project.team[0];
            const ownerAvatar = PlaceHolderImages.find(p => p.id === owner.avatar);
            return (
              <Card key={project.id}>
                <CardHeader>
                   <div className='flex items-center gap-3'>
                        <Avatar className='size-8'>
                            {ownerAvatar && <AvatarImage src={ownerAvatar.imageUrl} alt={owner.name} />}
                            <AvatarFallback>{owner.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-sm">{owner.name}</p>
                            <p className="text-xs text-muted-foreground">College 1st Year</p>
                        </div>
                    </div>
                  <CardTitle className="font-headline text-lg pt-2">{project.name}</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                   <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                   <div>
                     {project.tags?.slice(0, 2).map(tag => <Badge key={tag} variant={tag === 'AI/ML' ? 'default' : 'secondary'} className='mr-1'>{tag}</Badge>)}
                   </div>
                   <div className="flex items-center gap-1 text-yellow-400">
                        <Star className='size-4 fill-current' />
                        <Star className='size-4 fill-current' />
                        <Star className='size-4 fill-current' />
                        <Star className='size-4' />
                        <Star className='size-4' />
                    </div>
                   <Button asChild className='w-full'>
                      <Link href="/dashboard/project">Join</Link>
                   </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  );
}
