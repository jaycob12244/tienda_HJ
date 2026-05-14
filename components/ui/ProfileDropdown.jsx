import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { logout } from '../../services/authService';

/**
 * Deriva un nombre legible de un email.
 * Toma la parte antes del '@', separa por no-letras, capitaliza el primer token.
 * Ej: "riverajacobo29@gmail.com" → "Riverajacobo"
 *     "maria.garcia@example.com" → "Maria"
 */
function deriveName(email) {
  const local = (email || '').split('@')[0];
  const tokens = local.split(/[^a-zA-Z]+/).filter(Boolean);
  const first = tokens[0] || local;
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

export default function ProfileDropdown({ user, favoritesCount, onClose, triggerRef = null }) {
  const [ordersCount, setOrdersCount] = useState(null);
  const panelRef = useRef(null);
  // Usar ref para onClose para evitar que el listener de click-outside
  // se vuelva a registrar en cada render cuando el padre pase una nueva ref.
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  // Fetch conteo de órdenes al montar
  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .then(({ count, error }) => {
        if (!cancelled && !error) setOrdersCount(count ?? 0);
      });
    return () => { cancelled = true; };
  }, [user?.id]);

  // Cerrar al hacer click fuera del panel
  useEffect(() => {
    function handleOutside(e) {
      // Si el click fue en el botón que abrió el dropdown, dejar que el
      // toggle de NavBar lo maneje — no cerrar aquí.
      if (triggerRef?.current && triggerRef.current.contains(e.target)) return;
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onCloseRef.current();
      }
    }
    // Usar setTimeout para que el click que abrió el panel no lo cierre inmediatamente
    const timerId = setTimeout(() => {
      document.addEventListener('mousedown', handleOutside);
    }, 0);
    return () => {
      clearTimeout(timerId);
      document.removeEventListener('mousedown', handleOutside);
    };
  }, []); // sin deps: el listener se registra una sola vez al montar

  async function handleLogout() {
    onClose(); // cerrar dropdown antes del await para feedback inmediato
    try {
      await logout();
      window.location.reload();
    } catch (e) {
      console.error('Error al cerrar sesión:', e);
    }
  }

  const name = deriveName(user.email);
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="pdrop" ref={panelRef} role="dialog" aria-label="Perfil de usuario">
      {/* Header: avatar + nombre + email */}
      <div className="pdrop__header">
        <div className="pdrop__avatar" aria-hidden="true">{initial}</div>
        <div className="pdrop__info">
          <p className="pdrop__name">{name}</p>
          <p className="pdrop__email" title={user.email ?? ''}>{user.email ?? '—'}</p>
        </div>
      </div>

      <div className="pdrop__divider" />

      {/* Stats: favoritos y compras */}
      <div className="pdrop__stats">
        <div className="pdrop__row">
          <span className="pdrop__row-label">♥ Favoritos</span>
          <span className="pdrop__row-value">{favoritesCount ?? '—'}</span>
        </div>
        <div className="pdrop__row">
          <span className="pdrop__row-label">📦 Compras</span>
          <span className="pdrop__row-value">
            {ordersCount !== null ? ordersCount : '—'}
          </span>
        </div>
      </div>

      <div className="pdrop__divider" />

      {/* Logout */}
      <button type="button" className="pdrop__logout" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  );
}
