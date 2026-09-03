
'use client';

import { useState, useEffect } from 'react';
import { 
  Query, 
  onSnapshot, 
  QuerySnapshot, 
  DocumentData 
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';
import { firebaseConfig } from '../config';
import { fallbackStore } from '@/lib/fallback-registry';

function getFallbackDataForQuery(query: any): any[] {
  const path = query?._query?.path?.segments?.join('/') || query?.path || '';
  const segments = path.split('/').filter(Boolean);

  if (segments.length === 1 && segments[0] === 'politicians') {
    return fallbackStore.getAll();
  }

  if (segments.length >= 3 && segments[0] === 'politicians') {
    const polId = segments[1];
    const sub = segments[2];
    const pol = fallbackStore.getById(polId);
    if (!pol) return [];
    if (sub === 'cases') return pol.cases || [];
    if (sub === 'offices') return pol.offices || [];
    if (sub === 'forfeitures') return pol.forfeitures || [];
  }

  return [];
}

export function useCollection<T = DocumentData>(query: Query<T> | null) {
  const [data, setData] = useState<T[] | null>(() => {
    if (!query) return null;
    const fallback = getFallbackDataForQuery(query);
    return fallback.length > 0 ? (fallback as unknown as T[]) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    // Subscribe to fallback store changes so local updates reactively reflect
    const unsubFallback = fallbackStore.subscribe(() => {
      const fbData = getFallbackDataForQuery(query);
      if (fbData.length > 0) {
        setData(fbData as unknown as T[]);
      }
    });

    // If using placeholder key without real firebase, initialize immediately from fallback
    const isPlaceholder = firebaseConfig.apiKey === 'placeholder-api-key';
    if (isPlaceholder) {
      const fallback = getFallbackDataForQuery(query);
      setData(fallback as unknown as T[]);
      setLoading(false);
    }

    let unsubSnapshot: (() => void) | null = null;
    try {
      unsubSnapshot = onSnapshot(
        query,
        (snapshot: QuerySnapshot<T>) => {
          if (!snapshot.empty) {
            const items = snapshot.docs.map(doc => ({
              ...doc.data(),
              id: doc.id,
            }));
            setData(items);
          } else {
            const fallback = getFallbackDataForQuery(query);
            setData(fallback.length > 0 ? (fallback as unknown as T[]) : []);
          }
          setLoading(false);
        },
        async (err) => {
          if (!isPlaceholder) {
            const permissionError = new FirestorePermissionError({
              path: (query as any)._query?.path?.segments?.join('/') || 'unknown',
              operation: 'list',
            });
            errorEmitter.emit('permission-error', permissionError);
          }
          const fallback = getFallbackDataForQuery(query);
          setData(fallback as unknown as T[]);
          setError(err);
          setLoading(false);
        }
      );
    } catch {
      const fallback = getFallbackDataForQuery(query);
      setData(fallback as unknown as T[]);
      setLoading(false);
    }

    return () => {
      unsubFallback();
      if (unsubSnapshot) unsubSnapshot();
    };
  }, [query]);

  return { data, loading, error };
}
