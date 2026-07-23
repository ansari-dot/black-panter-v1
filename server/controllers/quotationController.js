import Quotation from '../models/Quotation.js';
import { sendQuotationEmail } from '../utils/emailService.js';
import { generateQuotationEmailHTML } from '../utils/emailTemplate.js';
import asyncHandler from '../utils/asyncHandler.js';

const normalizePayload = (p = {}) => ({
  quoteNo: p.quoteNo || '',
  quoteDate: p.quoteDate || '',
  expiryDate: p.expiryDate || '',
  preparedBy: p.preparedBy || '',
  salesRep: p.salesRep || '',
  projectName: p.projectName || '',
  customerRef: p.customerRef || '',
  poReference: p.poReference || '',
  client: {
    companyName: p.client?.companyName || '',
    contactPerson: p.client?.contactPerson || '',
    email: p.client?.email || '',
    phone: p.client?.phone || '',
    siteAddress: p.client?.siteAddress || '',
    billingAddress: p.client?.billingAddress || '',
    abn: p.client?.abn || ''
  },
  battery: {
    batteryType: p.battery?.batteryType || '',
    manufacturer: p.battery?.manufacturer || '',
    model: p.battery?.model || '',
    voltage: p.battery?.voltage || '',
    capacity: p.battery?.capacity || '',
    cells: p.battery?.cells || '',
    banks: p.battery?.banks || '',
    installYear: p.battery?.installYear || '',
    location: p.battery?.location || ''
  },
  description: p.description || '',
  serviceCategory: p.serviceCategory || '',
  scopeOfWork: Array.isArray(p.scopeOfWork) ? p.scopeOfWork : [],
  materials: Array.isArray(p.materials) ? p.materials : [],
  labour: Array.isArray(p.labour) ? p.labour : [],
  equipment: Array.isArray(p.equipment) ? p.equipment : [],
  additionalCharges: Array.isArray(p.additionalCharges) ? p.additionalCharges : [],
  terms: Array.isArray(p.terms) ? p.terms : [],
  notes: Array.isArray(p.notes) ? p.notes : [],
  internalNotes: p.internalNotes || '',
  customerNotes: p.customerNotes || '',
  validityDays: Number(p.validityDays) || 30,
  requireSignature: p.requireSignature === true,
  showBankDetails: p.showBankDetails === true,
  bankName: p.bankName || '',
  accountName: p.accountName || '',
  bsb: p.bsb || '',
  accountNumber: p.accountNumber || '',
  status: p.status || 'Draft',
  grandTotal: Number(p.grandTotal) || 0,
  inquiryId: p.inquiryId || null
});

export const getAll = asyncHandler(async (req, res) => {
  const items = await Quotation.find().sort({ createdAt: -1 });
  res.json(items);
});

export const getOne = asyncHandler(async (req, res) => {
  const item = await Quotation.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

export const create = asyncHandler(async (req, res) => {
  const payload = normalizePayload(req.body);
  const item = await Quotation.create(payload);

  // If sent, trigger email delivery
  if (req.body.sendEmail && req.body.emailDetails) {
    try {
      const html = generateQuotationEmailHTML(item, req.body.emailDetails.body || '');
      await sendQuotationEmail({
        to: req.body.emailDetails.to || item.client.email,
        subject: req.body.emailDetails.subject || `Quotation ${item.quoteNo}`,
        html,
        text: req.body.emailDetails.body || ''
      });
    } catch (emailErr) {
      console.error('Failed to send email inside create controller:', emailErr);
    }
  }

  res.status(201).json(item);
});

export const update = asyncHandler(async (req, res) => {
  const payload = normalizePayload(req.body);
  const item = await Quotation.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ message: 'Not found' });

  // If sent, trigger email delivery
  if (req.body.sendEmail && req.body.emailDetails) {
    try {
      const html = generateQuotationEmailHTML(item, req.body.emailDetails.body || '');
      await sendQuotationEmail({
        to: req.body.emailDetails.to || item.client.email,
        subject: req.body.emailDetails.subject || `Quotation ${item.quoteNo}`,
        html,
        text: req.body.emailDetails.body || ''
      });
    } catch (emailErr) {
      console.error('Failed to send email inside update controller:', emailErr);
    }
  }

  res.json(item);
});

export const remove = asyncHandler(async (req, res) => {
  const item = await Quotation.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

