import Service from '../models/Service.js';
import asyncHandler from '../utils/asyncHandler.js';

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

export const getAll = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.featuredOnHome === 'true') filter.featuredOnHome = true;
  const items = await Service.find(filter).sort({ displayOrder: 1, createdAt: -1 });
  res.json(items);
});

export const getPublic = asyncHandler(async (req, res) => {
  const filter = { status: 'Active' };
  if (req.query.featuredOnHome === 'true') filter.featuredOnHome = true;
  const items = await Service.find(filter).sort({ displayOrder: 1, createdAt: -1 });
  res.json(items);
});

export const getOne = asyncHandler(async (req, res) => {
  const item = await Service.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

export const getBySlug = asyncHandler(async (req, res) => {
  const item = await Service.findOne({ slug: req.params.slug });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

export const create = asyncHandler(async (req, res) => {
  const payload = normalizeServicePayload(req.body);
  const item = await Service.create(payload);
  res.status(201).json(item);
});

export const update = asyncHandler(async (req, res) => {
  const payload = normalizeServicePayload(req.body);
  const item = await Service.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

export const remove = asyncHandler(async (req, res) => {
  const item = await Service.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

export const updateFeatured = asyncHandler(async (req, res) => {
  const item = await Service.findByIdAndUpdate(
    req.params.id,
    { featuredOnHome: req.body.featuredOnHome },
    { new: true }
  );
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

