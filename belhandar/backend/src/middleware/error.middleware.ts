// Merkezi hata yakalama middleware'i

import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('❌ Hata:', err);

  // Prisma unique constraint hatası
  if (err.code === 'P2002') {
    return res.status(409).json({
      message: `Bu değer zaten kullanılıyor: ${err.meta?.target?.join(', ')}`,
    });
  }

  // Prisma kayıt bulunamadı hatası
  if (err.code === 'P2025') {
    return res.status(404).json({ message: 'Kayıt bulunamadı.' });
  }

  const status = err.statusCode || 500;
  const message = err.message || 'Sunucu hatası oluştu.';

  res.status(status).json({ message });
}
