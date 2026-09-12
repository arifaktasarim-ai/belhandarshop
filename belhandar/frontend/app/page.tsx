// Belhandar Ana Sayfa: Hero + Hakkımızda + Öne Çıkan Ürünler + İletişim özeti

import Navbar from '@/components/site/Navbar';
import Footer from '@/components/site/Footer';
import Hero from '@/components/site/Hero';
import ProductCard from '@/components/site/ProductCard';
import { Product } from '@/lib/types';
import Link from 'next/link';

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.slice(0, 4);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <main>
      <Navbar />
      <Hero />

      {/* Hakkımızda */}
      <section id="hakkimizda" className="py-28 px-6 lg:px-10 bg-bh-black">
        <div className="max-w-4xl mx-auto text-center">
          <p className="tracking-[0.4em] text-bh-gold text-xs uppercase mb-4">Markamız</p>
          <h2 className="font-serif text-4xl md:text-5xl mb-8 text-white">Belhandar Hikayesi</h2>
          <p className="text-white/60 leading-relaxed text-lg">
            Belhandar, kokunun bir imza olduğuna inanır. Her şişede, ustaca harmanlanmış notaların
            anlattığı bir hikaye saklıdır. Geleneksel parfümeri sanatını modern, minimalist bir estetikle
            harmanlayarak; giyeni değil, hatırlananı yaratıyoruz. Zamansız zarafeti modern lüksle buluşturuyoruz.
          </p>
        </div>
      </section>

      {/* Öne Çıkan Ürünler */}
      <section className="py-20 px-6 lg:px-10 bg-gradient-to-b from-bh-black to-[#151515]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="tracking-[0.4em] text-bh-gold text-xs uppercase mb-4">Koleksiyon</p>
            <h2 className="font-serif text-4xl md:text-5xl text-white">Öne Çıkan Ürünler</h2>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <p className="text-center text-white/40">Henüz ürün eklenmedi. Admin panelinden ürün ekleyebilirsiniz.</p>
          )}

          <div className="text-center mt-14">
            <Link href="/urunler" className="border border-bh-gold text-bh-gold px-8 py-3.5 rounded-full hover:bg-bh-gold hover:text-bh-black transition-all">
              Tüm Ürünleri Gör
            </Link>
          </div>
        </div>
      </section>

      {/* İletişim özeti */}
      <section className="py-24 px-6 lg:px-10 bg-[#151515]">
        <div className="max-w-3xl mx-auto text-center glass rounded-3xl p-12">
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">Bize Ulaşın</h2>
          <p className="text-white/60 mb-8">Sorularınız için bizimle iletişime geçmekten çekinmeyin.</p>
          <Link href="/iletisim" className="bg-gold-gradient text-bh-black font-semibold px-8 py-3.5 rounded-full hover:shadow-gold transition-all inline-block">
            İletişime Geç
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
