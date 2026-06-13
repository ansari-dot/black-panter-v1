import Testimonial from '../models/Testimonial.js';
import upload from '../middleware/upload.js';

const runUpload = (req, res) =>
  new Promise((resolve, reject) => {
    upload.single('image')(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

export const getAll = async (req, res) => {
  try {
    const items = await Testimonial.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOne = async (req, res) => {
  try {
    const item = await Testimonial.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const create = async (req, res) => {
  try {
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
  } catch (err) {
    console.error('Testimonial create error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

export const update = async (req, res) => {
  try {
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
  } catch (err) {
    console.error('Testimonial update error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const item = await Testimonial.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
