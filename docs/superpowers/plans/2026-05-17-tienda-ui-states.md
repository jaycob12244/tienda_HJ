# Tienda UI States Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar los estados de UI genéricos de la página de tienda (skeleton mal proporcionado, empty/error con texto plano) con estados visualmente ricos, on-brand y coherentes entre sí.

**Architecture:** Dos archivos modificados — `components/ui/Icon.jsx` recibe dos iconos nuevos (`package`, `alert-circle`), `styles/globals.css` reestructura el skeleton y añade clases para empty/error states, y `pages/tienda.jsx` actualiza el JSX de los tres estados. Sin nuevos componentes ni dependencias.

**Tech Stack:** Next.js 14, CSS custom properties (design tokens en `styles/globals.css`), SVG inline via componente `Icon` custom.

---

## File Map

| Archivo | Acción | Qué cambia |
|---------|--------|------------|
| `components/ui/Icon.jsx` | Modificar | Añadir paths SVG de `'package'` y `'alert-circle'` al objeto `icons` |
| `styles/globals.css` | Modificar | Reestructurar `.sh-skeleton` (líneas 1739–1757); actualizar `.shop-empty` y añadir `.shop-empty__icon`, `.shop-empty__title`, `.shop-empty__sub` (líneas 1674–1678) |
| `pages/tienda.jsx` | Modificar | Actualizar JSX de loading skeleton (líneas 80–85), empty state (líneas 94–97) y error state (líneas 86–93) |

---

## Task 1: Añadir iconos `package` y `alert-circle` a Icon.jsx

**Files:**
- Modify: `components/ui/Icon.jsx`

El componente `Icon` usa un objeto `icons` con SVG paths inline. No hay dependencia de lucide-react — se añaden los paths directamente.

- [ ] **Step 1: Abrir el archivo y localizar el objeto `icons`**

El objeto está en `components/ui/Icon.jsx` línea 4. Actualmente el último icono es `check` (línea 29).

- [ ] **Step 2: Añadir los dos iconos nuevos al final del objeto `icons`, antes del cierre `}`**

Reemplazar en `components/ui/Icon.jsx`:

```jsx
    check:            <polyline points="20 6 9 17 4 12" />,
  };
```

Con:

```jsx
    check:            <polyline points="20 6 9 17 4 12" />,
    package:          <><path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>,
    'alert-circle':   <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
  };
```

- [ ] **Step 3: Verificar que el build no lanza errores**

```bash
cd C:\Users\Rivera\Documents\tienda_HJ
npm run build
```

Resultado esperado: `✓ Compiled successfully` — 13 páginas estáticas, sin errores.

- [ ] **Step 4: Commit**

```bash
git add components/ui/Icon.jsx
git commit -m "feat(icon): add package and alert-circle icons for shop states"
```

---

## Task 2: Reestructurar CSS del skeleton

**Files:**
- Modify: `styles/globals.css` (líneas 1739–1757)

El skeleton actual es un único bloque con `aspect-ratio: 3/4` y shimmer en `::after`. Hay que convertirlo en una estructura que imite la card real: imagen (4/3) + área de info con líneas.

- [ ] **Step 1: Localizar el bloque a reemplazar**

En `styles/globals.css`, líneas 1739–1757:

```css
.sh-skeleton {
  background: var(--ink-2);
  border-radius: var(--r-md);
  aspect-ratio: 3 / 4;
  position: relative;
  overflow: hidden;
}
.sh-skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--ink-3) 50%,
    transparent 100%
  );
  animation: skeleton-pulse 1.4s var(--ease) infinite;
}
```

- [ ] **Step 2: Reemplazar ese bloque completo con la nueva estructura**

