# Sprint 6 — Optimización y Despliegue: Design Spec

**Fecha:** 2026-05-15  
**Proyecto:** AURIX Tienda de Sneakers  
**Base path:** `C:\Users\Rivera\Documents\tienda_HJ`

---

## Objetivo

Llevar el proyecto AURIX a un estado de producción pulido: corregir los dos bugs de responsive pendientes, añadir transiciones fluidas a todos los overlays, y escribir un README profesional de portafolio.

## Estructura del trabajo (Opción B — agrupado)

1. **Responsive Fixes** + **UX Polish** → una sola pasada por CSS y componentes  
2. **README profesional** → cuando el proyecto esté en estado final  

---

## Sección 1: Responsive Fixes

### Bug 1 — Botón de Favoritos no visible en móvil

**Síntoma:** En viewport ≤ 760px el botón de favoritos (`aria-label="Favoritos"`) no se ve.  
**Causa probable:** El `nav__right` tiene demasiados íconos visibles en pantallas pequeñas (≤ 390px): favoritos + perfil + carrito + burger. En pantallas muy estrechas algunos se salen del contenedor.  
**Fix:** Ocultar el ícono de perfil (`aria-label="Cuenta"`) en móvil. El acceso a la cuenta se puede añadir como link en el drawer del menú móvil (`nav__mobile`), manteniendo la funcionalidad. Quedan visibles: favoritos + carrito + burger — 3 íconos con espacio suficiente.

```css
/* globals.css — dentro de @media (max-width: 760px) */
.nav__icon[aria-label="Cuenta"] { display: none; }
```

Y en el drawer móvil añadir link a login/perfil como `nav__mobile-link`.

### Bug 2 — Botón negro en el drawer móvil (Ver colección / Carrito)

**Síntoma:** El botón "Ver colección" dentro del `nav__mobile-foot` se ve negro (fondo `var(--ink)`) en lugar de cream.  
**Causa:** Las reglas CSS están escritas pero puede haber conflicto de especificidad o cache.  
**Fix:** Verificar que las reglas existen y si hay conflicto, reforzar el selector:

```css
/* globals.css — dentro de @media (max-width: 760px) */
header.nav .nav__mobile-foot .btn--primary { background: var(--paper); color: var(--ink); }
header.nav .nav__mobile-foot .btn--ghost   { color: var(--paper); border-color: rgba(250,249,246,0.25); }
```

---

## Sección 2: UX Polish — Transiciones en Overlays

### Patrón unificado

El CartDrawer ya usa el patrón correcto: **siempre en DOM, visibilidad controlada por clase `is-open`**. Se aplica este mismo patrón a los tres overlays restantes.

### 2a. Menú móvil (`nav__mobile`)

**Estado actual:** `{mobileOpen && <div className="nav__mobile">}` — aparece/desaparece instantáneamente.

**Fix en NavBar.jsx:** Siempre renderizar `nav__mobile`, controlar por clase:
```jsx
<div className={`nav__mobile${mobileOpen ? ' is-open' : ''}`}>
  ...
</div>
```

**Fix en globals.css:** Animación slide-down con `grid-template-rows`:
```css
.nav__mobile {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s var(--ease);
  overflow: hidden;
}
.nav__mobile.is-open {
  grid-template-rows: 1fr;
}
.nav__mobile-inner {
  overflow: hidden;
  /* wrapper interno necesario para el truco grid-template-rows */
}
```

El contenido del drawer va dentro de un `<div className="nav__mobile-inner">`.

### 2b. SearchOverlay (`.so`)

**Estado actual:** Renderizado condicional, tiene animación de entrada pero salida instantánea.

**Fix en SearchOverlay.jsx:** Siempre en DOM, toggle clase:
```jsx
<div className={`so${app.searchOpen ? ' is-open' : ''}`}>
```

**Fix en globals.css:**
```css
.so { 
  position: fixed; inset: 0; z-index: 250;
  pointer-events: none;
  visibility: hidden;
}
.so.is-open { pointer-events: auto; visibility: visible; }
.so__backdrop {
  position: absolute; inset: 0;
  background: rgba(10,10,10,0.5); backdrop-filter: blur(8px);
  opacity: 0;
  transition: opacity 0.35s var(--ease);
}
.so.is-open .so__backdrop { opacity: 1; }
.so__sheet {
  /* mantener estilos existentes, reemplazar animation por transition */
  opacity: 0;
  transform: translateY(-12px) scale(0.98);
  transition: opacity 0.35s var(--ease), transform 0.35s var(--ease);
}
.so.is-open .so__sheet { opacity: 1; transform: none; }
```

### 2c. QuickViewModal (`.qv`)

**Estado actual:** Renderizado condicional desde `index.jsx` con `{quickView && <QuickViewModal product={quickView} />}`.

**Fix en index.jsx:** Siempre renderizar, pasar `open` como prop:
```jsx
<QuickViewModal 
  product={quickView} 
  open={quickView !== null} 
  onClose={() => setQuickView(null)} 
/>
```

