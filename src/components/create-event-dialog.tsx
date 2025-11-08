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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Switch } from './ui/switch';
import type { Event } from '@/lib/types';

const eventSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long.'),
  type: z.enum(['Hackathon', 'Workshop', 'Conference']),
  date: z.date({
    required_error: "A date for the event is required.",
  }),
  isOnline: z.boolean().default(false),
  location: z.string().optional(),
  description: z.string().min(20, 'Description must be at least 20 characters long.'),
  tags: z.string().min(2, 'Please provide at least one tag.'),
}).refine(data => data.isOnline || (!!data.location && data.location.length >= 2), {
    message: 'Location is required for in-person events.',
    path: ['location'],
});

type EventFormValues = z.infer<typeof eventSchema>;

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventToEdit?: Event;
}

export function CreateEventDialog({ open, onOpenChange, eventToEdit }: CreateEventDialogProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      isOnline: false,
      location: '',
      description: '',
      tags: '',
    },
  });

  useEffect(() => {
    if (eventToEdit) {
      form.reset({
        title: eventToEdit.title,
        type: eventToEdit.type,
        date: eventToEdit.date.toDate(),
        isOnline: eventToEdit.isOnline,
        location: eventToEdit.isOnline ? '' : eventToEdit.location,
        description: eventToEdit.description,
        tags: eventToEdit.tags.join(', '),
      });
    } else {
      form.reset({
        title: '',
        isOnline: false,
        location: '',
        description: '',
        tags: '',
        type: undefined,
        date: undefined
      });
    }
  }, [eventToEdit, form, open]);
  
  const isOnline = form.watch('isOnline');
  const isEditing = !!eventToEdit;
  
  const onSubmit = async (values: EventFormValues) => {
    if (!db || !user) {
      toast.error('Error', { description: 'You must be logged in to create or edit an event.' });
      return;
    }

    setIsSubmitting(true);
    
    const eventData = {
      ...values,
      tags: values.tags.split(',').map(tag => tag.trim()),
      location: values.isOnline ? 'Online' : values.location,
      organizerId: user.id,
      updatedAt: serverTimestamp(),
    };

    const promise = () => {
        if (isEditing) {
            const eventRef = doc(db, 'events', eventToEdit.id);
            return updateDoc(eventRef, eventData).catch(async (serverError) => {
                const permissionError = new FirestorePermissionError({ path: eventRef.path, operation: 'update', requestResourceData: eventData });
                errorEmitter.emit('permission-error', permissionError);
                throw serverError;
            });
        } else {
            const collectionRef = collection(db, 'events');
            return addDoc(collectionRef, { ...eventData, createdAt: serverTimestamp() }).catch(async (serverError) => {
                const permissionError = new FirestorePermissionError({ path: collectionRef.path, operation: 'create', requestResourceData: eventData });
                errorEmitter.emit('permission-error', permissionError);
                throw serverError;
            });
        }
    };

    toast.promise(promise, {
        loading: isEditing ? 'Saving changes...' : 'Creating your event...',
        success: () => {
            form.reset();
            onOpenChange(false);
            setIsSubmitting(false);
            return isEditing ? 'Event updated successfully.' : 'Event created successfully.';
        },
        error: (err) => {
            setIsSubmitting(false);
            return isEditing ? 'There was a problem updating your event.' : 'There was a problem creating your event.';
        }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Event' : 'Create a New Event'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details for your event.' : 'Fill out the details below to post a new event for the community.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., InnovateAI Hackathon" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Event Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an event type" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Hackathon">Hackathon</SelectItem>
                                <SelectItem value="Workshop">Workshop</SelectItem>
                                <SelectItem value="Conference">Conference</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(field.value, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                date < new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
            </div>
             <FormField
                control={form.control}
                name="isOnline"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Online Event</FormLabel>
                      <FormDescription>
                        Is this event virtual or in-person?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {!isOnline && (
                 <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Main Auditorium" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
              )}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the event..." className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. AI, WebDev, Networking" {...field} />
                  </FormControl>
                  <FormDescription>
                    Comma-separated list of relevant tags.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className='pt-4'>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Save Changes' : 'Create Event'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
