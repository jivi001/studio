'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      // In a development environment, we throw an error to leverage the Next.js error overlay.
      // This provides a rich, interactive debugging experience.
      if (process.env.NODE_ENV === 'development') {
        // We throw the error in a timeout to break out of the current render cycle
        // and ensure Next.js's error boundary can catch it.
        setTimeout(() => {
          throw error;
        }, 0);
      } else {
        // In production, you might want to log this to a monitoring service
        // or display a more user-friendly message.
        console.error('A Firestore permission error occurred:', error.toString());
      }
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  return null; // This component does not render anything.
}
