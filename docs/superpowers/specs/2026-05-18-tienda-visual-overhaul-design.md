# Tienda Visual Overhaul — Design Spec

**Date:** 2026-05-18  
**Sprint:** 7b  
**Scope:** Página `/tienda` — cards rediseñadas, animaciones de entrada/filtro, filtros con conteo

---

## Goal

Transformar la página de tienda de una grilla estática a una experiencia visual dinámica y on-brand: cards portrait con quick-add en hover, animaciones de entrada escalonadas, transición cinematográfica al cambiar filtros, y pills de filtro con conteo y color accent.

---

## Architecture

Tres archivos modificados:

- **`styles/globals.css`** — nuevas reglas para `.sh-card` (aspect-ratio 3/4, quick-add button), keyframes `card-enter` / `card-exit`, actualización de `.shop-filter.is-on` con `--accent`
- **`pages/tienda.jsx`** — lógica de stagger (`animKey`, `isExiting`), función `getCount`, JSX de quick-add button, inline `animationDelay` por card
- **`context/AppContext.jsx`** — sin cambios (el quick-add usa `app.addToCart` que ya existe)

---

## Section 1: Cards rediseñadas

### Aspect ratio

`.sh-card__media` cambia de `aspect-ratio: 4/3` a `aspect-ratio: 3/4`. Los sneakers en formato portrait son más editoriales y ocupan más espacio vertical, generando mejor impacto visual en el grid.

### Quick-add button

Barra negra de 40px de alto pegada al borde inferior de la imagen. Siempre en DOM, se oculta con `transform: translateY(100%)`, aparece en hover con `transform: translateY(0)`. Transición 220ms ease-out.

```
.sh-card__quick-add {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 40px;
  background: var(--ink);
  color: var(--paper);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  transform: translateY(100%);
  transition: transform 220ms ease-out;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.sh-card:hover .sh-card__quick-add {
  transform: translateY(0);
}
```

El botón llama a `app.addToCart(product)` con `e.stopPropagation()` para no abrir el QuickViewModal.

### Info section

- Nombre: `font-size: 15px` (era 14px)
- Precio: `color: var(--accent)` en lugar de `var(--paper)` — diferencia precio de nombre, más jerarquía visual
- Fav button: `width/height: 36px` (era 30px)

### CSS completo de cambios en .sh-card

```css
/* Cambiar en .sh-card__media */
aspect-ratio: 3 / 4;   /* era 4/3 */

/* Cambiar en .sh-card__name */
font-size: 15px;        /* era 14px */

/* Cambiar en .sh-card__price */
color: var(--accent);   /* era var(--paper) */

/* Cambiar en .sh-card__fav */
width: 36px; height: 36px;  /* era 30px */
```

---

## Section 2: Animaciones

### Keyframes

```css
@keyframes card-enter {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes card-exit {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(10px); }
}

@media (prefers-reduced-motion: reduce) {
  .sh-card--animate-in,
  .sh-card--animate-out { animation: none !important; }
}
```

### Clase de animación

```css
.sh-card--animate-in {
  animation: card-enter 380ms ease-out both;
}
.sh-card--animate-out {
  animation: card-exit 200ms ease-in both;
  pointer-events: none;
}
```

### Estado en tienda.jsx

Dos estados nuevos:
```jsx
const [isExiting, setIsExiting] = useState(false);
const [animKey,   setAnimKey]   = useState(0);
```

### Función handleFilterChange

Reemplaza el `onClick={() => setActiveFilter(f.id)}` en los botones de filtro:

```jsx
const handleFilterChange = (filterId) => {
  if (filterId === activeFilter) return;
  setIsExiting(true);
  setTimeout(() => {
    setActiveFilter(filterId);
    setAnimKey(k => k + 1);
    setIsExiting(false);
  }, 250);
};
```

### JSX de la card con stagger

```jsx
<article
  key={`${p.id}-${animKey}`}
  className={`sh-card${isExiting ? ' sh-card--animate-out' : ' sh-card--animate-in'}`}
  style={{ animationDelay: isExiting ? `${Math.min(i, 7) * 30}ms` : `${Math.min(i, 7) * 60}ms` }}
  onClick={() => setQuickView(p)}
>
```

- Salida: stagger de 30ms entre cards (rápido, 8 cards = 210ms + 200ms anim = ~410ms total)
- Entrada: stagger de 60ms entre cards (más suave, primeras 8 con delay, el resto sin delay)
- `Math.min(i, 7)` limita el stagger a las primeras 8 cards para no alargar demasiado si hay 16 productos

---

## Section 3: Filtros mejorados

### Conteo de productos

Función en `tienda.jsx`:

```jsx
const getCount = (filterId) => {
  if (filterId === 'todos') return allProducts.length;
  return allProducts.filter(p => p.category === filterId).length;
};
```

Label del filtro:
```jsx
{f.label} {!loading && allProducts.length > 0 && `(${getCount(f.id)})`}
```

El conteo solo aparece cuando los productos ya cargaron (`!loading && allProducts.length > 0`).

### Color del filtro activo

En `globals.css`, cambiar `.shop-filter.is-on`:

```css
/* Antes */
.shop-filter.is-on { background: var(--paper); color: var(--ink); border-color: var(--paper); }

/* Después */
.shop-filter.is-on { background: var(--accent); color: var(--ink); border-color: var(--accent); }
```

`--accent: #C9B8A1` — tono cálido y sofisticado, on-brand con la paleta editorial de AURIX.

---

## UX Guidelines aplicadas (UI/UX Pro Max)

| Regla | Aplicación |
|-------|------------|
| `duration-timing` | card-enter: 380ms; card-exit: 200ms; quick-add: 220ms — todos dentro de 150–400ms |
| `easing` | ease-out para entradas, ease-in para salidas |
| `exit-faster-than-enter` | Exit 200ms vs enter 380ms (~53% — correcto) |
| `stagger-sequence` | 30ms salida / 60ms entrada — dentro del rango 30–50ms recomendado |
| `reduced-motion` | `@media (prefers-reduced-motion: reduce)` desactiva todas las animaciones |
| `transform-performance` | Solo `opacity` y `transform` — sin animar width/height/top/left |
| `touch-target-size` | Fav button sube a 36px (acercándose al mínimo 44pt) |
| `hover-vs-tap` | Quick-add siempre en DOM — accesible por keyboard/focus, no solo hover |
| `motion-meaning` | Stagger comunica "aparición progresiva", exit/enter comunica "cambio de contenido" |

---

## Files to Modify

| Archivo | Cambio |
|---------|--------|
| `styles/globals.css` | `aspect-ratio: 3/4` en `__media`; `font-size: 15px` en `__name`; `color: var(--accent)` en `__price`; `36px` en `__fav`; añadir `.sh-card__quick-add`; añadir `@keyframes card-enter/card-exit`; añadir `.sh-card--animate-in/out`; `prefers-reduced-motion`; `.shop-filter.is-on` con `--accent` |
| `pages/tienda.jsx` | Estados `isExiting`, `animKey`; función `handleFilterChange`; función `getCount`; JSX de card con `animKey` en key, clases animate, `animationDelay`; JSX de filtros con `handleFilterChange` y conteo; JSX de quick-add button |

---

## Out of Scope

- Animaciones en páginas distintas a `/tienda`
- Quick-add en la página `/favoritos` (tiene su propio layout)
- Cambios al QuickViewModal
- Cambios al NavBar o CartDrawer
