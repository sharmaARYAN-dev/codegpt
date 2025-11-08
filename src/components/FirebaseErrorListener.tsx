'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { errorEmitter } from '@/firebase/error-emitter';
import type { FirestorePermissionError } from '@/firebase/errors';

export function FirebaseErrorListener() {

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      console.error('Firestore Permission Error:', error.toContextObject());

      if (process.env.NODE_ENV === 'development') {
         toast.error('Firestore Permission Error', {
          description: (
            <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
              <code className="text-white">{error.toString()}</code>
            </pre>
          ),
          duration: 10000,
        });
      }
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, []);

  return null;
}
