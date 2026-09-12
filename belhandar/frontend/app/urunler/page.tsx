// Ürünler sayfası: filtreleme ve arama destekli, ziyaretçilere açık liste

'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/site/Navbar';
import Footer from '@/components/site/Footer';
import ProductCard from '@/components/site/ProductCard';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Product, Category } from '@/lib/types';
import api from '@/lib/api';
import { Search } from 'lucide-react';

export default function ProductsPage() {
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

      <section className="pt-36 pb-20 px-6 lg:px-10 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="tracking-[0.4em] text-bh-gold text-xs uppercase mb-4">Koleksiyon</p>
          <h1 className="font-serif text-4xl md:text-5xl text-white">Tüm Ürünler</h1>
        </div>

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

      <Footer />
    </main>
  );
}
