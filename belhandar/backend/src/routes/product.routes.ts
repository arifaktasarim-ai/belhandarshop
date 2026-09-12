import { Router } from 'express';
import {
  getPublicProducts, getPublicProductBySlug,
  getAdminProducts, getAdminProductById,
  createProduct, updateProduct, deleteProduct,
  uploadProductImage, deleteProductImage,
} from '../controllers/product.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { upload } from '../lib/cloudinary';

// --- Herkese açık route'lar ---
export const publicProductRouter = Router();
publicProductRouter.get('/', getPublicProducts);
publicProductRouter.get('/:slug', getPublicProductBySlug);

// --- Admin route'ları (kimlik doğrulama zorunlu) ---
export const adminProductRouter = Router();
adminProductRouter.use(authenticate, authorize('ADMIN', 'STAFF'));
adminProductRouter.get('/', getAdminProducts);
adminProductRouter.get('/:id', getAdminProductById);
adminProductRouter.post('/', createProduct);
adminProductRouter.put('/:id', updateProduct);
adminProductRouter.delete('/:id', deleteProduct);
adminProductRouter.post('/:id/images', upload.single('image'), uploadProductImage);
adminProductRouter.delete('/images/:imageId', deleteProductImage);
