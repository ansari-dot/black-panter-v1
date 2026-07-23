import { useState, useEffect, FormEvent, useRef } from 'react';
import { Package, Search, Plus, Trash2, Edit2, X, ChevronDown, Image, Upload, Loader2 } from 'lucide-react';
import { TProduct, TWarehouse, TCategory } from '../types';

interface Props {
  products: TProduct[];
  warehouses: TWarehouse[];
  categories: TCategory[];
  onAddProduct: (prod: Omit<TProduct, 'id' | 'addedDate'>) => Promise<void>;
  onUpdateProduct: (id: string, prod: Partial<TProduct>) => Promise<void>;
  onUpdateStock: (id: string, status: 'In Stock' | 'Low Stock' | 'Out of Stock') => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  isCompact?: boolean;
  autoOpenAdd?: boolean;
  onResetAutoOpen?: () => void;
}

const EMPTY_FORM = {
  name: '', slug: '', displayTitle: '', category: '', sku: '',
  subtitle: '', description: '',
  price: 0, oldPrice: 0, saleLabel: '',
  imageUrl: '', gallery: '',
  highlights: '', certifications: '',
  capacity: '', voltage: '', cycleLife: '', chemistrType: '',
  ipRating: '', dimensions: '', weight: '', operatingTemp: '',
  warrantyMonths: 60, shipping: 'Australia Wide',
  stockStatus: 'In Stock' as const,
  rating: 4.8, reviewCount: 0,
  whatsappMessage: '', displayOrder: 0,
  status: 'Active' as const,
  // Inventory
  currentStock: 0, minStock: 10, reorderLevel: 15, location: '',
  warehouseStocks: [] as Array<{ warehouse: string; stock: number }>,
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{children}</label>
);

const Input = ({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="w-full p-2 rounded-lg border border-border bg-background focus:outline-none focus:border-primary text-foreground text-xs" />
);

const Textarea = ({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} className="w-full p-2 rounded-lg border border-border bg-background focus:outline-none focus:border-primary text-foreground text-xs resize-none" />
);

const Select = ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...props} className="w-full p-2 rounded-lg border border-border bg-background focus:outline-none text-foreground text-xs cursor-pointer">{children}</select>
);

