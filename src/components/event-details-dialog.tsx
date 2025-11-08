'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { toast } from 'sonner';
import { useState } from 'react';
import { Calendar, Loader2, MapPin, Ticket } from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { Event } from '@/lib/types';
import { Badge } from './ui/badge';
import { createNotification } from '@/lib/notification-services';

interface EventDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event;
}

export function EventDetailsDialog({ event, isOpen, onOpenChange }: EventDetailsDialogProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    if (!db || !user) return;
    
    setIsSubmitting(true);
    const userRef = doc(db, 'users', user.id);

    const promise = () => Promise.all([
        updateDoc(userRef, { registeredEvents: arrayUnion(event.id) }),
        createNotification({
            userId: user.id,
            type: 'event_reminder',
            message: `You have successfully registered for ${event.title}!`,
            link: '/dashboard/events',
        })
    ]).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: userRef.path,
            operation: 'update',
            requestResourceData: { registeredEvents: `arrayUnion(${event.id})` },
        });
        errorEmitter.emit('permission-error', permissionError);
        throw serverError;
    });

    toast.promise(promise, {
      loading: 'Registering for event...',
      success: () => {
        setIsSubmitting(false);
        onOpenChange(false);
        return 'Successfully registered for the event!';
      },
      error: () => {
        setIsSubmitting(false);
        return 'Failed to register for the event.';
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">{event.title}</DialogTitle>
          <DialogDescription>Confirm your registration for this event.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
                <div className='flex items-center gap-2'>
                    <Calendar className='size-4' />
                    <span>{event.date.toDate().toLocaleDateString()}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <MapPin className='size-4' />
                    <span>{event.location}</span>
                </div>
            </div>
            <div className="flex items-center gap-2 text-sm flex-wrap">
                {event.tags.map(tag => <Badge key={tag} variant='secondary'>{tag}</Badge>)}
            </div>
            <p className="text-muted-foreground pt-2 text-sm leading-relaxed">{event.description}</p>
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="button" onClick={handleRegister} disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Ticket className="mr-2 h-4 w-4" />
            )}
            Confirm Registration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
