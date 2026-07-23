import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAll = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.featuredOnHome === 'true') filter.featuredOnHome = true;

  // Advanced search filter
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    filter.$or = [
      { name: searchRegex },
      { description: searchRegex }
    ];
  }

  // Price range filters
  if (req.query.maxPrice) {
    filter.price = { ...filter.price, $lte: Number(req.query.maxPrice) };
  }
  if (req.query.minPrice) {
    filter.price = { ...filter.price, $gte: Number(req.query.minPrice) };
  }

  // Stock availability filter
  if (req.query.stockStatus) {
    filter.stockStatus = req.query.stockStatus;
  }

  // Dynamic sorting
  let sortOption = { displayOrder: 1, createdAt: -1 };
  if (req.query.sort) {
    if (req.query.sort === 'priceAsc') sortOption = { price: 1 };
    else if (req.query.sort === 'priceDesc') sortOption = { price: -1 };
    else if (req.query.sort === 'rating') sortOption = { rating: -1 };
    else if (req.query.sort === 'newest') sortOption = { createdAt: -1 };
  }

  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 12));
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate({ path: 'warehouseStocks.warehouse', select: 'name code city' })
      .sort(sortOption)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  res.json({ data: items, page, limit, total, totalPages: Math.ceil(total / limit) });
});

export const getOne = asyncHandler(async (req, res) => {
  const item = await Product.findById(req.params.id)
    .populate({ path: 'warehouseStocks.warehouse', select: 'name code city' });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

export const getBySlug = asyncHandler(async (req, res) => {
  const item = await Product.findOne({ slug: req.params.slug })
    .populate({ path: 'warehouseStocks.warehouse', select: 'name code city' });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

export const create = asyncHandler(async (req, res) => {
  const body = { ...req.body };
  if (body.oldPrice === null || body.oldPrice === 0) delete body.oldPrice;
  if (body.warrantyMonths === 0) delete body.warrantyMonths;

  if (Array.isArray(body.warehouseStocks)) {
    const totalStock = body.warehouseStocks.reduce((sum, ws) => sum + (Number(ws.stock) || 0), 0);
    body.currentStock = totalStock;
    
    let newStockStatus = 'In Stock';
    if (totalStock === 0) newStockStatus = 'Out of Stock';
    else if (totalStock < (body.minStock || 10)) newStockStatus = 'Low Stock';
    body.stockStatus = newStockStatus;
  }

  const item = await Product.create(body);
  await item.populate({ path: 'warehouseStocks.warehouse', select: 'name code city' });
  res.status(201).json(item);
});

export const update = asyncHandler(async (req, res) => {
  const body = { ...req.body };
  if (body.oldPrice === null || body.oldPrice === 0) delete body.oldPrice;
  if (body.warrantyMonths === 0) delete body.warrantyMonths;

  if (Array.isArray(body.warehouseStocks)) {
    const totalStock = body.warehouseStocks.reduce((sum, ws) => sum + (Number(ws.stock) || 0), 0);
    body.currentStock = totalStock;
    
    let newStockStatus = 'In Stock';
    if (totalStock === 0) newStockStatus = 'Out of Stock';
    else if (totalStock < (body.minStock || 10)) newStockStatus = 'Low Stock';
    body.stockStatus = newStockStatus;
  }

  const item = await Product.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  await item.populate({ path: 'warehouseStocks.warehouse', select: 'name code city' });
  res.json(item);
});

export const updateStock = asyncHandler(async (req, res) => {
  const item = await Product.findByIdAndUpdate(
    req.params.id,
    { stockStatus: req.body.stockStatus },
    { new: true }
  );
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

export const updateFeatured = asyncHandler(async (req, res) => {
  const item = await Product.findByIdAndUpdate(
    req.params.id,
    { featuredOnHome: req.body.featuredOnHome },
    { new: true }
  );
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

export const remove = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

