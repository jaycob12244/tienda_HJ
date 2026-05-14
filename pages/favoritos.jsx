import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Icon           from '../components/ui/Icon';
import SneakerStage   from '../components/ui/SneakerStage';
import NavBar         from '../components/layout/NavBar';
import Footer         from '../components/layout/Footer';
import CartDrawer     from '../components/cart/CartDrawer';
import SearchOverlay  from '../components/cart/SearchOverlay';
import QuickViewModal from '../components/product/QuickViewModal';
import { useApp }                              from '../context/AppContext';
import { getAllProducts, getFavoriteProducts } from '../services/productService';

export default function Favoritos() {
  const app    = useApp();
  const router = useRouter();

  const [allProducts, setAllProducts] = useState([]);
  const [quickView,   setQuickView]   = useState(null);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    getAllProducts().then(data => {
      if (data) setAllProducts(data);
      setLoading(false);
    });
  }, []);

  const products = getFavoriteProducts(app.favorites, allProducts);

  return (
    <>
      <Head><title>Favoritos — AURIX</title></Head>
      <div className="app-shell">
        <NavBar />
        <main>
          <section className="shop-hero">
            <div className="container container--wide shop-hero__inner">
              <div className="eyebrow shop-hero__eyebrow">Tu wishlist</div>
              <h1 className="shop-hero__title"><span className="editorial">Favoritos</span></h1>
              <p className="shop-hero__sub">
                {loading
                  ? 'Cargando…'
                  : products.length === 0
                    ? 'Aún no tienes modelos guardados.'
                    : `${products.length} modelo${products.length > 1 ? 's' : ''} guardado${products.length > 1 ? 's' : ''}.`
                }
              </p>
            </div>
          </section>

          <div className="shop-grid-wrap">
            <div className="container container--wide">
              {!loading && products.length === 0 ? (
                <div className="fav-empty">
                  <div className="fav-empty__icon"><Icon name="heart" size={28} /></div>
                  <h2 className="fav-empty__title">Tu wishlist está vacía</h2>
                  <p className="fav-empty__sub">
                    Guarda los modelos que más te gusten desde la tienda o el visor de producto.
                  </p>
                  <button className="btn btn--primary" onClick={() => router.push('/tienda')}>
                    Explorar tienda
                  </button>
                </div>
              ) : (
                <div className="shop-grid">
                  {products.map(p => (
                    <article key={p.id} className="sh-card" onClick={() => setQuickView(p)}>
                      <div className="sh-card__media">
                        {p.image
                          ? <img src={p.image} alt={p.name} className="sh-card__img" />
                          : <SneakerStage label={p.name} />
                        }
                        <span className="sh-card__badge mono">{p.badge}</span>
                        <button
                          className="sh-card__fav is-on"
                          onClick={e => { e.stopPropagation(); app.toggleFav(p.id); }}
                          aria-label="Quitar de favoritos"
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

      {quickView && (
        <QuickViewModal
          product={quickView}
          allProducts={allProducts}
          onClose={() => setQuickView(null)}
        />
      )}
      <CartDrawer />
      <SearchOverlay />
    </>
  );
}
