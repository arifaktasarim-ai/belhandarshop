import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-bh-black flex flex-col items-center justify-center text-center px-6">
      <h1 className="font-serif text-6xl text-gold-gradient mb-4">404</h1>
      <p className="text-white/60 mb-8">Aradığınız sayfa bulunamadı.</p>
      <Link href="/" className="bg-gold-gradient text-bh-black font-semibold px-6 py-3 rounded-full">
        Ana Sayfaya Dön
      </Link>
    </main>
  );
}
