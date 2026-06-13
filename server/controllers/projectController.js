import Project from '../models/Project.js';

const normalizePayload = (payload = {}) => ({
  title: payload.title || '',
  slug: payload.slug || '',
  subtitle: payload.subtitle || '',
  description: payload.description || '',
  category: payload.category || '',
  status: payload.status || 'Active',
  imageUrl: payload.imageUrl || '',
  heroTag: payload.heroTag || 'Project Detail',
  heroTitleLine1White: payload.heroTitleLine1White || payload.title || '',
  heroTitleLine1Orange: payload.heroTitleLine1Orange || '',
  heroTitleLine2White: payload.heroTitleLine2White || '',
  heroTitleLine2Orange: payload.heroTitleLine2Orange || '',
  gallery: Array.isArray(payload.gallery) ? payload.gallery : [],
  highlights: Array.isArray(payload.highlights) ? payload.highlights : [],
  metrics: Array.isArray(payload.metrics) ? payload.metrics : [],
  process: Array.isArray(payload.process) ? payload.process : [],
  clientName: payload.clientName || '',
  location: payload.location || '',
  sector: payload.sector || '',
  completedDate: payload.completedDate || '',
  timeline: payload.timeline || '',
  unitsInstalled: payload.unitsInstalled || '',
  uptime: payload.uptime || '',
  displayOrder: Number.isFinite(Number(payload.displayOrder)) ? Number(payload.displayOrder) : 0,
});

export const getAll = async (req, res, next) => {
  try {
    const items = await Project.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json(items);
  } catch (error) {
    next(error);
  }
};

export const getPublic = async (req, res, next) => {
  try {
    const items = await Project.find({ status: 'Active' }).sort({ displayOrder: 1, createdAt: -1 });
    res.json(items);
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const item = await Project.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

export const getBySlug = async (req, res, next) => {
  try {
    const item = await Project.findOne({ slug: req.params.slug });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const payload = normalizePayload(req.body);
    const item = await Project.create(payload);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const payload = normalizePayload(req.body);
    const item = await Project.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const item = await Project.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (error) {
    next(error);
  }
};
