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
import { useCollection, useFirestore, useUser } from '@/firebase';
import type { StudentProfile } from '@/lib/types';
import { useMemo } from 'react';
import { collection } from 'firebase/firestore';

const reputationIcons = {
  'Top Contributor': Award,
  'Bug Squasher': ShieldCheck,
  'Rising Star': Star,
  'Hackathon Winner': Trophy,
  'Code Guardian': ShieldCheck,
  'Community Helper': Star
}

export default function TeammatesPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { data: students } = useCollection<StudentProfile>(
    firestore ? collection(firestore, 'users') : null
  );

  const teammates = useMemo(() => {
    if (!students || !user) return [];
    return students.filter(s => s.id !== user.uid);
  }, [students, user]);
  
  const interests = useMemo(() => {
    if (!students) return [];
    return [...new Set(students.flatMap((s) => s.interests || []))];
  }, [students]);

  return (
    <div className="space-y-6">
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
            <Card key={student.id} className="flex flex-col text-center transition-transform duration-300 hover:-translate-y-1 hover:shadow-primary/20 hover:shadow-lg">
              <CardHeader className="items-center">
                <Avatar className="h-24 w-24 border-4 border-muted">
                  {student.photoURL && <AvatarImage src={student.photoURL} alt={student.displayName} data-ai-hint="person portrait" />}
                  <AvatarFallback>{student.displayName.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <CardTitle className="mt-4 font-headline">{student.displayName}</CardTitle>
                {student.reputation?.length > 0 && (
                   <div className="flex justify-center gap-2 mt-1">
                        {student.reputation.map((rep) => {
                            const Icon = reputationIcons[rep.label as keyof typeof reputationIcons] || Star;
                            return (
                            <Badge variant="secondary" key={rep.label} className="text-xs">
                                <Icon className={`mr-1 h-3 w-3 ${rep.color}`} />
                                {rep.label}
                            </Badge>
                        )})}
                    </div>
                )}
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2">
                    <div>
                        <h4 className="text-sm font-semibold text-muted-foreground">Skills</h4>
                        <div className="flex flex-wrap justify-center gap-1 mt-1">
                            {student.skills?.map((skill) => (
                            <Badge key={skill} variant="outline">
                                {skill}
                            </Badge>
                            ))}
                        </div>
                    </div>
                     <div>
                        <h4 className="text-sm font-semibold text-muted-foreground">Interests</h4>
                        <div className="flex flex-wrap justify-center gap-1 mt-1">
                            {student.interests?.map((interest) => (
                            <Badge key={interest} variant="secondary">
                                {interest}
                            </Badge>
                            ))}
                        </div>
                    </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Connect</Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
