# 🖤 Belhandar — Parfüm Vitrin & Stok Yönetim Sistemi

Bu proje bir **e-ticaret sitesi değildir**. Amaç, Belhandar parfüm koleksiyonunu premium bir web vitrininde sergilemek ve arka planda stok takibini yönetmektir.

## 📁 Proje Yapısı

```
belhandar/
├── backend/          # Node.js + Express + TypeScript + Prisma API
│   ├── prisma/
│   │   ├── schema.prisma   # Veritabanı şeması
│   │   └── seed.ts         # Başlangıç verisi (admin kullanıcı + örnek ürün)
│   └── src/
│       ├── controllers/    # İş mantığı
│       ├── routes/         # API uç noktaları
│       ├── middleware/     # Auth, hata yönetimi
│       ├── lib/             # Prisma & Cloudinary bağlantıları
│       └── server.ts        # Giriş noktası
│
└── frontend/         # Next.js 15 + TypeScript + Tailwind CSS
    ├── app/
    │   ├── page.tsx              # Ana sayfa
    │   ├── urunler/               # Ürün vitrin sayfaları
    │   ├── iletisim/              # İletişim sayfası
    │   └── admin/                 # Yönetim paneli (login, dashboard, ürünler, stok, raporlar, ayarlar)
    ├── components/
    │   ├── site/                  # Public sayfa bileşenleri
    │   ├── admin/                 # Panel bileşenleri
    │   └── ui/                    # Ortak arayüz bileşenleri (buton, input, kart...)
    └── lib/                       # API istemcisi, auth yardımcıları, tipler
```

## 🛠️ Kullanılan Teknolojiler

| Katman | Teknoloji |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Veritabanı | PostgreSQL + Prisma ORM |
| Kimlik Doğrulama | JWT (JSON Web Token) |
| Dosya Yükleme | Cloudinary |
| Grafikler | Recharts |
| Raporlama | PDFKit (PDF), ExcelJS (Excel) |

---

## ☁️ Canlıya Alma (Render.com)

Projeyi veritabanı, backend ve frontend dahil tamamen **Render.com** üzerinde barındırmak istersen, adım adım talimatlar için [`RENDER_DEPLOY.md`](./RENDER_DEPLOY.md) dosyasına bak. Kök dizindeki `render.yaml` ile tek tıkla (Blueprint) kurulum da yapılabiliyor.

## 🚀 Yerel Kurulum Talimatları

