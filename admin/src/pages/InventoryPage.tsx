import React, { useState, useMemo } from 'react';
import {
  Box, ArrowDownToLine, ArrowUpFromLine, Plus, Search, ChevronDown,
  Package, Archive, TriangleAlert, CircleAlert, DollarSign,
  Pencil, X, ChevronLeft, ChevronRight, Check, AlertCircle,
} from 'lucide-react';
import { TProduct, TStockMovement, TWarehouse } from '../types';

interface InventoryPageProps {
  products: TProduct[];
  movements: TStockMovement[];
  warehouses: TWarehouse[];
  onStockIn: (productId: string, quantity: number, note: string, warehouseId?: string) => Promise<void>;
  onStockOut: (productId: string, quantity: number, note: string, warehouseId?: string) => Promise<void>;
  onUpdateConfig: (
    productId: string,
    config: { minStock?: number; reorderLevel?: number; location?: string; warehouseStocks?: Array<{ warehouse: string; stock: number }> }
  ) => Promise<void>;
  onAddProductClick: () => void;
}

// ─── Status Badge ──────────────────────────────────────────────────────────────
const statusBadge = (status: 'In Stock' | 'Low Stock' | 'Out of Stock') => {
  const styles: Record<string, React.CSSProperties> = {
    'In Stock':     { backgroundColor: '#dcfce7', color: '#16a34a' },
    'Low Stock':    { backgroundColor: '#fef3c7', color: '#d97706' },
    'Out of Stock': { backgroundColor: '#fee2e2', color: '#dc2626' },
  };
  return (
    <span style={{ ...styles[status], fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6 }}>
      {status}
    </span>
  );
};

// ─── Movement Modal ────────────────────────────────────────────────────────────
interface MovementModalProps {
  type: 'in' | 'out';
  products: TProduct[];
  warehouses: TWarehouse[];
  preselectedProductId?: string;
  onClose: () => void;
  onSubmit: (productId: string, quantity: number, note: string, warehouseId?: string) => Promise<void>;
}

