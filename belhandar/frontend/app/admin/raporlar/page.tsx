'use client';

import { FileText, FileSpreadsheet, Package, Boxes, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

const reportTypes = [
  { key: 'products', title: 'Ürün Listesi Raporu', desc: 'Tüm ürünlerin detaylı listesi.', icon: Package },
  { key: 'stock', title: 'Stok Raporu', desc: 'Tüm ürünlerin güncel stok durumu.', icon: Boxes },
  { key: 'critical', title: 'Kritik Stok Raporu', desc: 'Kritik seviyenin altındaki ürünler.', icon: AlertTriangle },
];

export default function ReportsPage() {
  async function downloadReport(type: string, format: 'pdf' | 'excel') {
    const res = await api.get(`/admin/reports/${type}/${format}`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `belhandar-${type}-raporu.${format === 'pdf' ? 'pdf' : 'xlsx'}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-white">Raporlar</h1>
        <p className="text-white/50 text-sm mt-1">Raporlarınızı PDF veya Excel formatında indirin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportTypes.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.key} className="glass rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-bh-gold/10 flex items-center justify-center mb-4">
                <Icon className="text-bh-gold" size={22} />
              </div>
              <h3 className="font-serif text-xl text-white mb-1">{r.title}</h3>
              <p className="text-white/50 text-sm mb-5">{r.desc}</p>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" onClick={() => downloadReport(r.key, 'pdf')}>
                  <FileText size={16} /> PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => downloadReport(r.key, 'excel')}>
                  <FileSpreadsheet size={16} /> Excel
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
