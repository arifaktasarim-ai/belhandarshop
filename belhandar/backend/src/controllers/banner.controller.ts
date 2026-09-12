// Ana Sayfa Banner Yönetimi
// Ziyaretçiler sadece aktif (isActive=true) bannerları sıralı şekilde görür
// Admin, banner ekleyip/düzenleyip/silebilir ve Cloudinary'e görsel yükleyebilir

import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { cloudinary } from '../lib/cloudinary';
import { AuthRequest } from '../middleware/auth.middleware';

// GET /api/banners - Herkese açık, sadece aktif bannerlar
export async function getPublicBanners(req: Request, res: Response) {
  const banners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });
  res.json(banners);
}

// GET /api/admin/banners - Admin için tüm bannerlar (aktif/pasif dahil)
export async function getAdminBanners(req: AuthRequest, res: Response) {
  const banners = await prisma.banner.findMany({ orderBy: { order: 'asc' } });
  res.json(banners);
}

// POST /api/admin/banners - Yeni banner oluştur (görsel zorunlu)
export async function createBanner(req: AuthRequest, res: Response) {
  const file = req.file as Express.Multer.File & { path: string; filename: string };
  if (!file) return res.status(400).json({ message: 'Banner görseli zorunludur.' });

  const { title, subtitle, linkUrl, order, isActive } = req.body;

  const banner = await prisma.banner.create({
    data: {
      imageUrl: file.path,
      publicId: file.filename,
      title: title || null,
      subtitle: subtitle || null,
      linkUrl: linkUrl || null,
      order: order ? Number(order) : 0,
      isActive: isActive === undefined ? true : isActive === 'true' || isActive === true,
    },
  });

  res.status(201).json(banner);
}

// PUT /api/admin/banners/:id - Banner güncelle (görsel opsiyonel - değiştirilmek istenirse gönderilir)
export async function updateBanner(req: AuthRequest, res: Response) {
  const existing = await prisma.banner.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ message: 'Banner bulunamadı.' });

  const { title, subtitle, linkUrl, order, isActive } = req.body;
  const file = req.file as (Express.Multer.File & { path: string; filename: string }) | undefined;

  const data: any = {
    title: title !== undefined ? title || null : undefined,
    subtitle: subtitle !== undefined ? subtitle || null : undefined,
    linkUrl: linkUrl !== undefined ? linkUrl || null : undefined,
    order: order !== undefined ? Number(order) : undefined,
    isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : undefined,
  };

  // Yeni bir görsel yüklendiyse eskisini Cloudinary'den sil ve yenisini kaydet
  if (file) {
    try {
      await cloudinary.uploader.destroy(existing.publicId);
    } catch (e) {
      console.warn('Cloudinary silme uyarısı:', e);
    }
    data.imageUrl = file.path;
    data.publicId = file.filename;
  }

  const banner = await prisma.banner.update({ where: { id: req.params.id }, data });
  res.json(banner);
}

// DELETE /api/admin/banners/:id
export async function deleteBanner(req: AuthRequest, res: Response) {
  const banner = await prisma.banner.findUnique({ where: { id: req.params.id } });
  if (!banner) return res.status(404).json({ message: 'Banner bulunamadı.' });

  try {
    await cloudinary.uploader.destroy(banner.publicId);
  } catch (e) {
    console.warn('Cloudinary silme uyarısı:', e);
  }

  await prisma.banner.delete({ where: { id: req.params.id } });
  res.json({ message: 'Banner silindi.' });
}
