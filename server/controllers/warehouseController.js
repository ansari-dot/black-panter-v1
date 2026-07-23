import Warehouse from '../models/Warehouse.js';
import asyncHandler from '../utils/asyncHandler.js';

// GET /api/warehouses
export const getAll = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const items = await Warehouse.find(filter).sort({ createdAt: -1 });
  res.json(items);
});

// GET /api/warehouses/:id
export const getOne = asyncHandler(async (req, res) => {
  const item = await Warehouse.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Warehouse not found.' });
  res.json(item);
});

// POST /api/warehouses
export const create = asyncHandler(async (req, res) => {
  const { name, code, address, city, state, country, contactPerson, phone, email, notes } = req.body;
  if (!name || !code || !city) {
    return res.status(400).json({ message: 'name, code, and city are required.' });
  }
  const item = await Warehouse.create({ name, code: code.toUpperCase(), address, city, state, country, contactPerson, phone, email, notes });
  res.status(201).json(item);
});

// PUT /api/warehouses/:id
export const update = asyncHandler(async (req, res) => {
  const { name, code, address, city, state, country, contactPerson, phone, email, status, notes } = req.body;
  const item = await Warehouse.findByIdAndUpdate(
    req.params.id,
    { name, code: code?.toUpperCase(), address, city, state, country, contactPerson, phone, email, status, notes },
    { new: true, runValidators: true }
  );
  if (!item) return res.status(404).json({ message: 'Warehouse not found.' });
  res.json(item);
});

// PATCH /api/warehouses/:id/status
export const updateStatus = asyncHandler(async (req, res) => {
  const item = await Warehouse.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  if (!item) return res.status(404).json({ message: 'Warehouse not found.' });
  res.json(item);
});

// DELETE /api/warehouses/:id
export const remove = asyncHandler(async (req, res) => {
  const item = await Warehouse.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Warehouse not found.' });
  res.json({ message: 'Warehouse deleted.' });
});

