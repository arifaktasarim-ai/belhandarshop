'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/card';
import api from '@/lib/api';

export default function SettingsPage() {
  const [form, setForm] = useState({
    siteName: '', aboutTitle: '', aboutText: '',
    contactEmail: '', contactPhone: '', contactAddress: '', instagramUrl: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/settings').then((res) => setForm((f) => ({ ...f, ...res.data })));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await api.put('/admin/settings', form);
      setMessage('Ayarlar başarıyla güncellendi.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-serif text-3xl text-white">Ayarlar</h1>
        <p className="text-white/50 text-sm mt-1">Site genel ayarları ve marka bilgileri.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-5">
        <div>
          <Label>Site Adı</Label>
          <Input value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} />
        </div>
        <div>
          <Label>Hakkımızda Başlığı</Label>
          <Input value={form.aboutTitle || ''} onChange={(e) => setForm({ ...form, aboutTitle: e.target.value })} />
        </div>
        <div>
          <Label>Hakkımızda Metni (Marka Hikayesi)</Label>
          <Textarea rows={5} value={form.aboutText || ''} onChange={(e) => setForm({ ...form, aboutText: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>İletişim E-posta</Label>
            <Input value={form.contactEmail || ''} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
          </div>
          <div>
            <Label>İletişim Telefon</Label>
            <Input value={form.contactPhone || ''} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
          </div>
        </div>
        <div>
          <Label>Adres</Label>
          <Input value={form.contactAddress || ''} onChange={(e) => setForm({ ...form, contactAddress: e.target.value })} />
        </div>
        <div>
          <Label>Instagram Bağlantısı</Label>
          <Input value={form.instagramUrl || ''} onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })} />
        </div>

        {message && <p className="text-bh-gold text-sm">{message}</p>}
        <Button type="submit" disabled={saving}>{saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}</Button>
      </form>
    </div>
  );
}
