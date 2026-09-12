// Ürün detay sayfası (slug ile erişilir) - stok bilgisi ziyaretçiye gösterilmez

import Navbar from '@/components/site/Navbar';
import Footer from '@/components/site/Footer';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Product } from '@/lib/types';

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products/${slug}`,
      {
        cache: 'no-store',
      }
    );

    if (!res.ok) return null;

    return res.json();
  } catch {
    return null;
  }
}

const genderLabels: Record<string, string> = {
  ERKEK: 'Erkek',
  KADIN: 'Kadın',
  UNISEX: 'Unisex',
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getProduct(id);

  if (!product) notFound();

  const primaryImage =
    product.images?.find((i) => i.isPrimary) || product.images?.[0];

  return (
    <main>
      <Navbar />

      <section className="pt-32 pb-24 px-6 lg:px-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
        {/* Görsel */}
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden glass">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-serif text-2xl text-white/20">
              Belhandar
            </div>
          )}
        </div>

        {/* Bilgiler */}
        <div>
          {product.category && (
            <p className="text-bh-gold tracking-[0.3em] text-xs uppercase mb-3">
              {product.category.name}
            </p>
          )}

          <h1 className="font-serif text-4xl md:text-5xl text-white mb-3">
            {product.name}
          </h1>

          <p className="text-white/50 mb-8">
            {genderLabels[product.gender]} &middot; {product.volumeMl} ml
          </p>

          {product.description && (
            <p className="text-white/70 leading-relaxed mb-10">
              {product.description}
            </p>
          )}

          {/* Koku Notaları */}
          <div className="space-y-5">
            {product.topNotes && (
              <div className="glass rounded-xl p-5">
                <p className="text-bh-gold text-xs tracking-widest uppercase mb-1">
                  Üst Nota
                </p>
                <p className="text-white/80">{product.topNotes}</p>
              </div>
            )}

            {product.middleNotes && (
              <div className="glass rounded-xl p-5">
                <p className="text-bh-gold text-xs tracking-widest uppercase mb-1">
                  Orta Nota
                </p>
                <p className="text-white/80">{product.middleNotes}</p>
              </div>
            )}

            {product.baseNotes && (
              <div className="glass rounded-xl p-5">
                <p className="text-bh-gold text-xs tracking-widest uppercase mb-1">
                  Alt Nota
                </p>
                <p className="text-white/80">{product.baseNotes}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}