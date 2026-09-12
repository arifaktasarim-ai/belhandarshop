'use client';

// Ana sayfada gösterilen banner carousel'i
// İçerik tamamen admin panelinden (Banner Yönetimi) yönetilir.
// Aktif banner yoksa bileşen hiçbir şey render etmez.

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/api';
import { Banner } from '@/lib/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api.get('/banners').then((res) => setBanners(res.data)).finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (banners.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % banners.length), 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!loaded || banners.length === 0) return null;

  function goTo(i: number) {
    setIndex((i + banners.length) % banners.length);
  }

  return (
    <section className="relative w-full h-[45vh] md:h-[60vh] overflow-hidden">
      {banners.map((banner, i) => {
        const content = (
          <div className="absolute inset-0">
            <Image
              src={banner.imageUrl}
              alt={banner.title || 'Belhandar Banner'}
              fill
              className="object-cover"
              priority={i === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bh-black/80 via-bh-black/10 to-transparent" />
            {(banner.title || banner.subtitle) && (
              <div className="absolute inset-0 flex flex-col items-center justify-end text-center pb-12 px-6">
                {banner.title && (
                  <h2 className="font-serif text-3xl md:text-5xl text-gold-gradient mb-2">{banner.title}</h2>
                )}
                {banner.subtitle && (
                  <p className="text-white/80 max-w-xl text-sm md:text-base">{banner.subtitle}</p>
                )}
              </div>
            )}
          </div>
        );

        return (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ${i === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {banner.linkUrl ? <Link href={banner.linkUrl}>{content}</Link> : content}
          </div>
        );
      })}

      {banners.length > 1 && (
        <>
          <button
            onClick={() => goTo(index - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 glass-dark p-2 rounded-full text-bh-gold hover:scale-110 transition-transform"
            aria-label="Önceki banner"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => goTo(index + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 glass-dark p-2 rounded-full text-bh-gold hover:scale-110 transition-transform"
            aria-label="Sonraki banner"
          >
            <ChevronRight size={22} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-bh-gold' : 'w-1.5 bg-white/40'}`}
                aria-label={`Banner ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
