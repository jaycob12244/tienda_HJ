# Tienda Visual Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar la página de tienda con cards portrait + quick-add en hover, animaciones de entrada escalonadas, transición al cambiar filtros, y pills de filtro con conteo y color accent.

**Architecture:** Dos archivos modificados — `styles/globals.css` recibe todos los cambios de estilos (aspect-ratio, quick-add, keyframes, filtro activo) y `pages/tienda.jsx` recibe la lógica de animación (isExiting, animKey, handleFilterChange, getCount) y el JSX actualizado. Sin nuevos componentes ni dependencias.

**Tech Stack:** Next.js 14, CSS custom properties (design tokens), CSS animations con `@keyframes`, React `useState` + `setTimeout`.

---

## File Map

| Archivo | Acción | Qué cambia |
|---------|--------|------------|
| `styles/globals.css` | Modificar | Línea 1723: `aspect-ratio 4/3 → 3/4`; línea 1753: `font-size 14px → 15px`; línea 1755: `color var(--paper) → var(--accent)`; línea 1845: `width/height 30px → 36px`; añadir `.sh-card__quick-add` después de `.sh-card__badge`; añadir `@keyframes card-enter/card-exit` + `.sh-card--animate-in/out` + `prefers-reduced-motion`; línea 1664: `.shop-filter.is-on` con `--accent` |
| `pages/tienda.jsx` | Modificar | Añadir estados `isExiting`, `animKey`; reemplazar `onClick` de filtros por `handleFilterChange`; añadir función `getCount`; actualizar JSX de cards con clases de animación + quick-add button; actualizar label de filtros con conteo |

---

## Task 1: CSS — Ajustes visuales de la card (aspect-ratio, tipografía, colores)

**Files:**
- Modify: `styles/globals.css`

Cuatro cambios puntuales en reglas ya existentes que transforman las cards de landscape a portrait y mejoran la jerarquía visual.

- [ ] **Step 1: Cambiar aspect-ratio de la imagen de 4/3 a 3/4**

En `styles/globals.css`, línea 1723, cambiar:
```css
  aspect-ratio: 4/3;
```
Por:
```css
  aspect-ratio: 3/4;
```

- [ ] **Step 2: Aumentar font-size del nombre de 14px a 15px**

En `styles/globals.css`, línea 1753, cambiar:
```css
.sh-card__name { font-size: 14px; font-weight: 600; color: var(--paper); line-height: 1.25; }
```
Por:
```css
.sh-card__name { font-size: 15px; font-weight: 600; color: var(--paper); line-height: 1.25; }
```

- [ ] **Step 3: Cambiar color del precio de --paper a --accent**

En `styles/globals.css`, línea 1755, cambiar:
```css
.sh-card__price { font-size: 13px; color: var(--paper); }
```
Por:
```css
.sh-card__price { font-size: 14px; color: var(--accent); }
```

- [ ] **Step 4: Aumentar tamaño del botón de favorito de 30px a 36px**

En `styles/globals.css`, línea 1845, cambiar:
```css
.sh-card__fav {
  position: absolute; top: 10px; left: 10px;
  width: 30px; height: 30px; border-radius: 50%;
```
Por:
```css
.sh-card__fav {
  position: absolute; top: 10px; left: 10px;
  width: 36px; height: 36px; border-radius: 50%;
```

- [ ] **Step 5: Verificar build**

```bash
cd C:\Users\Rivera\Documents\tienda_HJ
npm run build
```
Resultado esperado: `✓ Compiled successfully` — 13 páginas estáticas, sin errores.

- [ ] **Step 6: Commit**

```bash
git add styles/globals.css
git commit -m "feat(card): portrait aspect-ratio 3/4, larger name, accent price, bigger fav button"
```

---

## Task 2: CSS — Botón quick-add (slide-up en hover)

**Files:**
- Modify: `styles/globals.css`

Añadir la regla `.sh-card__quick-add` después del bloque de `.sh-card__badge` (alrededor de línea 1745). El botón siempre está en el DOM, oculto con `translateY(100%)`, y sube en hover.

- [ ] **Step 1: Localizar el punto de inserción**

En `styles/globals.css`, el bloque `.sh-card__badge` termina alrededor de la línea 1745:
```css
.sh-card__badge {
  position: absolute;
  top: 10px; right: 10px;
  padding: 3px 9px;
  background: rgba(10,10,10,0.85);
  color: var(--paper);
  font-size: 9px;
  border-radius: var(--r-pill);
  letter-spacing: 0.1em;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255,255,255,0.08);
}
```

- [ ] **Step 2: Insertar la regla .sh-card__quick-add inmediatamente después del cierre de .sh-card__badge**

```css
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
  z-index: 2;
}
.sh-card:hover .sh-card__quick-add {
  transform: translateY(0);
}
.sh-card__quick-add:hover {
  background: var(--ink-3);
}
```

- [ ] **Step 3: Verificar build**

```bash
npm run build
```
Resultado esperado: `✓ Compiled successfully`.

