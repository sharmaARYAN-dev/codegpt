import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { projects } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Plus, Users, GitFork } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

export default function ProjectsPage() {
  const allProjects = projects;

  const renderProjectGrid = (projectList: typeof projects) => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {projectList.map((project) => {
        const owner = project.team[0];
        const ownerAvatar = PlaceHolderImages.find((p) => p.id === owner.avatar);

        return (
          <Link href={`/dashboard/projects/${project.id}`} key={project.id}>
            <Card  className="flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-primary/20 hover:shadow-lg h-full">
              <CardHeader>
                  <div className='flex items-center gap-3'>
                      <Avatar className='size-10'>
                          {ownerAvatar && <AvatarImage src={ownerAvatar.imageUrl} alt={owner.name} />}
                          <AvatarFallback>{owner.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                          <CardTitle className="font-headline text-lg">{project.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">by {owner.name}</p>
                      </div>
                  </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                <div className='space-y-2'>
                    <p className='text-xs font-semibold text-muted-foreground'>TECH STACK</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                        {project.tags?.map(t => <Badge key={t} variant='secondary' className='mr-1'>{t}</Badge>)}
                    </div>
                </div>
              </CardContent>
              <div className="flex items-center justify-between p-6 pt-0">
                  <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                    <div className='flex items-center gap-1'>
                        <Users className='size-4'/>
                        <span>{project.team.length}</span>
                    </div>
                     <div className='flex items-center gap-1'>
                        <GitFork className='size-4'/>
                        <span>1.2k</span>
                    </div>
                </div>
                <Button>View</Button>
              </div>
            </Card>
          </Link>
        );
      })}
        <Card className="flex flex-col items-center justify-center border-dashed border-2 hover:border-primary hover:text-primary transition-colors duration-300 cursor-pointer min-h-[350px] hover:shadow-lg bg-card/50">
            <div className='h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center'>
                <Plus className="h-10 w-10 text-primary" />
            </div>
            <p className="mt-4 font-semibold text-lg">Create New Project</p>
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
  );
}