export default function ProductsManager({ products, warehouses, categories, onAddProduct, onUpdateProduct, onUpdateStock, onDeleteProduct, isCompact = false, autoOpenAdd = false, onResetAutoOpen }: Props) {
  const activeCategoriesList = categories.filter(c => c.status === 'Active').map(c => c.name);
  const productCategories = activeCategoriesList.length > 0 ? activeCategoriesList : ['Core Services', 'Field Support', 'Industrial Solutions', 'Lithium Traction', 'Solar / Deep Cycle', 'Lead-Acid Traction'];

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<TProduct | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [page, setPage] = useState(1);
  const mainInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const uploadFile = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch(`${API}/api/upload`, { method: 'POST', credentials: 'include', body: fd });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return `${API}${data.url}`;
  };

  const handleMainUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMain(true);
    try {
      const url = await uploadFile(file);
      setForm(p => ({ ...p, imageUrl: url }));
    } catch { alert('Main image upload failed'); }
    finally { setUploadingMain(false); e.target.value = ''; }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingGallery(true);
    try {
      const urls = await Promise.all(files.map(uploadFile));
      setForm(p => ({ ...p, gallery: p.gallery ? p.gallery + '\n' + urls.join('\n') : urls.join('\n') }));
    } catch { alert('Gallery upload failed'); }
    finally { setUploadingGallery(false); e.target.value = ''; }
  };

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const openAdd = () => {
    setEditingProduct(null);
    setForm({ 
      ...EMPTY_FORM,
      category: productCategories[0] || '',
    });
    setShowModal(true);
  };

  useEffect(() => {
    if (autoOpenAdd) {
      openAdd();
      if (onResetAutoOpen) onResetAutoOpen();
    }
  }, [autoOpenAdd]);

  const openEdit = (prod: TProduct) => {
    setEditingProduct(prod);
    setForm({
      name: prod.name, slug: prod.slug, displayTitle: prod.displayTitle || '',
      category: prod.category, sku: prod.sku || '', subtitle: prod.subtitle || '',
      description: prod.description, price: prod.price, oldPrice: prod.oldPrice || 0,
      saleLabel: prod.saleLabel || '', imageUrl: prod.imageUrl || '',
      gallery: (prod.gallery || []).join('\n'),
      highlights: (prod.highlights || []).join('\n'),
      certifications: (prod.certifications || []).join('\n'),
      capacity: prod.capacity || '', voltage: prod.voltage || '',
      cycleLife: prod.cycleLife || '', chemistrType: prod.chemistrType || '',
      ipRating: prod.ipRating || '', dimensions: prod.dimensions || '',
      weight: prod.weight || '', operatingTemp: prod.operatingTemp || '',
      warrantyMonths: prod.warrantyMonths || 60, shipping: prod.shipping || 'Australia Wide',
      stockStatus: prod.stockStatus, rating: prod.rating || 4.8,
      reviewCount: prod.reviewCount || 0, whatsappMessage: prod.whatsappMessage || '',
      displayOrder: prod.displayOrder || 0, status: prod.status || 'Active',
      // Inventory
      currentStock: prod.currentStock ?? 0,
      minStock: prod.minStock ?? 10,
      reorderLevel: prod.reorderLevel ?? 15,
      location: prod.location || '',
      warehouseStocks: (prod.warehouseStocks || []).map((ws) => ({
        warehouse: typeof ws.warehouse === 'object' ? (ws.warehouse._id || ws.warehouse.id) : ws.warehouse,
        stock: ws.stock || 0,
      })),
    });
    setShowModal(true);
  };

  const f = (key: string) => (e: any) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  const fNum = (key: string) => (e: any) => setForm((prev) => ({ ...prev, [key]: Number(e.target.value) }));

  const handleAutoSlug = (e: any) => {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, name: val, slug: prev.slug || val.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.category || form.category.trim().length < 2) {
      alert('Please select a valid category.');
      return;
    }
    setSaving(true);
    try {
      const payload: Omit<TProduct, 'id' | 'addedDate'> = {
        name: form.name, slug: form.slug, displayTitle: form.displayTitle,
        category: form.category, sku: form.sku, subtitle: form.subtitle,
        description: form.description, price: form.price,
        oldPrice: form.oldPrice || null,
        saleLabel: form.saleLabel, imageUrl: form.imageUrl,
        gallery: form.gallery.split('\n').map(s => s.trim()).filter(Boolean),
        highlights: form.highlights.split('\n').map(s => s.trim()).filter(Boolean),
        certifications: form.certifications.split('\n').map(s => s.trim()).filter(Boolean),
        capacity: form.capacity, voltage: form.voltage, cycleLife: form.cycleLife,
        chemistrType: form.chemistrType, ipRating: form.ipRating,
        dimensions: form.dimensions, weight: form.weight, operatingTemp: form.operatingTemp,
        warrantyMonths: form.warrantyMonths || undefined,
        shipping: form.shipping,
        stockStatus: form.stockStatus, rating: form.rating, reviewCount: form.reviewCount,
        whatsappMessage: form.whatsappMessage, displayOrder: form.displayOrder, status: form.status,
        // Inventory
        currentStock: editingProduct ? (editingProduct.currentStock ?? 0) : 0,
        minStock: form.minStock,
        reorderLevel: form.reorderLevel,
        location: form.location,
        warehouseStocks: editingProduct ? (editingProduct.warehouseStocks || []) : [],
      };
      if (editingProduct) {
        await onUpdateProduct(editingProduct.id, payload);
      } else {
        await onAddProduct(payload);
      }
      setShowModal(false);
    } catch (err: any) {
      alert(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const stockStyles = (s: string): React.CSSProperties =>
    s === 'In Stock'
      ? { backgroundColor: '#dcfce7', color: '#16a34a' }
      : s === 'Low Stock'
      ? { backgroundColor: '#fef3c7', color: '#d97706' }
      : { backgroundColor: '#fee2e2', color: '#dc2626' };

  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div style={{ backgroundColor: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>Products</div>
          <div style={{ fontSize: 13, color: '#888888', marginTop: 2 }}>{products.length} products in catalog</div>
        </div>
        {!isCompact && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2" style={{ border: '1px solid #e8e8e8', borderRadius: 8, padding: '8px 12px', width: 200, backgroundColor: '#fff' }}>
              <Search size={14} strokeWidth={2.5} color="#888" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                style={{ border: 'none', outline: 'none', fontSize: 13, color: '#888', background: 'transparent', width: '100%' }}
              />
            </div>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 cursor-pointer"
              style={{ backgroundColor: '#e84b10', color: '#fff', fontSize: 13, fontWeight: 500, padding: '8px 16px', borderRadius: 8, border: 'none' }}
            >
              <Plus size={15} strokeWidth={2.5} /> Add Product
            </button>
          </div>
        )}
      </div>

      {/* Category filter pills */}
      {!isCompact && (
        <div className="flex items-center gap-2 flex-wrap">
          {['All', ...productCategories].map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setPage(1); }}
              className="cursor-pointer"
              style={{
                padding: '6px 16px',
                borderRadius: 9999,
                fontSize: 13,
                fontWeight: 500,
                border: activeCategory === cat ? 'none' : '1px solid #e8e8e8',
                backgroundColor: activeCategory === cat ? '#e84b10' : '#fff',
                color: activeCategory === cat ? '#fff' : '#1a1a1a',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Product list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
        {(isCompact ? products.slice(0, 3) : pageItems).length === 0 ? (
          <div style={{ padding: '48px 0', textAlign: 'center' }}>
            <Package size={32} color="#ccc" style={{ margin: '0 auto 8px' }} />
            <p style={{ fontSize: 12, color: '#888' }}>No products found.</p>
          </div>
        ) : (
          (isCompact ? products.slice(0, 3) : pageItems).map((prod) => (
            <div key={prod.id}>
              {/* Main row */}
              <div
                className="flex items-center justify-between"
                style={{ border: '1px solid #e8e8e8', borderRadius: 12, padding: '12px 16px', backgroundColor: '#fff' }}
              >
                {/* Left: image + info */}
                <div className="flex items-center gap-4">
                  <div style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', border: '1px solid #e8e8e8', flexShrink: 0, backgroundColor: '#f5f5f5' }}>
                    {prod.imageUrl ? (
                      <img src={prod.imageUrl} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Image size={20} color="#ccc" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#888888', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        {prod.category}
                      </span>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 6,
                        backgroundColor: prod.status === 'Inactive' ? '#f5f5f5' : '#dcfce7',
                        color: prod.status === 'Inactive' ? '#888888' : '#16a34a',
                      }}>
                        {prod.status || 'Active'}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>{prod.name}</div>
                    <div style={{ fontSize: 11, color: '#888888' }}>
                      {[prod.voltage, prod.capacity, prod.chemistrType].filter(Boolean).join(' | ') || prod.subtitle || ''}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#e84b10', marginTop: 2 }}>
                      ${prod.price?.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Right: stock dropdown + actions */}
                <div className="flex items-center gap-3">
                  {/* Stock status dropdown styled as badge */}
                  <div
                    className="flex items-center gap-1"
                    style={{ ...stockStyles(prod.stockStatus), fontSize: 13, fontWeight: 600, padding: '6px 12px', borderRadius: 8, cursor: 'pointer', position: 'relative' }}
                    onClick={() => {
                      const next = prod.stockStatus === 'In Stock' ? 'Low Stock' : prod.stockStatus === 'Low Stock' ? 'Out of Stock' : 'In Stock';
                      onUpdateStock(prod.id, next);
                    }}
                    title="Click to cycle stock status"
                  >
                    {prod.stockStatus}
                    <ChevronDown size={13} strokeWidth={2.5} />
                  </div>

                  {!isCompact && (
                    <>
                      <button
                        onClick={() => openEdit(prod)}
                        className="cursor-pointer"
                        style={{ color: '#888888', background: 'none', border: 'none', padding: 4 }}
                      >
                        <Edit2 size={16} strokeWidth={2.2} />
                      </button>
                      <button
                        onClick={() => onDeleteProduct(prod.id)}
                        className="cursor-pointer"
                        style={{ color: '#888888', background: 'none', border: 'none', padding: 4 }}
                      >
                        <Trash2 size={16} strokeWidth={2.2} />
                      </button>
                      <button
                        onClick={() => setExpandedId(expandedId === prod.id ? null : prod.id)}
                        className="cursor-pointer"
                        style={{ color: '#888888', background: 'none', border: 'none', padding: 4 }}
                      >
                        <ChevronDown
                          size={16}
                          strokeWidth={2.2}
                          style={{ transform: expandedId === prod.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                        />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Expanded details */}
              {expandedId === prod.id && (
                <div style={{ border: '1px solid #e8e8e8', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: '12px 16px', backgroundColor: '#fafafa', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, fontSize: 12 }}>
                  {[
                    ['Capacity', prod.capacity], ['Voltage', prod.voltage],
                    ['Cycle Life', prod.cycleLife], ['Chemistry', prod.chemistrType],
                    ['IP Rating', prod.ipRating], ['Dimensions', prod.dimensions],
                    ['Weight', prod.weight], ['Temp Range', prod.operatingTemp],
                    ['Warranty', prod.warrantyMonths ? `${prod.warrantyMonths} months` : ''],
                    ['Shipping', prod.shipping], ['Rating', prod.rating ? `${prod.rating}/5` : ''],
                    ['Reviews', prod.reviewCount?.toString()],
                  ].map(([label, val]) => val ? (
                    <div key={label}>
                      <div style={{ fontSize: 10, textTransform: 'uppercase', color: '#aaa', fontWeight: 600 }}>{label}</div>
                      <div style={{ fontWeight: 600, color: '#1a1a1a', marginTop: 2 }}>{val}</div>
                    </div>
                  ) : null)}
                  {prod.highlights?.length ? (
                    <div style={{ gridColumn: '1 / -1' }}>
                      <div style={{ fontSize: 10, textTransform: 'uppercase', color: '#aaa', fontWeight: 600, marginBottom: 4 }}>Highlights</div>
                      <div className="flex flex-wrap gap-1">
                        {prod.highlights.map((h) => <span key={h} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 9999, backgroundColor: '#fff7ed', color: '#c2410c', fontWeight: 500 }}>{h}</span>)}
                      </div>
                    </div>
                  ) : null}
                  {prod.certifications?.length ? (
                    <div style={{ gridColumn: '1 / -1' }}>
                      <div style={{ fontSize: 10, textTransform: 'uppercase', color: '#aaa', fontWeight: 600, marginBottom: 4 }}>Certifications</div>
                      <div className="flex flex-wrap gap-1">
                        {prod.certifications.map((c) => <span key={c} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 9999, backgroundColor: '#eff6ff', color: '#1d4ed8', fontWeight: 500 }}>{c}</span>)}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {!isCompact && filtered.length > 0 && (
        <div className="flex items-center justify-between" style={{ marginTop: 8 }}>
          <div style={{ fontSize: 11, color: '#888888' }}>
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} items
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="cursor-pointer flex items-center justify-center rounded"
              style={{ width: 28, height: 28, color: '#888', background: 'none', border: 'none' }}
            >
              <ChevronDown size={14} strokeWidth={2.5} style={{ transform: 'rotate(90deg)' }} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className="cursor-pointer flex items-center justify-center rounded"
                style={{ width: 28, height: 28, fontSize: 13, backgroundColor: n === page ? '#e84b10' : 'transparent', color: n === page ? '#fff' : '#1a1a1a', border: 'none', fontWeight: n === page ? 600 : 400 }}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="cursor-pointer flex items-center justify-center rounded"
              style={{ width: 28, height: 28, color: '#888', background: 'none', border: 'none' }}
            >
              <ChevronDown size={14} strokeWidth={2.5} style={{ transform: 'rotate(-90deg)' }} />
            </button>
          </div>
          <div className="flex items-center justify-between" style={{ border: '1px solid #e8e8e8', borderRadius: 8, padding: '6px 12px', width: 110, backgroundColor: '#fff' }}>
            <span style={{ fontSize: 13, color: '#1a1a1a' }}>{PAGE_SIZE} per page</span>
            <ChevronDown size={13} strokeWidth={2.5} color="#888" />
          </div>
        </div>
      )}
      {/* Add / Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[9999] bg-black/45 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-slide-up">

            {/* Modal header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0 bg-white">
              <h3 className="text-base font-bold text-gray-900">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 bg-white">
              <div className="p-6 flex flex-col gap-6 max-w-4xl mx-auto w-full">

                {/* ── BASIC INFO ── */}
                <section>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-3">Basic Info</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <Label>Product Name *</Label>
                      <Input required value={form.name} onChange={(e) => { handleAutoSlug(e); }} placeholder="e.g. LiFePO4 Deep Cycle Battery" />
                    </div>
                    <div>
                      <Label>Slug *</Label>
                      <Input required value={form.slug} onChange={(e) => setForm(p => ({ ...p, slug: (e.target.value).toLowerCase().replace(/[^a-z0-9-]/g, '') }))} placeholder="lifepo4-deep-cycle" />
                    </div>
                    <div>
                      <Label>Display Title</Label>
                      <Input value={form.displayTitle} onChange={f('displayTitle')} placeholder="Short display name" />
                    </div>
                    <div>
                      <Label>Category *</Label>
                      <Select required value={form.category} onChange={f('category')}>
                        <option value="">— Select Category —</option>
                        {productCategories.map(c => <option key={c} value={c}>{c}</option>)}
                      </Select>
                    </div>
                    <div>
                      <Label>SKU</Label>
                      <Input value={form.sku} onChange={f('sku')} placeholder="BPB-0001" />
                    </div>
                    <div className="col-span-2">
                      <Label>Subtitle</Label>
                      <Input value={form.subtitle} onChange={f('subtitle')} placeholder="Short hero description" />
                    </div>
                    <div className="col-span-2">
                      <Label>Description *</Label>
                      <Textarea required rows={3} value={form.description} onChange={f('description')} placeholder="Full product description..." />
                    </div>
                  </div>
                </section>

                {/* ── PRICING ── */}
                <section>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-3">Pricing</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>Price ($) *</Label>
                      <Input required type="number" step="0.01" min="0" value={form.price} onChange={fNum('price')} />
                    </div>
                    <div>
                      <Label>Old Price ($)</Label>
                      <Input type="number" step="0.01" min="0" value={form.oldPrice} onChange={fNum('oldPrice')} />
                    </div>
                    <div>
                      <Label>Sale Label</Label>
                      <Input value={form.saleLabel} onChange={f('saleLabel')} placeholder="e.g. 15%" />
                    </div>
                  </div>
                </section>

                {/* ── INVENTORY ── */}
                <section>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-3">Inventory Settings</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Min Stock (Low Stock alert)</Label>
                      <Input type="number" min="0" value={form.minStock} onChange={fNum('minStock')} placeholder="10" />
                    </div>
                    <div>
                      <Label>Reorder Level</Label>
                      <Input type="number" min="0" value={form.reorderLevel} onChange={fNum('reorderLevel')} placeholder="15" />
                    </div>
                  </div>
                </section>

                {/* ── IMAGES ── */}
                <section>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-3">Images</p>
                  <div className="grid grid-cols-1 gap-4">

                    {/* Main image */}
                    <div>
                      <Label>Main Image</Label>
                      <div className="flex items-center gap-3">
                        {form.imageUrl && (
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                            <img src={form.imageUrl} alt="main" className="w-full h-full object-cover" />
                            <button type="button" onClick={() => setForm(p => ({ ...p, imageUrl: '' }))}
                              className="absolute top-0.5 right-0.5 bg-white rounded-full p-0.5 shadow cursor-pointer">
                              <X className="w-3 h-3 text-gray-500" />
                            </button>
                          </div>
                        )}
                        <button type="button" onClick={() => mainInputRef.current?.click()}
                          disabled={uploadingMain}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary text-xs text-gray-500 hover:text-primary transition-colors cursor-pointer disabled:opacity-60">
                          {uploadingMain ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                          {uploadingMain ? 'Uploading...' : form.imageUrl ? 'Replace Image' : 'Upload Main Image'}
                        </button>
                        <input ref={mainInputRef} type="file" accept="image/jpg,image/jpeg,image/png,image/webp" className="hidden" onChange={handleMainUpload} />
                      </div>
                    </div>

                    {/* Gallery */}
                    <div>
                      <Label>Gallery Images</Label>
                      {form.gallery && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {form.gallery.split('\n').filter(Boolean).map((url, i) => (
                            <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                              <img src={url} alt={`gallery-${i}`} className="w-full h-full object-cover" />
                              <button type="button"
                                onClick={() => setForm(p => ({ ...p, gallery: p.gallery.split('\n').filter((_, idx) => idx !== i).join('\n') }))}
                                className="absolute top-0.5 right-0.5 bg-white rounded-full p-0.5 shadow cursor-pointer">
                                <X className="w-3 h-3 text-gray-500" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <button type="button" onClick={() => galleryInputRef.current?.click()}
                        disabled={uploadingGallery}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary text-xs text-gray-500 hover:text-primary transition-colors cursor-pointer disabled:opacity-60">
                        {uploadingGallery ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        {uploadingGallery ? 'Uploading...' : 'Add Gallery Images'}
                      </button>
                      <input ref={galleryInputRef} type="file" accept="image/jpg,image/jpeg,image/png,image/webp" multiple className="hidden" onChange={handleGalleryUpload} />
                    </div>

                  </div>
                </section>

                {/* ── SPECS ── */}
                <section>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-3">Technical Specs</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      ['Capacity', 'capacity', '100Ah'],
                      ['Voltage', 'voltage', '12V'],
                      ['Cycle Life', 'cycleLife', '4000+'],
                      ['Chemistry', 'chemistrType', 'LiFePO4'],
                      ['IP Rating', 'ipRating', 'IP67'],
                      ['Dimensions', 'dimensions', '330×175×220mm'],
                      ['Weight', 'weight', '12.5kg'],
                      ['Operating Temp', 'operatingTemp', '-20°C to 60°C'],
                    ].map(([label, key, placeholder]) => (
                      <div key={key}>
                        <Label>{label}</Label>
                        <Input value={(form as any)[key]} onChange={f(key)} placeholder={placeholder} />
                      </div>
                    ))}
                  </div>
                </section>

                {/* ── HIGHLIGHTS & CERTIFICATIONS ── */}
                <section>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-3">Highlights & Certifications</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Highlights (one per line)</Label>
                      <Textarea rows={4} value={form.highlights} onChange={f('highlights')} placeholder={"4000+ Cycle Life\nThermal Stable\nIP67 Rated"} />
                    </div>
                    <div>
                      <Label>Certifications (one per line)</Label>
                      <Textarea rows={4} value={form.certifications} onChange={f('certifications')} placeholder={"AS/NZS 4509\nUN38.3\nIEC 62619"} />
                    </div>
                  </div>
                </section>

                {/* ── AVAILABILITY & META ── */}
                <section>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-3">Availability & Meta</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <Label>Stock Status</Label>
                      <Select value={form.stockStatus} onChange={f('stockStatus')}>
                        <option value="In Stock">In Stock</option>
                        <option value="Low Stock">Low Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                      </Select>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select value={form.status} onChange={f('status')}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </Select>
                    </div>
                    <div>
                      <Label>Warranty (months)</Label>
                      <Input type="number" min="0" value={form.warrantyMonths} onChange={fNum('warrantyMonths')} />
                    </div>
                    <div>
                      <Label>Shipping</Label>
                      <Input value={form.shipping} onChange={f('shipping')} placeholder="Australia Wide" />
                    </div>
                    <div>
                      <Label>Rating</Label>
                      <Input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={fNum('rating')} />
                    </div>
                    <div>
                      <Label>Review Count</Label>
                      <Input type="number" min="0" value={form.reviewCount} onChange={fNum('reviewCount')} />
                    </div>
                    <div>
                      <Label>Display Order</Label>
                      <Input type="number" min="0" value={form.displayOrder} onChange={fNum('displayOrder')} />
                    </div>
                    <div>
                      <Label>WhatsApp Message</Label>
                      <Input value={form.whatsappMessage} onChange={f('whatsappMessage')} placeholder="Auto-generated if empty" />
                    </div>
                  </div>
                </section>



              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2.5 flex-shrink-0 bg-white">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-muted text-muted-foreground font-semibold text-xs cursor-pointer">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2 text-primary-foreground bg-primary font-bold rounded-lg hover:opacity-90 text-xs cursor-pointer disabled:opacity-60">
                  {saving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
