import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';

const genderLabels: Record<string, string> = { ERKEK: 'Erkek', KADIN: 'Kadın', UNISEX: 'Unisex' };

export default function ProductCard({ product }: { product: Product }) {
  const primaryImage = product.images?.find((i) => i.isPrimary) || product.images?.[0];

  return (
    <Link
      href={`/urunler/${product.slug}`}
      className="group glass rounded-2xl overflow-hidden hover:border-bh-gold/50 hover:-translate-y-1 transition-all duration-500"
    >
      <div className="relative aspect-[3/4] bg-gradient-to-b from-white/5 to-transparent overflow-hidden">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 font-serif text-lg">
            Belhandar
          </div>
        )}
        <span className="absolute top-3 right-3 glass-dark text-bh-gold text-xs px-3 py-1 rounded-full">
          {genderLabels[product.gender]}
        </span>
      </div>

      <div className="p-5">
        {product.category && (
          <p className="text-bh-gold/70 text-xs tracking-widest uppercase mb-1">{product.category.name}</p>
        )}
        <h3 className="font-serif text-xl text-white group-hover:text-bh-gold transition-colors">{product.name}</h3>
        <p className="text-white/40 text-sm mt-1">{product.volumeMl} ml</p>
      </div>
    </Link>
  );
}
