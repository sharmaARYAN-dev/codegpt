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
import { useFirestore, useUser } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import type { StudentProfile } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const profileSchema = z.object({
  skills: z.string().min(1, 'Please add at least one skill.'),
  interests: z.string().min(1, 'Please add at least one interest.'),
  github: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  linkedin: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  whatsapp: z.string().optional().or(z.literal('')),
  instagram: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  reddit: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
});

interface EditProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userProfile: StudentProfile;
}

export function EditProfileDialog({ isOpen, onOpenChange, userProfile }: EditProfileDialogProps) {
  const firestore = useFirestore();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      skills: userProfile?.skills?.join(', ') || '',
      interests: userProfile?.interests?.join(', ') || '',
      github: userProfile?.socialLinks?.github || '',
      linkedin: userProfile?.socialLinks?.linkedin || '',
      whatsapp: userProfile?.socialLinks?.whatsapp || '',
      instagram: userProfile?.socialLinks?.instagram || '',
      reddit: userProfile?.socialLinks?.reddit || '',
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        skills: userProfile.skills?.join(', ') || '',
        interests: userProfile.interests?.join(', ') || '',
        github: userProfile.socialLinks?.github || '',
        linkedin: userProfile.socialLinks?.linkedin || '',
        whatsapp: userProfile.socialLinks?.whatsapp || '',
        instagram: userProfile.socialLinks?.instagram || '',
        reddit: userProfile.socialLinks?.reddit || '',
      });
    }
  }, [userProfile, form, isOpen]);

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    if (!firestore || !user) {
      toast.error('Error', {
        description: 'You must be logged in to edit your profile.',
      });
      return;
    }

    setIsSubmitting(true);
    const updatedData = {
      skills: values.skills.split(',').map(s => s.trim()).filter(Boolean),
      interests: values.interests.split(',').map(i => i.trim()).filter(Boolean),
      socialLinks: {
        github: values.github || '',
        linkedin: values.linkedin || '',
        whatsapp: values.whatsapp || '',
        instagram: values.instagram || '',
        reddit: values.reddit || '',
      }
    };
    
    const userRef = doc(firestore, 'users', user.uid);
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
            if (err instanceof FirestorePermissionError) {
                // The global listener will show the toast
                return 'Permission denied.'; 
            }
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills</FormLabel>
                  <FormControl>
                    <Input placeholder="React, Python, Figma" {...field} />
                  </FormControl>
                  <FormDescription>Comma-separated list of your skills.</FormDescription>
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
                    <Input placeholder="AI, Music, Gaming" {...field} />
                  </FormControl>
                   <FormDescription>Comma-separated list of your interests.</FormDescription>
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
              name="instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://instagram.com/username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="reddit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reddit URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://reddit.com/user/username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1234567890" {...field} />
                  </FormControl>
                   <FormDescription>Include your country code.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4 sticky bottom-0 bg-background">
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
