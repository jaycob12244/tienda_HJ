import Icon from '../ui/Icon';
import SneakerStage from '../ui/SneakerStage';
import { useApp } from '../../context/AppContext';

export default function ProductCard({ product, onQuickView }) {
  const app = useApp();
  const isFav = app.favorites.has(product.id);

  // Primera imagen de product_images, o image legacy, o null (→ SneakerStage)
  const coverUrl = product.images?.[0]?.url ?? product.image ?? null;

  return (
    <article className="pc">
      <div className="pc__media">
        {coverUrl
          ? <img src={coverUrl} alt={product.name} className="pc__cover-img" />
          : <SneakerStage label={`${product.name} · drop photo`} />
        }
        <button
          className={`pc__fav${isFav ? ' is-on' : ''}`}
          onClick={() => app.toggleFav(product.id)}
          aria-label="Favorito"
        >
          <Icon name="heart" size={16} fill={isFav ? 'currentColor' : 'none'} />
        </button>
        <span className="pc__badge">{product.badge}</span>
        <div className="pc__overlay">
          <button className="btn btn--paper btn--sm" onClick={() => onQuickView(product)}>
            <Icon name="eye" size={14} /> Quick view
          </button>
          <button className="btn btn--primary btn--sm" onClick={() => app.addToCart(product)}>
            <Icon name="bag" size={14} /> Añadir
          </button>
        </div>
      </div>

      <div className="pc__meta">
        <div className="pc__row">
          <div className="eyebrow">{product.category}</div>
          <div className="pc__rate">
            <Icon name="star" size={11} />
            <span className="mono">{product.rating?.toFixed(1) ?? '—'}</span>
          </div>
        </div>
        <h3 className="pc__name">{product.name}</h3>
        <div className="pc__sub">{product.desc}</div>
        <div className="pc__foot">
          <div className="pc__price-wrap">
            <span className="eyebrow">Desde</span>
            <div className="pc__price">{product.currency}{product.price}</div>
          </div>
          <button className="pc__more" onClick={() => onQuickView(product)} aria-label="Ver detalle">
            <Icon name="arrow-up-right" size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
