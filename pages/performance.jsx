import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import NavBar  from '../components/layout/NavBar';
import Footer  from '../components/layout/Footer';
import Icon    from '../components/ui/Icon';
import SneakerStage from '../components/ui/SneakerStage';
import CartDrawer   from '../components/cart/CartDrawer';
import SearchOverlay from '../components/cart/SearchOverlay';
import { getAllProducts } from '../services/productService';

/* Métricas técnicas por modelo */
const METRICS = {
  'ax-01': { weight: 218, drop: 6,  energy: 87, terrain: 'Asfalto' },
  'ax-02': { weight: 232, drop: 8,  energy: 81, terrain: 'Indoor'  },
  'ax-03': { weight: 205, drop: 5,  energy: 94, terrain: 'Asfalto' },
  'ax-04': { weight: 245, drop: 10, energy: 74, terrain: 'Urbano'  },
  'ax-05': { weight: 298, drop: 4,  energy: 79, terrain: 'Trail'   },
  'ax-06': { weight: 261, drop: 12, energy: 68, terrain: 'Court'   },
  'ax-07': { weight: 188, drop: 3,  energy: 96, terrain: 'Pista'   },
  'ax-08': { weight: 270, drop: 10, energy: 71, terrain: 'Urbano'  },
};

/* Filas del comparador */
const ROWS = [
  {
    key: 'energy',
    label: 'Retorno energético',
    unit: '%',
    get: (p) => METRICS[p.id]?.energy ?? 0,
    higherBetter: true,
    max: 100,
  },
  {
    key: 'weight',
    label: 'Peso (talla 42)',
    unit: 'g',
    get: (p) => METRICS[p.id]?.weight ?? 0,
    higherBetter: false,
    max: 350,
  },
  {
    key: 'drop',
    label: 'Drop talón-punta',
    unit: 'mm',
    get: (p) => METRICS[p.id]?.drop ?? 0,
    higherBetter: false,
    max: 15,
  },
  {
    key: 'price',
    label: 'Precio',
    unit: '€',
    get: (p) => p.price,
    higherBetter: false,
    max: 400,
    prefix: true,
  },
  {
    key: 'rating',
    label: 'Valoración',
    unit: '/ 5',
    get: (p) => p.rating,
    higherBetter: true,
    max: 5,
  },
];

export default function Performance() {
  const [left,     setLeft]     = useState(null);
  const [right,    setRight]    = useState(null);
  const [products, setProducts] = useState([]);
  const comparing = left && right && left.id !== right.id;

  useEffect(() => {
    getAllProducts().then(data => { if (data) setProducts(data); });
  }, []);

  return (
    <>
      <Head><title>Performance — AURIX</title></Head>
      <div className="app-shell">
        <NavBar />
        <main>

          {/* Hero */}
          <section className="pf-hero">
            <div className="container container--wide pf-hero__inner">
              <div className="eyebrow pf-hero__eyebrow">Performance Lab · SS26</div>
              <h1 className="pf-hero__title">
                Compara.<br />
                <span className="editorial">Decide.</span><br />
                Corre.
              </h1>
              <p className="pf-hero__sub">
                Selecciona dos modelos Aurix y confronta sus métricas técnicas en tiempo real.
              </p>
            </div>
          </section>

          {/* Selectores */}
          <section className="pf-select">
            <div className="container container--wide">
              <div className="pf-select__grid">
                <ShoeSelector
                  side="A"
                  selected={left}
                  excluded={right?.id}
                  onSelect={setLeft}
                  products={products}
                />
                <div className="pf-select__vs">
                  <span className="mono">VS</span>
                </div>
                <ShoeSelector
                  side="B"
                  selected={right}
                  excluded={left?.id}
                  onSelect={setRight}
                  products={products}
                />
              </div>
            </div>
          </section>

          {/* Comparador */}
          {comparing ? (
            <Comparator left={left} right={right} />
          ) : (
            <div className="pf-prompt">
              <div className="pf-prompt__icon">
                <Icon name="diamond" size={20} />
              </div>
              <p className="mono pf-prompt__text">
                {!left && !right
                  ? 'Selecciona dos modelos para comenzar el análisis'
                  : 'Selecciona el segundo modelo para comparar'}
              </p>
            </div>
          )}

        </main>
        <Footer />
      </div>
      <CartDrawer />
      <SearchOverlay />
    </>
  );
}

