import Inquiry from '../models/Inquiry.js';
import asyncHandler from '../utils/asyncHandler.js';

const formatStatus = (status = '') => {
    const normalized = String(status).toLowerCase();
    if (normalized === 'read') return 'Read';
    if (normalized === 'replied') return 'Replied';
    return 'New';
};

const formatInquiry = (item) => ({
    id: item._id,
    name: item.name,
    company: item.company || '',
    email: item.email,
    phone: item.phone || '',
    service: item.service || '',
    subject: item.subject || item.service || 'Client inquiry',
    message: item.message,
    type: item.type || 'inquiry',
    quoteDetails: {
        batteryType: item.quoteDetails?.batteryType || '',
        quantity: item.quoteDetails?.quantity || '',
        location: item.quoteDetails?.location || '',
        address: item.quoteDetails?.address || '',
        billingAddress: item.quoteDetails?.billingAddress || '',
        abn: item.quoteDetails?.abn || '',
        urgency: item.quoteDetails?.urgency || '',
        sourcePage: item.quoteDetails?.sourcePage || '',
        sourceButton: item.quoteDetails?.sourceButton || '',
        submittedAt: item.quoteDetails?.submittedAt || '',
    },
    status: formatStatus(item.status),
    replyText: item.replyText || '',
    replyDate: item.replyDate || '',
    date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
});

export const getAll = asyncHandler(async (req, res) => {
    const items = await Inquiry.find().sort({ createdAt: -1 });
    res.json(items.map(formatInquiry));
});

export const getOne = asyncHandler(async (req, res) => {
    const item = await Inquiry.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(formatInquiry(item));
});

export const create = asyncHandler(async (req, res) => {
    const payload = {
        name: req.body.name,
        company: req.body.company || '',
        email: req.body.email,
        phone: req.body.phone || '',
        service: req.body.service || '',
        subject: req.body.subject || req.body.service || '',
        message: req.body.message,
        type: req.body.type === 'quote' ? 'quote' : 'inquiry',
        quoteDetails: req.body.quoteDetails || {},
    };
    const item = await Inquiry.create(payload);
    res.status(201).json(formatInquiry(item));
});

export const updateStatus = asyncHandler(async (req, res) => {
    const update = {};
    if (req.body.status) update.status = String(req.body.status).toLowerCase();
    if (typeof req.body.replyText === 'string') update.replyText = req.body.replyText;
    if (typeof req.body.replyDate === 'string') update.replyDate = req.body.replyDate;

    const item = await Inquiry.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(formatInquiry(item));
});

export const remove = asyncHandler(async (req, res) => {
    const item = await Inquiry.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
});

