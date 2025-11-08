'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bookmark, Star, MapPin, Calendar, Home, Building, Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useCollection } from '@/firebase/firestore/use-collection';
import type { Event, StudentProfile } from '@/lib/types';
import { collection, query, where, orderBy, type QueryConstraint, doc, deleteDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useMemo, useState } from 'react';
import { CreateEventDialog } from '@/components/create-event-dialog';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { ItemOptionsMenu } from '@/components/item-options-menu';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

function EventsSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-8 md:grid-cols-4 items-start'>
      <aside className='space-y-6 md:col-span-1 md:sticky top-24'>
        <Card><CardHeader><Skeleton className="h-6 w-3/4"/></CardHeader><CardContent className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-24 w-full" /></CardContent></Card>
      </aside>
      <main className='grid grid-cols-1 gap-6 md:col-span-3 lg:grid-cols-2'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="flex flex-col">
            <CardHeader><div className="flex items-center gap-4"><Skeleton className="size-12 rounded-full" /><div className="space-y-2"><Skeleton className="h-5 w-32" /><Skeleton className="h-4 w-20" /></div></div><Skeleton className="h-6 w-3/4 mt-4" /></CardHeader>
            <CardContent className="flex-grow space-y-4"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-4 w-1/3" /></CardContent>
            <div className='p-6 pt-2'><Skeleton className="h-10 w-full" /></div>
          </Card>
        ))}
      </main>
    </div>
  )
}

type EventType = 'All' | 'Hackathon' | 'Workshop' | 'Conference';

