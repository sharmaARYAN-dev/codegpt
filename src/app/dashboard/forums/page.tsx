import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { forumPosts } from '@/lib/data';
import { ArrowBigDown, ArrowBigUp, MessageSquare, Share, Bookmark } from 'lucide-react';

export default function ForumsPage() {
  const topCommunities = ['c/webdev', 'c/ai', 'c/gamedev', 'c/career', 'c/design'];
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 space-y-4">
        {forumPosts.map((post) => (
          <Card key={post.id} className="flex transition-shadow duration-300 hover:shadow-lg">
            <div className="p-4 flex flex-col items-center justify-start space-y-1 bg-muted/50 rounded-l-lg">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                <ArrowBigUp className="h-5 w-5" />
              </Button>
              <span className="text-sm font-bold">{post.upvotes}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                <ArrowBigDown className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-4 flex-1">
              <div className="text-xs text-muted-foreground">
                <span className="font-bold text-foreground hover:underline cursor-pointer">{post.community}</span>
                <span className="mx-1">&middot;</span>
                <span>Posted by u/{post.author} {post.createdAt}</span>
              </div>
              <h2 className="font-headline text-lg font-semibold mt-1">{post.title}</h2>
              <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                <Button variant="ghost" size="sm" className="gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {post.comments} Comments
                </Button>
                 <Button variant="ghost" size="sm" className="gap-1">
                    <Share className="h-4 w-4" />
                    Share
                </Button>
                 <Button variant="ghost" size="sm" className="gap-1">
                    <Bookmark className="h-4 w-4" />
                    Save
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-6 lg:sticky top-20">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Top Communities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {topCommunities.map((community, index) => (
                <li key={community} className="flex items-center gap-4">
                  <span className="text-muted-foreground font-bold">{index + 1}</span>
                  <span className="font-semibold hover:underline cursor-pointer">{community}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle className="font-headline">Create a Post</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground mb-4'>Share your thoughts with the community.</p>
            <Button className='w-full'>Create Post</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
