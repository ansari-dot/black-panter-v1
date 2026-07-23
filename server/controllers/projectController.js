import Project from '../models/Project.js';
import asyncHandler from '../utils/asyncHandler.js';

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

export const getAll = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.featuredOnHome === 'true') filter.featuredOnHome = true;
  const items = await Project.find(filter).sort({ displayOrder: 1, createdAt: -1 });
  res.json(items);
});

export const getPublic = asyncHandler(async (req, res) => {
  const filter = { status: 'Active' };
  if (req.query.featuredOnHome === 'true') filter.featuredOnHome = true;
  const items = await Project.find(filter).sort({ displayOrder: 1, createdAt: -1 });
  res.json(items);
});

export const getOne = asyncHandler(async (req, res) => {
  const item = await Project.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

export const getBySlug = asyncHandler(async (req, res) => {
  const item = await Project.findOne({ slug: req.params.slug });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

export const create = asyncHandler(async (req, res) => {
  const payload = normalizePayload(req.body);
  const item = await Project.create(payload);
  res.status(201).json(item);
});

export const update = asyncHandler(async (req, res) => {
  const payload = normalizePayload(req.body);
  const item = await Project.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

export const remove = asyncHandler(async (req, res) => {
  const item = await Project.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

export const updateFeatured = asyncHandler(async (req, res) => {
  const item = await Project.findByIdAndUpdate(
    req.params.id,
    { featuredOnHome: req.body.featuredOnHome },
    { new: true }
  );
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

