import { resolveImageUrl as resolveUrl } from './api';

export const normalizeProject = (p) => ({
  id: p._id || p.id || '',
  title: p.title || '',
  slug: p.slug || '',
  description: p.subtitle || p.description || '',
  image: resolveUrl(p.imageUrl || p.image || ''),
  gallery: Array.isArray(p.gallery) ? p.gallery.map(resolveUrl) : [],
  gradient: 'linear-gradient(to right, #F06123, #FF8803)',
  category: p.category || '',
  client: p.client || '',
  completedAt: p.completedAt || '',
  displayOrder: p.displayOrder || 0,
  status: p.status || 'Active',
});

export const normalizeProjectCatalog = (records = []) =>
  records
    .map(normalizeProject)
    .sort((a, b) => {
      const diff = (a.displayOrder || 0) - (b.displayOrder || 0);
      return diff !== 0 ? diff : a.title.localeCompare(b.title);
    });
