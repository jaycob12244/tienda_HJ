import { useState, useEffect } from 'react';
import Icon from '../ui/Icon';
import SneakerStage from '../ui/SneakerStage';
import { TECH_POINTS } from '../../data/products';
import DotFieldBg from '../ui/DotFieldBg';

const PAPERS = {
  '01': {
    title: 'Aero-Weave Shell',
    subtitle: 'Documento técnico · Ref. AX-MAT-01',
    abstract: 'Sistema de malla monofilamento diseñado para reducir la resistencia aerodinámica superficial sin sacrificar estructura ni transpirabilidad. Desarrollado en colaboración con el laboratorio de materiales textiles avanzados de la Universidad Politécnica de Eindhoven.',
    specs: [
      { k: 'Reducción de arrastre',    v: '−18 % vs malla estándar' },
      { k: 'Transpirabilidad',          v: '340 g/m²/24 h (ASTM E96)' },
      { k: 'Peso por par (talla 42)',   v: '42 g' },
      { k: 'Filamento',                 v: 'Poliéster de alto módulo 75D' },
      { k: 'Patrón de tejido',          v: 'Hexagonal variable — densidad 3 zonas' },
      { k: 'Resistencia a la tracción', v: '620 N (ISO 13934-1)' },
      { k: 'Ciclos de lavado',          v: '+200 sin degradación estructural' },
    ],
    conclusion: 'La geometría hexagonal de densidad variable concentra el material donde la presión de impacto es mayor, dejando secciones abiertas en zonas de baja carga para maximizar el flujo de aire. El resultado es un upper que el pie percibe como una segunda piel.',
  },
  '02': {
    title: 'Kinetic Core Midsole',
    subtitle: 'Documento técnico · Ref. AX-MID-02',
    abstract: 'Núcleo de amortiguación compuesto por espuma PEBA infusionada con nitrógeno molecular y una placa de carbono preimpregnado T700. El sistema convierte la energía de impacto en propulsión con una eficiencia medida del 94 %, superando los referentes actuales del mercado.',
    specs: [
      { k: 'Retorno energético',        v: '94 % (ISO 17707)' },
      { k: 'Material de espuma',        v: 'PEBA 11 × N₂ supercrítico' },
      { k: 'Densidad',                  v: '0.18 g/cm³' },
      { k: 'Placa de carbono',          v: 'Fibra T700 · 3K · prepreg epoxy' },
      { k: 'Rigidez de placa',          v: '8.4 N/mm (flexión 3 puntos)' },
      { k: 'Resistencia a la fatiga',   v: '+500 000 ciclos de compresión' },
      { k: 'Temperatura de trabajo',    v: '−10 °C a +45 °C' },
    ],
    conclusion: 'La infusión de nitrógeno genera microburbujas uniformes en la matriz PEBA que actúan como resortes moleculares. La placa de carbono distribuye la carga de forma elíptica desde el metatarso al antepié, recortando entre 1.2 % y 2.4 % el coste metabólico en ritmos de competición.',
  },
  '03': {
    title: 'Adaptive Traction',
    subtitle: 'Documento técnico · Ref. AX-OUT-03',
    abstract: 'Sistema de suela exterior con 184 microcanales de geometría variable que ajustan el área de contacto dinámicamente según la dureza del sustrato. Fabricada en compuesto TR90 reforzado con grafeno al 3 % para una combinación óptima de agarre, durabilidad y peso.',
    specs: [
      { k: 'Microcanales',              v: '184 × 0.8 mm (ancho) · profundidad 2.4 mm' },
      { k: 'Material',                  v: 'TR90 + grafeno 3 % en volumen' },
      { k: 'Coef. de rozamiento (seco)', v: '0.88 (ISO 13287)' },
      { k: 'Coef. de rozamiento (mojado)', v: '0.72 (ISO 13287)' },
      { k: 'Dureza Shore A',            v: '62 ± 2' },
      { k: 'Abrasión DIN',              v: '85 mm³ (DIN 53516)' },
      { k: 'Rango de temperatura',      v: '−15 °C a +60 °C' },
    ],
    conclusion: 'La adición de grafeno al compuesto TR90 incrementa la conductividad térmica de la suela, evitando la rigidización en frío y manteniendo el agarre en condiciones de asfalto húmedo o granito. Los microcanales orientados en tres ángulos (0°, 45°, −45°) aseguran tracción multidireccional sin elevar la masa total.',
  },
};