**Fix en QuickViewModal.jsx:** Usar el prop `open` para controlar la clase:
```jsx
<div className={`qv${open ? ' is-open' : ''}`}>
```

Manejar `product` internamente con un ref para no perder los datos durante la animación de cierre:
```jsx
const lastProduct = useRef(product);
if (product) lastProduct.current = product;
// usar lastProduct.current para renderizar
```

**Fix en globals.css:**
```css
.qv {
  position: fixed; inset: 0; z-index: 200;
  display: flex; align-items: center; justify-content: center;
  pointer-events: none;
}
.qv.is-open { pointer-events: auto; }
.qv__backdrop {
  position: absolute; inset: 0;
  background: rgba(10,10,10,0.45); backdrop-filter: blur(8px);
  opacity: 0;
  transition: opacity 0.4s var(--ease);
}
.qv.is-open .qv__backdrop { opacity: 1; }
.qv__sheet {
  /* mantener estilos existentes */
  opacity: 0;
  transform: scale(0.97) translateY(16px);
  transition: opacity 0.4s var(--ease), transform 0.4s var(--ease);
}
.qv.is-open .qv__sheet { opacity: 1; transform: none; }
```

### 2d. UX General adicional

- **Loading skeleton en Tienda:** Reemplazar el texto "Cargando productos…" por un grid de 4 tarjetas skeleton (divs animados con `@keyframes skeleton-pulse`). Colores: `background: var(--ink-2)` base, `var(--ink-3)` shimmer. Mismo aspect-ratio que `.sh-card`.
- **Estado vacío de Favoritos:** Añadir mensaje claro con CTA a la tienda cuando no hay favoritos.
- **Nav links — underline animado:** El subrayado de los nav links del desktop desliza de izquierda a derecha al hacer hover.

```css
.nav__link::after {
  content: '';
  position: absolute; bottom: 4px; left: 50%; right: 50%;
  height: 1px; background: var(--paper);
  transition: left 0.25s var(--ease), right 0.25s var(--ease);
}
.nav__link:hover::after { left: 12px; right: 12px; }
```

---

## Sección 3: README Profesional

**Archivo:** `README.md` (raíz del proyecto, reemplaza el actual)  
**Idioma:** Español con términos técnicos en inglés  
**Tono:** Profesional, de portafolio

### Estructura del README

```
# AURIX — Sneakers de Alta Ingeniería
badges: Next.js | React 18 | Supabase | TailwindCSS | Vercel

> Descripción de marca (2-3 líneas)
🔗 Demo en vivo

## ✨ Features
- Hero animado con scroll-sequence (59 frames WebP)
- Catálogo con filtros y QuickView modal
- Carrito persistente (localStorage + Supabase para usuarios)
- Sistema de favoritos
- Auth completo (registro, login, recuperación)
- Panel administrativo (CRUD productos, visualización pedidos)
- Página de comparación de performance técnica
- Deploy en Vercel con variables de entorno

## 🛠 Tech Stack
Tabla: Tecnología | Versión | Uso

## 🚀 Getting Started
1. Prerequisites (Node 18+)
2. Clonar repo
3. npm install
4. Crear .env.local con variables
5. npm run dev

## 🔐 Variables de Entorno
| Variable | Descripción | Dónde obtenerla |
|---|---|---|
| NEXT_PUBLIC_SUPABASE_URL | URL del proyecto Supabase | Dashboard Supabase |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Clave pública anon | Dashboard Supabase |

## 📁 Estructura del Proyecto
Árbol con descripción de cada carpeta/archivo clave

## 🗺 Sprints
Sprint 1 ✅ Base | Sprint 2 ✅ UI | Sprint 3 ✅ Estado | 
Sprint 4 ✅ Supabase | Sprint 5 ✅ Admin | Sprint 6 ✅ Deploy

## 📸 Screenshots
Sección con capturas de las páginas principales

## 👤 Autor
Jacobo Rivera — links a GitHub/LinkedIn si aplica
```

---

## Archivos a modificar

| Archivo | Cambio |
|---|---|
| `styles/globals.css` | Transiciones overlays, nav link hover, skeleton, responsive fixes |
| `components/layout/NavBar.jsx` | Nav mobile siempre en DOM, ocultar ícono cuenta en móvil, link perfil en drawer |
| `components/cart/SearchOverlay.jsx` | Siempre en DOM, toggle clase |
| `components/product/QuickViewModal.jsx` | Recibir prop `open`, usar lastProduct ref |
| `pages/index.jsx` | Cambiar renderizado condicional de QuickViewModal |
| `pages/favoritos.jsx` | Mejorar estado vacío |
| `pages/tienda.jsx` | Loading skeleton |
| `README.md` | Reescribir completo |

---

## Criterio de éxito

- ✅ Botón favoritos visible en móvil
- ✅ Botones del drawer móvil con colores correctos
- ✅ Todos los overlays abren y cierran con transición fluida
- ✅ README completo y profesional
- ✅ Build de Vercel pasa sin errores tras el push final
