'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductImage } from '@/lib/types';

interface ProductGalleryProps {
  images: ProductImage[];
  alt: string;
}

export default function ProductGallery({
  images,
  alt,
}: ProductGalleryProps) {
  const sortedImages = [...images].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return a.order - b.order;
  });

  const [activeIndex, setActiveIndex] = useState(0);

  if (sortedImages.length === 0) {
    return (
      <div className="aspect-square rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
        <span className="text-white/30 text-sm">
          Görsel bulunmuyor
        </span>
      </div>
    );
  }

  const activeImage = sortedImages[activeIndex];

  const previousImage = () => {
    setActiveIndex((current) =>
      current === 0 ? sortedImages.length - 1 : current - 1
    );
  };

  const nextImage = () => {
    setActiveIndex((current) =>
      current === sortedImages.length - 1 ? 0 : current + 1
    );
  };

  return (
    <div className="space-y-4">
      {/* Ana görsel */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-white/5 border border-white/10 group">
        <Image
          src={activeImage.url}
          alt={`${alt} - Görsel ${activeIndex + 1}`}
          fill
          priority={activeIndex === 0}
          className="object-contain p-6 transition-transform duration-500 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {sortedImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={previousImage}
              aria-label="Önceki görsel"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={nextImage}
              aria-label="Sonraki görsel"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {sortedImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white/70 text-xs">
            {activeIndex + 1} / {sortedImages.length}
          </div>
        )}
      </div>

      {/* Küçük görseller */}
      {sortedImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          {sortedImages.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-xl bg-white/5 border transition-all ${
                index === activeIndex
                  ? 'border-bh-gold ring-1 ring-bh-gold'
                  : 'border-white/10 hover:border-white/30'
              }`}
              aria-label={`${alt} görsel ${index + 1}`}
            >
              <Image
                src={image.url}
                alt={`${alt} - Küçük görsel ${index + 1}`}
                fill
                className="object-contain p-2"
                sizes="120px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}