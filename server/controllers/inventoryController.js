import Product from '../models/Product.js';
import StockMovement from '../models/StockMovement.js';
import asyncHandler from '../utils/asyncHandler.js';

// ─── GET /api/inventory ───────────────────────────────────────────────────────
export const getInventory = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status)      filter.status      = req.query.status;
  if (req.query.category)    filter.category    = req.query.category;
  if (req.query.stockStatus) filter.stockStatus = req.query.stockStatus;

  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  const skip  = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Product.find(filter)
      .select('name slug sku category imageUrl voltage capacity currentStock minStock reorderLevel location stockStatus status price displayOrder createdAt warehouseStocks')
      .populate({ path: 'warehouseStocks.warehouse', select: 'name code city' })
      .sort({ displayOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  res.json({ data: items, page, limit, total, totalPages: Math.ceil(total / limit) });
});

// ─── GET /api/inventory/movements ────────────────────────────────────────────
// Returns recent stock movements, populated with product + warehouse info
export const getMovements = asyncHandler(async (req, res) => {
  const limit     = Math.min(100, parseInt(req.query.limit) || 50);
  const productId   = req.query.productId;
  const warehouseId = req.query.warehouseId;

  const filter = {};
  if (productId)   filter.product   = productId;
  if (warehouseId) filter.warehouse = warehouseId;

  const movements = await StockMovement.find(filter)
    .populate('product',   'name sku imageUrl category')
    .populate('warehouse', 'name code city')
    .sort({ createdAt: -1 })
    .limit(limit);

  res.json(movements);
});

// ─── POST /api/inventory/movement ────────────────────────────────────────────
// Record a Stock In or Stock Out. Linked to a warehouse.
export const addMovement = asyncHandler(async (req, res) => {
  const { productId, type, quantity, note, warehouseId } = req.body;

  if (!productId || !type || !quantity || !warehouseId) {
    return res.status(400).json({ message: 'productId, type, quantity, and warehouseId are required.' });
  }
  if (!['in', 'out'].includes(type)) {
    return res.status(400).json({ message: 'type must be "in" or "out".' });
  }
  const qty = parseInt(quantity);
  if (!qty || qty < 1) {
    return res.status(400).json({ message: 'quantity must be a positive integer.' });
  }

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found.' });

  // Find the specific warehouse stock entry
  const existingEntry = product.warehouseStocks?.find(
    (ws) => String(ws.warehouse) === String(warehouseId)
  );
  const wStockBefore = existingEntry ? existingEntry.stock : 0;

  if (type === 'out' && wStockBefore < qty) {
    return res.status(400).json({
      message: `Cannot remove ${qty} units. Current stock in selected warehouse is only ${wStockBefore} units.`,
    });
  }

  const stockBefore = product.currentStock;
  const stockAfter = type === 'in' ? stockBefore + qty : stockBefore - qty;

  // Auto-determine stockStatus based on overall stock
  let newStockStatus = 'In Stock';
  if (stockAfter === 0)                    newStockStatus = 'Out of Stock';
  else if (stockAfter < product.minStock)  newStockStatus = 'Low Stock';

  // Save movement (with warehouse)
  const movement = await StockMovement.create({
    product:     productId,
    warehouse:   warehouseId,
    type,
    quantity:    qty,
    note:        note || '',
    by:          req.user?.name || 'Admin',
    stockBefore,
    stockAfter,
  });

  // Update product stock atomically
  let updatedProduct;
  if (type === 'in') {
    updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, "warehouseStocks.warehouse": warehouseId },
      {
        $inc: { "warehouseStocks.$.stock": qty, currentStock: qty },
        $set: { stockStatus: newStockStatus }
      },
      { new: true }
    );
    if (!updatedProduct) {
      updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
          $push: { warehouseStocks: { warehouse: warehouseId, stock: qty } },
          $inc: { currentStock: qty },
          $set: { stockStatus: newStockStatus }
        },
        { new: true }
      );
    }
  } else {
    updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, "warehouseStocks.warehouse": warehouseId },
      {
        $inc: { "warehouseStocks.$.stock": -qty, currentStock: -qty },
        $set: { stockStatus: newStockStatus }
      },
      { new: true }
    );
  }

  // Populate for response
  await movement.populate('product',   'name sku imageUrl category');
  await movement.populate('warehouse', 'name code city');

  res.status(201).json({ movement, product: updatedProduct });
});

// ─── PATCH /api/inventory/:productId/config ──────────────────────────────────
export const updateInventoryConfig = asyncHandler(async (req, res) => {
  const allowed = {};
  if (req.body.minStock     !== undefined) allowed.minStock     = Number(req.body.minStock);
  if (req.body.reorderLevel !== undefined) allowed.reorderLevel = Number(req.body.reorderLevel);
  if (req.body.location     !== undefined) allowed.location     = req.body.location;

  if (req.body.warehouseStocks !== undefined) {
    allowed.warehouseStocks = req.body.warehouseStocks;
    const totalStock = req.body.warehouseStocks.reduce((sum, ws) => sum + (Number(ws.stock) || 0), 0);
    allowed.currentStock = totalStock;
  } else if (req.body.currentStock !== undefined) {
    allowed.currentStock = Number(req.body.currentStock);
  }

  const product = await Product.findByIdAndUpdate(
    req.params.productId,
    allowed,
    { new: true, runValidators: true }
  );
  if (!product) return res.status(404).json({ message: 'Product not found.' });

  // Recalculate stockStatus
  let newStockStatus = 'In Stock';
  if (product.currentStock === 0)                    newStockStatus = 'Out of Stock';
  else if (product.currentStock < product.minStock)  newStockStatus = 'Low Stock';
  if (newStockStatus !== product.stockStatus) {
    product.stockStatus = newStockStatus;
    await product.save();
  }

  // Populate for response
  await product.populate({ path: 'warehouseStocks.warehouse', select: 'name code city' });

  res.json(product);
});

// ─── GET /api/inventory/summary ──────────────────────────────────────────────
export const getInventorySummary = asyncHandler(async (req, res) => {
  const products = await Product.find({ status: 'Active' })
    .select('currentStock minStock price stockStatus');

  const totalProducts   = products.length;
  const totalStock      = products.reduce((sum, p) => sum + p.currentStock, 0);
  const inventoryValue  = products.reduce((sum, p) => sum + (p.currentStock * p.price), 0);
  const lowStockCount   = products.filter(p => p.stockStatus === 'Low Stock').length;
  const outOfStockCount = products.filter(p => p.stockStatus === 'Out of Stock').length;

  res.json({ totalProducts, totalStock, inventoryValue, lowStockCount, outOfStockCount });
});

