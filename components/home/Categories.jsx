import { useRouter } from 'next/router';
import Icon from '../ui/Icon';
import DotFieldBg from '../ui/DotFieldBg';

const cats = [
  {
    id: 'running',
    label: 'Running',
    count: '12',
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'streetwear',
    label: 'Streetwear',
    count: '08',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'casual',
    label: 'Casual',
    count: '10',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'training',
    label: 'Training',
    count: '06',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=900&q=80&auto=format&fit=crop',
  },
  {
    id: 'luxury',
    label: 'Luxury',
    count: '04',
    image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=900&q=80&auto=format&fit=crop',
  },
];

export default function Categories() {
  const router = useRouter();
  return (
    <section className="cats">
      <DotFieldBg />
      <div className="container container--wide">
        <div className="section-head">
          <div>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Categorías</div>
            <h2 className="section-head__title">Cinco maneras de moverte.</h2>
          </div>
          <div className="section-head__sub">
            Cada cápsula resuelve un terreno distinto. Mismo lenguaje, distinta intención.
          </div>
        </div>

        <div className="cats__grid">
          {cats.map((c, i) => (
            <button
              key={c.id}
              className={`cat-card${i === 0 ? ' cat-card--lg' : ''}`}
              onClick={() => router.push(`/tienda?categoria=${c.id}`)}
            >
              <div className="cat-card__media">
                <img src={c.image} alt={c.label} className="cat-card__img" />
              </div>
              <div className="cat-card__overlay" />
              <div className="cat-card__meta">
                <div className="cat-card__label">{c.label}</div>
                <div className="cat-card__count mono">{c.count} modelos</div>
              </div>
              <div className="cat-card__arrow">
                <Icon name="arrow-up-right" size={16} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
