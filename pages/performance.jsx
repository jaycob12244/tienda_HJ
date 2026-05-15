import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import NavBar        from '../components/layout/NavBar';
import Footer        from '../components/layout/Footer';
import Icon          from '../components/ui/Icon';
import SneakerStage  from '../components/ui/SneakerStage';
import CartDrawer    from '../components/cart/CartDrawer';
import SearchOverlay from '../components/cart/SearchOverlay';
import { getAllProducts } from '../services/productService';

/* ── Métricas técnicas por modelo ── */
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

/* ── Perfil de cada terreno ── */
const TERRAIN_PROFILES = {
  'Asfalto': { use: 'Running urbano · Maratón · Asfalto',       desc: 'Optimizado para alta exigencia en superficie dura. Prioriza retorno energético y ligereza.' },
  'Indoor':  { use: 'Gym · Crossfit · Sala cubierta',           desc: 'Amortiguación y soporte para entrenamientos intensos en interior.' },
  'Urbano':  { use: 'Lifestyle · Paseo · Ciudad',               desc: 'Equilibrio entre comodidad, estilo y uso diario prolongado.' },
  'Trail':   { use: 'Trail · Montaña · Senderos',               desc: 'Construcción robusta para terrenos irregulares. Agarre y protección sobre todo.' },
  'Court':   { use: 'Tenis · Pádel · Court sports',             desc: 'Estabilidad lateral y respuesta rápida. Drop alto para cambios de dirección.' },
  'Pista':   { use: 'Atletismo · Competición · Velocidad',      desc: 'Máxima eficiencia y peso mínimo. Para quienes buscan cada décima de segundo.' },
};

/* ── Filas del comparador ── */
const ROWS = [
  { key: 'energy', label: 'Retorno energético', unit: '%',   get: (p) => METRICS[p.id]?.energy ?? 0, max: 100, context: 'Clave en Asfalto y Pista — más % = más propulsión' },
  { key: 'weight', label: 'Peso (talla 42)',    unit: 'g',   get: (p) => METRICS[p.id]?.weight ?? 0, max: 350, context: 'Relevante en Trail y Pista — menos gramos = menos fatiga' },
  { key: 'drop',   label: 'Drop talón-punta',   unit: 'mm',  get: (p) => METRICS[p.id]?.drop ?? 0,   max: 15,  context: 'Más mm = más cushioning — menos mm = postura más natural' },
  { key: 'price',  label: 'Precio',             unit: '€',   get: (p) => p.price,                     max: 400, prefix: true, context: 'Relación calidad-precio' },
  { key: 'rating', label: 'Valoración',         unit: '/ 5', get: (p) => p.rating,                    max: 5,   context: 'Valoración media de usuarios' },
];

