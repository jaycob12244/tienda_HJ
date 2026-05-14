import { useState } from 'react';
import { PRODUCTS, FILTERS } from '../../data/products';
import ProductCard from '../product/ProductCard';
import DotFieldBg from '../ui/DotFieldBg';

export default function Catalog({ onQuickView }) {
  const [filter, setFilter] = useState('todos');
  const filtered = filter === 'todos' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);

  return (
    <section className="catalog" id="shop">
      <DotFieldBg />
      <div className="container container--wide">
        <div className="catalog__head">
          <div>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Catálogo</div>
            <h2 className="catalog__title">El sistema completo.</h2>
          </div>
          <div className="catalog__filters" role="tablist">
            {FILTERS.map(f => (
              <button
                key={f.id}
                role="tab"
                aria-selected={filter === f.id}
                className={`catalog__filter${filter === f.id ? ' is-on' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="catalog__grid">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="catalog__empty">
            <p>No hay modelos en esta categoría ahora mismo.</p>
            <button className="ulink" onClick={() => setFilter('todos')}>Ver todo el catálogo</button>
          </div>
        )}
      </div>
    </section>
  );
}
