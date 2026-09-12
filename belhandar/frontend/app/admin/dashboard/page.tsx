'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Package, Boxes, AlertTriangle, Clock } from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import api from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';

const COLORS = ['#D4AF37', '#E8CE7A', '#8A6D1F', '#F4E5A1', '#B8912C', '#6B5416'];

interface DashboardStats {
  totalProducts: number;
  totalStock: number;
  criticalStockCount: number;
  latestProducts: any[];
  categoryDistribution: { name: string; value: number }[];
  stockDistribution: { name: string; stock: number }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    api.get('/admin/dashboard/stats').then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p className="text-white/50">Yükleniyor...</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-white">Dashboard</h1>
        <p className="text-white/50 text-sm mt-1">Belhandar yönetim paneline hoş geldiniz.</p>
      </div>

      {/* Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Toplam Ürün" value={stats.totalProducts} icon={Package} />
        <StatCard title="Toplam Stok" value={stats.totalStock} icon={Boxes} />
        <StatCard title="Kritik Stok" value={stats.criticalStockCount} icon={AlertTriangle} accent={stats.criticalStockCount > 0} />
        <StatCard title="Son Eklenen" value={stats.latestProducts.length} icon={Clock} />
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="font-serif text-xl text-white mb-4">Stok Dağılımı</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.stockDistribution}>
              <XAxis dataKey="name" tick={{ fill: '#999', fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={70} />
              <YAxis tick={{ fill: '#999', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#0F0F0F', border: '1px solid #D4AF37' }} />
              <Bar dataKey="stock" fill="#D4AF37" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="font-serif text-xl text-white mb-4">Kategori Dağılımı</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={stats.categoryDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {stats.categoryDistribution.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#0F0F0F', border: '1px solid #D4AF37' }} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#ccc' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Son Eklenen Ürünler */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-serif text-xl text-white mb-4">Son Eklenen Ürünler</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats.latestProducts.map((p) => (
            <Link key={p.id} href={`/admin/urunler/${p.id}`} className="group">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-white/5 mb-2">
                {p.images?.[0] ? (
                  <Image src={p.images[0].url} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">Görsel Yok</div>
                )}
              </div>
              <p className="text-sm text-white/80 truncate">{p.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
