import mongoose from 'mongoose';

const technicalProcedureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'wrench' },
}, { _id: false });

const productSchema = new mongoose.Schema({
  // Core identity
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  displayTitle: { type: String },
  category: { type: String, required: true },
  sku: { type: String, index: true },

  // Hero / page content
  subtitle: { type: String },
  description: { type: String, required: true },

  // Pricing
  price: { type: Number, required: true },
  oldPrice: { type: Number, default: null },
  saleLabel: { type: String },

  // Images
  imageUrl: { type: String },
  gallery: [{ type: String }],

  // Product attributes
  highlights: [{ type: String }],
  technicalProcedures: [technicalProcedureSchema],

  // Specs
  capacity: { type: String },
  voltage: { type: String },
  cycleLife: { type: String },
  chemistrType: { type: String },
  ipRating: { type: String },
  dimensions: { type: String },
  weight: { type: String },
  operatingTemp: { type: String },

  // Meta
  warrantyMonths: { type: Number, default: 60 },
  shipping: { type: String, default: 'Australia Wide' },
  stockStatus: { type: String, enum: ['In Stock', 'Low Stock', 'Out of Stock'], default: 'In Stock' },
  rating: { type: Number, default: 4.8, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },

  // Certifications
  certifications: [{ type: String }],

  // WhatsApp
  whatsappMessage: { type: String },

  // Inventory
  currentStock: { type: Number, default: 0, min: 0 },
  minStock: { type: Number, default: 10 },
  reorderLevel: { type: Number, default: 15 },
  location: { type: String, default: '' },
  warehouseStocks: [{
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
    stock: { type: Number, default: 0, min: 0 }
  }],

  // Display
  displayOrder: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  featuredOnHome: { type: Boolean, default: false },
}, { timestamps: true });

// Indexes for common queries
productSchema.index({ displayOrder: 1, createdAt: -1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ category: 1, status: 1, displayOrder: 1, createdAt: -1 });
productSchema.index({ featuredOnHome: 1, status: 1, displayOrder: 1, createdAt: -1 });


// Auto-generate whatsappMessage if not provided
productSchema.pre('save', async function () {
  if (!this.whatsappMessage) {
    this.whatsappMessage = `Hello, I would like to buy the ${this.name}. Please share the details.`;
  }
});

productSchema.pre('findOneAndUpdate', async function () {
  const update = this.getUpdate();
  if (update && !update.whatsappMessage && update.name) {
    update.whatsappMessage = `Hello, I would like to buy the ${update.name}. Please share the details.`;
  }
});

export default mongoose.model('Product', productSchema);
