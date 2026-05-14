import Icon from '../ui/Icon';
import { BENEFITS } from '../../data/products';
import DotFieldBg from '../ui/DotFieldBg';

export default function Benefits() {
  return (
    <section className="ben">
      <DotFieldBg />
      <div className="container container--wide">
        <div className="ben__row">
          {BENEFITS.map(b => (
            <div key={b.k} className="ben__item">
              <div className="ben__icon"><Icon name={b.icon} size={20} stroke={1.5} /></div>
              <div className="ben__num mono">{b.k}</div>
              <h3 className="ben__t">{b.t}</h3>
              <p className="ben__d">{b.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
