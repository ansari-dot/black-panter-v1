/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TInquiry {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  service?: string;
  subject: string;
  message: string;
  date: string;
  status: 'New' | 'Read' | 'Replied';
  type?: 'inquiry' | 'quote';
  quoteDetails?: {
    batteryType?: string;
    quantity?: string;
    location?: string;
    address?: string;
    billingAddress?: string;
    abn?: string;
    urgency?: string;
    sourcePage?: string;
    sourceButton?: string;
    submittedAt?: string;
  };
  replyText?: string;
  replyDate?: string;
}

export interface TService {
  id: string;
  name: string;
  title?: string;
  slug: string;
  status: 'Active' | 'Inactive';
  description: string;
  category?: string;
  iconName: string;
  serviceTagline?: string;
  heroDescription?: string;
  imageUrl?: string;
  detailImageUrl?: string;
  ctaText?: string;
  secondaryText?: string;
  keyHighlights?: string[];
  technicalProcedures?: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  gallery?: string[];
  displayOrder?: number;
  featuredOnHome?: boolean;
}

export interface TProduct {
  id: string;
  name: string;
  slug: string;
  displayTitle?: string;
  category: string;
  sku?: string;
  subtitle?: string;
  description: string;
  price: number;
  oldPrice?: number;
  saleLabel?: string;
  imageUrl?: string;
  gallery?: string[];
  highlights?: string[];
  technicalProcedures?: Array<{ title: string; description: string; icon?: string }>;
  capacity?: string;
  voltage?: string;
  cycleLife?: string;
  chemistrType?: string;
  ipRating?: string;
  dimensions?: string;
  weight?: string;
  operatingTemp?: string;
  warrantyMonths?: number;
  shipping?: string;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  rating?: number;
  reviewCount?: number;
  certifications?: string[];
  whatsappMessage?: string;
  displayOrder?: number;
  status?: 'Active' | 'Inactive';
  featuredOnHome?: boolean;
  addedDate: string;
  // Inventory
  currentStock?: number;
  minStock?: number;
  reorderLevel?: number;
  location?: string;
  warehouseStocks?: Array<{
    _id?: string;
    warehouse: string | { _id: string; name: string; code: string; city?: string };
    stock: number;
  }>;
}

export interface TSystemStatus {
  apiServer: 'Operational' | 'Degraded' | 'Offline';
  database: 'Operational' | 'Degraded' | 'Offline';
  cdn: 'Operational' | 'Degraded' | 'Offline';
  lastDeploy: string;
}

export interface TDashboardStats {
  newInquiriesCount: number;
  activeServicesCount: number;
  productsCount: number;
  siteVisitsCount: number;
  inquiriesTrend: string;
  servicesTrend: string;
  productsTrend: string;
  visitsTrend: string;
}

export interface TSystemLog {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  source: string;
}

export interface TTeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'Active' | 'On Leave';
  joinedDate: string;
  image?: string;
  linkedin?: string;
}

export interface TTestimonial {
  _id: string;
  name: string;
  company: string;
  rating: number;
  message: string;
  image?: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  createdAt: string;
}

export interface TEquipmentItem {
  _id?: string;
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  displayOrder?: number;
}

export interface TPartnerItem {
  _id?: string;
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  displayOrder?: number;
}

export interface TProject {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  category?: string;
  status: 'Active' | 'Inactive';
  imageUrl?: string;
  heroTag?: string;
  heroTitleLine1White?: string;
  heroTitleLine1Orange?: string;
  heroTitleLine2White?: string;
  heroTitleLine2Orange?: string;
  gallery?: string[];
  highlights?: string[];
  metrics?: Array<{ label: string; value: string }>;
  process?: string[];
  clientName?: string;
  location?: string;
  sector?: string;
  completedDate?: string;
  timeline?: string;
  unitsInstalled?: string;
  uptime?: string;
  displayOrder?: number;
  featuredOnHome?: boolean;
}

export type TTab = 'dashboard' | 'services' | 'products' | 'inquiries' | 'team' | 'testimonials' | 'settings' | 'partners' | 'projects' | 'homePage' | 'inventory' | 'warehouses' | 'categories' | 'homepageProducts' | 'homepageServices' | 'homepageProjects' | 'quotations' | 'createQuotation' | 'quotationTemplates';

export interface TWarehouse {
  _id: string;
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  country: string;
  contactPerson: string;
  phone: string;
  email: string;
  status: 'Active' | 'Inactive';
  notes: string;
  createdAt: string;
}

export interface TStockMovement {
  _id: string;
  product: {
    _id: string;
    name: string;
    sku?: string;
    imageUrl?: string;
    category?: string;
  };
  warehouse?: {
    _id: string;
    name: string;
    code: string;
    city?: string;
  } | null;
  type: 'in' | 'out';
  quantity: number;
  note: string;
  by: string;
  stockBefore: number;
  stockAfter: number;
  createdAt: string;
}

export interface TInventorySummary {
  totalProducts: number;
  totalStock: number;
  inventoryValue: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export interface TCategory {
  _id: string;
  id: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface TQuotation {
  id?: string;
  _id?: string;
  quoteNo: string;
  quoteDate: string;
  expiryDate: string;
  preparedBy?: string;
  salesRep?: string;
  projectName?: string;
  customerRef?: string;
  poReference?: string;
  client: {
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    siteAddress: string;
    billingAddress: string;
    abn: string;
  };
  battery: {
    batteryType: string;
    manufacturer: string;
    model: string;
    voltage: string;
    capacity: string;
    cells: string;
    banks: string;
    installYear: string;
    location: string;
  };
  description: string;
  serviceCategory: string;
  scopeOfWork: Array<{ name: string; checked: boolean }>;
  materials: Array<{ desc: string; partNo: string; qty: number; unit: string; price: number }>;
  labour: Array<{ desc: string; hours: number; rate: number }>;
  equipment: Array<{ name: string; checked: boolean }>;
  additionalCharges: Array<{ desc: string; amount: number }>;
  terms: string[];
  notes: string[];
  internalNotes?: string;
  customerNotes?: string;
  validityDays: number;
  requireSignature: boolean;
  showBankDetails: boolean;
  bankName?: string;
  accountName?: string;
  bsb?: string;
  accountNumber?: string;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  taxRate?: number;
  currency?: string;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Expired';
  grandTotal: number;
  inquiryId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

