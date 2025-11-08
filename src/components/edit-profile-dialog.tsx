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
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import type { StudentProfile } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Textarea } from './ui/textarea';
import { MultiSelect } from './ui/multi-select';

const profileSchema = z.object({
  displayName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  bio: z.string().max(200, 'About me should not exceed 200 characters.').optional().or(z.literal('')),
  skills: z.array(z.string()).min(1, 'Please add at least one skill.'),
  interests: z.array(z.string()).min(1, 'Please add at least one interest.'),
  github: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  linkedin: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  portfolio: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
});

interface EditProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userProfile: StudentProfile;
}

const popularSkills = ["React", "Next.js", "AI/ML", "Python", "TypeScript", "Node.js", "Firebase", "JavaScript", "Figma", "UI/UX"];
const popularInterests = ["Web Development", "Artificial Intelligence", "Mobile Development", "UI/UX Design", "Gaming", "Startups", "Blockchain"];


export function EditProfileDialog({ isOpen, onOpenChange, userProfile }: EditProfileDialogProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: userProfile?.displayName || '',
      bio: userProfile?.bio || '',
      skills: userProfile?.skills || [],
      interests: userProfile?.interests || [],
      github: userProfile?.links?.github || '',
      linkedin: userProfile?.links?.linkedin || '',
      portfolio: userProfile?.links?.portfolio || '',
    },
  });

  useEffect(() => {
    if (userProfile && isOpen) {
      form.reset({
        displayName: userProfile.displayName || '',
        bio: userProfile.bio || '',
        skills: userProfile.skills || [],
        interests: userProfile.interests || [],
        github: userProfile.links?.github || '',
        linkedin: userProfile.links?.linkedin || '',
        portfolio: userProfile.links?.portfolio || '',
      });
    }
  }, [userProfile, form, isOpen]);

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    if (!db || !user) {
      toast.error('Error', {
        description: 'You must be logged in to edit your profile.',
      });
      return;
    }

    setIsSubmitting(true);
    const updatedData = {
      displayName: values.displayName,
      bio: values.bio,
      skills: values.skills.map(s => s.trim().toLowerCase()).filter(Boolean),
      interests: values.interests.map(i => i.trim().toLowerCase()).filter(Boolean),
      links: {
        github: values.github || '',
        linkedin: values.linkedin || '',
        portfolio: values.portfolio || '',
      },
      updatedAt: serverTimestamp(),
    };
    
    const userRef = doc(db, 'users', user.id);
    const promise = () => updateDoc(userRef, updatedData).catch(async (serverError) => {
         const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: 'update',
          requestResourceData: updatedData,
        });
        errorEmitter.emit('permission-error', permissionError);
        throw serverError;
      });

    toast.promise(promise, {
        loading: 'Saving your changes...',
        success: () => {
            onOpenChange(false);
            setIsSubmitting(false);
            return 'Your profile has been updated.';
        },
        error: (err) => {
            setIsSubmitting(false);
            return 'There was a problem updating your profile.';
        }
    })
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Your Profile</DialogTitle>
          <DialogDescription>
            Update your skills, interests and social links to find better matches.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
             <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us a little bit about yourself..." className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills</FormLabel>
                  <FormControl>
                     <MultiSelect
                      placeholder="Add skills..."
                      selected={field.value}
                      onChange={field.onChange}
                      popularOptions={popularSkills}
                    />
                  </FormControl>
                  <FormDescription>What are you good at?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interests</FormLabel>
                   <FormControl>
                     <MultiSelect
                      placeholder="Add interests..."
                      selected={field.value}
                      onChange={field.onChange}
                      popularOptions={popularInterests}
                    />
                  </FormControl>
                   <FormDescription>What are you passionate about?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://linkedin.com/in/username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="portfolio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portfolio URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://your.portfolio" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4 sticky bottom-0 bg-background/95 pb-1">
               <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
