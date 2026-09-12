'use client';

// Ürün detay sayfasındaki görsel galerisi
// Önceden sadece birincil (isPrimary) görsel gösteriliyordu, ürüne eklenen
// diğer görseller hiçbir yerde görünmüyordu. Bu bileşen tüm görselleri
// büyük görüntüleyici + küçük resim (thumbnail) şeridiyle gösterir.

import { useState } from 'react';
import Image from 'next/image';
import { ProductImage } from '@/lib/types';

export default function ProductGallery({ images, alt }: { images: ProductImage[]; alt: string }) {
  const sorted = [...images].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return a.order - b.order;
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const active = sorted[activeIndex];

  if (sorted.length === 0) {
    return (
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden glass">
        <div className="w-full h-full flex items-center justify-center font-serif text-2xl text-white/20">
          Belhandar
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Büyük görsel */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden glass">
        <Image src={active.url} alt={alt} fill className="object-cover transition-opacity duration-300" priority />
      </div>

      {/* Küçük resim şeridi - birden fazla görsel varsa gösterilir */}
      {sorted.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
          {sorted.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(idx)}
              className={`relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                idx === activeIndex ? 'border-bh-gold' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <Image src={img.url} alt={`${alt} - görsel ${idx + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
