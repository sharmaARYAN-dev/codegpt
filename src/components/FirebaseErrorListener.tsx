'use client';

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import type { FirestorePermissionError } from '@/firebase/errors';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      console.error('Firestore Permission Error:', error.toContextObject());

      // In a real app, you might want to log this to a service like Sentry
      // For this prototype, we'll show a toast to the user.
      if (process.env.NODE_ENV === 'development') {
         toast({
          variant: 'destructive',
          title: 'Firestore Permission Error',
          description: (
            <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
              <code className="text-white">{error.toString()}</code>
            </pre>
          ),
        });
      }
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}
