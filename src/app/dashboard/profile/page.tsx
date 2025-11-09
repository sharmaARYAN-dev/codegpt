'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfileRedirectPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace(`/dashboard/profile/${user.id}`);
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <p>Loading profile...</p>
    </div>
  );
}
