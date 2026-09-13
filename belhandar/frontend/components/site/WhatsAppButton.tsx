'use client';

// WhatsApp Sipariş Hattı - sağ altta sabit duran, dalga animasyonlu buton.
// Tıklanınca WhatsApp'ı önceden yazılmış bir sipariş mesajıyla açar.
//
// AYAR: Aşağıdaki iki sabiti kendi bilgilerinize göre güncelleyin.
// Telefon numarası başında ülke kodu ile, boşluksuz/tiresiz yazılmalıdır (örn. Türkiye için 90 ile başlar).
const WHATSAPP_PHONE = '905314337171';
const WHATSAPP_MESSAGE = 'Merhaba, Belhandar ürünleri hakkında sipariş vermek istiyorum.';

export default function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp Sipariş Hattı"
      className="group fixed bottom-6 right-6 z-40 flex items-center gap-3"
    >
      {/* Masaüstünde görünen etiket */}
      <span className="hidden sm:inline-block glass-dark text-white/90 text-xs tracking-wide px-3 py-2 rounded-full opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap">
        WhatsApp&apos;tan Sipariş Ver
      </span>

      <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg hover:scale-105 transition-transform duration-300">
        {/* Dikkat çeken dalga animasyonu */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-40" />

        {/* WhatsApp ikonu */}
        <svg
          viewBox="0 0 32 32"
          className="relative w-7 h-7 fill-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16.004 3C9.376 3 4 8.373 4 15c0 2.34.687 4.523 1.872 6.36L4 29l7.84-1.83A11.93 11.93 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.75c-1.99 0-3.87-.55-5.47-1.51l-.39-.23-4.65 1.09 1.11-4.53-.25-.4A9.7 9.7 0 0 1 5.25 15c0-5.93 4.82-10.75 10.754-10.75S26.75 9.07 26.75 15 21.938 24.75 16.004 24.75Zm5.9-8.09c-.32-.16-1.9-.94-2.2-1.05-.29-.11-.51-.16-.72.16-.21.32-.83 1.05-1.02 1.27-.19.21-.38.24-.7.08-.32-.16-1.35-.5-2.57-1.6-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.38.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.62-.53-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.08-1.11 2.64s1.14 3.06 1.3 3.27c.16.21 2.24 3.42 5.42 4.8.76.33 1.35.53 1.81.68.76.24 1.45.21 2 .13.61-.09 1.9-.78 2.17-1.53.27-.75.27-1.39.19-1.53-.08-.13-.29-.21-.61-.37Z" />
        </svg>
      </span>
    </a>
  );
}
