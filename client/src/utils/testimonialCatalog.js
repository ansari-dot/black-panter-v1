import { resolveImageUrl as resolveUrl } from './api';

export const normalizeTestimonial = (t) => ({
  id: t._id || t.id || '',
  name: t.name || '',
  company: t.company || '',
  message: t.message || t.text || '',
  rating: typeof t.rating === 'number' ? t.rating : 5,
  image: resolveUrl(t.image || t.imageUrl || ''),
  status: t.status || 'Approved',
});

export const normalizeTestimonialCatalog = (records = []) =>
  records
    .map(normalizeTestimonial)
    .filter((t) => t.status === 'Approved');
