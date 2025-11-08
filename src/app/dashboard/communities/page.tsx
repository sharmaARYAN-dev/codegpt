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
            <p className="text-muted-foreground mt-1">Connect, discuss, and grow with other innovators.</p>
        </div>
        <Button>
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
            <Card key={post.id} className="transition-shadow duration-300 hover:shadow-lg p-4 hover:border-primary/50">
               <div className='flex items-center gap-3 mb-3'>
                    <Avatar className='size-8'>
                        {authorAvatar && <AvatarImage src={authorAvatar.imageUrl} alt={post.author} />}
                        <AvatarFallback>{post.author.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-sm">{post.author}</p>
                        <p className="text-xs text-muted-foreground">{post.createdAt}</p>
                    </div>
                    <Badge variant="secondary" className='ml-auto'>{post.community}</Badge>
                </div>
              <h2 className="font-headline text-xl font-semibold mt-1">{post.title}</h2>
              <p className='text-muted-foreground text-sm mt-2 line-clamp-2'>An intelligent platform that uses machine learning to optimize... This is an interesting topic, has anyone considered the privacy implications of using student data to train these models? Would love to hear some thoughts.</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
                 <Button variant='outline' size='sm' className='text-primary hover:bg-primary/10 hover:text-primary'>
                    <ArrowBigUp className="h-4 w-4 mr-2" />
                    Upvote ({post.upvotes})
                 </Button>
                 <div className='flex items-center gap-1'>
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.comments} Comments</span>
                 </div>
                 <div className="flex-1"></div>
                 <Button size='sm' asChild>
                    <Link href="#">Join Discussion</Link>
                </Button>
              </div>
            </Card>
          )})}
        </div>

        <div className="space-y-6 lg:sticky top-20">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg">Hot Projects</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {suggestedProjects.map((project) => {
                        const owner = project.team[0];
                        const ownerAvatar = PlaceHolderImages.find(p => p.id === owner.avatar);
                        return (
                        <div key={project.id}>
                            <div className='flex items-center gap-3'>
                                <Avatar className='size-8'>
                                    {ownerAvatar && <AvatarImage src={ownerAvatar.imageUrl} alt={owner.name} />}
                                    <AvatarFallback>{owner.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-sm">{project.name}</p>
                                    <p className="text-xs text-muted-foreground">by {owner.name}</p>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{project.description}</p>
                             <Button asChild size="sm" variant="secondary" className='mt-3 w-full'>
                                <Link href={`/dashboard/projects/${project.id}`}>View Project</Link>
                            </Button>
                        </div>
                        )
                    })}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
