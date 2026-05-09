'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProfile } from '@/lib/profile';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const profile = getProfile();
    router.replace(profile ? '/chat' : '/setup');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse text-gray-400 text-sm">Laden...</div>
    </div>
  );
}
