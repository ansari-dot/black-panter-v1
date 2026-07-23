import mongoose from 'mongoose';

const quotationSchema = new mongoose.Schema({
  quoteNo: { type: String, required: true, unique: true, trim: true },
  quoteDate: { type: String, required: true },
  expiryDate: { type: String, required: true },
  preparedBy: { type: String, default: '' },
  salesRep: { type: String, default: '' },
  projectName: { type: String, default: '' },
  customerRef: { type: String, default: '' },
  poReference: { type: String, default: '' },
  client: {
    companyName: { type: String, default: '' },
    contactPerson: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    siteAddress: { type: String, default: '' },
    billingAddress: { type: String, default: '' },
    abn: { type: String, default: '' }
  },
  battery: {
    batteryType: { type: String, default: '' },
    manufacturer: { type: String, default: '' },
    model: { type: String, default: '' },
    voltage: { type: String, default: '' },
    capacity: { type: String, default: '' },
    cells: { type: String, default: '' },
    banks: { type: String, default: '' },
    installYear: { type: String, default: '' },
    location: { type: String, default: '' }
  },
  description: { type: String, default: '' },
  serviceCategory: { type: String, default: '' },
  scopeOfWork: [{
    name: { type: String },
    checked: { type: Boolean, default: true }
  }],
  materials: [{
    desc: { type: String },
    partNo: { type: String, default: '' },
    qty: { type: Number, default: 0 },
    unit: { type: String, default: 'PCS' },
    price: { type: Number, default: 0 }
  }],
  labour: [{
    desc: { type: String },
    hours: { type: Number, default: 0 },
    rate: { type: Number, default: 0 }
  }],
  equipment: [{
    name: { type: String },
    checked: { type: Boolean, default: true }
  }],
  additionalCharges: [{
    desc: { type: String },
    amount: { type: Number, default: 0 }
  }],
  terms: { type: [String], default: [] },
  notes: { type: [String], default: [] },
  internalNotes: { type: String, default: '' },
  customerNotes: { type: String, default: '' },
  validityDays: { type: Number, default: 30 },
  requireSignature: { type: Boolean, default: false },
  showBankDetails: { type: Boolean, default: false },
  bankName: { type: String, default: '' },
  accountName: { type: String, default: '' },
  bsb: { type: String, default: '' },
  accountNumber: { type: String, default: '' },
  status: { type: String, enum: ['Draft', 'Sent', 'Sent Email', 'Pending', 'Accepted', 'Expired'], default: 'Draft' },
  grandTotal: { type: Number, default: 0 },
  inquiryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inquiry', default: null }
}, { timestamps: true });

quotationSchema.index({ createdAt: -1 });
quotationSchema.index({ inquiryId: 1 });

export default mongoose.model('Quotation', quotationSchema);

