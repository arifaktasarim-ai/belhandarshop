'use client';

import { useEffect, useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle, AlertTriangle } from 'lucide-react';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label, Badge } from '@/components/ui/card';
import api from '@/lib/api';
import { Product, StockMovement } from '@/lib/types';

export default function StockManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [critical, setCritical] = useState<Product[]>([]);
  const [tab, setTab] = useState<'hareket' | 'gecmis' | 'kritik'>('hareket');

  const [form, setForm] = useState({ productId: '', type: 'GIRIS', quantity: 1, description: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function loadAll() {
    const [p, m, c] = await Promise.all([
      api.get('/admin/products'),
      api.get('/admin/stock/movements'),
      api.get('/admin/stock/critical'),
    ]);
    setProducts(p.data);
    setMovements(m.data);
    setCritical(c.data);
  }

  useEffect(() => { loadAll(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    setSaving(true);
    try {
      await api.post('/admin/stock/movements', form);
      setMessage('Stok hareketi başarıyla kaydedildi.');
      setForm({ productId: '', type: 'GIRIS', quantity: 1, description: '' });
      loadAll();
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  }

  const typeLabels: Record<string, string> = { GIRIS: 'Giriş', CIKIS: 'Çıkış', DUZELTME: 'Düzeltme' };
  const typeColors: Record<string, string> = {
    GIRIS: 'bg-green-500/15 text-green-400',
    CIKIS: 'bg-red-500/15 text-red-400',
    DUZELTME: 'bg-yellow-500/15 text-yellow-400',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-white">Stok Yönetimi</h1>
        <p className="text-white/50 text-sm mt-1">Stok girişi, çıkışı ve geçmişini buradan yönetin.</p>
      </div>

      {/* Sekmeler */}
      <div className="flex gap-2 border-b border-white/10">
        {[
          { key: 'hareket', label: 'Yeni Hareket' },
          { key: 'gecmis', label: 'Stok Geçmişi' },
          { key: 'kritik', label: `Kritik Stok (${critical.length})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={`px-5 py-3 text-sm border-b-2 transition-colors ${
              tab === t.key ? 'border-bh-gold text-bh-gold' : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'hareket' && (
        <div className="glass rounded-2xl p-6 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label>Ürün *</Label>
              <Select required value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })}>
                <option value="">Ürün Seçin</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} (Mevcut Stok: {p.stockQuantity})</option>
                ))}
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>İşlem Türü *</Label>
                <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="GIRIS">Stok Girişi</option>
                  <option value="CIKIS">Stok Çıkışı</option>
                  <option value="DUZELTME">Düzeltme (Yeni Toplam)</option>
                </Select>
              </div>
              <div>
                <Label>Miktar *</Label>
                <Input type="number" min={1} required value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
              </div>
            </div>
            <div>
              <Label>Açıklama</Label>
              <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Örn: Yeni parti üretim girişi" />
            </div>

            {message && <p className="text-sm text-bh-gold">{message}</p>}

            <Button type="submit" disabled={saving}>
              {form.type === 'GIRIS' ? <ArrowUpCircle size={18} /> : <ArrowDownCircle size={18} />}
              {saving ? 'Kaydediliyor...' : 'Stok Hareketini Kaydet'}
            </Button>
          </form>
        </div>
      )}

      {tab === 'gecmis' && (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/50 text-left">
                <th className="p-4">Tarih</th>
                <th className="p-4">Ürün</th>
                <th className="p-4">İşlem Türü</th>
                <th className="p-4">Miktar</th>
                <th className="p-4">Açıklama</th>
                <th className="p-4">İşlemi Yapan</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((m) => (
                <tr key={m.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4 text-white/60">{new Date(m.createdAt).toLocaleString('tr-TR')}</td>
                  <td className="p-4 text-white">{m.product?.name}</td>
                  <td className="p-4"><Badge className={typeColors[m.type]}>{typeLabels[m.type]}</Badge></td>
                  <td className="p-4 text-white/80">{m.quantity} ({m.previousQty} → {m.newQty})</td>
                  <td className="p-4 text-white/60">{m.description || '-'}</td>
                  <td className="p-4 text-white/60">{m.user?.name}</td>
                </tr>
              ))}
              {movements.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-white/40">Henüz stok hareketi bulunmuyor.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'kritik' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {critical.length === 0 ? (
            <p className="text-white/40 col-span-3 text-center py-10">Kritik stok seviyesinde ürün bulunmuyor. 🎉</p>
          ) : (
            critical.map((p) => (
              <div key={p.id} className="glass rounded-2xl p-5 border-red-500/30">
                <div className="flex items-center gap-2 text-red-400 mb-2">
                  <AlertTriangle size={18} />
                  <span className="text-xs uppercase tracking-wider">Kritik Seviye</span>
                </div>
                <h3 className="font-serif text-lg text-white">{p.name}</h3>
                <p className="text-white/50 text-sm mt-1">Kod: {p.code}</p>
                <p className="text-red-400 text-2xl font-serif mt-2">{p.stockQuantity} adet</p>
                <p className="text-white/40 text-xs">Kritik eşik: {p.criticalStock}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
