
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/catalog';
import { previewProducts } from '../data/previewProducts';
import './PetStore.css';

const money = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(Number(value) || 0);

export default function ShopNow() {
  const [live, setLive] = useState([]);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('featured');
  const [page, setPage] = useState(1);

  const load = () => {
    setLoading(true);

    getProducts()
      .then((response) => {
        setLive(
          Array.isArray(response.products)
            ? response.products
            : []
        );
        setFailed(false);
      })
      .catch(() => {
        setFailed(true);
        setLive([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const preview = failed || (!loading && live.length === 0);
  const products = preview ? previewProducts : live;

  const categories = useMemo(
    () => [
      'All',
      ...new Set(
        products.map((product) =>
          String(product.category || 'Other')
        )
      )
    ],
    [products]
  );

  const filtered = useMemo(() => {
    let items = products.filter(
      (product) =>
        (category === 'All' ||
          String(product.category || 'Other') === category) &&
        [product.name, product.description, product.category].some(
          (value) =>
            String(value || '')
              .toLowerCase()
              .includes(query.toLowerCase())
        )
    );

    if (sort === 'low') {
      items.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sort === 'high') {
      items.sort((a, b) => Number(b.price) - Number(a.price));
    }

    if (sort === 'name') {
      items.sort((a, b) => a.name.localeCompare(b.name));
    }

    return items;
  }, [products, category, query, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / 15));
  const current = Math.min(page, pages);

  return (
    <main className="vv-store">
      <section className="vv-store-banner">
        <div className="vv-store-shell">
          <h1>All Products</h1>
          <p>
            <Link to="/">Home</Link> › All Products
          </p>
        </div>

        <img
          src="/beta/node/images/why-cho.png"
          alt="Dogs and cats"
        />
      </section>

      <section className="vv-store-shell vv-store-section">

        {!preview && (
          <div className="vv-store-filters">
            <input
              type="search"
              placeholder="Search pet products..."
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
            />

            <select
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                setPage(1);
              }}
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="low">Price low to high</option>
              <option value="high">Price high to low</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
        )}

        {loading ? (
          <p>Loading products…</p>
        ) : (
          <>
            <div className="vv-store-grid">
              {filtered
                .slice((current - 1) * 15, current * 15)
                .map((item, index) => (
                  <article
                    className="vv-store-product"
                    key={item.id || item.slug}
                  >
                    <Link
                      to={
                        item.preview
                          ? '/product-details?preview=' +
                            encodeURIComponent(item.slug)
                          : '/shop/' +
                            encodeURIComponent(item.slug)
                      }
                    >
                      <div className="vv-store-photo">
                        <span
                          className={
                            'vv-store-badge ' +
                            (index % 3 === 1 ? 'sale' : '')
                          }
                        >
                          {index % 3 === 1 ? 'Sale!' : 'New'}
                        </span>

                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            loading="lazy"
                          />
                        ) : (
                          <span>Image coming soon</span>
                        )}
                      </div>

                      <div
                        className="vv-stars"
                        aria-label="Rating not available"
                      >
                        ★★★★
                        <span className="vv-star-dim">★</span>
                        <small>
                          {item.preview
                            ? 'Sample product'
                            : 'Reviews not yet available'}
                        </small>
                      </div>

                      <h3>{item.name}</h3>
                    </Link>

                    <strong>{money(item.price)}</strong>
                  </article>
                ))}
            </div>

            {pages > 1 && (
              <nav
                className="vv-store-pagination"
                aria-label="Product pagination"
              >
                {Array.from({ length: pages }, (_, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => setPage(index + 1)}
                    aria-current={
                      current === index + 1
                        ? 'page'
                        : undefined
                    }
                  >
                    {index + 1}
                  </button>
                ))}
              </nav>
            )}
          </>
        )}
      </section>
    </main>
  );
}
