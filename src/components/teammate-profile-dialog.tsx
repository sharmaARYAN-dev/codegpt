'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Github, Linkedin, Check, Clock, UserPlus, Mail, School, BookOpen, BrainCircuit } from 'lucide-react';
import type { StudentProfile } from '@/lib/types';

interface TeammateProfileDialogProps {
  student: StudentProfile | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConnect: () => void;
  buttonState: 'CONNECT' | 'PENDING' | 'CONNECTED';
}

export function TeammateProfileDialog({ student, isOpen, onOpenChange, onConnect, buttonState }: TeammateProfileDialogProps) {
  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="items-center text-center">
          <Avatar className="h-32 w-32 border-4 border-muted">
            <AvatarImage src={student.photoURL} alt={student.displayName} />
            <AvatarFallback className="text-4xl">{student.displayName.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <DialogTitle className="font-headline text-3xl pt-2">{student.displayName}</DialogTitle>
          <p className="text-muted-foreground">{student.college}</p>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
            {student.bio && (
                <p className="text-center text-muted-foreground">{student.bio}</p>
            )}

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold flex items-center gap-2 mb-2"><BrainCircuit className="size-5 text-primary" />Skills</h4>
              <div className="flex flex-wrap gap-2">
                {student.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="capitalize">{skill}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold flex items-center gap-2 mb-2"><BookOpen className="size-5 text-primary" />Interests</h4>
              <div className="flex flex-wrap gap-2">
                {student.interests.map((interest) => (
                  <Badge key={interest} variant="outline" className="capitalize">{interest}</Badge>
                ))}
              </div>
            </div>
          </div>
          
           <div className="text-sm text-muted-foreground space-y-2">
                <div className="flex items-center gap-2">
                    <Mail className="size-4"/>
                    <a href={`mailto:${student.email}`} className="hover:text-primary transition-colors">{student.email}</a>
                </div>
                <div className="flex items-center gap-2">
                    <School className="size-4"/>
                    <span>{student.branch} &middot; {student.year} Year</span>
                </div>
            </div>
        </div>

        <DialogFooter className="sm:justify-between gap-2">
            <div className="flex gap-2">
                {student.links?.github && (
                    <Button variant="outline" size="icon" asChild>
                        <a href={student.links.github} target="_blank" rel="noopener noreferrer"><Github className="h-5 w-5" /></a>
                    </Button>
                )}
                {student.links?.linkedin && (
                    <Button variant="outline" size="icon" asChild>
                        <a href={student.links.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin className="h-5 w-5" /></a>
                    </Button>
                )}
            </div>
            <Button 
                className="w-full sm:w-auto" 
                disabled={buttonState !== 'CONNECT'}
                onClick={onConnect}
            >
                {buttonState === 'CONNECT' && <><UserPlus className="mr-2 h-4 w-4" /> Connect</>}
                {buttonState === 'PENDING' && <><Clock className="mr-2 h-4 w-4" /> Pending</>}
                {buttonState === 'CONNECTED' && <><Check className="mr-2 h-4 w-4" /> Connected</>}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
