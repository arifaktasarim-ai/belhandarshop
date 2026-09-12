'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

// Admin sayfalarını token kontrolüyle korur - token yoksa login'e yönlendirir
export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/admin/login');
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) return <div className="min-h-screen bg-bh-black flex items-center justify-center text-bh-gold">Yükleniyor...</div>;
  return <>{children}</>;
}
