import Quotation from '../models/Quotation.js';
import Inquiry from '../models/Inquiry.js';
import { sendQuotationEmail } from '../utils/emailService.js';
import { generateQuotationEmailHTML } from '../utils/emailTemplate.js';
import asyncHandler from '../utils/asyncHandler.js';
import Notification from '../models/Notification.js';

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

  // Fire email in background — don't block the response
  if (req.body.sendEmail && req.body.emailDetails) {
    const html = generateQuotationEmailHTML(item, req.body.emailDetails.body || '');
    sendQuotationEmail({
      to: req.body.emailDetails.to || item.client.email,
      subject: req.body.emailDetails.subject || `Quotation ${item.quoteNo}`,
      html,
      text: req.body.emailDetails.body || ''
    })
    .then(() => {
      return Notification.create({
        type: 'QUOTATION_SENT',
        title: 'Quotation Sent',
        message: `Quotation ${item.quoteNo} was sent to ${item.client.email}`,
        link: `/admin/quotations`,
      });
    })
    .catch(err => console.error('[Email] Failed to send quotation email:', err.message));
  }

  res.status(201).json(item);
});

export const update = asyncHandler(async (req, res) => {
  const payload = normalizePayload(req.body);
  const item = await Quotation.findByIdAndUpdate(req.params.id, payload, { returnDocument: 'after', runValidators: true });
  if (!item) return res.status(404).json({ message: 'Not found' });

  // Fire email in background — don't block the response
  if (req.body.sendEmail && req.body.emailDetails) {
    const html = generateQuotationEmailHTML(item, req.body.emailDetails.body || '');
    sendQuotationEmail({
      to: req.body.emailDetails.to || item.client.email,
      subject: req.body.emailDetails.subject || `Quotation ${item.quoteNo}`,
      html,
      text: req.body.emailDetails.body || ''
    })
    .then(() => {
      return Notification.create({
        type: 'QUOTATION_SENT',
        title: 'Quotation Sent',
        message: `Quotation ${item.quoteNo} was sent to ${item.client.email}`,
        link: `/admin/quotations`,
      });
    })
    .catch(err => console.error('[Email] Failed to send quotation email:', err.message));
  }

  res.json(item);
});

export const remove = asyncHandler(async (req, res) => {
  const item = await Quotation.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

export const getMyQuotations = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.email) return res.status(401).json({ message: 'User email not found' });
  
  const userEmailRegex = new RegExp(`^${req.user.email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
  
  const [formalQuotes, inquiries] = await Promise.all([
    Quotation.find({
      $or: [
        { 'client.email': userEmailRegex },
        { user: req.user._id }
      ]
    }).sort({ createdAt: -1 }),
    Inquiry.find({
      $or: [
        { email: userEmailRegex },
        { user: req.user._id }
      ]
    }).sort({ createdAt: -1 })
  ]);

  const formattedInquiries = inquiries.map(inq => ({
    _id: inq._id,
    quoteNo: `REQ-${inq._id.toString().slice(-6).toUpperCase()}`,
    quoteDate: inq.createdAt ? new Date(inq.createdAt).toISOString().split('T')[0] : '',
    createdAt: inq.createdAt,
    updatedAt: inq.updatedAt,
    projectName: inq.subject || inq.service || 'Quote Request',
    description: inq.message,
    status: inq.status === 'replied' ? 'Replied' : 'Submitted Request',
    grandTotal: 0,
    isRequest: true,
    client: {
      companyName: inq.company || '',
      contactPerson: inq.name || '',
      email: inq.email || '',
      phone: inq.phone || '',
      siteAddress: inq.quoteDetails?.address || '',
      billingAddress: inq.quoteDetails?.billingAddress || '',
      abn: inq.quoteDetails?.abn || ''
    },
    battery: {
      batteryType: inq.quoteDetails?.batteryType || '',
      quantity: inq.quoteDetails?.quantity || '',
      location: inq.quoteDetails?.location || ''
    }
  }));

  const allItems = [...formalQuotes, ...formattedInquiries].sort((a, b) => 
    new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  );

  res.json(allItems);
});

