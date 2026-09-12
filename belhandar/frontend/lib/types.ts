// Ortak TypeScript tipleri (backend Prisma modelleriyle eşleşir)

export type Gender = 'ERKEK' | 'KADIN' | 'UNISEX';
export type ProductStatus = 'AKTIF' | 'PASIF';
export type StockMovementType = 'GIRIS' | 'CIKIS' | 'DUZELTME';

export interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
}

export interface ProductImage {
  id: string;
  url: string;
  publicId: string;
  isPrimary: boolean;
  order: number;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  barcode?: string | null;
  slug: string;
  description?: string | null;
  topNotes?: string | null;
  middleNotes?: string | null;
  baseNotes?: string | null;
  gender: Gender;
  volumeMl: number;
  status: ProductStatus;
  stockQuantity: number;
  criticalStock: number;
  categoryId?: string | null;
  category?: Category | null;
  images: ProductImage[];
  createdAt: string;
}

export interface StockMovement {
  id: string;
  type: StockMovementType;
  quantity: number;
  description?: string | null;
  previousQty: number;
  newQty: number;
  createdAt: string;
  product?: { name: string; code: string };
  user?: { name: string };
}

export interface Banner {
  id: string;
  imageUrl: string;
  publicId: string;
  title?: string | null;
  subtitle?: string | null;
  linkUrl?: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
}
