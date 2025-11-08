'use client';

import {
  Card,
  CardContent,
  CardDescription,
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
import { Search, Github, Linkedin, Check, X, UserPlus, Clock } from 'lucide-react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import type { StudentProfile } from '@/lib/types';
import { useMemo, useState, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { createNotification } from '@/lib/notification-services';
import { TeammateProfileDialog } from '@/components/teammate-profile-dialog';

function TeammatesSkeleton() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
           <Skeleton className="h-6 w-40" />
           <Skeleton className="h-4 w-64 mt-1" />
        </CardHeader>
        <CardContent>
           <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
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
    </div>
  );
}

function useConnection(currentUser: StudentProfile | null) {
    const sendRequest = useCallback(async (targetUser: StudentProfile) => {
        if (!currentUser || !db) return;
        
        const currentUserRef = doc(db, "users", currentUser.id);
        const targetUserRef = doc(db, "users", targetUser.id);

        const promise = Promise.all([
             updateDoc(currentUserRef, { sentRequests: arrayUnion(targetUser.id) }),
             updateDoc(targetUserRef, { incomingRequests: arrayUnion(currentUser.id) }),
             createNotification({
                userId: targetUser.id,
                type: 'connection_request',
                message: `${currentUser.displayName} wants to connect with you.`,
                from: {
                    id: currentUser.id,
                    name: currentUser.displayName,
                    photoURL: currentUser.photoURL,
                },
                link: '/dashboard/teammates',
             })
        ]);
        
        toast.promise(promise, {
            loading: 'Sending request...',
            success: 'Connection request sent!',
            error: 'Failed to send request.',
        });

    }, [currentUser]);

    const acceptRequest = useCallback(async (requester: StudentProfile) => {
        if (!currentUser || !db) return;

        const currentUserRef = doc(db, "users", currentUser.id);
        const requesterRef = doc(db, "users", requester.id);

        const promise = Promise.all([
            updateDoc(currentUserRef, {
                incomingRequests: arrayRemove(requester.id),
                connections: arrayUnion(requester.id)
            }),
            updateDoc(requesterRef, {
                sentRequests: arrayRemove(currentUser.id),
                connections: arrayUnion(currentUser.id)
            }),
            createNotification({
                userId: requester.id,
                type: 'connection_accepted',
                message: `${currentUser.displayName} accepted your connection request.`,
                from: {
                    id: currentUser.id,
                    name: currentUser.displayName,
                    photoURL: currentUser.photoURL,
                },
                link: '/dashboard/teammates',
            })
        ]);
        
         toast.promise(promise, {
            loading: 'Accepting request...',
            success: 'Connection accepted!',
            error: 'Failed to accept request.',
        });
    }, [currentUser]);

    const declineRequest = useCallback(async (requesterId: string) => {
        if (!currentUser || !db) return;
        const currentUserRef = doc(db, "users", currentUser.id);
        const requesterRef = doc(db, "users", requesterId);

        const promise = Promise.all([
            updateDoc(currentUserRef, { incomingRequests: arrayRemove(requesterId) }),
            updateDoc(requesterRef, { sentRequests: arrayRemove(currentUser.id) })
        ]);

        toast.promise(promise, {
            loading: 'Declining request...',
            success: 'Request declined.',
            error: 'Failed to decline request.',
        });
    }, [currentUser]);

    return { sendRequest, acceptRequest, declineRequest };
}


