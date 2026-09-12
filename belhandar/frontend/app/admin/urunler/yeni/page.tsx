import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-serif text-3xl text-white">Yeni Ürün Ekle</h1>
        <p className="text-white/50 text-sm mt-1">Ürünü kaydettikten sonra resim yükleyebilirsiniz.</p>
      </div>
      <ProductForm />
    </div>
  );
}
