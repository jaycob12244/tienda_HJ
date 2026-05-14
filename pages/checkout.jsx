import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Icon, { Monogram } from '../components/ui/Icon';
import { useApp } from '../context/AppContext';
import { formatTotal } from '../utils/formatPrice';

const PAYMENT_METHODS = [
  { id: 'card',   label: 'Tarjeta',  icon: 'credit-card' },
  { id: 'paypal', label: 'PayPal',   icon: 'paypal' },
  { id: 'apple',  label: 'Apple Pay',icon: 'apple' },
];

const DELIVERY_OPTIONS = [
  { id: 'standard', label: 'Envío estándar',  sub: '3–5 días hábiles',  price: 0   },
  { id: 'express',  label: 'Envío express',   sub: '1–2 días hábiles',  price: 9   },
  { id: 'same',     label: 'Mismo día',       sub: 'Antes de las 22 h', price: 19  },
];

export default function Checkout() {
  const app    = useApp();
  const router = useRouter();
  const subtotal = formatTotal(app.cart);

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    address: '', city: '', postal: '', country: 'España',
  });
  const [payment,  setPayment]  = useState('card');
  const [delivery, setDelivery] = useState('standard');
  const [errors,   setErrors]   = useState({});
  const [done,     setDone]     = useState(false);

  const deliveryObj  = DELIVERY_OPTIONS.find(d => d.id === delivery);
  const deliveryCost = deliveryObj?.price ?? 0;
  const total        = Number(subtotal) + deliveryCost;

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Requerido';
    if (!form.email.trim())   e.email   = 'Requerido';
    if (!form.address.trim()) e.address = 'Requerido';
    if (!form.city.trim())    e.city    = 'Requerido';
    if (!form.postal.trim())  e.postal  = 'Requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setDone(true);
    app.cart.forEach(l => app.removeFromCart(l.product.id)); // vaciar carrito
  };

  /* ── Confirmación ── */
  if (done) return (
    <>
      <Head><title>Pedido confirmado — AURIX</title></Head>
      <div className="ck-confirm">
        <div className="ck-confirm__box">
          <div className="ck-confirm__mark">
            <Icon name="check" size={28} />
          </div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Pedido recibido</div>
          <h1 className="ck-confirm__title">¡Gracias, {form.name.split(' ')[0]}!</h1>
          <p className="ck-confirm__sub">
            Te hemos enviado la confirmación a <strong>{form.email}</strong>.
            Tu pedido llegará en <strong>{deliveryObj?.sub}</strong>.
          </p>
          <div className="ck-confirm__info mono">
            Dirección · {form.address}, {form.postal} {form.city}
          </div>
          <button className="btn btn--primary" onClick={() => router.push('/')}>
            Volver al inicio
          </button>
        </div>
      </div>
    </>
  );

  /* ── Formulario ── */
  return (
    <>
      <Head><title>Checkout — AURIX</title></Head>

      <div className="ck">
        {/* Header mínimo */}
        <header className="ck-nav">
          <button className="ck-nav__brand" onClick={() => router.push('/')}>
            <Monogram size={20} />
            <span>AURIX</span>
          </button>
          <div className="ck-nav__steps">
            <span className="ck-step is-on">Datos</span>
            <span className="ck-step-sep" />
            <span className="ck-step is-on">Envío</span>
            <span className="ck-step-sep" />
            <span className="ck-step">Pago</span>
          </div>
          <button className="ck-nav__back" onClick={() => router.back()}>
            <Icon name="arrow-left" size={16} /> Volver
          </button>
        </header>

        <form className="ck-body" onSubmit={submit} noValidate>
          {/* ── Columna izquierda ── */}
          <div className="ck-left">

            {/* Contacto */}
            <section className="ck-section">
              <h2 className="ck-section__title">Contacto</h2>
              <div className="ck-grid ck-grid--2">
                <Field label="Nombre completo" id="name"  value={form.name}  onChange={set('name')}  error={errors.name}  />
                <Field label="Email"           id="email" value={form.email} onChange={set('email')} error={errors.email} type="email" />
              </div>
              <Field label="Teléfono (opcional)" id="phone" value={form.phone} onChange={set('phone')} type="tel" />
            </section>

            {/* Dirección */}
            <section className="ck-section">
              <h2 className="ck-section__title">Dirección de envío</h2>
              <Field label="Calle y número" id="address" value={form.address} onChange={set('address')} error={errors.address} />
              <div className="ck-grid ck-grid--3">
                <Field label="Ciudad"        id="city"   value={form.city}   onChange={set('city')}   error={errors.city}   />
                <Field label="Código postal" id="postal" value={form.postal} onChange={set('postal')} error={errors.postal} />
                <Field label="País"          id="country" value={form.country} onChange={set('country')} />
              </div>
            </section>

            {/* Método de entrega */}
            <section className="ck-section">
              <h2 className="ck-section__title">Método de entrega</h2>
              <div className="ck-options">
                {DELIVERY_OPTIONS.map(d => (
                  <label key={d.id} className={`ck-option${delivery === d.id ? ' is-on' : ''}`}>
                    <input
                      type="radio" name="delivery" value={d.id}
                      checked={delivery === d.id}
                      onChange={() => setDelivery(d.id)}
                    />
                    <div className="ck-option__dot" />
                    <div className="ck-option__body">
                      <div className="ck-option__label">{d.label}</div>
                      <div className="ck-option__sub mono">{d.sub}</div>
                    </div>
                    <div className="ck-option__price mono">
                      {d.price === 0 ? 'Gratis' : `+€${d.price}`}
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {/* Método de pago */}
            <section className="ck-section">
              <h2 className="ck-section__title">Método de pago</h2>
              <div className="ck-pay-tabs">
                {PAYMENT_METHODS.map(m => (
                  <button
                    key={m.id} type="button"
                    className={`ck-pay-tab${payment === m.id ? ' is-on' : ''}`}
                    onClick={() => setPayment(m.id)}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {payment === 'card' && (
                <div className="ck-card-fields">
                  <Field label="Número de tarjeta" id="card-num" placeholder="1234 5678 9012 3456" />
                  <div className="ck-grid ck-grid--2">
                    <Field label="Caducidad" id="card-exp" placeholder="MM / AA" />
                    <Field label="CVC"       id="card-cvc" placeholder="•••" />
                  </div>
                  <Field label="Titular de la tarjeta" id="card-name" placeholder={form.name || 'Nombre en la tarjeta'} />
                </div>
              )}
              {payment !== 'card' && (
                <div className="ck-pay-alt">
                  <Icon name="check" size={16} />
                  <span>Serás redirigido a {PAYMENT_METHODS.find(m => m.id === payment)?.label} al confirmar.</span>
                </div>
              )}
            </section>

            <button type="submit" className="btn btn--primary btn--lg btn--icon ck-submit">
              Confirmar pedido
              <span className="btn__icon"><Icon name="arrow-right" size={15} /></span>
            </button>
            <p className="ck-hint mono">Pago cifrado · SSL · PCI-DSS · Datos no almacenados</p>
          </div>

          {/* ── Columna derecha: resumen ── */}
          <aside className="ck-right">
            <div className="ck-summary">
              <h3 className="ck-summary__title">Tu pedido</h3>

              <div className="ck-summary__lines">
                {app.cart.map(line => (
                  <div key={line.product.id} className="ck-summary__line">
                    <div className="ck-summary__thumb">
                      {line.product.image
                        ? <img src={line.product.image} alt={line.product.name} className="ck-summary__img" />
                        : <div className="ck-summary__ph mono">{line.product.name.slice(0, 6)}</div>
                      }
                      <span className="ck-summary__qty">{line.qty}</span>
                    </div>
                    <div className="ck-summary__info">
                      <div className="ck-summary__name">{line.product.name}</div>
                      <div className="ck-summary__meta eyebrow">{line.product.category}</div>
                    </div>
                    <div className="ck-summary__price mono">
                      {line.product.currency}{line.product.price * line.qty}
                    </div>
                  </div>
                ))}
              </div>

              <div className="ck-summary__divider" />

              <div className="ck-summary__rows">
                <div><span>Subtotal</span><span className="mono">€{subtotal}</span></div>
                <div>
                  <span>Envío</span>
                  <span className="mono">{deliveryCost === 0 ? 'Gratis' : `€${deliveryCost}`}</span>
                </div>
              </div>
              <div className="ck-summary__total">
                <span>Total</span>
                <span className="mono">€{total}</span>
              </div>

              <div className="ck-summary__delivery">
                <Icon name="truck" size={14} />
                <span>Entrega estimada: <strong>{deliveryObj?.sub}</strong></span>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </>
  );
}

/* Campo de formulario reutilizable */
function Field({ label, id, value, onChange, error, type = 'text', placeholder }) {
  return (
    <div className={`ck-field${error ? ' is-err' : ''}`}>
      <label className="ck-field__label" htmlFor={id}>{label}</label>
      <input
        id={id} type={type}
        className="ck-field__input"
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder ?? ''}
        autoComplete="on"
      />
      {error && <span className="ck-field__err">{error}</span>}
    </div>
  );
}