### Ön Gereksinimler
- Node.js 18+ yüklü olmalı
- Bir PostgreSQL veritabanı — bu proje **Supabase** kullanacak şekilde yapılandırılmıştır (ücretsiz, kurulum gerektirmez), alternatif olarak yerel PostgreSQL veya Railway/Neon gibi başka bulut servisleri de kullanılabilir
- Ücretsiz bir [Cloudinary](https://cloudinary.com) hesabı (ürün resimleri için)

### 1) Reponun İndirilmesi
Proje klasörünü bilgisayarınıza indirin/çıkarın ve içine girin:
```bash
cd belhandar
```

### 2) Backend Kurulumu

```bash
cd backend
npm install
```

`.env.example` dosyasını `.env` olarak kopyalayın ve kendi bilgilerinizle doldurun:
```bash
cp .env.example .env
```

`.env` içeriğini düzenleyin (bu proje varsayılan olarak **Supabase** kullanacak şekilde yapılandırılmıştır — detaylı adımlar için [`RENDER_DEPLOY.md`](./RENDER_DEPLOY.md) dosyasına bakın):
```env
# Supabase Pooler bağlantısı (uygulama çalışırken kullanılır)
DATABASE_URL="postgresql://postgres.xxxx:[SIFREN]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
# Supabase Direct bağlantısı (sadece migration için)
DIRECT_URL="postgresql://postgres.xxxx:[SIFREN]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"

JWT_SECRET="guclu-ve-rastgele-bir-anahtar"
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
PORT=5000
CLIENT_URL="http://localhost:3000"
```

> Yerel bir PostgreSQL kurulumu tercih ediyorsan `DATABASE_URL` ve `DIRECT_URL` için aynı yerel adresi (`postgresql://kullanici:sifre@localhost:5432/belhandar?schema=public`) kullanabilirsin — pooler ayrımı sadece Supabase gibi harici, bağlantı limiti olan servislerde gereklidir.

Veritabanı tablolarını oluşturun:
```bash
npx prisma migrate dev --name init
```

Başlangıç verilerini (admin kullanıcı + örnek kategori/ürün) yükleyin:
```bash
npm run prisma:seed
```

> Varsayılan admin girişi: **admin@belhandar.com** / **Belhandar2025!**
> ⚠️ Üretime almadan önce bu şifreyi mutlaka değiştirin.

Backend'i başlatın:
```bash
npm run dev
```
API şu adreste çalışacaktır: `http://localhost:5000`

### 3) Frontend Kurulumu

Yeni bir terminal açın:
```bash
cd frontend
npm install
```

`.env.local.example` dosyasını `.env.local` olarak kopyalayın:
```bash
cp .env.local.example .env.local
```

İçeriği kontrol edin (backend adresinizle eşleştiğinden emin olun):
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

Frontend'i başlatın:
```bash
npm run dev
```
Site şu adreste çalışacaktır: `http://localhost:3000`
Admin paneli: `http://localhost:3000/admin/login`

---

## 🔑 Roller ve Yetkiler

| Özellik | Ziyaretçi | Admin |
|---|---|---|
| Ürünleri görüntüleme | ✅ | ✅ |
| Ürün detayına erişim | ✅ | ✅ |
| Stok bilgisi görme | ❌ | ✅ |
| Ürün ekleme/düzenleme/silme | ❌ | ✅ |
| Stok giriş/çıkış işlemleri | ❌ | ✅ |
| Raporlara (PDF/Excel) erişim | ❌ | ✅ |

Stok gizliliği backend tarafında sağlanır: herkese açık `/api/products` uç noktası `stockQuantity` alanını hiçbir zaman döndürmez.

## 📊 Admin Paneli Özellikleri

- **Dashboard:** Toplam ürün, toplam stok, kritik stok sayısı, son eklenen ürünler, stok/kategori dağılım grafikleri
- **Ürünler:** Arama + durum filtreli liste, CRUD işlemleri, Cloudinary görsel yükleme
- **Stok Yönetimi:** Giriş/Çıkış/Düzeltme hareketleri, tam hareket geçmişi, kritik stok uyarı listesi
- **Raporlar:** Ürün listesi, stok durumu ve kritik stok raporlarının PDF/Excel çıktısı
- **Ayarlar:** Site adı, hakkımızda metni, iletişim bilgileri

## 🎨 Tasarım Sistemi

- Renk paleti: Siyah `#0F0F0F`, Altın `#D4AF37`, Beyaz `#FFFFFF`
- Glassmorphism (cam efekti) bileşenler (`.glass`, `.glass-dark` CSS sınıfları)
- Cormorant Garamond (başlıklar) + Inter (gövde metni) tipografi ikilisi
- Tamamen responsive: mobil, tablet ve masaüstü uyumlu

## 📌 Notlar ve Sonraki Adımlar

- Bu teslimat, isteğinizdeki tüm modülleri kapsayan **çalışır durumda bir üretim iskeleti**dir. Kurulumdan sonra `npm install` adımları gerçek paket sürümlerini indirecektir.
- Prisma şeması `User, Product, ProductImage, StockMovement, Category, Settings` tablolarının tümünü içerir.
- Görselleri Cloudinary'e yüklemeden önce Cloudinary hesabınızdan `cloud_name`, `api_key`, `api_secret` bilgilerini almanız gerekir.
- Üretime almadan önce: güçlü bir `JWT_SECRET` belirleyin, admin şifresini değiştirin, HTTPS kullanın ve CORS `CLIENT_URL` değerini gerçek alan adınızla sınırlayın.
- İsterseniz ek admin kullanıcı eklemek için Prisma Studio'yu kullanabilirsiniz: `npm run prisma:studio`
