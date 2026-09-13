'use client';

// Belhandar Ana Sayfa
// Artık eski Hero (büyük görsel + "BELHANDAR" başlığı) bölümü KALDIRILDI.
// Ana sayfa, eskiden /urunler adresinde olan ürün vitrinini (arama + filtre + tüm ürünler) gösterir.
// "Koleksiyon / Tüm Ürünler" başlığının bulunduğu yere, admin panelinden yönetilen banner yerleştirildi.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/site/Navbar';
import Footer from '@/components/site/Footer';
import BannerCarousel from '@/components/site/BannerCarousel';
import ProductCard from '@/components/site/ProductCard';
import WhatsAppButton from '@/components/site/WhatsAppButton';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Product, Category } from '@/lib/types';
import api from '@/lib/api';
import { Search } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [gender, setGender] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (gender) params.gender = gender;
    if (category) params.category = category;

    const timeout = setTimeout(() => {
      api.get('/products', { params }).then((res) => setProducts(res.data)).finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, gender, category]);

  return (
    <main>
      <Navbar />

      <section className="pt-28 pb-20 px-6 lg:px-10 max-w-7xl mx-auto">
        {/* Banner - Admin panelinden ("Banner Yönetimi") yüklenen görseller burada, sayfaya
            sığacak (kutulu) şekilde gösterilir. Banner eklenmediyse yerine başlık metni gösterilir. */}
        <BannerCarousel
          variant="contained"
          className="mb-12"
          fallback={
            <div className="text-center py-10">
              <p className="tracking-[0.4em] text-bh-gold text-xs uppercase mb-4">Koleksiyon</p>
              <h1 className="font-serif text-4xl md:text-5xl text-white">Tüm Ürünler</h1>
            </div>
          }
        />

        {/* Filtreler */}
        <div className="glass rounded-2xl p-5 mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <Input
              placeholder="Ürün ara..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Tüm Cinsiyetler</option>
            <option value="ERKEK">Erkek</option>
            <option value="KADIN">Kadın</option>
            <option value="UNISEX">Unisex</option>
          </Select>
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Tüm Kategoriler</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </div>

        {loading ? (
          <p className="text-center text-white/40 py-20">Yükleniyor...</p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <p className="text-center text-white/40 py-20">Aradığınız kriterlere uygun ürün bulunamadı.</p>
        )}
      </section>

      {/* Hakkımızda */}
      <section id="hakkimizda" className="py-28 px-6 lg:px-10 bg-gradient-to-b from-bh-black to-[#151515]">
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

      {/* WhatsApp Sipariş Hattı - sağ altta sabit */}
      <WhatsAppButton />
    </main>
  );
}