function ConnectionRequestCard({ request, onAccept, onDecline }: { request: StudentProfile, onAccept: () => void, onDecline: () => void }) {
    return (
        <div className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-muted/50">
            <div className="flex items-center gap-3">
                 <Avatar className="h-11 w-11">
                    <AvatarImage src={request.photoURL} alt={request.displayName} />
                    <AvatarFallback className='text-sm'>{request.displayName.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                    <p className="font-semibold truncate">{request.displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">{request.skills.slice(0, 3).join(', ')}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button size="icon" variant="outline" className="h-8 w-8 bg-green-500/10 text-green-600 border-green-500/30 hover:bg-green-500/20 hover:text-green-700" onClick={onAccept}><Check className="h-4 w-4" /></Button>
                <Button size="icon" variant="outline" className="h-8 w-8 bg-red-500/10 text-red-600 border-red-500/30 hover:bg-red-500/20 hover:text-red-700" onClick={onDecline}><X className="h-4 w-4" /></Button>
            </div>
        </div>
    )
}

function TeammateCard({ student, onConnect, buttonState, onCardClick }: { student: StudentProfile, onConnect: () => void, buttonState: 'CONNECT' | 'PENDING' | 'CONNECTED', onCardClick: () => void }) {
  return (
    <Card className="flex flex-col text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/20 hover:shadow-lg hover:border-primary/30 group">
      <CardContent className="p-6 pb-2 flex-1 cursor-pointer" onClick={onCardClick}>
        <Avatar className="h-28 w-28 border-4 border-muted mx-auto">
          <AvatarImage src={student.photoURL} alt={student.displayName} />
          <AvatarFallback className='text-3xl'>{student.displayName.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <h3 className="mt-4 font-headline text-xl">{student.displayName}</h3>
        <p className="text-sm text-muted-foreground">{student.college}</p>
        <div className="mt-4">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Skills</h4>
          <div className="flex flex-wrap justify-center gap-1.5 mt-2">
            {student.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="capitalize">
                {skill}
              </Badge>
            ))}
            {student.skills.length > 3 && <Badge variant="secondary">...</Badge>}
          </div>
        </div>
      </CardContent>
      <CardFooter className='p-4 pt-2'>
        <Button 
            className="w-full" 
            disabled={buttonState !== 'CONNECT'}
            onClick={onConnect}
        >
            {buttonState === 'CONNECT' && <><UserPlus className="mr-2 h-4 w-4" /> Connect</>}
            {buttonState === 'PENDING' && <><Clock className="mr-2 h-4 w-4" /> Pending</>}
            {buttonState === 'CONNECTED' && <><Check className="mr-2 h-4 w-4" /> Connected</>}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function ConnectionsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInterest, setSelectedInterest] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const { sendRequest, acceptRequest, declineRequest } = useConnection(user);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);

  const usersQuery = useMemo(() => db ? collection(db, 'users') : null, [db]);
  const { data: users, loading } = useCollection<StudentProfile>(usersQuery, 'users');
  
  const connections = useMemo(() => {
    if (!users) return [];
    let filteredUsers = user ? users.filter(u => u.id !== user.id) : users;

    if (selectedInterest !== 'all') {
      filteredUsers = filteredUsers.filter(u => u.interests.includes(selectedInterest));
    }

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filteredUsers = filteredUsers.filter(u => 
        u.displayName.toLowerCase().includes(lowercasedTerm) ||
        u.college?.toLowerCase().includes(lowercasedTerm) ||
        u.skills.some(skill => skill.toLowerCase().includes(lowercasedTerm)) ||
        u.interests.some(interest => interest.toLowerCase().includes(lowercasedTerm))
      );
    }
    
    const scoredUsers = filteredUsers.map(u => {
        let score = 0;
        if (user) {
            const currentUserSkills = new Set(user.skills || []);
            const currentUserInterests = new Set(user.interests || []);
            const sharedSkills = u.skills?.filter(skill => currentUserSkills.has(skill)) || [];
            const sharedInterests = u.interests?.filter(interest => currentUserInterests.has(interest)) || [];
            score += sharedSkills.length * 2;
            score += sharedInterests.length;
        }
        return { ...u, score };
    });

    if (sortBy === 'relevance') {
        return scoredUsers.sort((a, b) => b.score - a.score);
    }
    if (sortBy === 'xp') {
        return scoredUsers.sort((a, b) => (b.xp || 0) - (a.xp || 0));
    }
    if (sortBy === 'name') {
        return scoredUsers.sort((a, b) => a.displayName.localeCompare(b.displayName));
    }
    
    return scoredUsers;

  }, [user, users, searchTerm, selectedInterest, sortBy]);
  
  const interests = useMemo(() => {
    if (!users) return [];
    const allInterests = users.flatMap((s) => s.interests || []);
    return ['all', ...Array.from(new Set(allInterests))];
  }, [users]);
  
  const connectionRequests = useMemo(() => {
    if (!user || !users) return [];
    return users.filter(u => user.incomingRequests?.includes(u.id));
  }, [user, users]);

  const getButtonState = (studentId: string) => {
    if (!user) return 'CONNECT';
    if (user.connections?.includes(studentId)) return 'CONNECTED';
    if (user.sentRequests?.includes(studentId)) return 'PENDING';
    return 'CONNECT';
  }

  return (
    <>
      <TeammateProfileDialog
        student={selectedStudent}
        isOpen={!!selectedStudent}
        onOpenChange={() => setSelectedStudent(null)}
        onConnect={() => selectedStudent && sendRequest(selectedStudent)}
        buttonState={selectedStudent ? getButtonState(selectedStudent.id) : 'CONNECT'}
      />
      <div className="space-y-8">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Find Connections</h1>
          <p className="text-muted-foreground mt-1">Browse and connect with talented students across the university.</p>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by name, skill, interest, or college..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                  <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                          <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="relevance">Sort by: Relevance</SelectItem>
                          <SelectItem value="xp">Sort by: Experience</SelectItem>
                          <SelectItem value="name">Sort by: Name</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {loading ? <TeammatesSkeleton /> :
        <>
          {connectionRequests.length > 0 && (
              <Card>
                  <CardHeader>
                      <CardTitle className="font-headline text-xl">Connection Requests</CardTitle>
                      <CardDescription>You have {connectionRequests.length} pending connection request{connectionRequests.length > 1 && 's'}.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {connectionRequests.map(req => (
                          <ConnectionRequestCard 
                              key={req.id} 
                              request={req}
                              onAccept={() => acceptRequest(req)}
                              onDecline={() => declineRequest(req.id)}
                          />
                      ))}
                  </CardContent>
              </Card>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {connections.map((student) => {
              if (user?.incomingRequests?.includes(student.id)) return null;

              return (
                <TeammateCard 
                  key={student.id} 
                  student={student}
                  onConnect={() => sendRequest(student)}
                  buttonState={getButtonState(student.id)}
                  onCardClick={() => setSelectedStudent(student)}
                />
              );
            })}
          </div>
        </>
        }
      </div>
    </>
  );
}
