import Team from '../models/Team.js';

export const getAll = async (req, res) => {
  const items = await Team.find().sort({ createdAt: -1 });
  res.json(items);
};

export const getOne = async (req, res) => {
  const item = await Team.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
};

export const create = async (req, res) => {
  const item = await Team.create(req.body);
  res.status(201).json(item);
};

export const update = async (req, res) => {
  const item = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
};

export const updateStatus = async (req, res) => {
  const item = await Team.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
};

export const remove = async (req, res) => {
  await Team.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
