/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TProduct } from '../types';
import ProductsManager from '../components/ProductsManager';

interface ProductsPageProps {
  products: TProduct[];
  onAddProduct: (prod: Omit<TProduct, 'id' | 'addedDate'>) => Promise<void> | void;
  onUpdateStock: (id: string, status: 'In Stock' | 'Low Stock' | 'Out of Stock') => Promise<void> | void;
  onDeleteProduct: (id: string) => Promise<void> | void;
}

export default function ProductsPage({
  products,
  onAddProduct,
  onUpdateStock,
  onDeleteProduct
}: ProductsPageProps) {
  return (
    <div id="tab-products" className="animate-fade-in flex flex-col gap-5 font-sans">
      <div>
        <h1 className="text-3xl font-headings font-bold text-foreground tracking-tight">Batteries Inventory</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Control heavy warehouse accumulators catalog specs and stocks.</p>
      </div>
      <ProductsManager
        products={products}
        onAddProduct={onAddProduct}
        onUpdateStock={onUpdateStock}
        onDeleteProduct={onDeleteProduct}
        isCompact={false}
      />
    </div>
  );
}
