# Tienda UI States — Design Spec

**Date:** 2026-05-17  
**Sprint:** 7  
**Scope:** Página `/tienda` — estados de loading, empty y error

---

## Goal

Reemplazar los estados de UI genéricos de la página de tienda (skeleton mal proporcionado, empty/error con texto plano) con estados visualmente ricos, on-brand y coherentes entre sí. Resultado: una página de catálogo que se siente profesional en todos sus estados, no solo cuando tiene productos cargados.

---

## Architecture

Sin componentes nuevos. Todas las mejoras viven en dos archivos:

- **`pages/tienda.jsx`** — JSX de los tres estados (loading, empty, error)
- **`styles/globals.css`** — clases CSS nuevas dentro del bloque `Shop / Tienda page`

El icono `PackageSearch` y `WifiOff` vienen de `lucide-react` (ya en el proyecto a través de `components/ui/Icon.jsx` o import directo).

---

## Design System

### Shared visual language para todos los estados

Todos los estados (empty y error) comparten el mismo layout de tres niveles:

```
[icono Lucide, 48px, color: var(--muted)]
[título, Instrument Serif italic, editorial]
[subtexto, 14px, var(--muted-2)]
[CTA, btn btn--ghost]
```

Contenedor base `.shop-empty`:
```css
.shop-empty {
  padding: 100px 0;
  text-align: center;
  color: var(--muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
```

Clases nuevas (extensión de `.shop-empty`):
```css
.shop-empty__icon {
  color: var(--muted);
  margin-bottom: 8px;
  opacity: 0.6;
}

.shop-empty__title {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(24px, 3.5vw, 38px);
  color: var(--paper);
  letter-spacing: -0.02em;
  line-height: 1.15;
  margin: 0;
}

.shop-empty__sub {
  font-size: 14px;
  color: var(--muted-2);
  max-width: 32ch;
  line-height: 1.6;
  margin: 0;
}
```

---

## State 1: Skeleton loading cards

### Problema
`.sh-skeleton` actual tiene `aspect-ratio: 3/4` pero la card real tiene imagen `4/3` + info section debajo. El skeleton no se parece a lo que va a reemplazar.

### Solución
El skeleton se estructura para imitar la card real:

```
┌────────────────────────────┐
│                            │  ← .sh-skeleton__img  aspect-ratio: 4/3, shimmer
│         shimmer            │
│                            │
├────────────────────────────┤  ← .sh-skeleton__info  padding: 14px 16px 16px
│ ▓▓▓▓▓▓                    │  ← .sh-skeleton__line  40% width, 8px height
│ ▓▓▓▓▓▓▓▓▓▓▓               │  ← .sh-skeleton__line  70% width, 12px height
│ ▓▓▓▓                      │  ← .sh-skeleton__line  30% width, 10px height
└────────────────────────────┘
```

**CSS nuevo:**
```css
.sh-skeleton {
  background: var(--ink-2);
  border-radius: var(--r-md);
  border: 1px solid var(--ink-3);
  overflow: hidden;
  /* Eliminar aspect-ratio: 3/4 del CSS actual */
}

.sh-skeleton__img {
  aspect-ratio: 4/3;
  background: var(--ink-3);
  position: relative;
  overflow: hidden;
}

.sh-skeleton__img::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255,255,255,0.06) 50%,
    transparent 100%
  );
  animation: skeleton-pulse 1.6s ease-in-out infinite;
  transform: translateX(-100%);
}

.sh-skeleton__info {
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sh-skeleton__line {
  height: 10px;
  background: var(--ink-3);
  border-radius: 4px;
}
```

**JSX del skeleton card:**
```jsx
<div className="sh-skeleton">
  <div className="sh-skeleton__img" />
  <div className="sh-skeleton__info">
    <div className="sh-skeleton__line" style={{ width: '40%' }} />
    <div className="sh-skeleton__line" style={{ width: '70%', height: '12px' }} />
    <div className="sh-skeleton__line" style={{ width: '30%' }} />
  </div>
</div>
```

El keyframe `@keyframes skeleton-pulse` ya existe en globals.css — no duplicar.

---

## State 2: Empty state (sin productos en filtro)

**Trigger:** `!loading && !error && filtered.length === 0`

**Icono:** `PackageSearch` de lucide-react, size 48, className `shop-empty__icon`

**JSX:**
```jsx
<div className="shop-empty">
  <PackageSearch size={48} className="shop-empty__icon" />
  <h2 className="shop-empty__title">
    Sin resultados<br />
    <em>en esta categoría</em>
  </h2>
  <p className="shop-empty__sub">
    Prueba con otro filtro o explora toda la tienda
  </p>
  <button
    className="btn btn--ghost"
    onClick={() => setActiveFilter('todos')}
  >
    Ver todos
  </button>
</div>
```

---

## State 3: Error state (fallo de carga)

**Trigger:** `!loading && error`

**Icono:** `WifiOff` de lucide-react, size 48, className `shop-empty__icon`

**JSX:**
```jsx
<div className="shop-empty">
  <WifiOff size={48} className="shop-empty__icon" />
  <h2 className="shop-empty__title">
    Algo salió mal<br />
    <em>cargando la colección</em>
  </h2>
  <p className="shop-empty__sub">
    Revisa tu conexión e intenta de nuevo
  </p>
  <button
    className="btn btn--ghost"
    onClick={() => window.location.reload()}
  >
    Reintentar
  </button>
</div>
```

---

## UX Guidelines aplicadas (UI/UX Pro Max)

| Regla | Aplicación |
|-------|------------|
| `progressive-loading` | Skeleton imita estructura real → menos layout shift percibido |
| `empty-states` | Mensaje útil + acción clara cuando no hay contenido |
| `error-recovery` | Error state incluye causa (icono WifiOff) + camino de recuperación (Reintentar) |
| `motion-meaning` | Shimmer comunica "cargando" — no es decorativo |
| `font-pairing` | Instrument Serif italic en títulos de estado → on-brand editorial |
| `whitespace-balance` | 100px padding vertical — estados respiran, no se sienten vacíos |
| `color-semantic` | `--muted` para icono, `--paper` para título, `--muted-2` para subtexto — jerarquía clara |

---

## Files to Modify

| Archivo | Cambio |
|---------|--------|
| `styles/globals.css` | Reescribir `.sh-skeleton`, añadir `.sh-skeleton__img`, `.sh-skeleton__info`, `.sh-skeleton__line`, añadir `.shop-empty__icon`, `.shop-empty__title`, `.shop-empty__sub` |
| `pages/tienda.jsx` | Actualizar JSX de los tres estados (loading skeleton, empty, error) + imports de lucide-react |

---

## Out of Scope

- Cards de producto (hover states, quick-add, etc.)
- Filtros (conteo, animación de transición)
- Página `/favoritos` (tiene su propio empty state `.fav-empty` ya implementado)
- Accesibilidad avanzada (keyboard nav en cards)