/* ── Selector de zapato ── */
function ShoeSelector({ side, selected, excluded, onSelect, products }) {
  return (
    <div className="pf-selector">
      <div className="pf-selector__head">
        <span className="pf-selector__side mono">Modelo {side}</span>
        {selected && (
          <button className="pf-selector__clear" onClick={() => onSelect(null)}>
            <Icon name="close" size={12} /> Limpiar
          </button>
        )}
      </div>
      <div className="pf-selector__grid">
        {products.map(p => {
          const active   = selected?.id === p.id;
          const disabled = excluded === p.id;
          return (
            <button
              key={p.id}
              disabled={disabled}
              onClick={() => onSelect(p)}
              className={`pf-shoe-card${active ? ' is-on' : ''}${disabled ? ' is-disabled' : ''}`}
            >
              <div className="pf-shoe-card__stage">
                <SneakerStage dark label={p.name} />
              </div>
              <div className="pf-shoe-card__info">
                <div className="pf-shoe-card__name">{p.name}</div>
                <div className="pf-shoe-card__meta mono">
                  {p.colorway} · {p.currency}{p.price}
                </div>
              </div>
              {active && (
                <div className="pf-shoe-card__check">
                  <Icon name="check" size={12} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Panel de comparación ── */
function Comparator({ left, right }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, [left.id, right.id]);

  return (
    <section className="pf-compare" ref={ref}>
      <div className="container container--wide">

        {/* Cabecera con los dos zapatos */}
        <div className="pf-compare__heads">
          <div className="pf-compare__shoe">
            <div className="pf-compare__stage">
              <SneakerStage dark label={left.name} />
            </div>
            <div className="pf-compare__shoe-name">{left.name}</div>
            <div className="pf-compare__shoe-sub mono">{left.colorway} · {left.currency}{left.price}</div>
            <span className="pill pf-compare__badge">
              <span className="pill__dot" style={{ background: 'var(--paper)' }} />
              <span>{left.badge}</span>
            </span>
          </div>

          <div className="pf-compare__divider">
            <div className="pf-compare__divider-line" />
            <span className="pf-compare__divider-vs mono">VS</span>
            <div className="pf-compare__divider-line" />
          </div>

          <div className="pf-compare__shoe pf-compare__shoe--r">
            <div className="pf-compare__stage">
              <SneakerStage dark label={right.name} />
            </div>
            <div className="pf-compare__shoe-name">{right.name}</div>
            <div className="pf-compare__shoe-sub mono">{right.colorway} · {right.currency}{right.price}</div>
            <span className="pill pf-compare__badge">
              <span className="pill__dot" style={{ background: 'var(--paper)' }} />
              <span>{right.badge}</span>
            </span>
          </div>
        </div>

        {/* Métricas */}
        <div className="pf-compare__metrics">
          {ROWS.map(row => {
            const lv = row.get(left);
            const rv = row.get(right);
            const lPct = Math.round((lv / row.max) * 100);
            const rPct = Math.round((rv / row.max) * 100);
            const lWins = row.higherBetter ? lv > rv : lv < rv;
            const rWins = row.higherBetter ? rv > lv : rv < lv;
            const tie   = lv === rv;

            return (
              <div key={row.key} className="pf-metric">
                <div className="pf-metric__label eyebrow">{row.label}</div>

                <div className="pf-metric__row">
                  {/* Izquierda */}
                  <div className={`pf-metric__side pf-metric__side--l${lWins && !tie ? ' is-winner' : ''}`}>
                    <span className="pf-metric__val mono">
                      {row.prefix ? `${row.unit}${lv}` : `${lv}${row.unit}`}
                    </span>
                    <div className="pf-metric__bar-wrap">
                      <div
                        className="pf-metric__bar pf-metric__bar--l"
                        style={{ width: visible ? `${lPct}%` : '0%' }}
                      />
                    </div>
                  </div>

                  {/* Separador central */}
                  <div className="pf-metric__center">
                    {!tie && (
                      <span className="pf-metric__winner-dot" style={{
                        background: lWins ? 'var(--accent)' : 'transparent',
                        borderColor: lWins ? 'var(--accent)' : 'rgba(250,249,246,0.15)',
                      }} />
                    )}
                    {tie && <span className="pf-metric__tie mono">=</span>}
                    {!tie && (
                      <span className="pf-metric__winner-dot" style={{
                        background: rWins ? 'var(--accent)' : 'transparent',
                        borderColor: rWins ? 'var(--accent)' : 'rgba(250,249,246,0.15)',
                      }} />
                    )}
                  </div>

                  {/* Derecha */}
                  <div className={`pf-metric__side pf-metric__side--r${rWins && !tie ? ' is-winner' : ''}`}>
                    <div className="pf-metric__bar-wrap">
                      <div
                        className="pf-metric__bar pf-metric__bar--r"
                        style={{ width: visible ? `${rPct}%` : '0%' }}
                      />
                    </div>
                    <span className="pf-metric__val mono">
                      {row.prefix ? `${row.unit}${rv}` : `${rv}${row.unit}`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Veredicto */}
        <Verdict left={left} right={right} />
      </div>
    </section>
  );
}

/* ── Veredicto final ── */
function Verdict({ left, right }) {
  const scores = { [left.id]: 0, [right.id]: 0 };
  ROWS.forEach(row => {
    const lv = row.get(left);
    const rv = row.get(right);
    if (row.higherBetter) { if (lv > rv) scores[left.id]++; else if (rv > lv) scores[right.id]++; }
    else                  { if (lv < rv) scores[left.id]++; else if (rv < lv) scores[right.id]++; }
  });

  const winner = scores[left.id] > scores[right.id] ? left
               : scores[right.id] > scores[left.id] ? right
               : null;

  return (
    <div className="pf-verdict">
      <div className="eyebrow pf-verdict__eyebrow">Veredicto técnico</div>
      {winner ? (
        <>
          <h2 className="pf-verdict__title">
            <span className="editorial">{winner.name}</span> gana en{' '}
            {scores[winner.id]} de {ROWS.length} métricas.
          </h2>
          <p className="pf-verdict__sub">
            Mejor en terreno <strong>{METRICS[winner.id]?.terrain}</strong> ·
            Retorno energético <strong>{METRICS[winner.id]?.energy}%</strong> ·
            Peso <strong>{METRICS[winner.id]?.weight}g</strong>
          </p>
        </>
      ) : (
        <h2 className="pf-verdict__title">Empate técnico — ambos modelos están equilibrados.</h2>
      )}
    </div>
  );
}
