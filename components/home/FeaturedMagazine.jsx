import Icon from '../ui/Icon';
import SneakerStage from '../ui/SneakerStage';
import { PRODUCTS } from '../../data/products';
import DotFieldBg from '../ui/DotFieldBg';

export default function FeaturedMagazine({ onQuickView }) {
  const main = PRODUCTS[2]; // Volt — cover
  const side = [PRODUCTS[0], PRODUCTS[6], PRODUCTS[3]];

  return (
    <section className="feat">
      <DotFieldBg />
      <div className="container container--wide">
        <div className="section-head">
          <div>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Featured · SS26</div>
            <h2 className="section-head__title">Editorial drop, en color y forma.</h2>
          </div>
          <div className="section-head__sub">
            Una selección comisariada por nuestro equipo de diseño. Layout magazine, jerarquía clara.
          </div>
        </div>

        <div className="feat__grid">
          {/* Main hero card */}
          <article className="feat__hero">
            <div className="feat__hero-media">
              <SneakerStage dark label={`${main.name} · drop photo`} />
              <div className="feat__hero-tag pill">
                <span className="pill__dot" style={{ background: 'var(--paper)' }} />
                <span style={{ color: 'var(--paper)' }}>DROP 04 · LIVE</span>
              </div>
            </div>
            <div className="feat__hero-meta">
              <div>
                <div className="eyebrow">{main.category} · COVER</div>
                <h3 className="feat__hero-name">{main.name}</h3>
                <p className="feat__hero-desc">
                  Una silueta cinética con malla translúcida y placa de carbono visible.
                  La <span className="editorial">pieza de portada</span> del drop SS26.
                </p>
              </div>
              <div className="feat__hero-actions">
                <button className="btn btn--paper btn--icon" onClick={() => onQuickView(main)}>
                  Ver detalle <span className="btn__icon"><Icon name="arrow-right" size={14} /></span>
                </button>
                <div className="feat__hero-price mono">{main.currency}{main.price}</div>
              </div>
            </div>
          </article>

          {/* Side cards */}
          <div className="feat__side">
            {side.map((p, i) => (
              <article key={p.id} className="feat__card" onClick={() => onQuickView(p)}>
                <div className="feat__card-media">
                  <SneakerStage label={p.name} />
                </div>
                <div className="feat__card-meta">
                  <div className="eyebrow">N° 0{i + 1} · {p.category}</div>
                  <div className="feat__card-name">{p.name}</div>
                  <div className="feat__card-row">
                    <span className="mono">{p.currency}{p.price}</span>
                    <span className="feat__card-arrow"><Icon name="arrow-up-right" size={14} /></span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
