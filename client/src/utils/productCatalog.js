import { resolveImageUrl as resolveUrl } from './api';

const resolveImageUrl = resolveUrl;

const normalizeProductRecord = (product) => {
  const name = product.name || product.displayTitle || '';
  const slug = product.slug || '';
  const imageUrl = resolveImageUrl(product.imageUrl || '');
  const gallery = Array.isArray(product.gallery)
    ? product.gallery.map(resolveImageUrl)
    : [];

  return {
    id: product._id || product.id || slug,
    name,
    slug,
    displayTitle: product.displayTitle || name,
    category: product.category || '',
    sku: product.sku || '',
    subtitle: product.subtitle || '',
    description: product.description || '',
    price: typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0,
    oldPrice: product.oldPrice ? (typeof product.oldPrice === 'number' ? product.oldPrice : parseFloat(product.oldPrice)) : null,
    saleLabel: product.saleLabel || '',
    imageUrl,
    gallery,
    highlights: Array.isArray(product.highlights) ? product.highlights : [],
    technicalProcedures: Array.isArray(product.technicalProcedures) ? product.technicalProcedures : [],
    certifications: Array.isArray(product.certifications) ? product.certifications : [],
    capacity: product.capacity || '',
    voltage: product.voltage || '',
    cycleLife: product.cycleLife || '',
    chemistrType: product.chemistrType || '',
    ipRating: product.ipRating || '',
    dimensions: product.dimensions || '',
    weight: product.weight || '',
    operatingTemp: product.operatingTemp || '',
    warrantyMonths: product.warrantyMonths || null,
    shipping: product.shipping || '',
    stockStatus: product.stockStatus || 'In Stock',
    rating: product.rating || 0,
    reviewCount: product.reviewCount || 0,
    whatsappMessage: product.whatsappMessage || name,
    displayOrder: product.displayOrder || 0,
    status: product.status || 'Active',
  };
};

export const normalizeProductCatalog = (records = []) =>
  records
    .map(normalizeProductRecord)
    .sort((a, b) => {
      const diff = (a.displayOrder || 0) - (b.displayOrder || 0);
      return diff !== 0 ? diff : a.name.localeCompare(b.name);
    });

export const normalizeProduct = (product) => normalizeProductRecord(product);
