import { LucideIcon } from 'lucide-react';

export default function StatCard({
  title, value, icon: Icon, accent = false,
}: { title: string; value: string | number; icon: LucideIcon; accent?: boolean }) {
  return (
    <div className="glass rounded-2xl p-6 flex items-center justify-between hover:border-bh-gold/40 transition-colors">
      <div>
        <p className="text-white/50 text-xs tracking-wider uppercase mb-2">{title}</p>
        <p className={`text-3xl font-serif ${accent ? 'text-red-400' : 'text-bh-gold'}`}>{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${accent ? 'bg-red-500/10' : 'bg-bh-gold/10'}`}>
        <Icon className={accent ? 'text-red-400' : 'text-bh-gold'} size={26} />
      </div>
    </div>
  );
}
