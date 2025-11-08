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
import { format, startOfToday } from 'date-fns';
import { Switch } from './ui/switch';
import type { Event } from '@/lib/types';
import { MultiSelect } from './ui/multi-select';

const eventSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long.'),
  type: z.enum(['Hackathon', 'Workshop', 'Conference']),
  date: z.date({
    required_error: "A date for the event is required.",
  }),
  isOnline: z.boolean().default(false),
  location: z.string().optional(),
  customLocation: z.string().optional(),
  description: z.string().min(20, 'Description must be at least 20 characters long.'),
  tags: z.array(z.string()).min(1, 'Please provide at least one tag.'),
}).refine(data => {
    if (data.isOnline) return true;
    if (data.location === 'Other') {
        return !!data.customLocation && data.customLocation.length >= 2;
    }
    return !!data.location && data.location.length >= 2;
}, {
    message: 'A valid location is required for in-person events.',
    path: ['location'],
});

type EventFormValues = z.infer<typeof eventSchema>;

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventToEdit?: Event;
}

const campusLocations = ["Main Auditorium", "Library", "Engineering Block", "Science Wing", "Student Union"];
const popularTags = ["AI", "WebDev", "Mobile", "Design", "Networking", "Career"];


export function CreateEventDialog({ open, onOpenChange, eventToEdit }: CreateEventDialogProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      isOnline: false,
      location: '',
      customLocation: '',
      description: '',
      tags: [],
    },
  });

  useEffect(() => {
    if (eventToEdit) {
      const isCustomLocation = !campusLocations.includes(eventToEdit.location) && eventToEdit.location !== 'Online';
      form.reset({
        title: eventToEdit.title,
        type: eventToEdit.type,
        date: eventToEdit.date.toDate(),
        isOnline: eventToEdit.isOnline,
        location: isCustomLocation ? 'Other' : eventToEdit.location,
        customLocation: isCustomLocation ? eventToEdit.location : '',
        description: eventToEdit.description,
        tags: eventToEdit.tags,
      });
    } else {
      form.reset({
        title: '',
        isOnline: false,
        location: '',
        customLocation: '',
        description: '',
        tags: [],
        type: undefined,
        date: undefined
      });
    }
  }, [eventToEdit, form, open]);
  
  const isOnline = form.watch('isOnline');
  const location = form.watch('location');
  const isEditing = !!eventToEdit;
  
  const onSubmit = async (values: EventFormValues) => {
    if (!db || !user) {
      toast.error('Error', { description: 'You must be logged in to create or edit an event.' });
      return;
    }

    setIsSubmitting(true);

    let finalLocation = 'Online';
    if (!values.isOnline) {
      finalLocation = values.location === 'Other' ? values.customLocation! : values.location!;
    }
    
    const eventData = {
      ...values,
      tags: values.tags,
      location: finalLocation,
      organizerId: user.id,
      updatedAt: serverTimestamp(),
    };
    
    // Remove temporary fields
    delete (eventData as any).customLocation;

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
                        <FormItem className="flex flex-col pt-2">
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
                                disabled={(date) => date < startOfToday() }
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
                <div className='space-y-4'>
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a location" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {campusLocations.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {location === 'Other' && (
                        <FormField
                            control={form.control}
                            name="customLocation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Custom Location</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Specify location" {...field} value={field.value ?? ''}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </div>
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
                     <MultiSelect
                      placeholder="Add relevant tags..."
                      selected={field.value}
                      onChange={field.onChange}
                      popularOptions={popularTags}
                    />
                  </FormControl>
                  <FormDescription>
                    Add relevant keywords to help people find your event.
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
