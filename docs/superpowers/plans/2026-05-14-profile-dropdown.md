# Profile Dropdown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir un dropdown flotante de perfil en el NavBar que muestra nombre, email, favoritos, compras y botón de logout cuando el usuario está logueado; cuando no está logueado redirige a /login como antes.

**Architecture:** Se crea `ProfileDropdown.jsx` como componente autocontenido que recibe `user`, `favoritesCount` y `onClose` como props; NavBar mantiene el estado `profileOpen` localmente y renderiza el dropdown en un wrapper relativo al ícono de perfil. Las órdenes se obtienen con un COUNT query a Supabase al montar el dropdown.

**Tech Stack:** Next.js 14 Pages Router, React hooks (useState, useEffect, useRef), Supabase JS client (`lib/supabase.js`), authService (`services/authService.js`), AppContext (`context/AppContext.jsx`), CSS custom properties en `styles/globals.css`.

---

## Contexto del proyecto

- Base path del worktree: `C:\Users\Rivera\Documents\tienda_HJ\sprint3\.claude\worktrees\nervous-wilson-958925\sprint3\`
- `lib/supabase.js` — exporta el singleton `supabase`
- `services/authService.js` — exporta `logout()` (async, llama `supabase.auth.signOut()`, throws on error)
- `context/AppContext.jsx` — exporta `useApp()` que devuelve `{ user, favorites, ... }`
  - `user` es el objeto de Supabase Auth (tiene `user.id`, `user.email`) o `null`
  - `favorites` es un `Set` de product IDs
- `components/layout/NavBar.jsx` — usa `useApp()`, importa `Icon` desde `../ui/Icon`
- `styles/globals.css` — CSS global con variables `--ink`, `--paper`, `--paper-2`, `--line`, `--r-md`, `--font-mono`, `--ease`

## Estructura de archivos

| Archivo | Acción | Responsabilidad |
|---|---|---|
| `components/ui/ProfileDropdown.jsx` | CREAR | Panel flotante con info de usuario, stats y logout |
| `styles/globals.css` | MODIFICAR | Estilos `.pdrop` para el dropdown |
| `components/layout/NavBar.jsx` | MODIFICAR | Estado `profileOpen`, toggle en ícono perfil, render del dropdown |

---

## Task 1: ProfileDropdown component

**Files:**
- Create: `components/ui/ProfileDropdown.jsx`

Este componente muestra el panel flotante. Recibe `user` (objeto Auth de Supabase), `favoritesCount` (número) y `onClose` (función). Internamente:
- Deriva el nombre del usuario a partir del email
- Fetchea el conteo de órdenes desde Supabase al montar
- Cierra el panel cuando se hace click fuera

- [ ] **Step 1: Crear el archivo con la estructura base**

Crea `components/ui/ProfileDropdown.jsx` con este contenido completo:

```jsx
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

