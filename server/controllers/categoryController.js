import Category from '../models/Category.js';
import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';

// GET /api/categories
export const getAll = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const items = await Category.find(filter).sort({ displayOrder: 1, name: 1 });
  res.json(items);
});

// GET /api/categories/:id
export const getOne = asyncHandler(async (req, res) => {
  const item = await Category.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Category not found.' });
  res.json(item);
});

// POST /api/categories
export const create = asyncHandler(async (req, res) => {
  const { name, slug, description, displayOrder, status } = req.body;
  if (!name || !slug) {
    return res.status(400).json({ message: 'name and slug are required.' });
  }
  const slugLower = slug.toLowerCase().replace(/[^a-z0-9-]/g, '');
  const item = await Category.create({
    name: name.trim(),
    slug: slugLower,
    description: description || '',
    displayOrder: Number(displayOrder) || 0,
    status: status || 'Active',
  });
  res.status(201).json(item);
});

// PUT /api/categories/:id
export const update = asyncHandler(async (req, res) => {
  const { name, slug, description, displayOrder, status } = req.body;
  const slugLower = slug?.toLowerCase().replace(/[^a-z0-9-]/g, '');
  const item = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: name?.trim(),
      slug: slugLower,
      description,
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : undefined,
      status,
    },
    { new: true, runValidators: true }
  );
  if (!item) return res.status(404).json({ message: 'Category not found.' });
  res.json(item);
});

// DELETE /api/categories/:id
export const remove = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found.' });

  // Check if any product is using this category name
  const productsCount = await Product.countDocuments({ category: category.name });
  if (productsCount > 0) {
    return res.status(400).json({
      message: `Cannot delete category. ${productsCount} product(s) are currently assigned to this category.`,
    });
  }

  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Category deleted successfully.' });
});

