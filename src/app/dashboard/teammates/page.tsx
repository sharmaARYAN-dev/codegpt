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
import { Search, Award, ShieldCheck, Star, Trophy, Loader2, Github, Linkedin, Instagram } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { StudentProfile } from '@/lib/types';
import { useMemo, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { RedditIcon, WhatsAppIcon } from '@/components/icons';

const reputationIcons = {
  'Top Contributor': Award,
  'Bug Squasher': ShieldCheck,
  'Rising Star': Star,
  'Hackathon Winner': Trophy,
  'Code Guardian': ShieldCheck,
  'Community Helper': Star
}

function TeammatesSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="flex flex-col text-center">
          <CardHeader className="items-center pt-8">
            <Skeleton className="h-28 w-28 rounded-full" />
            <Skeleton className="h-6 w-3/5 mt-4" />
            <Skeleton className="h-4 w-4/5 mt-1" />
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            <div>
              <Skeleton className="h-4 w-1/4 mx-auto mb-2" />
              <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </div>
            <div>
              <Skeleton className="h-4 w-1/4 mx-auto mb-2" />
              <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                <Skeleton className="h-5 w-12 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
          </CardContent>
          <CardFooter className='p-4'>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default function TeammatesPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInterest, setSelectedInterest] = useState('all');

  const usersQuery = useMemoFirebase(() => firestore ? collection(firestore, 'users') : null, [firestore]);
  const { data: users, loading } = useCollection<StudentProfile>(usersQuery);
  
  const teammates = useMemo(() => {
    if (!users) return [];
    let filteredUsers = user ? users.filter(u => u.id !== user.uid) : users;

    if (selectedInterest !== 'all') {
      filteredUsers = filteredUsers.filter(u => u.interests.includes(selectedInterest));
    }

    if (searchTerm) {
      filteredUsers = filteredUsers.filter(u => 
        u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return filteredUsers;
  }, [user, users, searchTerm, selectedInterest]);
  
  const interests = useMemo(() => {
    if (!users) return [];
    const allInterests = users.flatMap((s) => s.interests || []);
    return ['all', ...Array.from(new Set(allInterests))];
  }, [users]);

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
              <Input placeholder="Search by name or skill..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Select value={selectedInterest} onValueChange={setSelectedInterest}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by interest" />
              </SelectTrigger>
              <SelectContent>
                {interests.map((interest) => (
                  <SelectItem key={interest} value={interest} className="capitalize">
                    {interest === 'all' ? 'All Interests' : interest}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {loading ? <TeammatesSkeleton /> :
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teammates.map((student) => {
            const hasSocials = student.socialLinks && Object.values(student.socialLinks).some(link => !!link);
            return (
              <Card key={student.id} className="flex flex-col text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/20 hover:shadow-lg hover:border-primary/30 group">
                <CardHeader className="flex-1 flex flex-col items-center pt-8">
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="w-full" disabled={!hasSocials}>Connect</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      {student.socialLinks?.github && (
                        <Link href={student.socialLinks.github} target="_blank" rel="noopener noreferrer">
                          <DropdownMenuItem>
                            <Github className="mr-2 h-4 w-4" />
                            <span>View GitHub</span>
                          </DropdownMenuItem>
                        </Link>
                      )}
                      {student.socialLinks?.linkedin && (
                         <Link href={student.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                          <DropdownMenuItem>
                            <Linkedin className="mr-2 h-4 w-4" />
                            <span>View LinkedIn</span>
                          </DropdownMenuItem>
                        </Link>
                      )}
                       {student.socialLinks?.instagram && (
                         <Link href={student.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                          <DropdownMenuItem>
                            <Instagram className="mr-2 h-4 w-4" />
                            <span>View Instagram</span>
                          </DropdownMenuItem>
                        </Link>
                      )}
                       {student.socialLinks?.reddit && (
                         <Link href={student.socialLinks.reddit} target="_blank" rel="noopener noreferrer">
                          <DropdownMenuItem>
                            <RedditIcon className="mr-2 h-4 w-4" />
                            <span>View Reddit</span>
                          </DropdownMenuItem>
                        </Link>
                      )}
                       {student.socialLinks?.whatsapp && (
                         <Link href={`https://wa.me/${student.socialLinks.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                          <DropdownMenuItem>
                            <WhatsAppIcon className="mr-2 h-4 w-4" />
                            <span>Chat on WhatsApp</span>
                          </DropdownMenuItem>
                        </Link>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      }
    </div>
  );
}
