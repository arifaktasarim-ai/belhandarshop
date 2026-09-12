// Admin panel genel yerleşimi - login sayfası hariç tüm /admin sayfaları
// Sidebar + korumalı içerik alanı

'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import RequireAuth from '@/components/admin/RequireAuth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) return <>{children}</>;

  return (
    <RequireAuth>
      <div className="min-h-screen bg-[#0d0d0d]">
        <Sidebar />
        <div className="ml-64 p-8">{children}</div>
      </div>
    </RequireAuth>
  );
}
