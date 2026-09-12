'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const links = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/urunler', label: 'Ürünler' },
  { href: '/#hakkimizda', label: 'Hakkımızda' },
  { href: '/iletisim', label: 'İletişim' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-20">
        <Link href="/" className="relative h-10 w-36 md:h-11 md:w-40 shrink-0">
          <Image src="/logo-gold.png" alt="Belhandar Parfümleri" fill className="object-contain object-left" priority />
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm tracking-wide text-white/80 hover:text-bh-gold transition-colors">
              {l.label}
            </Link>
          ))}
        </div>

        <button className="md:hidden text-bh-gold" onClick={() => setOpen(!open)}>
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden glass-dark px-6 pb-6 flex flex-col gap-4 animate-slide-up">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-white/80 hover:text-bh-gold text-sm tracking-wide">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
