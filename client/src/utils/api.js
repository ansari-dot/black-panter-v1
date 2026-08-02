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
    credentials: 'include',
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

  /** GET /api/products/:id/related */
  getRelated: (id) => request(`/api/products/${id}/related`),
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
// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  me: () => request('/api/auth/me'),
  login: (body) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  setupAccount: (body) => request('/api/auth/setup-account', { method: 'POST', body: JSON.stringify(body) }),
  forgotPassword: (body) => request('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify(body) }),
  verifyResetOtp: (body) => request('/api/auth/verify-reset-otp', { method: 'POST', body: JSON.stringify(body) }),
  resetPassword: (body) => request('/api/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
  updateProfile: (body) => request('/api/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),
  getWishlist: () => request('/api/auth/wishlist'),
  addToWishlist: (productId) => request('/api/auth/wishlist/add', { method: 'POST', body: JSON.stringify({ productId }) }),
  removeFromWishlist: (productId) => request('/api/auth/wishlist/remove', { method: 'POST', body: JSON.stringify({ productId }) }),
};

// ─── Orders ──────────────────────────────────────────────────────────────────
export const orderApi = {
  createOrder: (body) => request('/api/orders', { method: 'POST', body: JSON.stringify(body) }),
  processPayment: (id) => request(`/api/orders/${id}/pay`, { method: 'POST' }),
  getMyOrders: () => request('/api/orders/myorders'),
  trackOrder: (id) => request(`/api/orders/track/${id}`),
};

// ─── Quotations ───────────────────────────────────────────────────────────────
export const quotationApi = {
  getMyQuotations: () => request('/api/quotations/my-quotations'),
};

// ─── Cart ─────────────────────────────────────────────────────────────────────
export const cartApi = {
  get: () => request('/api/cart'),
  sync: (localItems) => request('/api/cart/sync', { method: 'POST', body: JSON.stringify({ localItems }) }),
  update: (productId, quantity) => request('/api/cart', { method: 'POST', body: JSON.stringify({ productId, quantity }) }),
  clear: () => request('/api/cart', { method: 'DELETE' }),
};

// ─── Wishlist ─────────────────────────────────────────────────────────────────
export const wishlistApi = {
  get: () => request('/api/wishlist'),
  add: (productId) => request('/api/wishlist/add', { method: 'POST', body: JSON.stringify({ productId }) }),
  remove: (productId) => request(`/api/wishlist/${productId}`, { method: 'DELETE' }),
  clear: () => request('/api/wishlist', { method: 'DELETE' }),
};

export { request };
export default BASE_URL;

// ─── Settings ─────────────────────────────────────────────────────────────────
export const settingsApi = {
  get: () => request('/api/settings'),
};
