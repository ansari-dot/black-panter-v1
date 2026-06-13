import Service from '../models/Service.js';

const DEFAULT_STATUS = 'Active';

const normalizeServicePayload = (payload = {}) => ({
  title: payload.title || payload.name,
  slug: payload.slug,
  description: payload.description || payload.heroDescription || '',
  category: payload.category || '',
  status: payload.status || DEFAULT_STATUS,
  iconName: payload.iconName || payload.icon || 'battery',
  serviceTagline: payload.serviceTagline || '',
  heroDescription: payload.heroDescription || '',
  imageUrl: payload.imageUrl || '',
  detailImageUrl: payload.detailImageUrl || '',
  ctaText: payload.ctaText || '',
  secondaryText: payload.secondaryText || '',
  keyHighlights: Array.isArray(payload.keyHighlights) ? payload.keyHighlights : [],
  technicalProcedures: Array.isArray(payload.technicalProcedures) ? payload.technicalProcedures : [],
  gallery: Array.isArray(payload.gallery) ? payload.gallery : [],
  displayOrder: Number.isFinite(Number(payload.displayOrder)) ? Number(payload.displayOrder) : 0,
});

export const getAll = async (req, res, next) => {
  try {
    const items = await Service.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json(items);
  } catch (error) {
    next(error);
  }
};

export const getPublic = async (req, res, next) => {
  try {
    const items = await Service.find({ status: 'Active' }).sort({ displayOrder: 1, createdAt: -1 });
    res.json(items);
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const item = await Service.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

export const getBySlug = async (req, res, next) => {
  try {
    const item = await Service.findOne({ slug: req.params.slug });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const payload = normalizeServicePayload(req.body);
    const item = await Service.create(payload);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const payload = normalizeServicePayload(req.body);
    const item = await Service.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const item = await Service.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (error) {
    next(error);
  }
};