function EventCard({ event, users, onJoin, onEdit, onDelete }: { event: Event, users: StudentProfile[] | null, onJoin: (eventName: string) => void, onEdit: (event: Event) => void, onDelete: (eventId: string, eventName: string) => void }) {
    const { user } = useAuth();
    const organizer = users?.find(u => u.id === event.organizerId);
    const isOwner = user && user.id === event.organizerId;

    return (
        <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/30 group">
            <CardHeader>
                <div className='flex items-start justify-between'>
                    <div className='flex items-center gap-4'>
                    <Avatar className='size-12'>
                        {organizer?.photoURL && <AvatarImage src={organizer.photoURL} alt={organizer.displayName} />}
                        <AvatarFallback>{organizer?.displayName?.substring(0, 2) ?? 'EV'}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                        <p className="font-semibold text-base truncate">{organizer?.displayName}</p>
                        <p className="text-sm text-muted-foreground">Organizer</p>
                    </div>
                    </div>
                    <div className='flex'>
                        {isOwner ? (
                             <ItemOptionsMenu onEdit={() => onEdit(event)} onDelete={() => onDelete(event.id, event.title)} />
                        ) : (
                            <Button variant='ghost' size='icon'>
                                <Bookmark className='size-5' />
                            </Button>
                        )}
                    </div>
                </div>
                <CardTitle className="font-headline pt-4 text-xl">{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
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
            <p className="text-muted-foreground pt-2 line-clamp-2 text-sm leading-relaxed">{event.description}</p>
            </CardContent>
            <div className='p-6 pt-2'>
                <Button className="w-full" onClick={() => onJoin(event.title)}>Join Event</Button>
            </div>
        </Card>
    )
}

export default function EventsPage() {
  const [activeType, setActiveType] = useState<EventType>('All');
  const [locationType, setLocationType] = useState('all');
  const [isCreateEventOpen, setCreateEventOpen] = useState(false);
  const [isDeleteEventOpen, setDeleteEventOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<{id: string, name: string} | null>(null);
  const [eventToEdit, setEventToEdit] = useState<Event | undefined>(undefined);

  const eventsQuery = useMemo(() => {
    if (!db) return null;
    const baseColl = collection(db, 'events');
    const queries: QueryConstraint[] = [];

    if (activeType !== 'All') {
      queries.push(where('type', '==', activeType));
    }
    if (locationType !== 'all') {
      const isOnline = locationType === 'online';
      queries.push(where('isOnline', '==', isOnline));
    }

    return query(baseColl, ...queries, orderBy('date'));
  }, [activeType, locationType, db]);

  const { data: allEvents, loading: loadingEvents } = useCollection<Event>(eventsQuery, 'events');

  const usersQuery = useMemo(() => db ? collection(db, 'users') : null, [db]);
  const { data: users, loading: loadingUsers } = useCollection<StudentProfile>(usersQuery, 'users');
  
  const handleCreateOrEdit = (event?: Event) => {
    setEventToEdit(event);
    setCreateEventOpen(true);
  }

  const handleDelete = (eventId: string, eventName: string) => {
    setEventToDelete({ id: eventId, name: eventName });
    setDeleteEventOpen(true);
  }

  const confirmDelete = async () => {
    if (!db || !eventToDelete) return;
    const eventRef = doc(db, 'events', eventToDelete.id);
    const promise = () => deleteDoc(eventRef).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({ path: eventRef.path, operation: 'delete' });
        errorEmitter.emit('permission-error', permissionError);
        throw serverError;
    });

    toast.promise(promise, {
        loading: `Deleting ${eventToDelete.name}...`,
        success: 'Event deleted successfully.',
        error: 'Failed to delete event.'
    });
    setEventToDelete(null);
  }


  const handleJoinEvent = (eventName: string) => {
    toast.success('Successfully Registered!', {
      description: `You have joined the event: ${eventName}.`,
    });
  }
  
  const eventTypes: EventType[] = ['All', 'Hackathon', 'Workshop', 'Conference'];
  const isLoading = loadingEvents || loadingUsers;

  return (
    <>
      <CreateEventDialog 
        open={isCreateEventOpen} 
        onOpenChange={(open) => {
            if (!open) setEventToEdit(undefined);
            setCreateEventOpen(open)
        }} 
        eventToEdit={eventToEdit}
      />
      <DeleteConfirmationDialog 
        isOpen={isDeleteEventOpen}
        onOpenChange={setDeleteEventOpen}
        onConfirm={confirmDelete}
        itemName={eventToDelete?.name ?? 'event'}
      />
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">Explore Events</h1>
            <p className="mt-1 text-muted-foreground">Find your next opportunity to innovate, learn, and connect.</p>
          </div>
          <Button onClick={() => handleCreateOrEdit()}>
            <Plus className='mr-2' />
            Create Event
          </Button>
        </div>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-4 items-start'>
          <aside className='space-y-6 md:col-span-1 md:sticky top-24'>
            <Card>
              <CardHeader>
                <CardTitle className='font-headline text-lg'>Filters</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Location</h3>
                  <ToggleGroup type="single" value={locationType} onValueChange={(v) => setLocationType(v || 'all')} className="grid w-full grid-cols-2 gap-2">
                    <ToggleGroupItem value="online" aria-label="Toggle online" className='gap-2'>
                      <Home className='size-4' /> Online
                    </ToggleGroupItem>
                    <ToggleGroupItem value="campus" aria-label="Toggle campus-based" className='gap-2'>
                      <Building className='size-4' /> Campus
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Event Type</h3>
                  <div className='flex flex-col gap-2'>
                    {eventTypes.map(type => (
                      <Button 
                        key={type}
                        variant={activeType === type ? 'secondary' : 'ghost'} 
                        className='justify-start'
                        onClick={() => setActiveType(type)}
                      >
                        {type === 'All' ? 'All Types' : type}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          <main className='grid grid-cols-1 gap-6 md:col-span-3 lg:grid-cols-2'>
            {isLoading ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-96" />) :
                allEvents?.map((event) => (
                  <EventCard key={event.id} event={event} users={users} onJoin={handleJoinEvent} onEdit={handleCreateOrEdit} onDelete={handleDelete} />
                ))
            }
          </main>
        </div>

      </div>
    </>
  );
}