function MovementModal({ type, products, warehouses, preselectedProductId, onClose, onSubmit }: MovementModalProps) {
  const [productId, setProductId] = useState(preselectedProductId || (products[0]?.id ?? ''));
  const [warehouseId, setWarehouseId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const activeWarehouses = warehouses.filter((w) => w.status === 'Active');
  const selectedProduct = products.find((p) => p.id === productId);
  const isOut = type === 'out';
  const accentColor = isOut ? '#dc2626' : '#16a34a';
  const accentBg = isOut ? '#fee2e2' : '#dcfce7';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(quantity);
    if (!qty || qty < 1) { setError('Enter a valid quantity (minimum 1).'); return; }
    
    if (!warehouseId) {
      setError('Please select a warehouse.');
      return;
    }

    if (selectedProduct) {
      const existingEntry = selectedProduct.warehouseStocks?.find(
        (ws) => (typeof ws.warehouse === 'object' ? ws.warehouse._id : ws.warehouse) === warehouseId
      );
      const wStock = existingEntry ? existingEntry.stock : 0;

      if (isOut && qty > wStock) {
        setError(`Cannot remove ${qty} units. Selected warehouse only has ${wStock} units.`);
        return;
      }
    }

    setLoading(true);
    setError('');
    try {
      await onSubmit(productId, qty, note.trim(), warehouseId);
      setSuccess(true);
      setTimeout(onClose, 1200);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ backgroundColor: '#fff', borderRadius: 16, width: '100%', maxWidth: 460, boxShadow: '0 20px 60px rgba(0,0,0,0.18)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: accentBg, color: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isOut ? <ArrowUpFromLine size={18} strokeWidth={2.3} /> : <ArrowDownToLine size={18} strokeWidth={2.3} />}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>
                {isOut ? 'Stock Out' : 'Stock In'}
              </div>
              <div style={{ fontSize: 11, color: '#888' }}>
                {isOut ? 'Remove units from inventory' : 'Add units to inventory'}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 4 }}>
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Success State */}
        {success ? (
          <div style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: accentBg, color: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={24} strokeWidth={2.5} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>
              {isOut ? 'Stock removed successfully!' : 'Stock added successfully!'}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Warehouse selector */}
            {activeWarehouses.length > 0 && (
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                  Warehouse *
                </label>
                <select
                  value={warehouseId}
                  onChange={(e) => setWarehouseId(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #e8e8e8', borderRadius: 8, fontSize: 13, color: '#1a1a1a', backgroundColor: '#fff', cursor: 'pointer' }}
                  required
                >
                  <option value=''>— Select Warehouse —</option>
                  {activeWarehouses.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.code} — {w.name} ({w.city})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Product selector */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Product</label>
              <select
                value={productId}
                onChange={(e) => { setProductId(e.target.value); setError(''); }}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e8e8e8', borderRadius: 8, fontSize: 13, color: '#1a1a1a', backgroundColor: '#fff', cursor: 'pointer' }}
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.sku ? `(${p.sku})` : ''} — Stock: {p.currentStock ?? 0}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock preview */}
            {selectedProduct && (
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1, padding: '10px 14px', backgroundColor: '#f5f5f5', borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>Current Stock</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a' }}>{selectedProduct.currentStock ?? 0}</div>
                  <div style={{ fontSize: 11, color: '#888' }}>units</div>
                </div>
                <div style={{ flex: 1, padding: '10px 14px', backgroundColor: accentBg, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: accentColor, marginBottom: 2 }}>After This Movement</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: accentColor }}>
                    {isOut
                      ? Math.max(0, (selectedProduct.currentStock ?? 0) - (parseInt(quantity) || 0))
                      : (selectedProduct.currentStock ?? 0) + (parseInt(quantity) || 0)
                    }
                  </div>
                  <div style={{ fontSize: 11, color: accentColor }}>units</div>
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                Quantity *
              </label>
              <input
                type="number"
                min={1}
                required
                value={quantity}
                onChange={(e) => { setQuantity(e.target.value); setError(''); }}
                placeholder="Enter number of units"
                style={{ width: '100%', padding: '10px 12px', border: `1px solid ${error ? '#dc2626' : '#e8e8e8'}`, borderRadius: 8, fontSize: 13, color: '#1a1a1a', boxSizing: 'border-box' }}
              />
            </div>

            {/* Note */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                Note / Reference
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={isOut ? 'e.g. Job #WO-2026-0156' : 'e.g. Received from ABC Supplier'}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e8e8e8', borderRadius: 8, fontSize: 13, color: '#1a1a1a', boxSizing: 'border-box' }}
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', backgroundColor: '#fee2e2', borderRadius: 8, color: '#dc2626', fontSize: 12 }}>
                <AlertCircle size={15} strokeWidth={2.3} />
                {error}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
              <button
                type="button"
                onClick={onClose}
                style={{ padding: '10px 18px', border: '1px solid #e8e8e8', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', backgroundColor: '#fff', color: '#555' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{ padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', backgroundColor: accentColor, color: '#fff', border: 'none', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Processing...' : (isOut ? '− Remove Stock' : '+ Add Stock')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Edit Config Modal ─────────────────────────────────────────────────────────
interface ConfigModalProps {
  product: TProduct;
  warehouses: TWarehouse[];
  onClose: () => void;
  onSave: (productId: string, config: { minStock: number; reorderLevel: number; location: string; warehouseStocks: Array<{ warehouse: string; stock: number }> }) => Promise<void>;
}

function ConfigModal({ product, warehouses, onClose, onSave }: ConfigModalProps) {
  const [minStock, setMinStock] = useState(String(product.minStock ?? 10));
  const [reorderLevel, setReorderLevel] = useState(String(product.reorderLevel ?? 15));
  const [location, setLocation] = useState(product.location ?? '');
  const [warehouseStocks, setWarehouseStocks] = useState<Array<{ warehouse: string; stock: number }>>(() => {
    return (product.warehouseStocks || []).map((ws) => ({
      warehouse: typeof ws.warehouse === 'object' ? (ws.warehouse._id || ws.warehouse.id) : ws.warehouse,
      stock: ws.stock || 0,
    }));
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onSave(product.id, {
        minStock: parseInt(minStock) || 10,
        reorderLevel: parseInt(reorderLevel) || 15,
        location: location.trim(),
        warehouseStocks,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save config.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ backgroundColor: '#fff', borderRadius: 16, width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.18)', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>Edit Inventory Config</div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{product.name}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 4 }}>
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Min Stock</label>
              <input type="number" min={0} value={minStock} onChange={(e) => setMinStock(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e8e8e8', borderRadius: 8, fontSize: 13, boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Reorder Level</label>
              <input type="number" min={0} value={reorderLevel} onChange={(e) => setReorderLevel(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e8e8e8', borderRadius: 8, fontSize: 13, boxSizing: 'border-box' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Warehouse Stock Allocations</label>
            {warehouses.filter(w => w.status === 'Active').length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6, border: '1px solid #e8e8e8', borderRadius: 8, padding: 12, backgroundColor: '#f9f9f9', maxHeight: 200, overflowY: 'auto' }}>
                {warehouses.filter(w => w.status === 'Active').map(w => {
                  const wId = w._id || w.id;
                  const existingStock = warehouseStocks?.find(ws => ws.warehouse === wId)?.stock ?? 0;
                  const isAssigned = warehouseStocks?.some(ws => ws.warehouse === wId) ?? false;

                  const handleToggleWarehouse = (checked: boolean) => {
                    if (checked) {
                      setWarehouseStocks(prev => [...(prev || []), { warehouse: wId, stock: 0 }]);
                    } else {
                      setWarehouseStocks(prev => (prev || []).filter(ws => ws.warehouse !== wId));
                    }
                  };

                  const handleStockChange = (val: string) => {
                    const num = parseInt(val) || 0;
                    setWarehouseStocks(prev => (prev || []).map(ws => 
                      ws.warehouse === wId ? { ...ws, stock: num } : ws
                    ));
                  };

                  return (
                    <div key={wId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 8, borderRadius: 6, border: '1px solid #e8e8e8', backgroundColor: '#fff' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#333' }}>
                        <input
                          type="checkbox"
                          checked={isAssigned}
                          onChange={(e) => handleToggleWarehouse(e.target.checked)}
                          style={{ cursor: 'pointer' }}
                        />
                        <div>
                          <div>{w.code}</div>
                          <div style={{ fontSize: 10, color: '#888', fontWeight: 'normal' }}>{w.name} ({w.city})</div>
                        </div>
                      </label>
                      {isAssigned && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', fontWeight: 600 }}>Stock:</span>
                          <input
                            type="number"
                            min="0"
                            value={existingStock}
                            onChange={(e) => handleStockChange(e.target.value)}
                            style={{ width: 60, padding: '4px 6px', border: '1px solid #e8e8e8', borderRadius: 4, fontSize: 12, textAlign: 'center' }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ fontSize: 12, color: '#888', fontStyle: 'italic' }}>No active warehouses registered. Add a warehouse first.</p>
            )}
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', backgroundColor: '#fee2e2', borderRadius: 8, color: '#dc2626', fontSize: 12 }}>
              <AlertCircle size={15} strokeWidth={2.3} /> {error}
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 18px', border: '1px solid #e8e8e8', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', backgroundColor: '#fff', color: '#555' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', backgroundColor: '#e84b10', color: '#fff', border: 'none', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Saving...' : 'Save Config'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Inventory Page ───────────────────────────────────────────────────────
export default function InventoryPage({ products, movements, warehouses, onStockIn, onStockOut, onUpdateConfig, onAddProductClick }: InventoryPageProps) {
  const [modal, setModal] = useState<'in' | 'out' | null>(null);
  const [configProduct, setConfigProduct] = useState<TProduct | null>(null);
  const [preselectedId, setPreselectedId] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const perPage = 8;

  // Derived categories from real products
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
    return ['All', ...cats];
  }, [products]);

  // Filtered products for table
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku || '').toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
      const matchStatus = statusFilter === 'All' || p.stockStatus === statusFilter;
      return matchSearch && matchCat && matchStatus;
    });
  }, [products, search, categoryFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  // Stats — all real, computed from products
  const totalStock      = products.reduce((s, p) => s + (p.currentStock ?? 0), 0);
  const inventoryValue  = products.reduce((s, p) => s + ((p.currentStock ?? 0) * (p.price || 0)), 0);
  const lowStockItems   = products.filter((p) => p.stockStatus === 'Low Stock');
  const outOfStockItems = products.filter((p) => p.stockStatus === 'Out of Stock');

  const card: React.CSSProperties = {
    backgroundColor: '#ffffff',
    border: '1px solid #e8e8e8',
    borderRadius: 12,
    padding: 20,
  };

  const openStockModal = (type: 'in' | 'out', productId?: string) => {
    setPreselectedId(productId);
    setModal(type);
  };

  const formatMovementDate = (iso: string) => {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Modals ── */}
      {modal && (
        <MovementModal
          type={modal}
          products={products}
          warehouses={warehouses}
          preselectedProductId={preselectedId}
          onClose={() => setModal(null)}
          onSubmit={modal === 'in' ? onStockIn : onStockOut}
        />
      )}
      {configProduct && (
        <ConfigModal
          product={configProduct}
          warehouses={warehouses}
          onClose={() => setConfigProduct(null)}
          onSave={onUpdateConfig}
        />
      )}

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, border: '1px solid #e8e8e8', borderRadius: 12, backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box size={24} strokeWidth={2} color="#1a1a1a" />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.25 }}>Inventory Overview</div>
            <div style={{ fontSize: 13, color: '#888888', marginTop: 2 }}>Track and manage your inventory in real-time</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => openStockModal('in')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #16a34a', backgroundColor: '#f0fdf4', color: '#16a34a', fontSize: 13, fontWeight: 600, padding: '9px 16px', borderRadius: 8, cursor: 'pointer' }}
          >
            <ArrowDownToLine size={15} strokeWidth={2.5} />
            Stock In
          </button>
          <button
            onClick={() => openStockModal('out')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #dc2626', backgroundColor: '#fff5f5', color: '#dc2626', fontSize: 13, fontWeight: 600, padding: '9px 16px', borderRadius: 8, cursor: 'pointer' }}
          >
            <ArrowUpFromLine size={15} strokeWidth={2.5} />
            Stock Out
          </button>
          <button
            onClick={onAddProductClick}
            style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#e84b10', color: '#ffffff', fontSize: 13, fontWeight: 600, padding: '9px 16px', borderRadius: 8, cursor: 'pointer', border: 'none' }}
          >
            <Plus size={15} strokeWidth={2.5} />
            Add Product
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
        {[
          { label: 'TOTAL PRODUCTS',      value: products.length.toString(),               sub: 'All products tracked',    icon: <Package size={22} strokeWidth={2} />,       iconBg: '#dcfce7', iconColor: '#16a34a' },
          { label: 'TOTAL STOCK (UNITS)', value: totalStock.toLocaleString(),               sub: 'Total available units',   icon: <Archive size={22} strokeWidth={2} />,       iconBg: '#dcfce7', iconColor: '#16a34a' },
          { label: 'LOW STOCK ITEMS',     value: lowStockItems.length.toString(),           sub: 'Below reorder level',     icon: <TriangleAlert size={22} strokeWidth={2} />, iconBg: '#fef3c7', iconColor: '#d97706' },
          { label: 'OUT OF STOCK',        value: outOfStockItems.length.toString(),         sub: 'No stock available',      icon: <CircleAlert size={22} strokeWidth={2} />,   iconBg: '#fee2e2', iconColor: '#dc2626' },
          { label: 'INVENTORY VALUE',     value: `$${inventoryValue.toLocaleString('en-AU', { minimumFractionDigits: 0 })}`, sub: 'AUD — price × stock',   icon: <DollarSign size={22} strokeWidth={2} />,    iconBg: '#f5f5f5', iconColor: '#888' },
        ].map((stat) => (
          <div key={stat.label} style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginTop: 4, lineHeight: 1 }}>{stat.value}</div>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: stat.iconBg, color: stat.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {stat.icon}
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#888888' }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Inventory Table ── */}
      <div style={card}>
        {/* Filters row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#e84b10', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            INVENTORY ITEMS ({filtered.length})
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #e8e8e8', borderRadius: 8, padding: '8px 12px', width: 220, backgroundColor: '#fff' }}>
              <Search size={14} strokeWidth={2.5} color="#888" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by name or SKU..."
                style={{ border: 'none', outline: 'none', fontSize: 13, color: '#1a1a1a', backgroundColor: 'transparent', width: '100%' }}
              />
            </div>
            {/* Category */}
            <div style={{ position: 'relative' }}>
              <select
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                style={{ appearance: 'none', border: '1px solid #e8e8e8', borderRadius: 8, padding: '8px 32px 8px 12px', fontSize: 13, color: '#1a1a1a', backgroundColor: '#fff', cursor: 'pointer' }}
              >
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#888' }} />
            </div>
            {/* Status */}
            <div style={{ position: 'relative' }}>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                style={{ appearance: 'none', border: '1px solid #e8e8e8', borderRadius: 8, padding: '8px 32px 8px 12px', fontSize: 13, color: '#1a1a1a', backgroundColor: '#fff', cursor: 'pointer' }}
              >
                <option>All</option>
                <option>In Stock</option>
                <option>Low Stock</option>
                <option>Out of Stock</option>
              </select>
              <ChevronDown size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#888' }} />
            </div>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e8e8e8' }}>
              {['PRODUCT', 'SKU', 'CATEGORY', 'LOCATION', 'CURRENT STOCK', 'MIN. STOCK', 'REORDER LVL', 'STATUS', 'ACTIONS'].map((h) => (
                <th key={h} style={{ fontSize: 11, fontWeight: 600, color: '#888888', textAlign: 'left', padding: '8px 12px', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ padding: '40px 12px', textAlign: 'center', color: '#888', fontSize: 13 }}>
                  No products found matching your filters.
                </td>
              </tr>
            ) : pageItems.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #e8e8e8' }}>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, overflow: 'hidden', border: '1px solid #e8e8e8', flexShrink: 0, backgroundColor: '#f5f5f5' }}>
                      {item.imageUrl
                        ? <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={16} color="#ccc" /></div>
                      }
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: '#888888' }}>{`${item.voltage || ''} ${item.capacity || item.category}`.trim()}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px', fontSize: 13, color: '#888888' }}>{item.sku || `BPB-${item.id.slice(0, 5).toUpperCase()}`}</td>
                <td style={{ padding: '12px', fontSize: 13, color: '#1a1a1a' }}>{item.category}</td>
                <td style={{ padding: '12px', fontSize: 11, color: '#1a1a1a', lineHeight: '18px' }}>
                  {item.warehouseStocks && item.warehouseStocks.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {item.warehouseStocks.map((ws, idx) => {
                        const resolvedWarehouse = typeof ws.warehouse === 'object' ? ws.warehouse : warehouses.find(w => w.id === ws.warehouse || w._id === ws.warehouse);
                        const codeName = resolvedWarehouse ? resolvedWarehouse.code : String(ws.warehouse);
                        const fullName = resolvedWarehouse ? resolvedWarehouse.name : '';
                        return (
                          <div key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }} title={fullName}>
                            <span style={{ fontWeight: 700, fontFamily: 'monospace', padding: '1px 5px', borderRadius: 4, backgroundColor: '#f3f4f6', color: '#4b5563', fontSize: 9 }}>{codeName}</span>
                            <span style={{ fontWeight: 600, color: '#111827' }}>{ws.stock}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <span style={{ color: '#ccc' }}>Not Allocated</span>
                  )}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>{item.currentStock ?? 0}</div>
                  <div style={{ fontSize: 11, color: '#888888' }}>Units</div>
                </td>
                <td style={{ padding: '12px', fontSize: 13, color: '#1a1a1a', textAlign: 'center' }}>{item.minStock ?? 10}</td>
                <td style={{ padding: '12px', fontSize: 13, color: '#1a1a1a', textAlign: 'center' }}>{item.reorderLevel ?? 15}</td>
                <td style={{ padding: '12px' }}>{statusBadge(item.stockStatus)}</td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button
                      onClick={() => openStockModal('in', item.id)}
                      title="Stock In"
                      style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #dcfce7', backgroundColor: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      <ArrowDownToLine size={13} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={() => openStockModal('out', item.id)}
                      title="Stock Out"
                      style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #fee2e2', backgroundColor: '#fff5f5', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      <ArrowUpFromLine size={13} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={() => setConfigProduct(item)}
                      title="Edit Config"
                      style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #e8e8e8', backgroundColor: '#fff', color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      <Pencil size={13} strokeWidth={2.5} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
          <div style={{ fontSize: 11, color: '#888888' }}>
            Showing {Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)} of {filtered.length} items
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: 'none', cursor: page === 1 ? 'not-allowed' : 'pointer', color: page === 1 ? '#ccc' : '#888', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ChevronLeft size={14} strokeWidth={2.5} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const n = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
              return (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  style={{ width: 28, height: 28, borderRadius: 6, border: 'none', fontSize: 13, backgroundColor: n === page ? '#e84b10' : 'transparent', color: n === page ? '#fff' : '#1a1a1a', cursor: 'pointer', fontWeight: n === page ? 700 : 400 }}
                >
                  {n}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: 'none', cursor: page === totalPages ? 'not-allowed' : 'pointer', color: page === totalPages ? '#ccc' : '#888', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ChevronRight size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Low Stock Alerts + Recent Movements ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Low Stock Alerts — REAL data */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#e84b10', textTransform: 'uppercase', letterSpacing: '0.05em' }}>LOW STOCK ALERTS</div>
            <span style={{ fontSize: 12, color: '#888' }}>{lowStockItems.length + outOfStockItems.length} items need attention</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[...outOfStockItems, ...lowStockItems].slice(0, 6).length === 0 ? (
              <div style={{ padding: '24px 0', textAlign: 'center', color: '#888', fontSize: 13 }}>
                ✅ All products are well-stocked!
              </div>
            ) : [...outOfStockItems, ...lowStockItems].slice(0, 6).map((p) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <TriangleAlert size={18} strokeWidth={2.2} color={p.stockStatus === 'Out of Stock' ? '#dc2626' : '#d97706'} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#888888' }}>SKU: {p.sku || `BPB-${p.id.slice(0, 5).toUpperCase()}`}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: '#888' }}>Current: <span style={{ fontWeight: 700, color: '#1a1a1a' }}>{p.currentStock ?? 0} Units</span></div>
                  <div style={{ fontSize: 11, color: '#888' }}>Min: <span style={{ fontWeight: 700, color: '#1a1a1a' }}>{p.minStock ?? 10} Units</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Stock Movements — REAL data */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#e84b10', textTransform: 'uppercase', letterSpacing: '0.05em' }}>RECENT STOCK MOVEMENTS</div>
            <span style={{ fontSize: 12, color: '#888' }}>{movements.length} total</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {movements.length === 0 ? (
              <div style={{ padding: '24px 0', textAlign: 'center', color: '#888', fontSize: 13 }}>
                No movements recorded yet. Use Stock In / Stock Out to start tracking.
              </div>
            ) : movements.slice(0, 6).map((m) => {
              const { date, time } = formatMovementDate(m.createdAt);
              const isIn = m.type === 'in';
              return (
                <div key={m._id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: isIn ? '#dcfce7' : '#fee2e2', color: isIn ? '#16a34a' : '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {isIn ? <ArrowDownToLine size={15} strokeWidth={2.2} /> : <ArrowUpFromLine size={15} strokeWidth={2.2} />}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 4, backgroundColor: isIn ? '#dcfce7' : '#fee2e2', color: isIn ? '#16a34a' : '#dc2626', flexShrink: 0 }}>
                    {isIn ? 'IN' : 'OUT'}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {m.product?.name || 'Unknown Product'}
                    </div>
                    <div style={{ fontSize: 11, color: '#888' }}>{m.note || m.by}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: isIn ? '#16a34a' : '#dc2626', flexShrink: 0, width: 60, textAlign: 'center' }}>
                    {isIn ? '+' : '-'}{m.quantity}
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 11, color: '#1a1a1a' }}>{date}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>{time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
