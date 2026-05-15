import { useState } from 'react';
import Icon from '../ui/Icon';
import { updateOrderStatus } from '../../services/adminService';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

/**
 * Fila de tabla para una orden. Al hacer click expande el panel de detalle.
 * @param {object}   order          - Objeto orden con order_items[]
 * @param {function} onStatusChange - (id, newStatus) => void — para actualizar el estado en el padre
 */
export default function OrderRow({ order, onStatusChange }) {
  const [open,   setOpen]   = useState(false);
  const [status, setStatus] = useState(order.status ?? 'pending');
  const [saving, setSaving] = useState(false);

  const handleStatusUpdate = async () => {
    setSaving(true);
    try {
      await updateOrderStatus(order.id, status);
      onStatusChange(order.id, status);
    } finally {
      setSaving(false);
    }
  };

  const date = new Date(order.created_at).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <>
      <tr style={{ cursor: 'pointer' }} onClick={() => setOpen(o => !o)}>
        <td className="mono" style={{ fontSize: 12 }}>{order.id.slice(0, 8)}…</td>
        <td style={{ fontWeight: 500 }}>{order.full_name}</td>
        <td className="mono">{order.currency ?? '€'}{order.total}</td>
        <td style={{ fontSize: 12, color: 'var(--muted)' }}>{order.payment_method}</td>
        <td>
          <span className={`adm-status adm-status--${status}`}>{status}</span>
        </td>
        <td className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{date}</td>
        <td style={{ color: 'var(--muted)' }}>
          <Icon name={open ? 'close' : 'arrow-right'} size={14} />
        </td>
      </tr>

      {open && (
        <tr>
          <td colSpan={7} style={{ padding: 0 }}>
            <div className="adm-order-detail">
              {/* Productos + cambio de estado */}
              <div>
                <div className="eyebrow adm-order-detail__section-title">Productos</div>
                <div className="adm-items-list">
                  {(order.order_items ?? []).map(item => (
                    <div key={item.id} className="adm-item-row">
                      <div>
                        <span className="adm-item-row__name">{item.product_name}</span>
                        <span className="adm-item-row__qty"> ×{item.qty}</span>
                      </div>
                      <span className="adm-item-row__price">
                        {order.currency ?? '€'}{item.product_price}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="adm-status-form">
                  <select
                    className="adm-select"
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button
                    className="btn btn--primary btn--sm"
                    onClick={handleStatusUpdate}
                    disabled={saving || status === order.status}
                  >
                    {saving ? 'Guardando…' : 'Actualizar estado'}
                  </button>
                </div>
              </div>

              {/* Dirección de entrega */}
              <div>
                <div className="eyebrow adm-order-detail__section-title">Entrega</div>
                <div className="adm-address">
                  <strong>{order.full_name}</strong><br />
                  {order.address}<br />
                  {order.postal_code} {order.city}<br />
                  <span style={{ color: 'var(--muted)', fontSize: 12 }}>
                    {order.delivery_method}
                  </span>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
