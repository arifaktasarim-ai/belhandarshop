'use client';

// Banner Yönetimi - Ana sayfadaki banner carousel'i buradan yönetilir.
// Görsel yükleme, başlık/alt yazı/link ekleme, sıralama, aktif/pasif yapma ve silme.

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Trash2, UploadCloud, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label, Badge } from '@/components/ui/card';
import api from '@/lib/api';
import { Banner } from '@/lib/types';

export default function BannerManagementPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [order, setOrder] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function loadBanners() {
    setLoading(true);
    const res = await api.get('/admin/banners');
    setBanners(res.data);
    setLoading(false);
  }

  useEffect(() => { loadBanners(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!file) {
      setError('Lütfen bir banner görseli seçin.');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', title);
      formData.append('subtitle', subtitle);
      formData.append('linkUrl', linkUrl);
      formData.append('order', String(order));

      await api.post('/admin/banners', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setFile(null);
      setTitle('');
      setSubtitle('');
      setLinkUrl('');
      setOrder(0);
      (document.getElementById('banner-file-input') as HTMLInputElement | null)?.value && ((document.getElementById('banner-file-input') as HTMLInputElement).value = '');
      loadBanners();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Banner yüklenirken bir hata oluştu.');
    } finally {
      setUploading(false);
    }
  }

  async function toggleActive(banner: Banner) {
    await api.put(`/admin/banners/${banner.id}`, { isActive: (!banner.isActive).toString() });
    loadBanners();
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu banner\'ı silmek istediğinizden emin misiniz?')) return;
    await api.delete(`/admin/banners/${id}`);
    loadBanners();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-white">Banner Yönetimi</h1>
        <p className="text-white/50 text-sm mt-1">Ana sayfadaki banner carousel'inde gösterilecek görselleri yönetin.</p>
      </div>

      {/* Yeni Banner Ekle */}
      <div className="glass rounded-2xl p-6 max-w-2xl">
        <h3 className="font-serif text-xl text-white mb-4">Yeni Banner Ekle</h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label>Banner Görseli * (önerilen oran: 1920x900)</Label>
            <label
              htmlFor="banner-file-input"
              className="flex items-center gap-3 border-2 border-dashed border-white/20 rounded-xl px-4 py-6 cursor-pointer hover:border-bh-gold transition-colors text-white/50 hover:text-bh-gold"
            >
              <UploadCloud size={22} />
              <span className="text-sm">{file ? file.name : 'Görsel seçmek için tıklayın'}</span>
            </label>
            <input
              id="banner-file-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <div>
            <Label>Başlık (opsiyonel)</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Örn: Yeni Sezon Koleksiyonu" />
          </div>
          <div>
            <Label>Alt Yazı (opsiyonel)</Label>
            <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Örn: Zamansız kokular şimdi vitrinde" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Bağlantı Adresi (opsiyonel)</Label>
              <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="/urunler" />
            </div>
            <div>
              <Label>Sıralama</Label>
              <Input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} />
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <Button type="submit" disabled={uploading}>
            <Plus size={18} /> {uploading ? 'Yükleniyor...' : 'Banner Ekle'}
          </Button>
        </form>
      </div>

      {/* Mevcut Bannerlar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <p className="text-white/40 col-span-2 text-center py-10">Yükleniyor...</p>
        ) : banners.length === 0 ? (
          <p className="text-white/40 col-span-2 text-center py-10">Henüz banner eklenmedi.</p>
        ) : (
          banners.map((banner) => (
            <div key={banner.id} className="glass rounded-2xl overflow-hidden">
              <div className="relative aspect-[16/7] bg-white/5">
                <Image src={banner.imageUrl} alt={banner.title || 'Banner'} fill className="object-cover" />
                <Badge className={`absolute top-3 right-3 ${banner.isActive ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/50'}`}>
                  {banner.isActive ? 'Aktif' : 'Pasif'}
                </Badge>
              </div>
              <div className="p-5">
                <p className="text-white font-serif text-lg">{banner.title || 'Başlıksız Banner'}</p>
                {banner.subtitle && <p className="text-white/50 text-sm mt-1">{banner.subtitle}</p>}
                <p className="text-white/30 text-xs mt-2">Sıra: {banner.order}{banner.linkUrl ? ` · Bağlantı: ${banner.linkUrl}` : ''}</p>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => toggleActive(banner)}>
                    {banner.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                    {banner.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(banner.id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
