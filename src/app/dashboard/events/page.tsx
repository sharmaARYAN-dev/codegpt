import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { projects, students } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Plus, Star, MessageSquare, Dot } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export default function ProjectsPage() {
  const allProjects = projects;

  const renderProjectGrid = (projectList: typeof projects) => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {projectList.map((project) => {
        const owner = project.team[0];
        const ownerAvatar = PlaceHolderImages.find((p) => p.id === owner.avatar);

        return (
          <Link href="/dashboard/project" key={project.id}>
            <Card  className="flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-primary/20 hover:shadow-lg h-full">
              <CardHeader>
                  <div className='flex items-center gap-3'>
                      <Avatar>
                          {ownerAvatar && <AvatarImage src={ownerAvatar.imageUrl} alt={owner.name} />}
                          <AvatarFallback>{owner.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                          <p className="font-semibold">{owner.name}</p>
                          <p className="text-sm text-muted-foreground">College 1st Year</p>
                      </div>
                  </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <CardTitle className="font-headline text-xl">{project.name}</CardTitle>
                  <div className='text-sm text-muted-foreground'>
                    <p>{project.description}</p>
                  </div>
                <div className="flex flex-wrap gap-2">
                  {project.tags?.map((tag) => (
                      <Badge key={tag} variant={tag === 'AI/ML' ? 'default' : 'secondary'}>{tag}</Badge>
                  ))}
                </div>
                <div className='flex items-center gap-2 text-muted-foreground'>
                    <Star className='size-4'/>
                    <Star className='size-4'/>
                    <Star className='size-4'/>
                    <Star className='size-4'/>
                    <Star className='size-4'/>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-gradient-to-r from-accent to-primary text-primary-foreground">Join</Button>
              </CardFooter>
            </Card>
          </Link>
        );
      })}
        <Card className="flex flex-col items-center justify-center border-dashed border-2 hover:border-primary hover:text-primary transition-colors duration-300 cursor-pointer min-h-[250px] hover:shadow-lg">
            <Plus className="h-10 w-10" />
            <p className="mt-2 font-semibold">New Project</p>
        </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Discover Projects</h1>
        <p className="text-muted-foreground mt-1">Find your next big idea or the people to build it with</p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="secondary">Tags</Button>
        <Button variant="outline" className="border-primary text-primary">Domain</Button>
        <Button variant="secondary">Sort By &lt;...&gt;</Button>
        <div className="flex-1"></div>
        <div className='text-sm text-muted-foreground flex items-center gap-1'>
            <span>Dorr.lect</span>
            <Dot/>
            <span>Newest</span>
            <Dot/>
            <span>Trending</span>
        </div>
      </div>
      <Separator />
      {renderProjectGrid(allProjects)}
    </div>
  );
}
