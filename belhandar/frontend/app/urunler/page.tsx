// Ürün vitrini artık ana sayfada (/) gösteriliyor.
// Eski /urunler bağlantıları (yer imleri, dış bağlantılar) kırılmasın diye buradan
// otomatik olarak ana sayfaya yönlendirme yapılır.

import { redirect } from 'next/navigation';

export default function ProductsPageRedirect() {
  redirect('/');
}
