import { useState, useEffect, useRef } from 'react';
import Icon from '../ui/Icon';
import SneakerStage from '../ui/SneakerStage';
import { useApp } from '../../context/AppContext';
import { getRelated } from '../../services/productService';

const COLORS_FALLBACK = [
  { name: 'Bone', hex: '#E8E5DD' },
  { name: 'Onyx', hex: '#0A0A0A' },
  { name: 'Cream', hex: '#C9B8A1' },
];
const SIZES_FALLBACK = ['38', '39', '40', '41', '42', '43', '44', '45'];

export default function QuickViewModal({ product: initialProduct, open, allProducts = [], onClose }) {
  const app = useApp();

  // lastProduct keeps the previous non-null product so the modal doesn't go
  // blank during the exit animation (when open=false, initialProduct=null)
  const lastProduct = useRef(initialProduct);
  if (initialProduct) lastProduct.current = initialProduct;
  const product0 = lastProduct.current;

  const [product,   setProduct]   = useState(product0);
  const [activeIdx, setActiveIdx] = useState(0);
  const [color,     setColor]     = useState(0);
  const [size,      setSize]      = useState(null);

  const related = product ? getRelated(product, allProducts) : [];
  const isFav   = product ? app.favorites.has(product.id) : false;

  const images = product?.images?.length
    ? product.images
    : product?.image
    ? [{ id: 'legacy', url: product.image }]
    : [];

  const colors = product?.available_colors?.length ? product.available_colors : COLORS_FALLBACK;
  const sizes  = product?.available_sizes?.length  ? product.available_sizes  : SIZES_FALLBACK;

  // Reset when a new product opens
  useEffect(() => {
    if (initialProduct) {
      setProduct(initialProduct);
      setActiveIdx(0);
      setSize(null);
      setColor(0);
    }
  }, [initialProduct]);

  // Reset when user navigates to a related product
  useEffect(() => {
    if (product?.id) {
      setActiveIdx(0);
      setSize(null);
      setColor(0);
    }
  }, [product?.id]);

  // Body scroll lock — tied to open prop
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Escape key — tied to open prop
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!product) return null;

  return (
    <div className={`qv${open ? ' is-open' : ''}`}>
      <div className="qv__backdrop" onClick={onClose} />
      <div className="qv__sheet">
        <button className="qv__close" onClick={onClose} aria-label="Cerrar">
          <Icon name="close" size={18} />
        </button>

        <div className="qv__media">
          {images.length > 0 ? (
            <div className="qv__gallery">
              <div className="qv__gallery-main">
                <img src={images[activeIdx]?.url} alt={product.name} className="qv__real-img" />
              </div>
              {images.length > 1 && (
                <div className="qv__gallery-strip">
                  {images.map((img, i) => (
                    <button
                      key={img.id ?? i}
                      className={`qv__gallery-thumb${activeIdx === i ? ' is-active' : ''}`}
                      onClick={() => setActiveIdx(i)}
                      aria-label={`Imagen ${i + 1}`}
                    >
                      <img src={img.url} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <SneakerStage label={`${product.name} · drop photo`} />
          )}
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
            <span className="mono">{product.rating?.toFixed(1) ?? '—'}</span>
            <span className="qv__rate-sep">·</span>
            <span className="mono">421 reseñas</span>
          </div>

          <div className="qv__divide" />

          <div className="qv__group">
            <div className="qv__group-head">
              <div className="eyebrow">Color</div>
              <div className="qv__group-val">{colors[color]?.name ?? '—'}</div>
            </div>
            <div className="qv__colors">
              {colors.map((c, i) => (
                <button
                  key={i}
                  className={`qv__color${color === i ? ' is-on' : ''}`}
                  onClick={() => setColor(i)}
                  aria-label={c.name}
                >
                  <span style={{ background: c.hex }} />
                </button>
              ))}
            </div>
          </div>

          <div className="qv__group">
            <div className="qv__group-head">
              <div className="eyebrow">Talla</div>
              <button className="qv__guide ulink">Guía de tallas</button>
            </div>
            <div className="qv__sizes">
              {sizes.map((s, i) => (
                <button
                  key={i}
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
                      {r.images?.[0]?.url || r.image
                        ? <img src={r.images?.[0]?.url ?? r.image} alt={r.name} className="qv__rel-img" />
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
