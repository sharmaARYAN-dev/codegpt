'use client';

import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, ShieldCheck, Star } from 'lucide-react';
import { users as mockUsers } from '@/lib/mock-data';
import type { StudentProfile } from '@/lib/types';
import { useMemo, useState } from 'react';
import { EditProfileDialog } from '@/components/edit-profile-dialog';

const reputationIcons = {
  'Top Contributor': Award,
  'Bug Squasher': ShieldCheck,
  'Rising Star': Star,
  'Hackathon Winner': Award,
  'Code Guardian': ShieldCheck,
  'Community Helper': Star
} as const;

export default function ProfilePage() {
  const { user } = useUser();
  const [isEditProfileOpen, setEditProfileOpen] = useState(false);
  
  const userProfile = useMemo(() => {
    return mockUsers.find(p => p.email.split('.')[0] === user?.email?.split('@')[0].split('.')[0]) || {
        id: user?.uid || 'new-user',
        displayName: user?.displayName || "New User",
        email: user?.email || "",
        photoURL: user?.photoURL || "",
        skills: ["Web Development"],
        interests: ["AI"],
        reputation: [{ label: "Rising Star", color: "text-green-400" }]
    } as StudentProfile;
  }, [user]);

  if (!user || !userProfile) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <>
    <EditProfileDialog 
        isOpen={isEditProfileOpen} 
        onOpenChange={setEditProfileOpen} 
        userProfile={userProfile} 
    />
    <div className="container mx-auto max-w-5xl py-2">
      <Card className="overflow-hidden">
        <div className="h-36 bg-gradient-to-r from-primary/70 to-accent/70" />
        <CardContent className="p-6">
          <div className="flex items-end -mt-20">
            <Avatar className="h-32 w-32 border-4 border-background">
              {userProfile.photoURL && (
                <AvatarImage src={userProfile.photoURL} alt={userProfile.displayName || 'User'} />
              )}
              <AvatarFallback className="text-5xl">
                {userProfile.displayName
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="ml-6">
              <h1 className="text-3xl font-bold font-headline">
                {userProfile.displayName}
              </h1>
              <p className="text-muted-foreground">{userProfile.email}</p>
            </div>
            <Button variant="outline" className="ml-auto" onClick={() => setEditProfileOpen(true)}>
              Edit Profile
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-xl">About Me</CardTitle>
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
                  <CardTitle className="font-headline text-xl">My Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">No projects yet. Start creating!</p>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Skills</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {userProfile.skills?.map((skill) => (
                    <Badge key={skill} variant="secondary" className='text-sm'>
                      {skill}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Interests</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {userProfile.interests?.map((interest) => (
                    <Badge key={interest} variant="outline" className='text-sm'>
                      {interest}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Reputation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userProfile.reputation?.map((rep) => {
                    const Icon = reputationIcons[rep.label as keyof typeof reputationIcons] || Star;
                    return (
                      <div key={rep.label} className="flex items-center gap-3 text-sm">
                        <Icon className={`h-5 w-5 ${rep.color}`} />
                        <span className='font-medium'>{rep.label}</span>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
}
