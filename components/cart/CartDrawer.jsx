import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Icon from '../ui/Icon';
import SneakerStage from '../ui/SneakerStage';
import { useApp } from '../../context/AppContext';
import { formatTotal } from '../../utils/formatPrice';

export default function CartDrawer() {
  const app  = useApp();
  const router = useRouter();
  const total = formatTotal(app.cart);

  useEffect(() => {
    document.body.style.overflow = app.cartOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [app.cartOpen]);

  return (
    <div className={`cart${app.cartOpen ? ' is-open' : ''}`} aria-hidden={!app.cartOpen}>
      <div className="cart__backdrop" onClick={() => app.setCartOpen(false)} />
      <aside className="cart__panel" role="dialog" aria-label="Carrito">
        {/* Header */}
        <div className="cart__head">
          <div>
            <div className="eyebrow">Carrito</div>
            <h2 className="cart__title">Tu selección</h2>
          </div>
          <button className="cart__close" onClick={() => app.setCartOpen(false)} aria-label="Cerrar">
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="cart__body">
          {app.cart.length === 0 ? (
            <div className="cart__empty">
              <div className="cart__empty-mark"><Icon name="bag" size={22} /></div>
              <h3>Tu carrito está silencioso.</h3>
              <p>Empieza explorando nuestra colección. Tus selecciones aparecerán aquí.</p>
              <button className="btn btn--primary" onClick={() => app.setCartOpen(false)}>
                Volver a la colección
              </button>
            </div>
          ) : (
            <div className="cart__lines">
              {app.cart.map(line => (
                <div className="cart__line" key={line.product.id}>
                  <div className="cart__thumb">
                    {line.product.image
                      ? <img src={line.product.image} alt={line.product.name} className="cart__thumb-img" />
                      : <SneakerStage label={line.product.name} />
                    }
                  </div>
                  <div className="cart__lineMeta">
                    <div className="eyebrow">{line.product.category}</div>
                    <div className="cart__lineName">{line.product.name}</div>
                    <div className="cart__lineSub">
                      Talla 42{line.product.colorway ? ` · ${line.product.colorway}` : line.product.brand ? ` · ${line.product.brand}` : ''}
                    </div>
                    <div className="cart__lineFoot">
                      <div className="cart__qty">
                        <button onClick={() => app.changeQty(line.product.id, -1)} aria-label="Quitar uno">
                          <Icon name="minus" size={12} />
                        </button>
                        <span className="mono">{line.qty}</span>
                        <button onClick={() => app.changeQty(line.product.id, +1)} aria-label="Añadir uno">
                          <Icon name="plus" size={12} />
                        </button>
                      </div>
                      <div className="cart__linePrice">
                        {line.product.currency}{line.product.price * line.qty}
                      </div>
                    </div>
                  </div>
                  <button
                    className="cart__remove"
                    onClick={() => app.removeFromCart(line.product.id)}
                    aria-label="Quitar producto"
                  >
                    <Icon name="close" size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {app.cart.length > 0 && (
          <div className="cart__foot">
            <div className="cart__rows">
              <div><span>Subtotal</span><span className="mono">€{total}</span></div>
              <div><span>Envío</span><span className="mono">Gratis</span></div>
              <div className="cart__totalRow"><span>Total</span><span className="mono">€{total}</span></div>
            </div>
            <button
              className="btn btn--primary btn--lg btn--icon"
              style={{ width: '100%' }}
              onClick={() => { app.setCartOpen(false); router.push('/checkout'); }}
            >
              Tramitar pedido <span className="btn__icon"><Icon name="arrow-right" size={14} /></span>
            </button>
            <p className="cart__hint mono">Pago cifrado · Apple Pay · Stripe · 3 plazos sin coste</p>
          </div>
        )}
      </aside>
    </div>
  );
}
