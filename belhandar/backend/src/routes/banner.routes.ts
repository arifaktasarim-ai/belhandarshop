import { Router } from 'express';
import {
  getPublicBanners, getAdminBanners,
  createBanner, updateBanner, deleteBanner,
} from '../controllers/banner.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { uploadBanner } from '../lib/cloudinary';

// --- Herkese açık ---
export const publicBannerRouter = Router();
publicBannerRouter.get('/', getPublicBanners);

// --- Admin (kimlik doğrulama zorunlu) ---
export const adminBannerRouter = Router();
adminBannerRouter.use(authenticate, authorize('ADMIN', 'STAFF'));
adminBannerRouter.get('/', getAdminBanners);
adminBannerRouter.post('/', uploadBanner.single('image'), createBanner);
adminBannerRouter.put('/:id', uploadBanner.single('image'), updateBanner);
adminBannerRouter.delete('/:id', deleteBanner);