```css
.sh-skeleton {
  background: var(--ink-2);
  border: 1px solid var(--ink-3);
  border-radius: var(--r-md);
  overflow: hidden;
}
.sh-skeleton__img {
  aspect-ratio: 4 / 3;
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

> Nota: `@keyframes skeleton-pulse` ya existe en la línea 1734 — no duplicar.

- [ ] **Step 3: Verificar que `next build` pasa**

```bash
npm run build
```

Resultado esperado: `✓ Compiled successfully` sin errores CSS.

- [ ] **Step 4: Commit**

```bash
git add styles/globals.css
git commit -m "feat(skeleton): restructure sh-skeleton to match card proportions (4/3 image + info lines)"
```

---

## Task 3: Actualizar JSX del skeleton en tienda.jsx

**Files:**
- Modify: `pages/tienda.jsx` (líneas 79–85)

El JSX actual renderiza `<div className="sh-skeleton" />` — un bloque vacío. Hay que actualizarlo para usar la nueva estructura HTML que el CSS de Task 2 espera.

- [ ] **Step 1: Localizar el bloque de loading en tienda.jsx**

Líneas 79–85:

```jsx
{loading && (
  <div className="shop-grid">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="sh-skeleton" />
    ))}
  </div>
)}
```

- [ ] **Step 2: Reemplazar ese bloque con el JSX estructurado**

```jsx
{loading && (
  <div className="shop-grid">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="sh-skeleton">
        <div className="sh-skeleton__img" />
        <div className="sh-skeleton__info">
          <div className="sh-skeleton__line" style={{ width: '40%' }} />
          <div className="sh-skeleton__line" style={{ width: '70%', height: '12px' }} />
          <div className="sh-skeleton__line" style={{ width: '30%' }} />
        </div>
      </div>
    ))}
  </div>
)}
```

> Se cambia `length: 4` por `length: 8` para llenar el grid de 4 columnas × 2 filas y que el loading se vea completo en desktop.

- [ ] **Step 3: Verificar visualmente**

```bash
npm run dev
```

Abrir `http://localhost:3000/tienda`. El skeleton debe mostrarse como 8 tarjetas con área de imagen (proporcional a las cards reales) y 3 líneas grises en la sección de info. El shimmer debe recorrer solo el área de imagen.

- [ ] **Step 4: Commit**

```bash
git add pages/tienda.jsx
git commit -m "feat(tienda): update skeleton JSX to use structured sh-skeleton__img + info lines"
```

---

## Task 4: Añadir CSS de empty y error states

**Files:**
- Modify: `styles/globals.css` (línea 1674 — bloque `.shop-empty`)

El `.shop-empty` actual tiene solo 4 propiedades básicas. Hay que extenderlo con flexbox y añadir las subclases para icono, título y subtexto.

- [ ] **Step 1: Localizar el bloque a modificar**

En `styles/globals.css`, líneas 1674–1678:

```css
.shop-empty {
  padding: 80px 0;
  text-align: center;
  color: var(--muted);
}
```

- [ ] **Step 2: Reemplazar ese bloque con la versión extendida**

