import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-bh-black border-t border-bh-gold/15 pt-16 pb-8 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
        <div>
          <div className="relative h-12 w-44 mb-4">
            <Image src="/logo-gold.png" alt="Belhandar Parfümleri" fill className="object-contain object-left" />
          </div>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs">
            Kokunun bir imza olduğuna inanıyoruz. Zamansız zarafeti modern lüksle buluşturuyoruz.
          </p>
        </div>

        <div>
          <h4 className="text-bh-gold text-sm tracking-widest uppercase mb-4">Hızlı Bağlantılar</h4>
          <div className="flex flex-col gap-2 text-sm text-white/60">
            <Link href="/" className="hover:text-bh-gold transition-colors">Ana Sayfa</Link>
            <Link href="/urunler" className="hover:text-bh-gold transition-colors">Ürünler</Link>
            <Link href="/iletisim" className="hover:text-bh-gold transition-colors">İletişim</Link>
            <Link href="/admin/login" className="hover:text-bh-gold transition-colors">Yönetim Paneli</Link>
          </div>
        </div>

        <div>
          <h4 className="text-bh-gold text-sm tracking-widest uppercase mb-4">İletişim</h4>
          <div className="flex flex-col gap-3 text-sm text-white/60">
            <span className="flex items-center gap-2"><Mail size={16} className="text-bh-gold" /> info@belhandar.com</span>
            <span className="flex items-center gap-2"><Phone size={16} className="text-bh-gold" /> +90 555 000 00 00</span>
            <span className="flex items-center gap-2"><MapPin size={16} className="text-bh-gold" /> İstanbul, Türkiye</span>
            <span className="flex items-center gap-2"><Instagram size={16} className="text-bh-gold" /> @belhandar</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 text-center text-white/30 text-xs">
        © {new Date().getFullYear()} Belhandar. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
