// Ürün CRUD işlemleri
// Ziyaretçiler için: sadece AKTIF ürünler, stok bilgisi gizli
// Admin için: tüm ürünler, stok bilgisi dahil

import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { cloudinary } from '../lib/cloudinary';
import { AuthRequest } from '../middleware/auth.middleware';
import { Request } from 'express';

const productSchema = z.object({
  name: z.string().min(2, 'Ürün adı en az 2 karakter olmalıdır.'),
  code: z.string().min(1, 'Ürün kodu zorunludur.'),
  barcode: z.string().optional(),
  description: z.string().optional(),
  topNotes: z.string().optional(),
  middleNotes: z.string().optional(),
  baseNotes: z.string().optional(),
  gender: z.enum(['ERKEK', 'KADIN', 'UNISEX']),
  volumeMl: z.coerce.number().int().positive('Hacim pozitif bir sayı olmalıdır.'),
  status: z.enum(['AKTIF', 'PASIF']).default('AKTIF'),
  stockQuantity: z.coerce.number().int().min(0).default(0),
  criticalStock: z.coerce.number().int().min(0).default(10),
  categoryId: z.string().optional().nullable(),
});

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// GET /api/products - Herkese açık ürün listesi (filtreleme + arama destekli)
export async function getPublicProducts(req: Request, res: Response) {
  const { category, gender, search, minVolume, maxVolume } = req.query;

  const where: any = { status: 'AKTIF' };
  if (category) where.categoryId = String(category);
  if (gender) where.gender = String(gender);
  if (search) {
    where.OR = [
      { name: { contains: String(search), mode: 'insensitive' } },
      { description: { contains: String(search), mode: 'insensitive' } },
    ];
  }
  if (minVolume || maxVolume) {
    where.volumeMl = {};
    if (minVolume) where.volumeMl.gte = Number(minVolume);
    if (maxVolume) where.volumeMl.lte = Number(maxVolume);
  }

  const products = await prisma.product.findMany({
    where,
    select: {
      id: true, name: true, slug: true, description: true, gender: true,
      volumeMl: true, topNotes: true, middleNotes: true, baseNotes: true,
      category: { select: { name: true, slug: true } },
      images: { orderBy: { order: 'asc' } },
      // NOT: stockQuantity kasıtlı olarak seçilmiyor - ziyaretçiler stok göremez
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json(products);
}

// GET /api/products/:slug - Tekil ürün detayı (herkese açık)
export async function getPublicProductBySlug(req: Request, res: Response) {
  const product = await prisma.product.findFirst({
    where: { slug: req.params.slug, status: 'AKTIF' },
    select: {
      id: true, name: true, code: true, slug: true, description: true, gender: true,
      volumeMl: true, topNotes: true, middleNotes: true, baseNotes: true,
      category: { select: { name: true, slug: true } },
      images: { orderBy: { order: 'asc' } },
    },
  });

  if (!product) return res.status(404).json({ message: 'Ürün bulunamadı.' });
  res.json(product);
}

// GET /api/admin/products - Admin için tüm ürünler (stok dahil)
export async function getAdminProducts(req: AuthRequest, res: Response) {
  const { search, category, status } = req.query;
  const where: any = {};
  if (search) where.name = { contains: String(search), mode: 'insensitive' };
  if (category) where.categoryId = String(category);
  if (status) where.status = String(status);

  const products = await prisma.product.findMany({
    where,
    include: { category: true, images: true },
    orderBy: { createdAt: 'desc' },
  });

  res.json(products);
}

// GET /api/admin/products/:id
export async function getAdminProductById(req: AuthRequest, res: Response) {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: { category: true, images: true, stockMovements: { orderBy: { createdAt: 'desc' }, take: 20, include: { user: { select: { name: true } } } } },
  });
  if (!product) return res.status(404).json({ message: 'Ürün bulunamadı.' });
  res.json(product);
}

// POST /api/admin/products - Yeni ürün oluştur
export async function createProduct(req: AuthRequest, res: Response) {
  const parsed = productSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.errors[0].message });
  }

  const data = parsed.data;
  const slug = slugify(data.name) + '-' + Math.random().toString(36).slice(2, 6);

  const product = await prisma.product.create({
    data: { ...data, slug },
  });

  res.status(201).json(product);
}

// PUT /api/admin/products/:id - Ürün güncelle
export async function updateProduct(req: AuthRequest, res: Response) {
  const parsed = productSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.errors[0].message });
  }

  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: parsed.data,
  });

  res.json(product);
}

// DELETE /api/admin/products/:id - Ürün sil (görselleri Cloudinary'den de temizler)
export async function deleteProduct(req: AuthRequest, res: Response) {
  const images = await prisma.productImage.findMany({ where: { productId: req.params.id } });

  for (const img of images) {
    try {
      await cloudinary.uploader.destroy(img.publicId);
    } catch (e) {
      console.warn('Cloudinary silme uyarısı:', e);
    }
  }

  await prisma.product.delete({ where: { id: req.params.id } });
  res.json({ message: 'Ürün başarıyla silindi.' });
}

// POST /api/admin/products/:id/images - Ürün resmi yükle
export async function uploadProductImage(req: AuthRequest, res: Response) {
  const file = req.file as Express.Multer.File & { path: string; filename: string };
  if (!file) return res.status(400).json({ message: 'Resim dosyası bulunamadı.' });

  const existingCount = await prisma.productImage.count({ where: { productId: req.params.id } });

  const image = await prisma.productImage.create({
    data: {
      productId: req.params.id,
      url: file.path,
      publicId: file.filename,
      isPrimary: existingCount === 0,
      order: existingCount,
    },
  });

  res.status(201).json(image);
}

// DELETE /api/admin/products/images/:imageId - Ürün resmini sil
export async function deleteProductImage(req: AuthRequest, res: Response) {
  const image = await prisma.productImage.findUnique({ where: { id: req.params.imageId } });
  if (!image) return res.status(404).json({ message: 'Görsel bulunamadı.' });

  await cloudinary.uploader.destroy(image.publicId);
  await prisma.productImage.delete({ where: { id: req.params.imageId } });

  res.json({ message: 'Görsel silindi.' });
}