```css
.shop-empty {
  padding: 100px 0;
  text-align: center;
  color: var(--muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.shop-empty__icon {
  color: var(--muted);
  opacity: 0.5;
  margin-bottom: 4px;
}
.shop-empty__title {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(24px, 3.5vw, 38px);
  font-weight: 400;
  color: var(--paper);
  letter-spacing: -0.02em;
  line-height: 1.2;
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

- [ ] **Step 3: Verificar que `next build` pasa**

```bash
npm run build
```

Resultado esperado: `✓ Compiled successfully`.

- [ ] **Step 4: Commit**

```bash
git add styles/globals.css
git commit -m "feat(shop): extend shop-empty with flexbox layout and editorial state subclasses"
```

---

## Task 5: Actualizar JSX de empty state y error state

**Files:**
- Modify: `pages/tienda.jsx` (líneas 86–98)

Los dos estados actuales son texto plano con `<span className="mono">`. Hay que reemplazarlos con la estructura icono + título editorial + subtexto + CTA, usando los iconos añadidos en Task 1 y las clases CSS de Task 4.

- [ ] **Step 1: Verificar que el import de Icon ya existe en tienda.jsx**

La línea 7 de `pages/tienda.jsx` ya tiene:
```jsx
import Icon from '../components/ui/Icon';
```

No necesitas añadir nada.

- [ ] **Step 2: Localizar los dos bloques de estado a reemplazar**

Error state (líneas 86–93):
```jsx
{!loading && error && (
  <div className="shop-empty">
    <span className="mono">Error al cargar productos.</span>
    <button className="btn btn--ghost" style={{ marginTop: 16 }} onClick={() => window.location.reload()}>
      Reintentar
    </button>
  </div>
)}
```

Empty state (líneas 94–98):
```jsx
{!loading && !error && filtered.length === 0 && (
  <div className="shop-empty">
    <span className="mono">Sin productos en esta categoría</span>
  </div>
)}
```

- [ ] **Step 3: Reemplazar el error state**

```jsx
{!loading && error && (
  <div className="shop-empty">
    <Icon name="alert-circle" size={48} className="shop-empty__icon" />
    <h2 className="shop-empty__title">
      Algo salió mal<br />
      <em>cargando la colección</em>
    </h2>
    <p className="shop-empty__sub">
      Revisa tu conexión e intenta de nuevo
    </p>
    <button className="btn btn--ghost" onClick={() => window.location.reload()}>
      Reintentar
    </button>
  </div>
)}
```

- [ ] **Step 4: Reemplazar el empty state**

```jsx
{!loading && !error && filtered.length === 0 && (
  <div className="shop-empty">
    <Icon name="package" size={48} className="shop-empty__icon" />
    <h2 className="shop-empty__title">
      Sin resultados<br />
      <em>en esta categoría</em>
    </h2>
    <p className="shop-empty__sub">
      Prueba con otro filtro o explora toda la tienda
    </p>
    <button className="btn btn--ghost" onClick={() => setActiveFilter('todos')}>
      Ver todos
    </button>
  </div>
)}
```

- [ ] **Step 5: Verificar los tres estados visualmente**

```bash
npm run dev
```

**Verificar loading state:**
Abrir `http://localhost:3000/tienda`. Durante la carga se ven 8 skeleton cards con imagen 4/3 + 3 líneas de info con shimmer en el área de imagen.

**Verificar empty state:**
En la barra de filtros, seleccionar una categoría que no tenga productos (si todas tienen productos, temporalmente cambiar `filtered.length === 0` por `filtered.length > -1` para forzar el estado). Debe mostrar: icono caja (gris, semitransparente) + título en Instrument Serif italic "Sin resultados / *en esta categoría*" + subtexto + botón "Ver todos".

**Verificar error state:**
Temporalmente cambiar `setError(false)` por `setError(true)` en el useEffect de fetchProducts (línea 30) para forzar el estado. Debe mostrar: icono alerta circular + título "Algo salió mal / *cargando la colección*" + subtexto + botón "Reintentar". Restaurar el cambio después.

- [ ] **Step 6: Verificar build final**

```bash
npm run build
```

Resultado esperado: `✓ Compiled successfully` — 13 páginas estáticas, sin warnings.

- [ ] **Step 7: Commit**

```bash
git add pages/tienda.jsx
git commit -m "feat(tienda): editorial empty and error states with Icon + Instrument Serif titles"
```

---

## Verificación final

Después de los 5 tasks, el resultado esperado:

| Estado | Antes | Después |
|--------|-------|---------|
| Loading | 4 bloques `3/4` con shimmer global | 8 cards `4/3` imagen + 3 líneas de info con shimmer solo en imagen |
| Empty | Texto mono plano, sin CTA | Icono caja + título editorial italic + subtexto + botón "Ver todos" |
| Error | Texto mono + botón con `style` inline | Icono alerta + título editorial italic + subtexto + botón "Reintentar" |

```bash
npm run build
# Esperado: ✓ Compiled successfully (13 páginas estáticas)
```
