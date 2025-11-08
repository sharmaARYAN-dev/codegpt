'use client';

import { Button } from '@/components/ui/button';
import { useFirestore } from '@/firebase';
import {
  seedUsers,
  seedProjects,
  seedEvents,
  seedForumPosts,
} from '@/lib/seed-data';
import {
  writeBatch,
  collection,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SeedPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleSeedDatabase = async () => {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Firestore is not available.',
      });
      return;
    }

    setIsLoading(true);
    setIsDone(false);

    try {
      const batch = writeBatch(firestore);

      // --- Seed Users ---
      const usersCollection = collection(firestore, 'users');
      const userRefs: { id: string, user: any }[] = [];
      seedUsers.forEach((user) => {
        const userRef = doc(usersCollection);
        batch.set(userRef, { ...user, id: userRef.id });
        userRefs.push({ id: userRef.id, user });
      });

      // --- Seed Projects ---
      const projectsCollection = collection(firestore, 'projects');
      seedProjects.forEach((project, index) => {
        const projectRef = doc(projectsCollection);
        // Assign a random user as the owner
        const ownerId = userRefs[index % userRefs.length].id;
        batch.set(projectRef, { ...project, id: projectRef.id, ownerId, createdAt: Timestamp.now() });
      });

      // --- Seed Events ---
      const eventsCollection = collection(firestore, 'events');
      seedEvents.forEach((event, index) => {
        const eventRef = doc(eventsCollection);
        // Assign a random user as the organizer
        const organizerId = userRefs[index % userRefs.length].id;
        batch.set(eventRef, { ...event, id: eventRef.id, organizerId });
      });

      // --- Seed Forum Posts ---
      const forumPostsCollection = collection(firestore, 'forumPosts');
      seedForumPosts.forEach((post, index) => {
        const postRef = doc(forumPostsCollection);
        // Assign a random user as the author
        const authorId = userRefs[index % userRefs.length].id;
        batch.set(postRef, {
          ...post,
          id: postRef.id,
          authorId,
          createdAt: Timestamp.fromMillis(Date.now() - (index * 24 * 60 * 60 * 1000)),
        });
      });

      await batch.commit();

      toast({
        title: 'Database Seeded!',
        description:
          'Your Firestore database has been populated with initial data.',
      });
      setIsDone(true);
    } catch (error: any) {
      console.error('Error seeding database:', error);
      toast({
        variant: 'destructive',
        title: 'Seeding Failed',
        description:
          error.message || 'An unexpected error occurred during seeding.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex h-full items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Seed Database</CardTitle>
          <CardDescription>
            Populate your Firestore database with initial data. This will add
            users, projects, events, and forum posts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleSeedDatabase}
            disabled={isLoading || isDone}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isDone ? 'Database Seeded!' : 'Seed Database'}
          </Button>
           {isDone && <p className="mt-4 text-center text-sm text-green-500">Seeding complete. You can now explore the app with the new data.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