/* ── Página principal ── */
export default function Performance() {
  const [left,     setLeft]     = useState(null);
  const [right,    setRight]    = useState(null);
  const [products, setProducts] = useState([]);
  const comparing = !!(left && right && left.id !== right.id);

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

          {/* Selector — colapsa con animación cuando hay comparación activa */}
          <div className={`pf-select-wrapper${comparing ? ' is-hidden' : ''}`}>
            <div className="pf-select-inner">
              <section className="pf-select">
                <div className="container container--wide">

                  {/* Instrucción ARRIBA del grid */}
                  <p className="pf-select__prompt mono">
                    {!left && !right
                      ? 'Selecciona dos modelos para comenzar el análisis'
                      : 'Ahora selecciona el segundo modelo →'}
                  </p>

                  <div className="pf-select__grid">
                    <ShoeSelector
                      side="A"
                      selected={left}
                      excluded={right?.id}
                      hasSelection={!!left}
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
                      hasSelection={!!right}
                      onSelect={setRight}
                      products={products}
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Comparador */}
          {comparing && (
            <Comparator
              left={left}
              right={right}
              onChangeLeft={() => setLeft(null)}
              onChangeRight={() => setRight(null)}
            />
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
function ShoeSelector({ side, selected, excluded, hasSelection, onSelect, products }) {
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
          const dimmed   = hasSelection && !active && !disabled;
          return (
            <button
              key={p.id}
              disabled={disabled}
              onClick={() => onSelect(p)}
              className={[
                'pf-shoe-card',
                active   ? 'is-on'       : '',
                disabled ? 'is-disabled' : '',
                dimmed   ? 'is-dim'      : '',
              ].filter(Boolean).join(' ')}
            >
              <div className="pf-shoe-card__stage">
                {(p.images?.[0]?.url ?? p.image)
                  ? <img src={p.images?.[0]?.url ?? p.image} alt={p.name} className="pf-shoe-card__img" />
                  : <SneakerStage dark label={p.name} />}
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
function Comparator({ left, right, onChangeLeft, onChangeRight }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, [left.id, right.id]);

  return (
    <section className="pf-compare">
      <div className="container container--wide">

        {/* Cabecera: los dos zapatos seleccionados */}
        <div className="pf-compare__heads">

          {/* Izquierda */}
          <div className="pf-compare__shoe">
            <div className="pf-compare__stage">
              {(left.images?.[0]?.url ?? left.image)
                ? <img src={left.images?.[0]?.url ?? left.image} alt={left.name} className="pf-compare__img" />
                : <SneakerStage dark label={left.name} />}
            </div>
            <div className="pf-compare__shoe-name">{left.name}</div>
            <div className="pf-compare__shoe-sub mono">{left.colorway} · {left.currency}{left.price}</div>
            <span className="pill pf-compare__badge">
              <span className="pill__dot" style={{ background: 'var(--paper)' }} />
              <span>{left.badge}</span>
            </span>
            <button className="pf-compare__change" onClick={onChangeLeft}>
              Cambiar modelo
            </button>
          </div>

          {/* Separador */}
          <div className="pf-compare__divider">
            <div className="pf-compare__divider-line" />
            <span className="pf-compare__divider-vs mono">VS</span>
            <div className="pf-compare__divider-line" />
          </div>

          {/* Derecha */}
          <div className="pf-compare__shoe pf-compare__shoe--r">
            <div className="pf-compare__stage">
              {(right.images?.[0]?.url ?? right.image)
                ? <img src={right.images?.[0]?.url ?? right.image} alt={right.name} className="pf-compare__img" />
                : <SneakerStage dark label={right.name} />}
            </div>
            <div className="pf-compare__shoe-name">{right.name}</div>
            <div className="pf-compare__shoe-sub mono">{right.colorway} · {right.currency}{right.price}</div>
            <span className="pill pf-compare__badge">
              <span className="pill__dot" style={{ background: 'var(--paper)' }} />
              <span>{right.badge}</span>
            </span>
            <button className="pf-compare__change" onClick={onChangeRight}>
              Cambiar modelo
            </button>
          </div>
        </div>

        {/* Métricas */}
        <div className="pf-compare__metrics">
          {ROWS.map(row => {
            const lv   = row.get(left);
            const rv   = row.get(right);
            const lPct = Math.round((lv / row.max) * 100);
            const rPct = Math.round((rv / row.max) * 100);

            return (
              <div key={row.key} className="pf-metric">
                <div className="pf-metric__header">
                  <div className="pf-metric__label eyebrow">{row.label}</div>
                  <div className="pf-metric__context mono">{row.context}</div>
                </div>

                <div className="pf-metric__row">
                  {/* Izquierda */}
                  <div className="pf-metric__side pf-metric__side--l">
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

                  {/* Línea central neutra */}
                  <div className="pf-metric__center">
                    <div className="pf-metric__center-line" />
                  </div>

                  {/* Derecha */}
                  <div className="pf-metric__side pf-metric__side--r">
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

        {/* Veredicto por terreno */}
        <Verdict left={left} right={right} />
      </div>
    </section>
  );
}

/* ── Veredicto por terreno ── */
function Verdict({ left, right }) {
  const leftM        = METRICS[left.id]  ?? {};
  const rightM       = METRICS[right.id] ?? {};
  const leftProfile  = TERRAIN_PROFILES[leftM.terrain]  ?? {};
  const rightProfile = TERRAIN_PROFILES[rightM.terrain] ?? {};
  const sameTerrain  = leftM.terrain === rightM.terrain;

  return (
    <div className="pf-verdict">
      <div className="eyebrow pf-verdict__eyebrow">¿Para qué actividad es cada uno?</div>

      <div className="pf-verdict__profiles">

        <div className="pf-verdict__profile">
          <div className="pf-verdict__profile-name">{left.name}</div>
          <div className="pf-verdict__terrain-tag">{leftM.terrain}</div>
          <div className="pf-verdict__use mono">{leftProfile.use}</div>
          <p className="pf-verdict__desc">{leftProfile.desc}</p>
        </div>

        <div className="pf-verdict__divider" />

        <div className="pf-verdict__profile pf-verdict__profile--r">
          <div className="pf-verdict__profile-name">{right.name}</div>
          <div className="pf-verdict__terrain-tag">{rightM.terrain}</div>
          <div className="pf-verdict__use mono">{rightProfile.use}</div>
          <p className="pf-verdict__desc">{rightProfile.desc}</p>
        </div>

      </div>

      <p className="pf-verdict__rec">
        {sameTerrain
          ? `Ambos están optimizados para ${leftM.terrain}. Decide según peso y precio.`
          : `Elige ${left.name} si tu actividad es ${leftM.terrain}. Elige ${right.name} si prefieres ${rightM.terrain}.`
        }
      </p>
    </div>
  );
}
