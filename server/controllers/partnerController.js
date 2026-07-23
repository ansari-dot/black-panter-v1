import Partner from '../models/Partner.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAll = asyncHandler(async (req, res) => {
  const items = await Partner.find().sort({ displayOrder: 1, createdAt: -1 });
  res.json(items);
});

export const create = asyncHandler(async (req, res) => {
  const item = await Partner.create(req.body);
  res.status(201).json(item);
});

export const update = asyncHandler(async (req, res) => {
  const item = await Partner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

export const remove = asyncHandler(async (req, res) => {
  const item = await Partner.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

