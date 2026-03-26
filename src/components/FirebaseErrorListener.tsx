'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * A non-rendering component that listens for Firebase errors emitted globally
 * and surfaces them to the user via toasts or dev overlays.
 */
export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = errorEmitter.on('permission-error', (error: FirestorePermissionError) => {
      // In development, we want to see the rich contextual error
      if (process.env.NODE_ENV === 'development') {
        console.error('Firebase Security Rules Denial:', error.context);
        
        toast({
          variant: 'destructive',
          title: 'Permission Denied',
          description: `Check Security Rules for: ${error.context.operation} at ${error.context.path}`,
        });
      } else {
        // Production-friendly message
        toast({
          variant: 'destructive',
          title: 'Access Denied',
          description: 'You do not have permission to perform this action.',
        });
      }
    });

    return () => unsubscribe();
  }, [toast]);

  return null;
}
