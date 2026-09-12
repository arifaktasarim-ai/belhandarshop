import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Arka plan görseli - lüks/karanlık atmosfer */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2000&auto=format&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-bh-black/70 via-bh-black/60 to-bh-black" />

      <div className="relative z-10 text-center px-6 animate-fade-in">
        <p className="tracking-[0.5em] text-bh-gold text-xs md:text-sm mb-6 uppercase">Eau de Parfum Koleksiyonu</p>
        <div className="relative h-24 md:h-36 w-full max-w-[560px] mx-auto mb-6">
          <Image src="/logo-gold.png" alt="Belhandar Parfümleri" fill className="object-contain" priority />
        </div>
        <p className="text-white/70 max-w-xl mx-auto text-base md:text-lg leading-relaxed mb-10">
          Her şişede ustaca harmanlanmış notaların anlattığı bir hikaye. Zamansız zarafeti keşfedin.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/urunler" className="bg-gold-gradient text-bh-black font-semibold px-8 py-3.5 rounded-full hover:shadow-gold hover:scale-[1.02] transition-all">
            Koleksiyonu Keşfet
          </Link>
          <Link href="/#hakkimizda" className="border border-bh-gold text-bh-gold px-8 py-3.5 rounded-full hover:bg-bh-gold hover:text-bh-black transition-all">
            Markamız
          </Link>
        </div>
      </div>

      <ChevronDown className="absolute bottom-8 left-1/2 -translate-x-1/2 text-bh-gold animate-bounce" size={28} />
    </section>
  );
}
