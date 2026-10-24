// Connects the site to the VedaVet backend public API (/api/v1/public/*).
// Falls back to the local sample catalogue for products if the backend is unreachable.
import { previewProducts } from '../data/previewProducts';

export const API_BASE =
  window.VEDAVET_API_BASE ||
  (location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    ? 'http://localhost:4000/api/v1'
    : '/beta/node/api/v1');

// Frontend path -> backend public endpoint. Paths not listed have no backend endpoint yet.
const GET_ROUTES = {
  '/products': '/public/products',
  '/branches': '/public/branches',
  '/doctors': '/public/doctors',
  '/services': '/public/services'
};
const POST_ROUTES = {
  '/appointments': '/public/appointments',
  '/orders': '/public/orders'
};

async function call(path, { method = 'GET', body } = {}) {
  const res = await fetch(API_BASE + path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message?.join?.(', ') || data.message || 'Request failed (' + res.status + ')');
  return data;
}

// Backend stores site-relative image paths (/images/...); the site is served under /beta/node/.
const withBase = (url) => (url && url.startsWith('/images/') ? '/beta/node' + url : url);

// Backend products have id/imageUrl/Decimal price; pages expect slug/image_url/number price.
const normalizeProduct = (p) => ({
  ...p,
  slug: p.slug || p.id,
  image_url: withBase(p.image_url || p.imageUrl) || '/beta/node/images/product-image-1.jpg',
  price: p.price == null ? null : Number(p.price)
});

async function loadProducts() {
  try {
    const items = await call(GET_ROUTES['/products']);
    if (Array.isArray(items) && items.length) return items.map(normalizeProduct);
  } catch (err) {
    console.warn('Products API unavailable, showing sample catalogue:', err.message);
  }
  return previewProducts;
}

export async function apiRequest(path, { method = 'GET', body } = {}) {
  if (method !== 'GET') {
    if (!POST_ROUTES[path]) throw new Error('This feature requires a connected backend. No information was submitted.');
    return call(POST_ROUTES[path], { method, body });
  }
  if (path === '/products') return { products: await loadProducts() };
  if (path.startsWith('/products/')) {
    const slug = decodeURIComponent(path.split('/').pop());
    return { product: (await loadProducts()).find((p) => p.slug === slug) || null };
  }
  if (path === '/branches') return { branches: await call(GET_ROUTES[path]) };
  if (path === '/doctors') return { doctors: await call(GET_ROUTES[path]) };
  if (path === '/services') return { services: await call(GET_ROUTES[path]) };
  if (path === '/blogs') return { blogs: [] };
  if (path === '/case-studies') return { cases: [] };
  return {};
}
