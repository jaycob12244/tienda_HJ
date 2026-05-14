import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import NavBar    from '../components/layout/NavBar';
import Footer    from '../components/layout/Footer';
import Icon      from '../components/ui/Icon';
import SneakerStage from '../components/ui/SneakerStage';
import QuickViewModal from '../components/product/QuickViewModal';
import CartDrawer     from '../components/cart/CartDrawer';
import SearchOverlay  from '../components/cart/SearchOverlay';

import { useApp } from '../context/AppContext';
import { PRODUCTS, EXTERNAL_PRODUCTS, FILTERS } from '../data/products';

const ALL_PRODUCTS = [
  ...EXTERNAL_PRODUCTS,
  ...PRODUCTS.map(p => ({ ...p, brand: 'Aurix' })),
];

export default function Tienda() {
  const router = useRouter();
  const app    = useApp();
  const [activeFilter, setActiveFilter] = useState('todos');
  const [quickView, setQuickView]       = useState(null);

  useEffect(() => {
    const cat = router.query.categoria;
    if (cat) setActiveFilter(cat);
  }, [router.query.categoria]);

  const filtered = activeFilter === 'todos'
    ? ALL_PRODUCTS
    : ALL_PRODUCTS.filter(p => p.category === activeFilter);

  return (
    <>
      <Head>
        <title>Tienda — AURIX</title>
      </Head>

      <div className="app-shell">
        <NavBar />

        <main>
          {/* Hero */}
          <section className="shop-hero">
            <div className="container container--wide shop-hero__inner">
              <div className="eyebrow shop-hero__eyebrow">Colección SS26 · Drop 04</div>
              <h1 className="shop-hero__title">
                La <span className="editorial">Tienda</span>
              </h1>
              <p className="shop-hero__sub">
                Nike · Adidas · Aurix — todo en un solo lugar.
              </p>
            </div>
          </section>

          {/* Sticky filter bar */}
          <div className="shop-filters-bar">
            <div className="container container--wide shop-filters">
              {FILTERS.map(f => (
                <button
                  key={f.id}
                  className={`shop-filter${activeFilter === f.id ? ' is-on' : ''}`}
                  onClick={() => setActiveFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product grid */}
          <div className="shop-grid-wrap">
            <div className="container container--wide">
              {filtered.length === 0 ? (
                <div className="shop-empty">
                  <span className="mono">Sin productos en esta categoría</span>
                </div>
              ) : (
                <div className="shop-grid">
                  {filtered.map(p => (
                    <article
                      key={p.id}
                      className="sh-card"
                      onClick={() => setQuickView(p)}
                    >
                      <div className="sh-card__media">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="sh-card__img" />
                        ) : (
                          <SneakerStage label={p.name} />
                        )}
                        <span className="sh-card__badge mono">{p.badge}</span>
                        <button
                          className={`sh-card__fav${app.favorites.has(p.id) ? ' is-on' : ''}`}
                          onClick={e => { e.stopPropagation(); app.toggleFav(p.id); }}
                          aria-label="Favorito"
                        >
                          <Icon name="heart" size={14} />
                        </button>
                      </div>
                      <div className="sh-card__info">
                        <div className="sh-card__brand eyebrow">{p.brand}</div>
                        <div className="sh-card__name">{p.name}</div>
                        <div className="sh-card__row">
                          <span className="mono sh-card__price">{p.currency}{p.price}</span>
                          <span className="sh-card__arrow">
                            <Icon name="arrow-up-right" size={13} />
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {quickView && (
        <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
      )}
      <CartDrawer />
      <SearchOverlay />
    </>
  );
}
