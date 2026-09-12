// Veritabanını başlangıç verileriyle dolduran seed script'i
// Çalıştırmak için: npm run prisma:seed

import { PrismaClient, Gender, ProductStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1) Admin kullanıcısı oluştur
  const hashedPassword = await bcrypt.hash('Belhandar2025!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@belhandar.com' },
    update: {},
    create: {
      name: 'Belhandar Admin',
      email: 'admin@belhandar.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin kullanıcı oluşturuldu:', admin.email);

  // 2) Kategoriler
  const categoryNames = ['Erkek Parfüm', 'Kadın Parfüm', 'Unisex Parfüm', 'Niche Koleksiyon'];
  const categories = [];
  for (const name of categoryNames) {
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/ü/g, 'u').replace(/ş/g, 's');
    const cat = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name, slug },
    });
    categories.push(cat);
  }
  console.log('✅ Kategoriler oluşturuldu:', categories.length);

  // 3) Site ayarları
  const existingSettings = await prisma.settings.findFirst();
  if (!existingSettings) {
    await prisma.settings.create({
      data: {
        siteName: 'Belhandar',
        aboutTitle: 'Belhandar Hikayesi',
        aboutText:
          'Belhandar, kokunun bir imza olduğuna inanır. Her şişede, ustaca harmanlanmış notaların anlattığı bir hikaye saklıdır. Zamansız zarafeti modern lüksle buluşturuyoruz.',
        contactEmail: 'info@belhandar.com',
        contactPhone: '+90 555 000 00 00',
        contactAddress: 'İstanbul, Türkiye',
      },
    });
    console.log('✅ Site ayarları oluşturuldu');
  }

  // 4) Örnek ürün
  const sampleProduct = await prisma.product.upsert({
    where: { code: 'BH-0001' },
    update: {},
    create: {
      name: 'Belhandar Noir Oud',
      code: 'BH-0001',
      barcode: '8690000000011',
      slug: 'belhandar-noir-oud',
      description: 'Yoğun ve gizemli bir oud kompozisyonu, gece için tasarlandı.',
      topNotes: 'Safran, Bergamot',
      middleNotes: 'Oud, Gül',
      baseNotes: 'Amber, Misk, Sandal Ağacı',
      gender: Gender.UNISEX,
      volumeMl: 100,
      status: ProductStatus.AKTIF,
      stockQuantity: 25,
      criticalStock: 10,
      categoryId: categories[3].id,
    },
  });
  console.log('✅ Örnek ürün oluşturuldu:', sampleProduct.name);

  console.log('🎉 Seed işlemi tamamlandı!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
