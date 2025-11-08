'use client';

import { useEffect, useState, useMemo } from 'react';
import { onSnapshot, Query, DocumentData, collection, getFirestore } from 'firebase/firestore';

export function useCollection<T>(query: Query<DocumentData> | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    };

    setLoading(true);

    const unsubscribe = onSnapshot(
      query,
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
  }, [query]);

  return { data, loading, error };
}
