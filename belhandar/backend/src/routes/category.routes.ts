import { Router } from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

export const publicCategoryRouter = Router();
publicCategoryRouter.get('/', getCategories);

export const adminCategoryRouter = Router();
adminCategoryRouter.use(authenticate, authorize('ADMIN', 'STAFF'));
adminCategoryRouter.post('/', createCategory);
adminCategoryRouter.put('/:id', updateCategory);
adminCategoryRouter.delete('/:id', deleteCategory);
