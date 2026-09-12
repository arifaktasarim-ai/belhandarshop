# 🚀 Belhandar — Supabase (Veritabanı) + Render.com (Backend/Frontend) Kurulum Rehberi

Bu mimaride:
- **Veritabanı:** Supabase PostgreSQL
- **Backend (Express API):** Render.com Web Service
- **Frontend (Next.js):** Render.com Web Service

## Önce Anlaşılması Gereken Önemli Nokta

> **Render'a girdiğin ortam değişkenleri kalıcıdır.** Supabase bağlantı bilgilerini Render Dashboard'a **bir kez** girersin; `git push` ile her yeni deploy yaptığında Render bu değerleri otomatik olarak korur ve tekrar kullanır. Yani "her yenilendiğinde Supabase'den bilgi çekme" işlemi manuel bir senkronizasyon değil — bir kere tanımlanan ortam değişkenleri kalıcı olarak saklanır ve her build/restart'ta kullanılır. Sadece Supabase tarafında şifreni değiştirirsen, Render'daki değişkeni de elle güncellemen gerekir.

---

## 1) Supabase Projesi Oluştur

1. [supabase.com](https://supabase.com) üzerinden ücretsiz bir hesap aç, **New Project** oluştur.
2. Proje oluşturulurken belirlediğin **veritabanı şifresini** bir yere not al (sonradan tekrar gösterilmiyor, sadece "Reset Database Password" ile sıfırlanabiliyor).
3. Proje hazır olduğunda: **Project Settings** (sol alt dişli ikonu) → **Database** sekmesine gir.
4. **Connection String** bölümünde iki farklı bağlantı modu göreceksin:

   | Mod | Port | Ne Zaman Kullanılır |
   |---|---|---|
   | **Transaction Pooler** (pgbouncer) | `6543` | Uygulamanın normal çalışması sırasında (`DATABASE_URL`) |
   | **Session / Direct Connection** | `5432` | Sadece `prisma migrate` komutları için (`DIRECT_URL`) |

   Render gibi platformlarda backend her istekte yeni bağlantı açabildiğinden, pooler kullanmak zorunludur; aksi halde Supabase'in bağlantı limitine hızla takılırsın. Ancak pooler, tablo oluşturma/değiştirme (DDL) komutlarını desteklemez, bu yüzden migration için ayrıca direct bağlantıya ihtiyaç var. Bu proje bu ikisini ayırmak için Prisma'nın `directUrl` özelliğini kullanacak şekilde zaten yapılandırıldı (`backend/prisma/schema.prisma`).

5. Her iki bağlantı adresini de kopyala. Formatları şuna benzer:
   ```
   # Pooler (DATABASE_URL için, port 6543)
   postgresql://postgres.xxxxxxxxxxxx:[SIFREN]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres

   # Direct (DIRECT_URL için, port 5432)
   postgresql://postgres.xxxxxxxxxxxx:[SIFREN]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
   ```
6. Pooler adresinin sonuna `?pgbouncer=true` eklemeyi unutma:
   ```
   postgresql://postgres.xxxxxxxxxxxx:[SIFREN]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

---

## 2) Kodu GitHub'a Yükle

Render, deploy işlemini bir Git reposu üzerinden yapar:
```powershell
cd C:\Yol\belhandar
git init
git add .
git commit -m "Belhandar ilk kurulum"
git branch -M main
git remote add origin https://github.com/kullanici-adin/belhandar.git
git push -u origin main
```

> `.env` dosyaların `.gitignore` içinde olduğu için repoya yüklenmez — bu normaldir, gizli bilgiler Render Dashboard'a ayrıca girilecek.

---

## 3) Cloudinary Hesabı

Ürün resimleri hâlâ Cloudinary üzerinden yönetiliyor (Render'ın disk alanı kalıcı olmadığı için). [cloudinary.com](https://cloudinary.com) üzerinden ücretsiz hesap aç, `cloud_name`, `api_key`, `api_secret` bilgilerini not al.

---

## 4) Render'da Backend Web Service Oluştur

1. Render Dashboard → **New** → **Web Service** → GitHub reponu bağla.
2. Ayarlar:
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:**
     ```
     npm install && npx prisma generate && npm run build
     ```
   - **Start Command:**
     ```
     npm run start:render
     ```
     (Bu komut, deploy sırasında önce `prisma migrate deploy` ile Supabase'deki tabloları senkronize eder, sonra sunucuyu başlatır.)
   - **Health Check Path:** `/api/health`
3. **Environment** sekmesinde şu değişkenleri gir:

   | Anahtar | Değer |
   |---|---|
   | `DATABASE_URL` | Supabase Pooler adresi (`?pgbouncer=true` ekli, port 6543) |
   | `DIRECT_URL` | Supabase Direct adresi (port 5432) |
   | `JWT_SECRET` | Render'ın "Generate" butonuyla otomatik üretebilirsin |
   | `JWT_EXPIRES_IN` | `7d` |
   | `CLOUDINARY_CLOUD_NAME` | Cloudinary hesabından |
   | `CLOUDINARY_API_KEY` | Cloudinary hesabından |
   | `CLOUDINARY_API_SECRET` | Cloudinary hesabından |
   | `CLIENT_URL` | Frontend servisinin adresi (adım 5'ten sonra doldur) |
   | `CRITICAL_STOCK_THRESHOLD` | `10` |

4. **Create Web Service** ile kurulumu başlat. İlk deploy birkaç dakika sürebilir; loglardan `prisma migrate deploy` adımının başarıyla tamamlandığını görebilirsin.

---

## 5) Render'da Frontend Web Service Oluştur

1. Render Dashboard → **New** → **Web Service** → aynı repo.
2. Ayarlar:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:render`
3. **Environment** sekmesinde:

   | Anahtar | Değer |
   |---|---|
   | `NEXT_PUBLIC_API_URL` | `https://belhandar-backend.onrender.com/api` (backend'in gerçek adresi, sonuna `/api` eklemeyi unutma) |

4. Deploy tamamlandıktan sonra frontend'in gerçek adresini kopyala (örn. `https://belhandar-frontend.onrender.com`).

---

## 6) Çapraz Referansları Tamamla

Backend servisine geri dön → **Environment** → `CLIENT_URL` değerini frontend'in gerçek adresiyle güncelle → **Save Changes** (bu otomatik olarak yeniden deploy tetikler).

---

## 7) Blueprint (render.yaml) ile Otomatik Kurulum — Alternatif Yöntem

Adım 4-5'i tek tek yapmak yerine, proje kökündeki `render.yaml` dosyasını kullanarak da kurabilirsin:

1. Render Dashboard → **New** → **Blueprint** → reponu seç.
2. Render, `render.yaml` içindeki iki servisi (backend + frontend) otomatik önerir. Veritabanı Supabase'de olduğu için `render.yaml` içinde bir Render Postgres tanımı **yoktur**.
3. **Apply** dedikten sonra, backend servisinin **Environment** sekmesine git ve `sync: false` olarak işaretli şu değişkenleri elle doldur:
   - `DATABASE_URL`, `DIRECT_URL` (Supabase'den)
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
4. Servis adlarını değiştirdiysen adım 6'daki gibi `CLIENT_URL` ve `NEXT_PUBLIC_API_URL` değerlerini gerçek adreslerle güncelle.

---

## 8) Başlangıç Verisini (Seed) Yükle

Migration'lar her deploy'da otomatik çalışsa da, admin kullanıcısı ve örnek kategori/ürün verisini sadece bir kez yüklemen gerekir. En kolay yöntem, kendi bilgisayarından Supabase'e doğrudan bağlanmak:

```powershell
cd backend
$env:DATABASE_URL="Supabase Pooler adresin (?pgbouncer=true ekli)"
$env:DIRECT_URL="Supabase Direct adresin"
npm run prisma:seed
```

Varsayılan admin girişi: **admin@belhandar.com** / **Belhandar2025!** — canlıya aldıktan hemen sonra admin panelinden veya Supabase Table Editor üzerinden şifreyi değiştir.

---

## 9) Doğrulama

- Backend health check: `https://belhandar-backend.onrender.com/api/health` → `{"status":"ok"}` dönmeli.
- Supabase Dashboard → **Table Editor** → `users`, `products` gibi tabloların oluştuğunu görebilirsin.
- Frontend adresine girip admin panelinden giriş yaparak ürün ekleyip Supabase Table Editor'da anlık olarak veri değişimini gözlemleyebilirsin.

---

## Sık Karşılaşılan Sorunlar

**"Too many connections" / bağlantı hatası:** `DATABASE_URL`'in pooler adresini (port 6543, `?pgbouncer=true` ekli) kullandığından emin ol. Direct bağlantıyı (`5432`) uygulamanın kendisi için kullanırsan Supabase'in ücretsiz plan bağlantı limitine hızla takılırsın.

**Migration hatası ("prepared statement already exists" vb.):** Bu genelde `DIRECT_URL` alanının boş bırakılıp migration'ın pooler üzerinden çalıştırılmaya çalışılmasından kaynaklanır. `DIRECT_URL` değişkeninin dolu olduğundan emin ol.

**Frontend eski API adresine istek atıyor:** `NEXT_PUBLIC_...` değişkenleri build sırasında koda gömülür. Değeri değiştirdikten sonra Render'da **Manual Deploy → Clear build cache & deploy** yapman gerekir.

**Supabase şifresini unuttum:** Supabase Dashboard → Project Settings → Database → **Reset Database Password**. Şifreyi sıfırladıktan sonra Render'daki `DATABASE_URL` ve `DIRECT_URL` değişkenlerini de güncellemen gerekir (aksi halde bağlantı koparılana kadar eski şifreyle çalışmaya devam eder, connection pool yeniden kurulduğunda hata alırsın).

## Güncelleme Yayınlamak

`main` branch'ine her `git push` yaptığında Render otomatik olarak yeniden build alıp deploy eder. Ortam değişkenlerini (Supabase bilgileri dahil) tekrar girmene gerek yoktur — bunlar servise kalıcı olarak bağlıdır ve her deploy'da otomatik kullanılır.
