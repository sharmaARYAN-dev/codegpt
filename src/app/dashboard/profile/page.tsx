'use client';

import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, ShieldCheck, Star } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  const skills = ['React', 'Node.js', 'TypeScript', 'Figma', 'Firebase'];
  const interests = ['AI/ML', 'Web Dev', 'Mobile Apps', 'Design Systems'];
  const reputation = [
    { icon: Award, label: 'Top Contributor', color: 'text-yellow-400' },
    { icon: ShieldCheck, label: 'Bug Squasher', color: 'text-green-400' },
    { icon: Star, label: 'Rising Star', color: 'text-purple-400' },
  ];

  return (
    <div className="container mx-auto max-w-4xl py-2">
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary to-accent" />
        <CardContent className="p-6">
          <div className="flex items-end -mt-16">
            <Avatar className="h-28 w-28 border-4 border-background">
              {user.photoURL && (
                <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />
              )}
              <AvatarFallback className="text-4xl">
                {user.displayName
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <h1 className="text-2xl font-bold font-headline">
                {user.displayName}
              </h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="outline" className="ml-auto">
              Edit Profile
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Aspiring full-stack developer and AI enthusiast. Passionate
                    about building products that make a difference. Currently a
                    1st year Computer Science student.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>My Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">No projects yet. Start creating!</p>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Interests</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <Badge key={interest} variant="outline">
                      {interest}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
               <Card>
                <CardHeader>
                  <CardTitle>Reputation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {reputation.map((rep) => (
                     <div key={rep.label} className="flex items-center gap-2 text-sm">
                        <rep.icon className={`h-5 w-5 ${rep.color}`} />
                        <span>{rep.label}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
