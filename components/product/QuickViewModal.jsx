import { useState, useEffect } from 'react';
import Icon from '../ui/Icon';
import SneakerStage from '../ui/SneakerStage';
import { useApp } from '../../context/AppContext';
import { getRelated } from '../../services/productService';

const SIZES  = ['38', '39', '40', '41', '42', '43', '44', '45'];
const COLORS = [
  { id: 0, n: 'Bone', hex: '#E8E5DD' },
  { id: 1, n: 'Onyx', hex: '#0A0A0A' },
  { id: 2, n: 'Cream', hex: '#C9B8A1' },
];

export default function QuickViewModal({ product: initialProduct, onClose }) {
  const app = useApp();
  const [product, setProduct] = useState(initialProduct);
  const [size,    setSize]    = useState(null);
  const [color,   setColor]   = useState(0);

  const related   = getRelated(product);
  const isFav     = app.favorites.has(product.id);

  // Resetear talla/color al cambiar de producto
  useEffect(() => {
    setProduct(initialProduct);
    setSize(null);
    setColor(0);
  }, [initialProduct]);

  useEffect(() => {
    setSize(null);
    setColor(0);
  }, [product.id]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!product) return null;

  return (
    <div className="qv">
      <div className="qv__backdrop" onClick={onClose} />
      <div className="qv__sheet">
        <button className="qv__close" onClick={onClose} aria-label="Cerrar">
          <Icon name="close" size={18} />
        </button>

        <div className="qv__media">
          {product.image
            ? <img src={product.image} alt={product.name} className="qv__real-img" />
            : <SneakerStage label={`${product.name} · drop photo`} />
          }
        </div>

        <div className="qv__panel">
          <div className="eyebrow">{product.category} · {product.badge}</div>
          <div className="qv__name-row">
            <h2 className="qv__name">{product.name}</h2>
            <button
              className={`qv__fav${isFav ? ' is-on' : ''}`}
              onClick={() => app.toggleFav(product.id)}
              aria-label={isFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            >
              <Icon name="heart" size={17} />
            </button>
          </div>
          <div className="qv__sub">{product.desc}</div>

          <div className="qv__rate">
            <Icon name="star" size={13} />
            <span className="mono">{product.rating.toFixed(1)}</span>
            <span className="qv__rate-sep">·</span>
            <span className="mono">421 reseñas</span>
          </div>

          <div className="qv__divide" />

          {/* Color */}
          <div className="qv__group">
            <div className="qv__group-head">
              <div className="eyebrow">Color</div>
              <div className="qv__group-val">{COLORS[color].n}</div>
            </div>
            <div className="qv__colors">
              {COLORS.map(c => (
                <button
                  key={c.id}
                  className={`qv__color${color === c.id ? ' is-on' : ''}`}
                  onClick={() => setColor(c.id)}
                  aria-label={c.n}
                >
                  <span style={{ background: c.hex }} />
                </button>
              ))}
            </div>
          </div>

          {/* Talla */}
          <div className="qv__group">
            <div className="qv__group-head">
              <div className="eyebrow">Talla</div>
              <button className="qv__guide ulink">Guía de tallas</button>
            </div>
            <div className="qv__sizes">
              {SIZES.map(s => (
                <button
                  key={s}
                  className={`qv__size${size === s ? ' is-on' : ''}`}
                  onClick={() => setSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="qv__divide" />

          <div className="qv__buy">
            <div>
              <div className="eyebrow">Total</div>
              <div className="qv__price">{product.currency}{product.price}</div>
            </div>
            <button
              className="btn btn--primary btn--lg btn--icon"
              onClick={() => { app.addToCart(product); onClose(); }}
            >
              Añadir al carrito
              <span className="btn__icon"><Icon name="arrow-right" size={14} /></span>
            </button>
          </div>

          {/* Productos relacionados */}
          {related.length > 0 && (
            <div className="qv__related">
              <div className="eyebrow qv__related-title">También te puede interesar</div>
              <div className="qv__related-grid">
                {related.map(r => (
                  <button
                    key={r.id}
                    className="qv__rel-card"
                    onClick={() => setProduct(r)}
                  >
                    <div className="qv__rel-media">
                      {r.image
                        ? <img src={r.image} alt={r.name} className="qv__rel-img" />
                        : <SneakerStage label={r.name} />
                      }
                    </div>
                    <div className="qv__rel-name">{r.name}</div>
                    <div className="qv__rel-price mono">{r.currency}{r.price}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
