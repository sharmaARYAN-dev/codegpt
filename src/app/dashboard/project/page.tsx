import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { projects, students } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { FileText, Send } from 'lucide-react';

export default function ProjectWorkspacePage() {
  const project = projects[0];
  
  return (
    <div className="space-y-6">
       <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">{project.name}</h1>
        <p className="text-muted-foreground mt-1">{project.description}</p>
      </div>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="code">Code Editor</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h3 className="font-semibold">Team Members</h3>
                    <div className="flex flex-wrap gap-4 mt-2">
                        {project.team.map(member => {
                            const avatar = PlaceHolderImages.find(p => p.id === member.avatar);
                            return (
                                <div key={member.id} className="flex items-center gap-2">
                                    <Avatar className='size-8'>
                                        {avatar && <AvatarImage src={avatar.imageUrl} alt={member.name} />}
                                        <AvatarFallback>{member.name.substring(0,2)}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{member.name}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold">Project Progress</h3>
                    <div className="w-full bg-muted rounded-full h-2.5 mt-2">
                        <div className="bg-primary h-2.5 rounded-full" style={{width: `${project.progress}%`}}></div>
                    </div>
                    <p className='text-sm text-muted-foreground mt-1'>{project.progress}% complete</p>
                </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="code" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Real-Time Code Editor</CardTitle>
                    <CardDescription>Collaborate on code with your teammates instantly. This is a placeholder for a real code editor.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea 
                        className="min-h-[500px] font-code bg-muted/50 text-base"
                        defaultValue={`function HelloWorld() {\n  console.log("Welcome to the ${project.name} project!");\n}`}
                    />
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="documents" className="mt-6">
             <Card>
                <CardHeader>
                    <CardTitle>Shared Documents</CardTitle>
                    <CardDescription>All your project-related documents in one place.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {['Project_Proposal.pdf', 'API_Documentation.md', 'User_Flow_Diagram.fig'].map(doc => (
                            <div key={doc} className="flex items-center p-2 rounded-md border hover:bg-muted/50">
                                <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                                <span className='font-medium'>{doc}</span>
                                <Button variant="ghost" size="sm" className="ml-auto">Download</Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="chat" className="mt-6">
            <Card className='flex flex-col h-[600px]'>
                <CardHeader>
                    <CardTitle>Team Chat</CardTitle>
                </CardHeader>
                <CardContent className='flex-1 flex flex-col'>
                    <div className="flex-grow space-y-4 overflow-y-auto p-4 bg-muted/30 rounded-md">
                        <div className="flex items-end gap-2">
                             <Avatar className='size-8'>
                                <AvatarImage src={PlaceHolderImages.find(p => p.id === 'avatar-2')?.imageUrl} />
                                <AvatarFallback>SL</AvatarFallback>
                            </Avatar>
                            <div className="p-3 rounded-lg bg-muted max-w-xs">
                                <p className="text-sm">Hey, I just pushed the initial setup for the auth flow. Can you take a look?</p>
                            </div>
                        </div>
                         <div className="flex items-end gap-2 justify-end">
                            <div className="p-3 rounded-lg bg-primary text-primary-foreground max-w-xs">
                                <p className="text-sm">Awesome, on it now!</p>
                            </div>
                            <Avatar className='size-8'>
                                <AvatarImage src={PlaceHolderImages.find(p => p.id === 'avatar-1')?.imageUrl} />
                                <AvatarFallback>AJ</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <Input placeholder="Type a message..." />
                        <Button>
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
