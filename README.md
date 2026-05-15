# AURIX — Sneakers de Alta Ingeniería

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Supabase](https://img.shields.io/badge/Supabase-2.0-3ECF8E?logo=supabase)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38BDF8?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Vercel-deployed-black?logo=vercel)

> Tienda de sneakers de alta gama con estética cinematográfica. Catálogo interactivo, carrito persistente, sistema de favoritos, autenticación completa y panel de administración — construido como proyecto de portafolio full-stack.

🔗 **[Demo en vivo](https://tienda-hj.vercel.app)** · [Repositorio](https://github.com/jaycob12244/tienda_HJ)

---

## ✨ Features

- **Hero animado** con scroll-sequence de 59 frames WebP — reproducción suave mediante `requestAnimationFrame` y LERP
- **Catálogo con filtros** por categoría y búsqueda en tiempo real con SearchOverlay
- **QuickView Modal** — vista rápida de producto sin salir del catálogo, con galería de imágenes, selector de color/talla y productos relacionados
- **Carrito persistente** — `localStorage` para usuarios anónimos, sincronización con Supabase para usuarios registrados
- **Sistema de favoritos** — wishlist con icono en navegación y página dedicada
- **Autenticación completa** — registro, inicio de sesión y recuperación de contraseña vía Supabase Auth
- **Panel de administración** — CRUD de productos con modal de edición, visualización de pedidos (ruta `/admin`)
- **Página de performance técnica** — comparativa de tecnologías del producto con animaciones de datos
- **Overlays con transiciones fluidas** — SearchOverlay, QuickView y menú móvil con animaciones de entrada y salida
- **Responsive mobile-first** — navegación adaptada con drawer animado
- **Deploy en Vercel** con variables de entorno y builds automáticos

---

## 🛠 Tech Stack

| Tecnología | Versión | Uso |
|---|---|---|
| [Next.js](https://nextjs.org) | 14 | Framework React — Pages Router, SSG |
| [React](https://react.dev) | 18 | UI — hooks, context, refs |
| [Supabase](https://supabase.com) | 2.x | Base de datos PostgreSQL + Auth + Storage |
| [TailwindCSS](https://tailwindcss.com) | 3 | Utilidades CSS base |
| CSS Custom Properties | — | Design tokens, animaciones, componentes |
| [Vercel](https://vercel.com) | — | Deploy, CI/CD automático |
| Space Grotesk + Instrument Serif | — | Tipografía (Google Fonts) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Una cuenta en [Supabase](https://supabase.com) (plan gratuito suficiente)

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/jaycob12244/tienda_HJ.git
cd tienda_HJ

# 2. Instalar dependencias
npm install

# 3. Crear variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# 4. Iniciar en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🔐 Variables de Entorno

| Variable | Descripción | Dónde obtenerla |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase | Dashboard Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública anon | Dashboard Supabase → Settings → API |

> **Nota:** Las variables `NEXT_PUBLIC_*` son expuestas al cliente. Nunca añadas la `service_role` key aquí.

---

## 📁 Estructura del Proyecto

```
tienda_HJ/
├── components/
│   ├── cart/           # CartDrawer, SearchOverlay
│   ├── home/           # Hero (scroll-sequence), Marquee, Categories, Technology, Benefits, Newsletter
│   ├── layout/         # NavBar, Footer
│   ├── product/        # QuickViewModal, ProductCard
│   └── ui/             # Icon, Reveal, ScrollProgress, SneakerStage, ProfileDropdown
├── context/
│   └── AppContext.jsx   # Estado global: carrito, favoritos, auth, overlays
├── data/
│   └── products.js      # Filtros de catálogo, links de navegación
├── pages/
│   ├── index.jsx        # Home — hero animado + secciones
│   ├── tienda.jsx       # Catálogo con filtros y QuickView
│   ├── favoritos.jsx    # Wishlist del usuario
│   ├── performance.jsx  # Página de comparativa técnica
│   ├── checkout.jsx     # Flujo de compra
│   ├── login.jsx        # Autenticación
│   ├── register.jsx     # Registro
│   ├── recover.jsx      # Recuperación de contraseña
│   └── admin/           # Panel de administración (protegido)
│       ├── products.jsx  # CRUD de productos
│       └── orders.jsx    # Visualización de pedidos
├── public/
│   └── frames/          # 59 frames WebP para el hero scroll-sequence
├── services/
│   ├── productService.js # Queries a Supabase: productos, favoritos, filtros
│   └── adminService.js   # CRUD admin: crear, editar, eliminar productos
├── styles/
│   └── globals.css       # Design tokens, componentes CSS, animaciones
└── supabase/
    └── client.js         # Cliente Supabase inicializado
```

---

## 🗺 Roadmap de Sprints

| Sprint | Estado | Descripción |
|---|---|---|
| Sprint 1 | ✅ | Base del proyecto — Next.js, Tailwind, estructura de carpetas |
| Sprint 2 | ✅ | UI completa — Hero scroll-sequence, catálogo, diseño de componentes |
| Sprint 3 | ✅ | Estado global — carrito, favoritos, SearchOverlay, QuickView |
| Sprint 4 | ✅ | Supabase — auth, base de datos, productos reales, RLS |
| Sprint 5 | ✅ | Panel de administración — CRUD productos, visualización de pedidos |
| Sprint 6 | ✅ | Optimización y deploy — responsive fixes, transiciones fluidas, Vercel |

---

## 📸 Screenshots

> *Capturas de las páginas principales del proyecto.*

| Home — Hero | Tienda — Catálogo |
|---|---|
| ![Hero](docs/screenshots/home.png) | ![Tienda](docs/screenshots/tienda.png) |

| QuickView Modal | Panel Admin |
|---|---|
| ![QuickView](docs/screenshots/quickview.png) | ![Admin](docs/screenshots/admin.png) |

---

## 👤 Autor

**Jacobo Rivera**

Proyecto de portafolio full-stack — diseñado, desarrollado y desplegado de forma independiente.

[![GitHub](https://img.shields.io/badge/GitHub-jaycob12244-181717?logo=github)](https://github.com/jaycob12244)
