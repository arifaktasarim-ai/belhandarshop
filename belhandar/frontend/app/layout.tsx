import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Belhandar | Premium Parfüm Koleksiyonu',
  description: 'Belhandar - Zamansız zarafeti modern lüksle buluşturan premium parfüm markası.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
