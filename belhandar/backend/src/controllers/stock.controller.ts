// Stok Yönetimi: Giriş, Çıkış, Geçmiş, Kritik Stok Uyarısı

import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

const movementSchema = z.object({
  productId: z.string(),
  type: z.enum(['GIRIS', 'CIKIS', 'DUZELTME']),
  quantity: z.coerce.number().int().positive('Miktar pozitif bir sayı olmalıdır.'),
  description: z.string().optional(),
});

// POST /api/admin/stock/movements - Yeni stok hareketi oluştur
export async function createStockMovement(req: AuthRequest, res: Response) {
  const parsed = movementSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.errors[0].message });
  }
  const { productId, type, quantity, description } = parsed.data;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return res.status(404).json({ message: 'Ürün bulunamadı.' });

  const previousQty = product.stockQuantity;
  let newQty = previousQty;

  if (type === 'GIRIS') newQty = previousQty + quantity;
  else if (type === 'CIKIS') {
    if (quantity > previousQty) {
      return res.status(400).json({ message: 'Çıkış miktarı mevcut stoktan fazla olamaz.' });
    }
    newQty = previousQty - quantity;
  } else if (type === 'DUZELTME') {
    newQty = quantity; // Düzeltmede miktar, yeni stok sayısını doğrudan ifade eder
  }

  const [movement] = await prisma.$transaction([
    prisma.stockMovement.create({
      data: {
        productId, type, quantity, description,
        previousQty, newQty, userId: req.user!.userId,
      },
    }),
    prisma.product.update({
      where: { id: productId },
      data: { stockQuantity: newQty },
    }),
  ]);

  res.status(201).json(movement);
}

// GET /api/admin/stock/movements - Tüm stok hareketleri (filtrelenebilir)
export async function getStockMovements(req: AuthRequest, res: Response) {
  const { productId, type, startDate, endDate } = req.query;
  const where: any = {};
  if (productId) where.productId = String(productId);
  if (type) where.type = String(type);
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(String(startDate));
    if (endDate) where.createdAt.lte = new Date(String(endDate));
  }

  const movements = await prisma.stockMovement.findMany({
    where,
    include: {
      product: { select: { name: true, code: true } },
      user: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json(movements);
}

// GET /api/admin/stock/critical - Kritik stok altındaki ürünler
export async function getCriticalStock(req: AuthRequest, res: Response) {
  // Prisma iki alanı doğrudan karşılaştıramadığı için tüm ürünleri çekip filtreliyoruz
  const all = await prisma.product.findMany({ include: { category: true } });
  const criticalProducts = all.filter((p) => p.stockQuantity <= p.criticalStock);

  res.json(criticalProducts);
}
