const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// ─── resolve uploaded image paths ────────────────────────────────────────────
export const resolveImageUrl = (path = '') => {
  if (!path) return '';
  if (path.startsWith('/uploads/') || path.startsWith('uploads/'))
    return `${BASE_URL}/${path.replace(/^\//, '')}`;
  return path;
};

// ─── core fetch wrapper ───────────────────────────────────────────────────────
async function request(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `Request failed: ${res.status}`);
  return data;
}

// ─── Products ─────────────────────────────────────────────────────────────────
export const productsApi = {
  /** GET /api/products?status=Active&page=1&limit=12&category=...&featuredOnHome=true&search=...&maxPrice=...&stockStatus=...&sort=... */
  getAll: ({ page = 1, limit = 12, status, category, featuredOnHome, search, maxPrice, stockStatus, sort } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (status)          params.set('status', status);
    if (category)        params.set('category', category);
    if (featuredOnHome)  params.set('featuredOnHome', 'true');
    if (search)          params.set('search', search);
    if (maxPrice)        params.set('maxPrice', maxPrice);
    if (stockStatus)     params.set('stockStatus', stockStatus);
    if (sort)            params.set('sort', sort);
    return request(`/api/products?${params}`);
  },

  /** GET /api/products/slug/:slug */
  getBySlug: (slug) => request(`/api/products/slug/${slug}`),

  /** GET /api/products/:id */
  getById: (id) => request(`/api/products/${id}`),
};

// ─── Services ─────────────────────────────────────────────────────────────────
export const servicesApi = {
  /** GET /api/services/public */
  getPublic: () => request('/api/services/public'),
};

// ─── Projects ─────────────────────────────────────────────────────────────────
export const projectsApi = {
  /** GET /api/projects/public */
  getPublic: () => request('/api/projects/public'),

  /** GET /api/projects/slug/:slug */
  getBySlug: (slug) => request(`/api/projects/slug/${slug}`),
};

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const testimonialsApi = {
  /** GET /api/testimonials */
  getAll: () => request('/api/testimonials'),
};

// ─── Team ─────────────────────────────────────────────────────────────────────
export const teamApi = {
  /** GET /api/team */
  getAll: () => request('/api/team'),
};

// ─── Inquiries ────────────────────────────────────────────────────────────────
export const inquiriesApi = {
  /** POST /api/inquiries */
  create: (body) =>
    request('/api/inquiries', { method: 'POST', body: JSON.stringify(body) }),
};

export default BASE_URL;
