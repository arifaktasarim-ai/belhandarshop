'use client';

import { useEffect, useState } from 'react';
import ProductForm from '@/components/admin/ProductForm';
import api from '@/lib/api';
import { Product } from '@/lib/types';

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    params.then(({ id }) => {
      api
        .get(`/admin/products/${id}`)
        .then((res) => setProduct(res.data));
    });
  }, [params]);

  if (!product) {
    return <p className="text-white/50">Yükleniyor...</p>;
  }

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