- [ ] **Step 4: Commit**

```bash
git add styles/globals.css
git commit -m "feat(card): add quick-add slide-up button CSS"
```

---

## Task 3: CSS — Keyframes de animación + filtro activo con accent

**Files:**
- Modify: `styles/globals.css`

Dos cambios independientes pero en el mismo archivo: añadir las keyframes y clases de animación, y actualizar el color del filtro activo.

- [ ] **Step 1: Cambiar el color del filtro activo de --paper a --accent**

En `styles/globals.css`, línea 1664, cambiar:
```css
.shop-filter.is-on { background: var(--paper); color: var(--ink); border-color: var(--paper); }
```
Por:
```css
.shop-filter.is-on { background: var(--accent); color: var(--ink); border-color: var(--accent); }
```

- [ ] **Step 2: Añadir keyframes y clases de animación al final del bloque Shop/Tienda**

Buscar el comentario `/* ========================================` que cierra la sección de tienda (después de los media queries del grid, alrededor de línea 1838) e insertar antes de él:

```css
/* Shop — card animations */
@keyframes card-enter {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes card-exit {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(10px); }
}
.sh-card--animate-in {
  animation: card-enter 380ms ease-out both;
}
.sh-card--animate-out {
  animation: card-exit 200ms ease-in both;
  pointer-events: none;
}
@media (prefers-reduced-motion: reduce) {
  .sh-card--animate-in,
  .sh-card--animate-out { animation: none !important; opacity: 1 !important; transform: none !important; }
}
```

- [ ] **Step 3: Verificar build**

```bash
npm run build
```
Resultado esperado: `✓ Compiled successfully`.

- [ ] **Step 4: Commit**

```bash
git add styles/globals.css
git commit -m "feat(shop): card-enter/exit keyframes, animate-in/out classes, accent filter active state"
```

---

## Task 4: JSX — tienda.jsx completo (estados, lógica, card JSX, filtros)

**Files:**
- Modify: `pages/tienda.jsx`

Este task actualiza el JSX de tienda.jsx en cuatro áreas: estados nuevos, función handleFilterChange, función getCount, y JSX de cards + filtros.

### Contexto del archivo actual

El archivo tiene esta estructura relevante:
```jsx
// Imports en líneas 1-16
// Estados: allProducts, activeFilter, quickView, loading, error (líneas 21-25)
// useEffect fetchProducts (líneas 27-40)
// useEffect router.query.categoria (líneas 42-45)
// const filtered = ... (línea 47)
// JSX: filtros con onClick={() => setActiveFilter(f.id)} (línea 69)
// JSX: cards como <article key={p.id} className="sh-card" ...> (línea 102)
```

- [ ] **Step 1: Añadir los dos estados nuevos después de los estados existentes**

Los estados actuales terminan en línea 25 (`const [error, setError] = useState(false);`).
Añadir inmediatamente después:

```jsx
const [isExiting, setIsExiting] = useState(false);
const [animKey,   setAnimKey]   = useState(0);
```

El bloque completo de estados queda:
```jsx
const [allProducts,  setAllProducts]  = useState([]);
const [activeFilter, setActiveFilter] = useState('todos');
const [quickView,    setQuickView]    = useState(null);
const [loading,      setLoading]      = useState(true);
const [error,        setError]        = useState(false);
const [isExiting,    setIsExiting]    = useState(false);
const [animKey,      setAnimKey]      = useState(0);
```

- [ ] **Step 2: Añadir las funciones handleFilterChange y getCount antes del return**

Insertar después de `const filtered = filterByCategory(allProducts, activeFilter);` (línea 47):

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

const getCount = (filterId) => {
  if (filterId === 'todos') return allProducts.length;
  return allProducts.filter(p => p.category === filterId).length;
};
```

- [ ] **Step 3: Actualizar los botones de filtro para usar handleFilterChange y mostrar conteo**

Buscar (alrededor de líneas 65-72):
```jsx
{FILTERS.map(f => (
  <button
    key={f.id}
    className={`shop-filter${activeFilter === f.id ? ' is-on' : ''}`}
    onClick={() => setActiveFilter(f.id)}
  >
    {f.label}
  </button>
))}
```

Reemplazar con:
```jsx
{FILTERS.map(f => (
  <button
    key={f.id}
    className={`shop-filter${activeFilter === f.id ? ' is-on' : ''}`}
    onClick={() => handleFilterChange(f.id)}
  >
    {f.label}{!loading && allProducts.length > 0 && ` (${getCount(f.id)})`}
  </button>
))}
```

- [ ] **Step 4: Actualizar el JSX de cada card con clases de animación y botón quick-add**

Buscar el `<article>` de la card (alrededor de línea 102):
```jsx
<article key={p.id} className="sh-card" onClick={() => setQuickView(p)}>
  <div className="sh-card__media">
    {p.image
      ? <img src={p.image} alt={p.name} className="sh-card__img" />
      : <SneakerStage label={p.name} />
    }
    <span className="sh-card__badge mono">{p.badge}</span>
    <button
      className={`sh-card__fav${app.favorites.has(p.id) ? ' is-on' : ''}`}
      onClick={e => { e.stopPropagation(); app.toggleFav(p.id); }}
      aria-label="Favorito"
    >
      <Icon name="heart" size={14} />
    </button>
  </div>
  <div className="sh-card__info">
    <div className="sh-card__brand eyebrow">{p.brand}</div>
    <div className="sh-card__name">{p.name}</div>
    <div className="sh-card__row">
      <span className="mono sh-card__price">{p.currency}{p.price}</span>
      <span className="sh-card__arrow"><Icon name="arrow-up-right" size={13} /></span>
    </div>
  </div>
