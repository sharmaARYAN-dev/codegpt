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
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { MultiSelect } from './ui/multi-select';

const projectSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters long.'),
  description: z.string().min(10, 'Description must be at least 10 characters long.'),
  tags: z.array(z.string()).min(1, 'Please add at least one tag.'),
});

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const popularTags = ["React", "Next.js", "AI/ML", "Python", "TypeScript", "Node.js", "Firebase", "JavaScript"];


export function CreateProjectDialog({ open, onOpenChange }: CreateProjectDialogProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      tags: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof projectSchema>) => {
    if (!db || !user) {
      toast.error('Error', {
        description: 'You must be logged in to create a project.',
      });
      return;
    }

    setIsSubmitting(true);
    const projectData = {
      name: values.name,
      description: values.description,
      tags: values.tags.map(t => t.toLowerCase()),
      skillsNeeded: values.tags.map(t => t.toLowerCase()),
      ownerId: user.id,
      members: [{ uid: user.id, role: 'owner', joinedAt: serverTimestamp() }],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      repo: '',
      demoLink: '',
    };

    const collectionRef = collection(db, 'projects');
    const promise = () => addDoc(collectionRef, projectData).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: collectionRef.path,
          operation: 'create',
          requestResourceData: projectData,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw serverError;
      });

    toast.promise(promise, {
        loading: 'Creating your project...',
        success: () => {
            form.reset({ name: '', description: '', tags: []});
            onOpenChange(false);
            setIsSubmitting(false);
            return `${values.name} has been successfully created.`;
        },
        error: (err) => {
            setIsSubmitting(false);
            if (err instanceof FirestorePermissionError) {
                return 'Permission denied.'; 
            }
            return 'There was a problem creating your project.';
        }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create a New Project</DialogTitle>
          <DialogDescription>
            Tell us about your awesome idea.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Awesome Project" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your project in a few sentences." className="resize-none" {...field} />
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
                  <FormLabel>Tags / Tech Stack</FormLabel>
                  <FormControl>
                    <MultiSelect
                      placeholder="Add tech stack..."
                      selected={field.value}
                      onChange={field.onChange}
                      popularOptions={popularTags}
                    />
                  </FormControl>
                  <FormDescription>
                    Add relevant technologies or topics for your project.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Project
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
