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
import { Plus, Star, BarChartHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

export default function ProjectsPage() {
  const allProjects = projects;

  const renderProjectGrid = (projectList: typeof projects) => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {projectList.map((project, index) => {
        const owner = project.team[0];
        const ownerAvatar = PlaceHolderImages.find((p) => p.id === owner.avatar);

        return (
          <Link href="/dashboard/project" key={project.id}>
            <Card  className="flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-primary/20 hover:shadow-lg h-full p-4">
              <CardHeader className="p-2">
                  <p className='text-sm text-muted-foreground'>Project Card</p>
                  <CardTitle className="font-headline text-xl">{project.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow p-2 space-y-3">
                <div className='flex items-center gap-3'>
                    <Avatar className='size-8'>
                        {ownerAvatar && <AvatarImage src={ownerAvatar.imageUrl} alt={owner.name} />}
                        <AvatarFallback>{owner.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-sm">{owner.name}</p>
                        <p className="text-xs text-muted-foreground">Owner's Info 1 Count</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className='flex items-center gap-1'>
                        <Star className='size-4 text-primary fill-primary'/>
                        <BarChartHorizontal className='size-4 -rotate-90' />
                    </div>
                    <span>{['React', 'Python', 'Design'].map(t => <Badge key={t} variant='outline' className='mr-1'>{t}</Badge>)}</span>
                    <div className='flex items-center gap-1'>
                        <Star className='size-4'/>
                        <span>1.2K</span>
                    </div>
                </div>
              </CardContent>
              <CardFooter className='p-2'>
                <Button className="w-full bg-gradient-to-r from-accent to-primary text-primary-foreground">Join Team</Button>
              </CardFooter>
            </Card>
          </Link>
        );
      })}
        <Card className="flex flex-col items-center justify-center border-dashed border-2 hover:border-primary hover:text-primary transition-colors duration-300 cursor-pointer min-h-[250px] hover:shadow-lg bg-card/50">
            <div className='relative'>
                 <div className='h-20 w-20 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center'>
                    <Plus className="h-10 w-10 text-primary-foreground" />
                </div>
                <div className='absolute -bottom-2 -right-2 bg-background p-1 rounded-full'>
                    <div className='h-4 w-4 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center'>
                        <Star className='size-2 text-primary-foreground fill-primary-foreground' />
                    </div>
                </div>
                 <div className='absolute -top-1 -left-1 bg-background p-0.5 rounded-full'>
                    <div className='h-2 w-2 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center' />
                </div>
            </div>
            <p className="mt-4 font-semibold text-lg">+ New Project</p>
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
        <Button>Tags</Button>
        <Button variant="outline">Domain</Button>
        <Button variant="outline">Domain</Button>
        <Button variant="outline">College</Button>
        <Button variant="outline">Sort By</Button>
        <div className="flex-1"></div>
        <Button variant="ghost">Newest / Trending</Button>
      </div>
      
      {renderProjectGrid(allProjects)}
    </div>
  );
}
