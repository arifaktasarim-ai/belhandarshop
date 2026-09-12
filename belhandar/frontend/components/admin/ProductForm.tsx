'use client';

// Ürün ekleme/düzenleme formu - hem "yeni ürün" hem "ürün düzenle" sayfalarında kullanılır

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/card';
import api from '@/lib/api';
import { Product, Category } from '@/lib/types';
import { Trash2, UploadCloud } from 'lucide-react';
import Image from 'next/image';

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const isEdit = !!product;

  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: product?.name || '',
    code: product?.code || '',
    barcode: product?.barcode || '',
    description: product?.description || '',
    topNotes: product?.topNotes || '',
    middleNotes: product?.middleNotes || '',
    baseNotes: product?.baseNotes || '',
    gender: product?.gender || 'UNISEX',
    volumeMl: product?.volumeMl || 100,
    status: product?.status || 'AKTIF',
    stockQuantity: product?.stockQuantity ?? 0,
    criticalStock: product?.criticalStock ?? 10,
    categoryId: product?.categoryId || '',
  });
  const [images, setImages] = useState(product?.images || []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/admin/products/${product!.id}`, form);
      } else {
        const res = await api.post('/admin/products', form);
        router.push(`/admin/urunler/${res.data.id}`);
        return;
      }
      router.push('/admin/urunler');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kaydetme sırasında bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!product || !e.target.files?.[0]) return;
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    setUploading(true);
    try {
      const res = await api.post(`/admin/products/${product.id}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImages((prev) => [...prev, res.data]);
    } finally {
      setUploading(false);
    }
  }

  async function handleImageDelete(imageId: string) {
    await api.delete(`/admin/products/images/${imageId}`);
    setImages((prev) => prev.filter((i) => i.id !== imageId));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="glass rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <Label>Ürün Adı *</Label>
          <Input required value={form.name} onChange={(e) => updateField('name', e.target.value)} />
        </div>
        <div>
          <Label>Ürün Kodu *</Label>
          <Input required value={form.code} onChange={(e) => updateField('code', e.target.value)} />
        </div>
        <div>
          <Label>Barkod</Label>
          <Input value={form.barcode} onChange={(e) => updateField('barcode', e.target.value)} />
        </div>
        <div>
          <Label>Kategori</Label>
          <Select value={form.categoryId} onChange={(e) => updateField('categoryId', e.target.value)}>
            <option value="">Kategori Seçin</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </div>
        <div>
          <Label>Cinsiyet</Label>
          <Select value={form.gender} onChange={(e) => updateField('gender', e.target.value as any)}>
            <option value="UNISEX">Unisex</option>
            <option value="ERKEK">Erkek</option>
            <option value="KADIN">Kadın</option>
          </Select>
        </div>
        <div>
          <Label>Hacim (ml) *</Label>
          <Input type="number" required value={form.volumeMl} onChange={(e) => updateField('volumeMl', Number(e.target.value))} />
        </div>
        <div>
          <Label>Durum</Label>
          <Select value={form.status} onChange={(e) => updateField('status', e.target.value as any)}>
            <option value="AKTIF">Aktif</option>
            <option value="PASIF">Pasif</option>
          </Select>
        </div>
        <div>
          <Label>Kritik Stok Eşiği</Label>
          <Input type="number" value={form.criticalStock} onChange={(e) => updateField('criticalStock', Number(e.target.value))} />
        </div>
        {!isEdit && (
          <div>
            <Label>Başlangıç Stok Miktarı</Label>
            <Input type="number" value={form.stockQuantity} onChange={(e) => updateField('stockQuantity', Number(e.target.value))} />
          </div>
        )}
        <div className="md:col-span-2">
          <Label>Açıklama</Label>
          <Textarea rows={4} value={form.description} onChange={(e) => updateField('description', e.target.value)} />
        </div>
      </div>

      <div className="glass rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <Label>Üst Nota</Label>
          <Textarea rows={2} value={form.topNotes} onChange={(e) => updateField('topNotes', e.target.value)} />
        </div>
        <div>
          <Label>Orta Nota</Label>
          <Textarea rows={2} value={form.middleNotes} onChange={(e) => updateField('middleNotes', e.target.value)} />
        </div>
        <div>
          <Label>Alt Nota</Label>
          <Textarea rows={2} value={form.baseNotes} onChange={(e) => updateField('baseNotes', e.target.value)} />
        </div>
      </div>

      {isEdit && (
        <div className="glass rounded-2xl p-6">
          <Label>Ürün Resimleri</Label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-3">
            {images.map((img) => (
              <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden group">
                <Image src={img.url} alt="" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => handleImageDelete(img.id)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                >
                  <Trash2 className="text-red-400" size={20} />
                </button>
              </div>
            ))}
            <label className="aspect-square rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-bh-gold transition-colors text-white/40 hover:text-bh-gold">
              <UploadCloud size={22} />
              <span className="text-xs mt-1">{uploading ? 'Yükleniyor...' : 'Resim Ekle'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
            </label>
          </div>
        </div>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>{saving ? 'Kaydediliyor...' : isEdit ? 'Değişiklikleri Kaydet' : 'Ürünü Oluştur'}</Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/urunler')}>İptal</Button>
      </div>
    </form>
  );
}