export default function Technology() {
  const [paper, setPaper] = useState(null);

  return (
    <>
      <section className="tech">
        <DotFieldBg />
        <div className="container container--wide">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Proprietary Tech</div>
              <h2 className="section-head__title">
                Ingeniería que se siente <span className="editorial">viva</span>.
              </h2>
            </div>
            <div className="section-head__sub">
              Tres sistemas patentados que trabajan en coordinación: chasis, núcleo y agarre.
            </div>
          </div>

          <div className="tech__grid">
            {TECH_POINTS.map(t => (
              <article key={t.num} className="techCard">
                <div className="techCard__top">
                  <div className="techCard__mark"><Icon name="diamond" size={16} /></div>
                  <div className="mono techCard__num">{t.num}</div>
                </div>
                <h3 className="techCard__t">{t.t}</h3>
                <p className="techCard__d">{t.d}</p>
                <div className="techCard__foot">
                  <button className="ulink" onClick={() => setPaper(PAPERS[t.num])}>
                    Leer paper técnico <Icon name="arrow-up-right" size={12} />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="tech__360">
            <div className="tech__360-meta">
              <div className="eyebrow">360° analysis</div>
              <h3 className="tech__360-title">
                Explora la arquitectura <span className="editorial">interna</span>.
              </h3>
              <p className="tech__360-desc">
                Vista rotatoria del chasis. Materiales, costuras, perfil y anclajes,
                documentados al detalle.
              </p>
              <div className="tech__360-stats">
                <div><div className="mono">94%</div><span>Retorno energético</span></div>
                <div><div className="mono">218g</div><span>Peso por pie · 42</span></div>
                <div><div className="mono">5.2mm</div><span>Drop talón-punta</span></div>
              </div>
            </div>
            <div className="tech__360-frame">
              <SneakerStage dark label="360° · drop sneaker photo" />
              <div className="tech__360-dots">
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <span key={i} className={i === 2 ? 'is-on' : ''} />
                ))}
              </div>
              <button className="tech__360-btn">
                <Icon name="play" size={12} />
                <span className="mono">ROTAR 360°</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {paper && <TechPaperModal paper={paper} onClose={() => setPaper(null)} />}
    </>
  );
}

function TechPaperModal({ paper, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="tp">
      <div className="tp__backdrop" onClick={onClose} />
      <div className="tp__sheet">
        <div className="tp__header">
          <div>
            <div className="eyebrow tp__ref">{paper.subtitle}</div>
            <h2 className="tp__title">{paper.title}</h2>
          </div>
          <button className="tp__close" onClick={onClose} aria-label="Cerrar">
            <Icon name="close" size={16} />
          </button>
        </div>

        <div className="tp__body">
          <div className="tp__divider" />

          <section className="tp__block">
            <div className="eyebrow tp__block-label">Resumen</div>
            <p className="tp__text">{paper.abstract}</p>
          </section>

          <div className="tp__divider" />

          <section className="tp__block">
            <div className="eyebrow tp__block-label">Especificaciones técnicas</div>
            <table className="tp__table">
              <tbody>
                {paper.specs.map(s => (
                  <tr key={s.k} className="tp__row">
                    <td className="tp__row-k">{s.k}</td>
                    <td className="tp__row-v mono">{s.v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <div className="tp__divider" />

          <section className="tp__block">
            <div className="eyebrow tp__block-label">Conclusión de ingeniería</div>
            <p className="tp__text">{paper.conclusion}</p>
          </section>

          <div className="tp__foot mono">
            AURIX Engineering Division · Laboratorio de I+D · Madrid — Tokio · 2026
          </div>
        </div>
      </div>
    </div>
  );
}
