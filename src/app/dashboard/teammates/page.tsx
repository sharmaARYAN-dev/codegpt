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
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection } from 'firebase/firestore';
import type { StudentProfile } from '@/lib/types';
import { useMemo, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { RedditIcon, WhatsAppIcon } from '@/components/icons';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';


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
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInterest, setSelectedInterest] = useState('all');

  const usersQuery = useMemo(() => db ? collection(db, 'users') : null, [db]);
  const { data: users, loading } = useCollection<StudentProfile>(usersQuery, 'users');
  
  const teammates = useMemo(() => {
    if (!users) return [];
    let filteredUsers = user ? users.filter(u => u.id !== user.id) : users;

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
            const hasSocials = student.links && Object.values(student.links).some(link => !!link);
            return (
              <Card key={student.id} className="flex flex-col text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/20 hover:shadow-lg hover:border-primary/30 group">
                <CardHeader className="flex-1 flex flex-col items-center pt-8">
                  <Avatar className="h-28 w-28 border-4 border-muted">
                    <AvatarImage src={student.photoURL} alt={student.displayName} />
                    <AvatarFallback className='text-3xl'>{student.displayName.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="mt-4 font-headline text-xl">{student.displayName}</CardTitle>
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
                      {student.links?.github && (
                        <Link href={student.links.github} target="_blank" rel="noopener noreferrer">
                          <DropdownMenuItem>
                            <Github className="mr-2 h-4 w-4" />
                            <span>View GitHub</span>
                          </DropdownMenuItem>
                        </Link>
                      )}
                      {student.links?.linkedin && (
                         <Link href={student.links.linkedin} target="_blank" rel="noopener noreferrer">
                          <DropdownMenuItem>
                            <Linkedin className="mr-2 h-4 w-4" />
                            <span>View LinkedIn</span>
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
