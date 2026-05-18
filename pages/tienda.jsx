import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import NavBar         from '../components/layout/NavBar';
import Footer         from '../components/layout/Footer';
import Icon           from '../components/ui/Icon';
import SneakerStage   from '../components/ui/SneakerStage';
import QuickViewModal from '../components/product/QuickViewModal';
import CartDrawer     from '../components/cart/CartDrawer';
import SearchOverlay  from '../components/cart/SearchOverlay';

import { useApp }                          from '../context/AppContext';
import { FILTERS }                         from '../data/products';
import { getAllProducts, filterByCategory } from '../services/productService';

export default function Tienda() {
  const router = useRouter();
  const app    = useApp();

  const [allProducts,  setAllProducts]  = useState([]);
  const [activeFilter, setActiveFilter] = useState('todos');
  const [quickView,    setQuickView]    = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(false);
      const data = await getAllProducts();
      if (data === null) {
        setError(true);
      } else {
        setAllProducts(data);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    const cat = router.query.categoria;
    if (cat) setActiveFilter(cat);
  }, [router.query.categoria]);

  const filtered = filterByCategory(allProducts, activeFilter);

  return (
    <>
      <Head><title>Tienda — AURIX</title></Head>
      <div className="app-shell">
        <NavBar />
        <main>
          <section className="shop-hero">
            <div className="container container--wide shop-hero__inner">
              <div className="eyebrow shop-hero__eyebrow">Colección SS26 · Drop 04</div>
              <h1 className="shop-hero__title">La <span className="editorial">Tienda</span></h1>
              <p className="shop-hero__sub">Nike · Adidas · Aurix — todo en un solo lugar.</p>
            </div>
          </section>

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

          <div className="shop-grid-wrap">
            <div className="container container--wide">
              {loading && (
                <div className="shop-grid">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="sh-skeleton">
                      <div className="sh-skeleton__img" />
                      <div className="sh-skeleton__info">
                        <div className="sh-skeleton__line" style={{ width: '40%' }} />
                        <div className="sh-skeleton__line" style={{ width: '70%', height: '12px' }} />
                        <div className="sh-skeleton__line" style={{ width: '30%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {!loading && error && (
                <div className="shop-empty">
                  <Icon name="alert-circle" size={48} className="shop-empty__icon" />
                  <h2 className="shop-empty__title">
                    Algo salió mal<br />
                    <em>cargando la colección</em>
                  </h2>
                  <p className="shop-empty__sub">
                    Revisa tu conexión e intenta de nuevo
                  </p>
                  <button className="btn btn--ghost" onClick={() => window.location.reload()}>
                    Reintentar
                  </button>
                </div>
              )}
              {!loading && !error && filtered.length === 0 && (
                <div className="shop-empty">
                  <Icon name="package" size={48} className="shop-empty__icon" />
                  <h2 className="shop-empty__title">
                    Sin resultados<br />
                    <em>en esta categoría</em>
                  </h2>
                  <p className="shop-empty__sub">
                    Prueba con otro filtro o explora toda la tienda
                  </p>
                  <button className="btn btn--ghost" onClick={() => setActiveFilter('todos')}>
                    Ver todos
                  </button>
                </div>
              )}
              {!loading && !error && filtered.length > 0 && (
                <div className="shop-grid">
                  {filtered.map(p => (
                    <article key={p.id} className="sh-card" onClick={() => setQuickView(p)}>
                      <div className="sh-card__media">
                        {p.image
                          ? <img src={p.image} alt={p.name} className="sh-card__img" />
                          : <SneakerStage label={p.name} />
                        }
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
                          <span className="sh-card__arrow"><Icon name="arrow-up-right" size={13} /></span>
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

      <QuickViewModal
        product={quickView}
        open={quickView !== null}
        allProducts={allProducts}
        onClose={() => setQuickView(null)}
      />
      <CartDrawer />
      <SearchOverlay />
    </>
  );
}
