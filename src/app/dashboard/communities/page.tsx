'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowBigUp, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { forumPosts, suggestedProjects, users } from '@/lib/mock-data';
import { useState } from 'react';
import { CreatePostDialog } from '@/components/create-post-dialog';

export default function CommunitiesPage() {
  const filters = ['All', 'AI/ML', 'WebDev', 'Design', 'Startups', 'Gaming'];
  const [isCreatePostOpen, setCreatePostOpen] = useState(false);
  
  return (
    <>
      <CreatePostDialog open={isCreatePostOpen} onOpenChange={setCreatePostOpen} />
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">Communities</h1>
            <p className="mt-1 text-muted-foreground">Connect, discuss, and grow with other innovators.</p>
          </div>
          <Button onClick={() => setCreatePostOpen(true)}>+ Start a Discussion</Button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {filters.map((filter, index) => (
            <Button key={filter} variant={index === 0 ? 'default' : 'outline'}>
              {filter}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            {forumPosts.map((post) => {
              const author = users.find(u => u.id === post.authorId);
              return (
                <Card key={post.id} className="p-0 transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/10">
                  <CardContent className="p-6">
                    <div className='mb-4 flex items-center gap-3 flex-wrap'>
                      <Avatar className='size-9'>
                        {author?.photoURL && <AvatarImage src={author.photoURL} alt={author.displayName} />}
                        <AvatarFallback>{author?.displayName?.substring(0, 2) ?? '??'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold">{author?.displayName}</p>
                        <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</p>
                      </div>
                      <Badge variant="secondary" className='ml-0 sm:ml-auto'>{post.community}</Badge>
                    </div>
                    <h2 className="font-headline text-xl font-semibold">{post.title}</h2>
                    <p className='text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed'>{post.content}</p>
                  </CardContent>
                  <div className="px-6 pb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <Button variant='outline' size='sm' className='text-primary border-primary/50 hover:bg-primary/10 hover:text-primary'>
                      <ArrowBigUp className="mr-2 h-4 w-4" />
                      Upvote ({post.upvotes})
                    </Button>
                    <div className='flex items-center gap-1.5'>
                      <MessageSquare className="h-4 w-4" />
                      <span>{post.comments} Comments</span>
                    </div>
                    <div className="flex-1 min-w-[10px]"></div>
                    <Button size='sm' asChild>
                      <Link href="#">Join Discussion</Link>
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>

          <div className="space-y-6 lg:sticky top-24">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-lg">Hot Projects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestedProjects.map((project) => {
                  const owner = users.find(u => u.id === project.ownerId);
                  return (
                    <div key={project.id} className="p-3 border rounded-md bg-card hover:bg-muted/50 transition-colors">
                      <div className='flex items-center gap-3'>
                        <Avatar className='size-8'>
                          {owner?.photoURL && <AvatarImage src={owner.photoURL} alt={owner.displayName} />}
                          <AvatarFallback>{owner?.displayName?.substring(0, 2) ?? '??'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">{project.name}</p>
                          <p className="text-xs text-muted-foreground">by {owner?.displayName}</p>
                        </div>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
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
    </>
  );
}
