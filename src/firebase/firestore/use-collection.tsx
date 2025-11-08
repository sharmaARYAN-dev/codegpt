'use client';

import { useEffect, useState, useMemo } from 'react';
import { onSnapshot, Query, DocumentData, collection, getFirestore } from 'firebase/firestore';

export function useCollection<T>(query: Query<DocumentData> | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Re-create a stable query object only when the path or constraints change
  const stableQuery = useMemoFirebase(() => {
    return query;
  }, [query ? JSON.stringify(query) : '']);

  useEffect(() => {
    if (!stableQuery) {
      setLoading(false);
      return;
    };

    setLoading(true);

    const unsubscribe = onSnapshot(
      stableQuery,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
        setData(docs);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
        console.error("Error fetching collection:", err);
      }
    );

    return () => unsubscribe();
  }, [stableQuery]); // Use the memoized query

  return { data, loading, error };
}

export function useMemoFirebase<T>(factory: () => T, deps: React.DependencyList): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, deps);
}
