// Cloudinary konfigürasyonu - Ürün resimleri bu servise yüklenir

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Ürün görselleri için storage - "belhandar/products" klasörüne yüklenir
const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: 'belhandar/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit' }],
  }),
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB sınır
});

export { cloudinary };
