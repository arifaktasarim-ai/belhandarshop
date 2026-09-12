'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/card';
import api from '@/lib/api';
import { Product } from '@/lib/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadProducts() {
    setLoading(true);
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (status) params.status = status;
    const res = await api.get('/admin/products', { params });
    setProducts(res.data);
    setLoading(false);
  }

  useEffect(() => {
    const t = setTimeout(loadProducts, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status]);

  async function handleDelete(id: string) {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) return;
    await api.delete(`/admin/products/${id}`);
    loadProducts();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-white">Ürünler</h1>
          <p className="text-white/50 text-sm mt-1">Tüm ürünlerinizi buradan yönetin.</p>
        </div>
        <Link href="/admin/urunler/yeni">
          <Button><Plus size={18} /> Yeni Ürün</Button>
        </Link>
      </div>

      <div className="glass rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <Input placeholder="Ürün adı ile ara..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Tüm Durumlar</option>
          <option value="AKTIF">Aktif</option>
          <option value="PASIF">Pasif</option>
        </Select>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-white/50 text-left">
              <th className="p-4">Ürün</th>
              <th className="p-4">Kod</th>
              <th className="p-4">Kategori</th>
              <th className="p-4">Hacim</th>
              <th className="p-4">Stok</th>
              <th className="p-4">Durum</th>
              <th className="p-4 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-8 text-center text-white/40">Yükleniyor...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-white/40">Ürün bulunamadı.</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-white">{p.name}</td>
                  <td className="p-4 text-white/60">{p.code}</td>
                  <td className="p-4 text-white/60">{p.category?.name || '-'}</td>
                  <td className="p-4 text-white/60">{p.volumeMl} ml</td>
                  <td className={`p-4 font-medium ${p.stockQuantity <= p.criticalStock ? 'text-red-400' : 'text-bh-gold'}`}>
                    {p.stockQuantity}
                  </td>
                  <td className="p-4">
                    <Badge className={p.status === 'AKTIF' ? 'bg-green-500/15 text-green-400' : 'bg-white/10 text-white/50'}>
                      {p.status === 'AKTIF' ? 'Aktif' : 'Pasif'}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/urunler/${p.id}`}>
                        <Button variant="outline" size="sm"><Pencil size={14} /></Button>
                      </Link>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(p.id)}><Trash2 size={14} /></Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