export default function ProfileDropdown({ user, favoritesCount, onClose }) {
  const [ordersCount, setOrdersCount] = useState(null);
  const panelRef = useRef(null);
  // Usar ref para onClose para evitar que el listener de click-outside
  // se vuelva a registrar en cada render cuando el padre pase una nueva ref.
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  // Fetch conteo de órdenes al montar
  useEffect(() => {
    supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .then(({ count, error }) => {
        if (!error) setOrdersCount(count ?? 0);
      });
  }, [user.id]);

  // Cerrar al hacer click fuera del panel
  useEffect(() => {
    function handleOutside(e) {
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
          <p className="pdrop__email" title={user.email}>{user.email}</p>
        </div>
      </div>

      <div className="pdrop__divider" />

      {/* Stats: favoritos y compras */}
      <div className="pdrop__stats">
        <div className="pdrop__row">
          <span className="pdrop__row-label">♥ Favoritos</span>
          <span className="pdrop__row-value">{favoritesCount}</span>
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
      <button className="pdrop__logout" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Verificar que el archivo existe y no tiene errores de sintaxis**

```bash
node --input-type=module --eval "import('./components/ui/ProfileDropdown.jsx').then(() => console.log('OK')).catch(e => console.error(e))" 2>&1 || echo "Sintaxis correcta (el error de import es esperado fuera de Next)"
```

El archivo no tiene tests unitarios porque depende del DOM y de Supabase. La verificación se hará visualmente en el browser en Task 3. Puedes también simplemente confirmar que el archivo fue creado correctamente con `ls components/ui/`.

---

## Task 2: CSS styles para ProfileDropdown

**Files:**
- Modify: `styles/globals.css` (agregar al final del archivo, antes del último comentario de sección si existe)

- [ ] **Step 1: Agregar los estilos al final de `styles/globals.css`**

Abre `styles/globals.css` y agrega este bloque al **final del archivo**:

```css
/* ─── Profile Dropdown ──────────────────────────────────── */
.pdrop {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 240px;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  box-shadow: 0 8px 32px -4px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.06);
  z-index: 200;
  overflow: hidden;
  animation: pdrop-in .18s var(--ease) both;
}
@keyframes pdrop-in {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}
.pdrop__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
}
.pdrop__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--ink);
  color: var(--paper);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  flex-shrink: 0;
  letter-spacing: 0;
}
.pdrop__info { overflow: hidden; }
.pdrop__name {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pdrop__email {
  font-size: 12px;
  color: var(--ink-3);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pdrop__divider {
  height: 1px;
  background: var(--line);
}
.pdrop__stats { padding: 8px 0; }
.pdrop__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  font-size: 13px;
  color: var(--ink);
}
.pdrop__row-label { color: var(--ink-3); }
.pdrop__row-value {
  font-weight: 600;
  font-family: var(--font-mono);
  font-size: 13px;
}
.pdrop__logout {
  display: block;
  width: 100%;
  padding: 12px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 500;
  color: var(--ink);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background .15s;
}
.pdrop__logout:hover { background: var(--paper-2); }
```

- [ ] **Step 2: Verificar que los estilos fueron agregados**

```bash
grep -c "pdrop" styles/globals.css
```

Esperado: un número mayor a 10 (hay más de 10 referencias a `.pdrop` en el bloque).

---

## Task 3: NavBar — wiring del dropdown

**Files:**
- Modify: `components/layout/NavBar.jsx`

El objetivo es:
1. Importar `ProfileDropdown`
2. Añadir estado `profileOpen`
3. Envolver el botón de perfil en un `<div>` con `position: relative` para que el dropdown se posicione correctamente
4. Cambiar el handler del botón: si `app.user` existe → toggle `profileOpen`; si no → `router.push('/login')`
5. Renderizar `<ProfileDropdown>` dentro del wrapper cuando `profileOpen` es `true`

- [ ] **Step 1: Abrir `components/layout/NavBar.jsx` y verificar el estado actual**

Lee el archivo. El botón de perfil actual es (línea ~63):
```jsx
<button className="nav__icon" aria-label="Cuenta" onClick={() => router.push('/login')}>
  <Icon name="user" size={18} />
</button>
```

- [ ] **Step 2: Reemplazar el contenido completo de `components/layout/NavBar.jsx`**

```jsx
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Icon, { Monogram } from '../ui/Icon';
import { useApp } from '../../context/AppContext';
import { NAV_LINKS } from '../../data/products';
import ProfileDropdown from '../ui/ProfileDropdown';

export default function NavBar() {
  const app = useApp();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (id) => {
    setMobileOpen(false);
    if (id === 'shop') {
      router.push('/tienda');
    } else if (id === 'performance') {
      router.push('/performance');
    } else if (id === 'technology') {
      if (router.pathname === '/') {
        const el = document.getElementById('technology');
        if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
      } else {
        router.push('/?scroll=technology');
      }
    }
  };

  const handleProfileClick = () => {
    if (app.user) {
      setProfileOpen(open => !open);
    } else {
      router.push('/login');
    }
  };

  // Callback estable para pasar a ProfileDropdown como onClose
  const closeProfile = useCallback(() => setProfileOpen(false), []);

  return (
    <header className={`nav${scrolled ? ' is-solid' : ''}`}>
      <div className="nav__inner container container--wide">
        {/* Brand */}
        <button className="nav__brand" onClick={() => router.push('/')} aria-label="AURIX home">
          <span className="nav__mark"><Monogram size={20} /></span>
          <span>AURIX</span>
        </button>

        {/* Desktop links */}
        <nav className="nav__links">
          {NAV_LINKS.map(l => (
            <button key={l.id} className="nav__link" onClick={() => handleNav(l.id)}>{l.label}</button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="nav__right">
          <button className="nav__icon" aria-label="Buscar" onClick={() => app.setSearchOpen(true)}>
            <Icon name="search" size={18} />
          </button>
          <button className="nav__icon" aria-label="Favoritos" style={{ position: 'relative' }} onClick={() => router.push('/favoritos')}>
            <Icon name="heart" size={18} />
            {app.favorites.size > 0 && (
              <span className="nav__badge">{app.favorites.size}</span>
            )}
          </button>

          {/* Perfil: wrapper relativo para posicionar el dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              className="nav__icon"
              aria-label="Cuenta"
              aria-expanded={profileOpen}
              onClick={handleProfileClick}
            >
              <Icon name="user" size={18} />
            </button>
            {profileOpen && app.user && (
              <ProfileDropdown
                user={app.user}
                favoritesCount={app.favorites.size}
                onClose={closeProfile}
              />
            )}
          </div>

          <button className="nav__bag" onClick={() => app.setCartOpen(true)} aria-label="Carrito">
            <Icon name="bag" size={18} />
            <span className="nav__bag-count">{app.cart.length}</span>
          </button>
          <button className="nav__cta btn btn--sm" onClick={() => router.push('/tienda')}>
            Ver colección
          </button>
          <button className="nav__burger" onClick={() => setMobileOpen(o => !o)} aria-label="Menú">
            <Icon name={mobileOpen ? 'close' : 'menu'} size={22} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="nav__mobile">
          {NAV_LINKS.map(l => (
            <button key={l.id} className="nav__mobile-link" onClick={() => handleNav(l.id)}>{l.label}</button>
          ))}
          <div className="nav__mobile-foot">
            <button className="btn btn--primary" onClick={() => { setMobileOpen(false); router.push('/tienda'); }}>Ver colección</button>
            <button className="btn btn--ghost" onClick={() => app.setCartOpen(true)}>Carrito ({app.cart.length})</button>
          </div>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 3: Verificar que el archivo fue guardado correctamente**

```bash
grep -n "ProfileDropdown\|profileOpen\|closeProfile" components/layout/NavBar.jsx
```

Salida esperada — tres referencias a `ProfileDropdown` (import, render, closing tag), dos a `profileOpen` (useState, setProfileOpen), una a `closeProfile`:
```
1:import ProfileDropdown from '../ui/ProfileDropdown';
17:  const [profileOpen, setProfileOpen] = useState(false);
39:  const closeProfile = useCallback(() => setProfileOpen(false), []);
...
```

- [ ] **Step 4: Commit**

```bash
git add components/ui/ProfileDropdown.jsx styles/globals.css components/layout/NavBar.jsx
git commit -m "feat: add profile dropdown to NavBar

Shows user name, email, favorites count and orders count when logged in.
Redirects to /login when not logged in (unchanged behavior).

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 4: Verificación manual (checklist)

No hay framework de testing configurado en este proyecto. Verificar manualmente con `npm run dev`:

- [ ] **Step 1: Levantar el servidor de desarrollo**

```bash
npm run dev
```

Abrir `http://localhost:3000` en el navegador.

- [ ] **Step 2: Caso — usuario NO logueado**

  1. Abre `http://localhost:3000`
  2. Haz click en el ícono de perfil (persona) en el NavBar
  3. ✅ Esperado: navega a `/login` (sin dropdown)

- [ ] **Step 3: Caso — usuario logueado ve el dropdown**

  1. Inicia sesión en `/login`
  2. Navega a la home
  3. Haz click en el ícono de perfil
  4. ✅ Esperado: aparece el panel flotante con nombre derivado del email, el email completo (con ellipsis si es largo), "♥ Favoritos" con el conteo correcto, "📦 Compras" con número (o `—` mientras carga)
  5. El panel debe aparecer debajo y a la derecha del ícono con una animación suave

- [ ] **Step 4: Caso — click fuera cierra el dropdown**

  1. Con el dropdown abierto, haz click en cualquier área fuera del panel
  2. ✅ Esperado: el dropdown se cierra

- [ ] **Step 5: Caso — click en ícono con dropdown abierto lo cierra**

  1. Haz click en el ícono de perfil para abrir el dropdown
  2. Haz click de nuevo en el ícono de perfil
  3. ✅ Esperado: el dropdown se cierra (toggle)

- [ ] **Step 6: Caso — Cerrar sesión**

  1. Con el dropdown abierto, haz click en "Cerrar sesión"
  2. ✅ Esperado: el dropdown se cierra inmediatamente, la sesión se cierra (el ícono de perfil vuelve a redirigir a /login)

- [ ] **Step 7: Caso — email largo**

  1. Revisa visualmente que el email en el dropdown usa `text-overflow: ellipsis` si es muy largo
  2. ✅ Esperado: el panel no se desborda, el texto se trunca con `...`