</article>
```

Reemplazar con:
```jsx
<article
  key={`${p.id}-${animKey}`}
  className={`sh-card${isExiting ? ' sh-card--animate-out' : ' sh-card--animate-in'}`}
  style={{ animationDelay: isExiting ? `${Math.min(i, 7) * 30}ms` : `${Math.min(i, 7) * 60}ms` }}
  onClick={() => setQuickView(p)}
>
  <div className="sh-card__media">
    {p.image
      ? <img src={p.image} alt={p.name} className="sh-card__img" />
      : <SneakerStage label={p.name} />
    }
    <span className="sh-card__badge mono">{p.badge}</span>
    <button
      className={`sh-card__fav${app.favorites.has(p.id) ? ' is-on' : ''}`}
      onClick={e => { e.stopPropagation(); app.toggleFav(p.id); }}
      aria-label="Favorito"
    >
      <Icon name="heart" size={14} />
    </button>
    <button
      className="sh-card__quick-add"
      onClick={e => { e.stopPropagation(); app.addToCart(p); }}
      aria-label={`Agregar ${p.name} al carrito`}
    >
      + Carrito
    </button>
  </div>
  <div className="sh-card__info">
    <div className="sh-card__brand eyebrow">{p.brand}</div>
    <div className="sh-card__name">{p.name}</div>
    <div className="sh-card__row">
      <span className="mono sh-card__price">{p.currency}{p.price}</span>
      <span className="sh-card__arrow"><Icon name="arrow-up-right" size={13} /></span>
    </div>
  </div>
</article>
```

> Nota: El `map` callback ya tiene `(p, i)` — si no lo tiene, cambiar `filtered.map(p =>` por `filtered.map((p, i) =>` para tener el índice `i` disponible para el `animationDelay`.

- [ ] **Step 5: Verificar que el map usa el índice i**

Confirmar que la línea del map sea:
```jsx
{filtered.map((p, i) => (
```
Si era `filtered.map(p =>`, actualizarla ahora.

- [ ] **Step 6: Verificar build**

```bash
cd C:\Users\Rivera\Documents\tienda_HJ
npm run build
```
Resultado esperado: `✓ Compiled successfully` — 13 páginas estáticas, sin errores ni warnings.

- [ ] **Step 7: Verificar visualmente en dev server**

```bash
npm run dev
```

Abrir `http://localhost:3000/tienda` y verificar:

1. **Cards portrait** — las imágenes deben verse en formato vertical (3/4), más altas que anchas
2. **Precio en accent** — el precio debe verse en tono cálido (#C9B8A1) en lugar de blanco
3. **Quick-add** — al hacer hover sobre una card, debe aparecer una barra negra "+ CARRITO" desde abajo de la imagen
4. **Quick-add funciona** — al hacer clic en "+ CARRITO", el contador del carrito en la NavBar debe aumentar
5. **Animación de entrada** — al cargar la página, las cards deben entrar escalonadas (fade + slide up)
6. **Transición de filtro** — al cambiar de filtro, las cards actuales salen (fade out) y las nuevas entran (stagger in)
7. **Conteo en filtros** — los botones de filtro muestran `Todos (16)`, `Running (4)`, etc.
8. **Filtro activo accent** — el filtro seleccionado debe verse en tono cálido (#C9B8A1) en lugar de blanco

- [ ] **Step 8: Commit**

```bash
git add pages/tienda.jsx
git commit -m "feat(tienda): portrait cards, quick-add, stagger animations, filter transitions, filter counts"
```

---

## Verificación final

Después de los 4 tasks, el resultado esperado:

| Feature | Antes | Después |
|---------|-------|---------|
| Aspecto de imagen | Landscape 4/3 | Portrait 3/4 — más editorial |
| Precio | Blanco igual al nombre | Cálido (#C9B8A1) — más jerarquía |
| Quick-add | No existe | Barra slide-up en hover con "+ CARRITO" |
| Entrada de productos | Aparición instantánea | Stagger: cada card con 60ms de delay |
| Cambio de filtro | Instantáneo | Exit stagger 30ms + enter stagger 60ms |
| Conteo en filtros | Solo label | `Todos (16)`, `Running (4)`, etc. |
| Filtro activo | Blanco | Accent cálido (#C9B8A1) |

```bash
npm run build
# Esperado: ✓ Compiled successfully (13 páginas estáticas)
```
