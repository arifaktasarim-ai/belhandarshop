'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Boxes, FileBarChart, Settings, LogOut } from 'lucide-react';
import { logoutUser } from '@/lib/auth';

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/urunler', label: 'Ürünler', icon: Package },
  { href: '/admin/stok', label: 'Stok Yönetimi', icon: Boxes },
  { href: '/admin/raporlar', label: 'Raporlar', icon: FileBarChart },
  { href: '/admin/ayarlar', label: 'Ayarlar', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-[#0A0A0A] border-r border-bh-gold/15 flex flex-col fixed left-0 top-0">
      <div className="h-20 flex items-center justify-center border-b border-bh-gold/15 px-6">
        <div className="relative h-11 w-full">
          <Image src="/logo-gold.png" alt="Belhandar Parfümleri" fill className="object-contain" priority />
        </div>
      </div>

      <nav className="flex-1 py-8 px-4 space-y-1">
        {menuItems.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                active ? 'bg-gold-gradient text-bh-black font-semibold' : 'text-white/60 hover:bg-white/5 hover:text-bh-gold'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-bh-gold/15">
        <button
          onClick={logoutUser}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
        >
          <LogOut size={18} />
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
