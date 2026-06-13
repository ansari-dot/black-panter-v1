import Product from '../models/Product.js';

export const getAll = async (req, res) => {
  const items = await Product.find().sort({ createdAt: -1 });
  res.json(items);
};

export const getOne = async (req, res) => {
  const item = await Product.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
};

export const create = async (req, res) => {
  const item = await Product.create(req.body);
  res.status(201).json(item);
};

export const update = async (req, res) => {
  const item = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
};

export const updateStock = async (req, res) => {
  const item = await Product.findByIdAndUpdate(req.params.id, { stockStatus: req.body.stockStatus }, { new: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
};

export const remove = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
