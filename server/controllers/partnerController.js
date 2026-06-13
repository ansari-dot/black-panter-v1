import Partner from '../models/Partner.js';

export const getAll = async (req, res, next) => {
  try {
    const items = await Partner.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json(items);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const item = await Partner.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const item = await Partner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const item = await Partner.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (error) {
    next(error);
  }
};
