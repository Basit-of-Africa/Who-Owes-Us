
'use client';

import { useState, useEffect } from 'react';
import { 
  DocumentReference, 
  onSnapshot, 
  DocumentSnapshot, 
  DocumentData 
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';
import { firebaseConfig } from '../config';
import { fallbackStore } from '@/lib/fallback-registry';

function getFallbackDoc(ref: any): any | null {
  const path = ref?.path || '';
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 2 && segments[0] === 'politicians') {
    return fallbackStore.getById(segments[1]) || null;
  }
  return null;
}

export function useDoc<T = DocumentData>(ref: DocumentReference<T> | null) {
  const [data, setData] = useState<T | null>(() => {
    if (!ref) return null;
    return getFallbackDoc(ref) as T | null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!ref) {
      setLoading(false);
      return;
    }

    const unsubFallback = fallbackStore.subscribe(() => {
      const fb = getFallbackDoc(ref);
      if (fb) {
        setData(fb as T);
      }
    });

    const isPlaceholder = firebaseConfig.apiKey === 'placeholder-api-key';
    if (isPlaceholder) {
      const fallback = getFallbackDoc(ref);
      if (fallback) {
        setData(fallback as T);
      }
      setLoading(false);
    }

    let unsubSnapshot: (() => void) | null = null;
    try {
      unsubSnapshot = onSnapshot(
        ref,
        (snapshot: DocumentSnapshot<T>) => {
          if (snapshot.exists()) {
            setData({ ...snapshot.data(), id: snapshot.id });
          } else {
            const fallback = getFallbackDoc(ref);
            setData(fallback as T | null);
          }
          setLoading(false);
        },
        async (err) => {
          if (!isPlaceholder) {
            const permissionError = new FirestorePermissionError({
              path: ref.path,
              operation: 'get',
            });
            errorEmitter.emit('permission-error', permissionError);
          }
          const fallback = getFallbackDoc(ref);
          setData(fallback as T | null);
          setError(err);
          setLoading(false);
        }
      );
    } catch {
      const fallback = getFallbackDoc(ref);
      setData(fallback as T | null);
      setLoading(false);
    }

    return () => {
      unsubFallback();
      if (unsubSnapshot) unsubSnapshot();
    };
  }, [ref]);

  return { data, loading, error };
}
