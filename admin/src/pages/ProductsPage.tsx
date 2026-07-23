import { TProduct, TWarehouse, TCategory } from '../types';
import ProductsManager from '../components/ProductsManager';

interface ProductsPageProps {
  products: TProduct[];
  warehouses: TWarehouse[];
  categories: TCategory[];
  onAddProduct: (prod: Omit<TProduct, 'id' | 'addedDate'>) => Promise<void>;
  onUpdateProduct: (id: string, prod: Partial<TProduct>) => Promise<void>;
  onUpdateStock: (id: string, status: 'In Stock' | 'Low Stock' | 'Out of Stock') => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  autoOpenAdd?: boolean;
  onResetAutoOpen?: () => void;
}

export default function ProductsPage({ products, warehouses, categories, onAddProduct, onUpdateProduct, onUpdateStock, onDeleteProduct, autoOpenAdd, onResetAutoOpen }: ProductsPageProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a' }}>Products Catalog</div>
        <div style={{ fontSize: 13, color: '#888888', marginTop: 4 }}>Manage your full product catalog with all attributes, pricing, specs, and availability.</div>
      </div>
      <ProductsManager
        products={products}
        warehouses={warehouses}
        categories={categories}
        onAddProduct={onAddProduct}
        onUpdateProduct={onUpdateProduct}
        onUpdateStock={onUpdateStock}
        onDeleteProduct={onDeleteProduct}
        isCompact={false}
        autoOpenAdd={autoOpenAdd}
        onResetAutoOpen={onResetAutoOpen}
      />
    </div>
  );
}
