'use client';

import { useEffect, useState } from 'react';
import ProductForm from '@/components/admin/ProductForm';
import api from '@/lib/api';
import { Product } from '@/lib/types';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    api.get(`/admin/products/${params.id}`).then((res) => setProduct(res.data));
  }, [params.id]);

  if (!product) return <p className="text-white/50">Yükleniyor...</p>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-serif text-3xl text-white">Ürünü Düzenle</h1>
        <p className="text-white/50 text-sm mt-1">{product.name}</p>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
