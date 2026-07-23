import Testimonial from '../models/Testimonial.js';
import upload from '../middleware/upload.js';
import asyncHandler from '../utils/asyncHandler.js';

const runUpload = (req, res) =>
  new Promise((resolve, reject) => {
    upload.single('image')(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

export const getAll = asyncHandler(async (req, res) => {
  const items = await Testimonial.find().sort({ createdAt: -1 });
  res.json(items);
});

export const getOne = asyncHandler(async (req, res) => {
  const item = await Testimonial.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

export const create = asyncHandler(async (req, res) => {
  await runUpload(req, res);
  const data = {
    name:    req.body.name,
    company: req.body.company,
    message: req.body.message,
    rating:  Number(req.body.rating),
    status:  req.body.status || 'Pending',
  };
  if (req.file) data.image = `/uploads/${req.file.filename}`;
  const item = await Testimonial.create(data);
  res.status(201).json(item);
});

export const update = asyncHandler(async (req, res) => {
  await runUpload(req, res);
  const data = {
    name:    req.body.name,
    company: req.body.company,
    message: req.body.message,
    rating:  Number(req.body.rating),
    status:  req.body.status,
  };
  if (req.file) data.image = `/uploads/${req.file.filename}`;
  const item = await Testimonial.findByIdAndUpdate(req.params.id, data, { new: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

export const updateStatus = asyncHandler(async (req, res) => {
  const item = await Testimonial.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

export const remove = asyncHandler(async (req, res) => {
  await Testimonial.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

