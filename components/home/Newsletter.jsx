import { useState } from 'react';
import Icon from '../ui/Icon';
import DotFieldBg from '../ui/DotFieldBg';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (email.includes('@')) setSent(true);
  };

  return (
    <section className="nl">
      <DotFieldBg />
      <div className="container container--wide">
        <div className="nl__inner">
          <div className="nl__left">
            <div className="eyebrow">Newsletter · privada</div>
            <h2 className="nl__title">Acceso anticipado <br />a cada drop.</h2>
            <p className="nl__sub">
              Una nota mensual con próximos lanzamientos, ventas privadas y
              piezas de archivo. Sin ruido.
            </p>
          </div>
          <form className="nl__form" onSubmit={onSubmit}>
            {!sent ? (
              <>
                <div className="nl__field">
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  <button type="submit" className="btn btn--paper btn--icon">
                    Suscribir <span className="btn__icon"><Icon name="arrow-right" size={14} /></span>
                  </button>
                </div>
                <div className="nl__hint mono">Sin spam · Baja en un click · GDPR</div>
              </>
            ) : (
              <div className="nl__ok">
                <div className="nl__okMark"><Icon name="check" size={20} /></div>
                <div>
                  <div className="nl__okT">Estás dentro.</div>
                  <div className="nl__okD">Revisa tu correo para confirmar.</div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
