// İletişim sayfası

import Navbar from '@/components/site/Navbar';
import Footer from '@/components/site/Footer';
import { Mail, Phone, MapPin, Instagram } from 'lucide-react';

export default function ContactPage() {
  return (
    <main>
      <Navbar />

      <section className="pt-36 pb-24 px-6 lg:px-10 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="tracking-[0.4em] text-bh-gold text-xs uppercase mb-4">İletişim</p>
          <h1 className="font-serif text-4xl md:text-5xl text-white">Bize Ulaşın</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass rounded-2xl p-8 text-center hover:border-bh-gold/50 transition-colors">
            <Mail className="text-bh-gold mx-auto mb-4" size={30} />
            <h3 className="font-serif text-xl text-white mb-2">E-posta</h3>
            <p className="text-white/60 text-sm">info@belhandar.com</p>
          </div>
          <div className="glass rounded-2xl p-8 text-center hover:border-bh-gold/50 transition-colors">
            <Phone className="text-bh-gold mx-auto mb-4" size={30} />
            <h3 className="font-serif text-xl text-white mb-2">Telefon</h3>
            <p className="text-white/60 text-sm">+90 555 000 00 00</p>
          </div>
          <div className="glass rounded-2xl p-8 text-center hover:border-bh-gold/50 transition-colors">
            <MapPin className="text-bh-gold mx-auto mb-4" size={30} />
            <h3 className="font-serif text-xl text-white mb-2">Adres</h3>
            <p className="text-white/60 text-sm">İstanbul, Türkiye</p>
          </div>
        </div>

        <div className="mt-16 glass rounded-2xl p-10 text-center">
          <Instagram className="text-bh-gold mx-auto mb-4" size={30} />
          <h3 className="font-serif text-xl text-white mb-2">Sosyal Medya</h3>
          <p className="text-white/60 text-sm">Instagram üzerinden bizi takip edin: @belhandar</p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
