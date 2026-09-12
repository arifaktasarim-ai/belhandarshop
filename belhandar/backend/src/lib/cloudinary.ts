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
const productStorage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: 'belhandar/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit' }],
  }),
});

export const upload = multer({
  storage: productStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB sınır
});

// Ana sayfa banner görselleri için storage - "belhandar/banners" klasörüne yüklenir
// Bannerlar geniş/yatay olduğu için farklı bir kırpma oranı kullanılır
const bannerStorage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: 'belhandar/banners',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1920, height: 900, crop: 'limit' }],
  }),
});

export const uploadBanner = multer({
  storage: bannerStorage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB sınır
});

export { cloudinary };
