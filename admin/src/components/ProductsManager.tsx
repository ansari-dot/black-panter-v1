/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, ChangeEvent } from 'react';
import { Battery, Package, Search, Plus, Trash2, Calendar, X } from 'lucide-react';
import { TProduct } from '../types';

interface ProductsManagerProps {
  products: TProduct[];
  onAddProduct: (prod: Omit<TProduct, 'id' | 'addedDate'>) => Promise<void> | void;
  onUpdateStock: (id: string, status: 'In Stock' | 'Low Stock' | 'Out of Stock') => Promise<void> | void;
  onDeleteProduct: (id: string) => Promise<void> | void;
  isCompact?: boolean;
}

export default function ProductsManager({ products, onAddProduct, onUpdateStock, onDeleteProduct, isCompact = false }: ProductsManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState(false);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Lithium Traction');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState('');
  const [voltage, setVoltage] = useState('48V');
  const [warrantyMonths, setWarrantyMonths] = useState(36);
  const [stockStatus, setStockStatus] = useState<'In Stock' | 'Low Stock' | 'Out of Stock'>('In Stock');

  const categories = ['All', 'Lithium Traction', 'Solar / Deep Cycle', 'Lead-Acid Traction'];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.capacity.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !capacity.trim() || !description.trim()) return;
    onAddProduct({ name, slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), category, description, capacity, voltage, warrantyMonths: Number(warrantyMonths), stockStatus });
    setName(''); setSlug(''); setCategory('Lithium Traction'); setDescription(''); setCapacity(''); setVoltage('48V'); setWarrantyMonths(36); setStockStatus('In Stock');
    setShowAddForm(false);
  };

  const handleAutoSlug = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'));
  };

  return (
    <div id="products-manager-container" className="bg-card border border-border rounded-xl flex flex-col h-full overflow-hidden">

      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold font-headings text-foreground">Products</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isCompact ? `${products.length} products` : `${products.length} products in catalog`}
          </p>
        </div>
        {!isCompact && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-muted/30 focus:outline-none focus:border-primary text-foreground w-44"
              />
            </div>
            <button onClick={() => setShowAddForm(true)} className="flex items-center gap-1.5 text-xs font-semibold bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-opacity-90 transition-all cursor-pointer">
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          </div>
        )}
      </div>

      {/* Category pills */}
      {!isCompact && (
        <div className="px-5 py-2.5 border-b border-border flex items-center gap-1.5 overflow-x-auto bg-muted/10">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 text-[11px] font-medium rounded-full cursor-pointer transition-colors whitespace-nowrap ${activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Products grid */}
      <div className="p-4 flex-1 overflow-y-auto">
        {(isCompact ? products.slice(0, 3) : filteredProducts).length === 0 ? (
          <div className="py-12 text-center">
            <Package className="w-8 h-8 text-muted-foreground stroke-[1.5] mx-auto mb-2" />
            <p className="text-xs text-muted-foreground italic">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(isCompact ? products.slice(0, 3) : filteredProducts).map((prod) => (
              <div key={prod.id} className="bg-white border border-border rounded-xl p-4 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 relative group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                    {prod.category}
                  </span>
                  <select
                    value={prod.stockStatus}
                    onChange={(e) => onUpdateStock(prod.id, e.target.value as any)}
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border-0 focus:outline-none cursor-pointer ${
                      prod.stockStatus === 'In Stock' ? 'bg-success/10 text-success' :
                      prod.stockStatus === 'Low Stock' ? 'bg-warning/10 text-warning' :
                      'bg-danger/10 text-danger'}`}
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>

                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-foreground line-clamp-1">{prod.name}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">{prod.description}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2.5 border-t border-border text-[11px] text-muted-foreground mb-3">
                  <div><div className="text-[9px] uppercase text-muted-foreground/60">Capacity</div><div className="font-semibold text-foreground mt-0.5">{prod.capacity}</div></div>
                  <div><div className="text-[9px] uppercase text-muted-foreground/60">Voltage</div><div className="font-semibold text-foreground mt-0.5">{prod.voltage}</div></div>
                  <div><div className="text-[9px] uppercase text-muted-foreground/60">Warranty</div><div className="font-semibold text-foreground mt-0.5">{prod.warrantyMonths}m</div></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border pt-2.5">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{prod.addedDate}</span>
                  {!isCompact && (
                    <button onClick={() => onDeleteProduct(prod.id)} className="p-1 rounded text-muted-foreground hover:text-danger hover:bg-danger/5 opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isCompact && products.length > 3 && (
        <div className="p-3 text-center border-t border-border bg-muted/10">
          <p className="text-xs text-muted-foreground">View all products in the Products tab.</p>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-card border border-border rounded-xl max-w-md w-full shadow-xl overflow-hidden animate-slide-up">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground font-headings">Add Product</h3>
              <button onClick={() => setShowAddForm(false)} className="text-muted-foreground hover:text-foreground cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Product Name</label>
                <input required type="text" placeholder="e.g. Panther Lithium 450Ah" value={name} onChange={handleAutoSlug}
                  className="w-full p-2.5 rounded-lg border border-border bg-background focus:outline-none focus:border-primary text-foreground" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Slug</label>
                  <input required type="text" placeholder="auto-generated" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="w-full p-2.5 rounded-lg border border-border bg-background focus:outline-none focus:border-primary text-foreground" />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background focus:outline-none text-foreground cursor-pointer">
                    <option value="Lithium Traction">Lithium Traction</option>
                    <option value="Solar / Deep Cycle">Solar / Deep Cycle</option>
                    <option value="Lead-Acid Traction">Lead-Acid Traction</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Description</label>
                <textarea required rows={2} placeholder="Brief product description..." value={description} onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background focus:outline-none focus:border-primary text-foreground"></textarea>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Capacity</label>
                  <input required type="text" placeholder="e.g. 450Ah" value={capacity} onChange={(e) => setCapacity(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background focus:outline-none focus:border-primary text-foreground" />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Voltage</label>
                  <select value={voltage} onChange={(e) => setVoltage(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background focus:outline-none text-foreground cursor-pointer">
                    <option value="12V">12V</option><option value="24V">24V</option><option value="36V">36V</option><option value="48V">48V</option><option value="80V">80V</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Warranty (mo)</label>
                  <input required type="number" min={1} max={120} value={warrantyMonths} onChange={(e) => setWarrantyMonths(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-border bg-background focus:outline-none focus:border-primary text-foreground" />
                </div>
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 text-[10px]">Stock Status</label>
                <div className="flex items-center gap-4">
                  {(['In Stock', 'Low Stock', 'Out of Stock'] as const).map((s) => (
                    <label key={s} className="flex items-center gap-1.5 cursor-pointer text-foreground">
                      <input type="radio" name="stock" checked={stockStatus === s} onChange={() => setStockStatus(s)} className="text-primary" />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button type="button" onClick={() => setShowAddForm(false)} className="px-3.5 py-2.5 rounded-lg border border-border hover:bg-muted text-muted-foreground font-semibold cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-primary-foreground bg-primary font-bold rounded-lg hover:bg-opacity-90 cursor-pointer">Add Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
