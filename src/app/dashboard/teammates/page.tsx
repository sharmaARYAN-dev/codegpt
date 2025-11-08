'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Award, ShieldCheck, Star, Trophy } from 'lucide-react';
import { useUser } from '@/firebase';
import { users } from '@/lib/mock-data';
import { useMemo } from 'react';

const reputationIcons = {
  'Top Contributor': Award,
  'Bug Squasher': ShieldCheck,
  'Rising Star': Star,
  'Hackathon Winner': Trophy,
  'Code Guardian': ShieldCheck,
  'Community Helper': Star
}

export default function TeammatesPage() {
  const { user } = useUser();
  
  const teammates = useMemo(() => {
    if (!user) return users;
    return users.filter(u => u.id !== user.uid);
  }, [user]);
  
  const interests = useMemo(() => [...new Set(users.flatMap((s) => s.interests))], []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">Find Your Next Teammate</h1>
        <p className="text-muted-foreground mt-1">Browse and connect with talented students across the university.</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name or skill..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Filter by interest" />
              </SelectTrigger>
              <SelectContent>
                {interests.map((interest) => (
                  <SelectItem key={interest} value={interest}>
                    {interest}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {teammates.map((student) => {
          return (
            <Card key={student.id} className="flex flex-col text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/20 hover:shadow-lg hover:border-primary/30">
              <CardHeader className="items-center pt-8">
                <Avatar className="h-28 w-28 border-4 border-muted">
                  <AvatarImage src={student.photoURL} alt={student.displayName} data-ai-hint="person portrait" />
                  <AvatarFallback className='text-3xl'>{student.displayName.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <CardTitle className="mt-4 font-headline text-xl">{student.displayName}</CardTitle>
                {student.reputation?.length > 0 && (
                   <div className="flex justify-center gap-2 mt-1">
                        {student.reputation.map((rep) => {
                            const Icon = reputationIcons[rep.label as keyof typeof reputationIcons] || Star;
                            return (
                            <div key={rep.label} className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Icon className={`h-3 w-3 ${rep.color}`} />
                                {rep.label}
                            </div>
                        )})}
                    </div>
                )}
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-4">
                    <div>
                        <h4 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider">Skills</h4>
                        <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                            {student.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                                {skill}
                            </Badge>
                            ))}
                        </div>
                    </div>
                     <div>
                        <h4 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider">Interests</h4>
                        <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                            {student.interests.map((interest) => (
                            <Badge key={interest} variant="outline">
                                {interest}
                            </Badge>
                            ))}
                        </div>
                    </div>
                </div>
              </CardContent>
              <CardFooter className='p-4'>
                <Button className="w-full">Connect</Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
