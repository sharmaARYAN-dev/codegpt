'use client';

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
import { projects, students } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Dot, Send, Star, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProjectWorkspacePage() {
  const project = projects[0];
  const teamMembers = project.team;

  const openRoles = [
    {
      title: 'UI/UX Designer',
      description: 'Euhccland',
      collegeYear: 'College 1st Year',
      avatar: 'avatar-3',
    },
    {
      title: 'ML Engineer',
      description: 'Cohesipt ters',
      collegeYear: 'College 1st Year',
      avatar: 'avatar-5',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          {project.name}
        </h1>
        <div className="flex flex-wrap gap-2 mt-2">
          {project.tags?.map((tag) => (
            <Badge
              key={tag}
              variant={
                tag === 'AI/ML' || tag === 'Python' ? 'default' : 'secondary'
              }
            >
              {tag}
            </Badge>
          ))}
          <Badge variant="secondary">Education</Badge>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage
              src={
                PlaceHolderImages.find((p) => p.id === project.team[0].avatar)
                  ?.imageUrl
              }
            />
            <AvatarFallback>
              {project.team[0].name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{project.team[0].name}</p>
            <p className="text-sm text-muted-foreground">
              College 1st Year <span className="mx-1">&middot;</span> 1.2K
            </p>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-accent to-primary text-primary-foreground">
          Join Team
        </Button>
      </div>

      <div className="text-sm text-muted-foreground flex items-center gap-1">
        <Link href="#" className="hover:text-primary">
          Dott.ict
        </Link>
        <Dot />
        <Link href="#" className="hover:text-primary">
          Newest
        </Link>
        <span>/</span>
        <Link href="#" className="hover:text-primary">
          Trending
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your foosire tliyefwlay illicert besteas off the sot clreed a
                fovite kitaitit to tro, Widhy yoe agae-and lotjeet. Uwine de
                metare witit wt the youll. habs to pest and oratresoacts. Alli
                ht thet, fhitn Wienen avrit legrit ho mend emd o proftroria ads
                renn; aue future.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {teamMembers.map((member) => {
                const avatar = PlaceHolderImages.find(
                  (p) => p.id === member.avatar
                );
                return (
                  <div key={member.id} className="flex items-center gap-3">
                    <Avatar className="size-10">
                      {avatar && <AvatarImage src={avatar.imageUrl} />}
                      <AvatarFallback>
                        {member.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-sm text-muted-foreground">
                        The the bed it: be hihesk the toroid ertrit the tose yot
                        sahep buiid
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">
                Comments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Avatar className="size-10">
                  <AvatarImage
                    src={
                      PlaceHolderImages.find((p) => p.id === 'avatar-4')
                        ?.imageUrl
                    }
                  />
                  <AvatarFallback>GA</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">Giiaa Aetcleme</p>
                  <p className="text-sm text-muted-foreground">
                    Aliegine 1st Year
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Avatar className="size-10">
                  <AvatarImage
                    src={
                      PlaceHolderImages.find((p) => p.id === 'avatar-6')
                        ?.imageUrl
                    }
                  />
                  <AvatarFallback>SE</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">Sted Ernactde</p>
                  <p className="text-sm text-muted-foreground">
                    Oatlage. Tet Virar
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:sticky top-20">
          <Card className="bg-card/50 backdrop-blur-sm border-border/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline text-xl">
                Team Chat
              </CardTitle>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm">
                <span className="font-semibold">Priye:</span> Welcome!
                <br />
                <span className="font-semibold">Alax:</span> Just pushed the ode
                code.
              </div>
              <Button className="w-full">Join Team</Button>
            </CardContent>
          </Card>

          {openRoles.map((role) => (
            <Card key={role.title}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage
                      src={
                        PlaceHolderImages.find((p) => p.id === role.avatar)
                          ?.imageUrl
                      }
                    />
                    <AvatarFallback>
                      {role.title.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{role.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {role.collegeYear}
                    </p>
                    <p className="text-sm mt-1">{role.description}</p>
                    <div className="flex items-center gap-1 text-muted-foreground mt-2">
                      <Star className="size-4" />
                      <Star className="size-4" />
                      <Star className="size-4" />
                      <Star className="size-4" />
                      <Star className="size-4" />
                    </div>
                  </div>
                  <Button size="sm">Join</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
