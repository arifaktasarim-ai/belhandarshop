// Dashboard için özet istatistikler ve grafik verileri

import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

// GET /api/admin/dashboard/stats
export async function getDashboardStats(req: AuthRequest, res: Response) {
  const [totalProducts, allProducts, latestProducts, categories] = await Promise.all([
    prisma.product.count(),
    prisma.product.findMany({ include: { category: true } }),
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { images: { where: { isPrimary: true }, take: 1 } },
    }),
    prisma.category.findMany({ include: { _count: { select: { products: true } } } }),
  ]);

  const totalStock = allProducts.reduce((sum, p) => sum + p.stockQuantity, 0);
  const criticalStockProducts = allProducts.filter((p) => p.stockQuantity <= p.criticalStock);

  // Kategori dağılım grafiği için veri
  const categoryDistribution = categories.map((c) => ({
    name: c.name,
    value: c._count.products,
  }));

  // Stok dağılımı - ürün bazında (en çok stoklu 8 ürün)
  const stockDistribution = allProducts
    .sort((a, b) => b.stockQuantity - a.stockQuantity)
    .slice(0, 8)
    .map((p) => ({ name: p.name, stock: p.stockQuantity }));

  res.json({
    totalProducts,
    totalStock,
    criticalStockCount: criticalStockProducts.length,
    latestProducts,
    categoryDistribution,
    stockDistribution,
  });
}
