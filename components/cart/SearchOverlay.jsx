import { useState, useEffect, useRef } from 'react';
import Icon from '../ui/Icon';
import SneakerStage from '../ui/SneakerStage';
import { useApp } from '../../context/AppContext';
import { PRODUCTS } from '../../data/products';

const SUGGESTIONS = ['aurix one', 'kinetic core', 'trail k2', 'carbon plate', 'ivory'];

export default function SearchOverlay() {
  const app = useApp();
  const [q, setQ] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (app.searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQ('');
    }
  }, [app.searchOpen]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && app.setSearchOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [app.setSearchOpen]);

  if (!app.searchOpen) return null;

  const results = q.trim()
    ? PRODUCTS.filter(p => (p.name + p.category + p.desc).toLowerCase().includes(q.toLowerCase()))
    : [];

  return (
    <div className="so">
      <div className="so__backdrop" onClick={() => app.setSearchOpen(false)} />
      <div className="so__sheet">
        <div className="so__bar">
          <Icon name="search" size={20} />
          <input
            ref={inputRef}
            className="so__input"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Buscar modelos, tecnología, colorways…"
          />
          <button className="so__esc" onClick={() => app.setSearchOpen(false)}>
            <span className="mono">ESC</span>
          </button>
        </div>

        <div className="so__results">
          {q.trim().length === 0 ? (
            <>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Sugerencias</div>
              <div className="so__sug">
                {SUGGESTIONS.map(s => (
                  <button key={s} className="so__chip" onClick={() => setQ(s)}>{s}</button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="eyebrow" style={{ marginBottom: 12 }}>
                {results.length} resultado{results.length !== 1 ? 's' : ''}
              </div>
              <div className="so__list">
                {results.map(p => (
                  <button key={p.id} className="so__item" onClick={() => app.setSearchOpen(false)}>
                    <div className="so__thumb">
                      <SneakerStage label={p.name} />
                    </div>
                    <div className="so__itemMeta">
                      <div className="eyebrow">{p.category}</div>
                      <div className="so__itemName">{p.name}</div>
                    </div>
                    <div className="mono so__itemPrice">{p.currency}{p.price}</div>
                  </button>
                ))}
                {results.length === 0 && (
                  <div className="so__noresult">Sin coincidencias. Prueba con otro término.</div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
