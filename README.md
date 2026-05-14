# AURIX — Tienda de Sneakers

Proyecto e-commerce de alta gama desarrollado con Next.js 14, React 18 y TailwindCSS.

---

## Requisitos previos

- [Node.js](https://nodejs.org/) versión **18 o superior**
- npm (incluido con Node.js)

---

## Cómo iniciar el servidor de desarrollo

### 1. Abre una terminal en la carpeta del proyecto

```
C:\Users\Rivera\Documents\tienda_HJ\sprint3\sprint3
```

### 2. Instala las dependencias (solo la primera vez)

```bash
npm install
```

### 3. Inicia el servidor

```bash
npm run dev
```

### 4. Abre el navegador

```
http://localhost:3000
```

---

## Comandos disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con hot-reload |
| `npm run build` | Compila el proyecto para producción |
| `npm run start` | Inicia el servidor de producción (requiere build previo) |

---

## Páginas del proyecto

| Ruta | Descripción |
|---|---|
| `/` | Landing page principal |
| `/tienda` | Catálogo de productos (Nike, Adidas, Aurix) |
| `/performance` | Comparador de modelos Aurix |
| `/checkout` | Proceso de pago |
| `/login` | Inicio de sesión |
| `/register` | Registro de cuenta |
| `/recover` | Recuperación de contraseña |

---

## Estructura de carpetas

```
sprint3/
├── components/
│   ├── cart/          # Carrito y overlay de búsqueda
│   ├── home/          # Secciones de la landing page
│   ├── layout/        # NavBar y Footer
│   ├── product/       # QuickView modal
│   └── ui/            # Componentes reutilizables (Icon, Reveal, DotField…)
├── context/           # AppContext — carrito, favoritos, overlays
├── data/
│   └── products.js    # Productos, filtros, categorías, navegación
├── pages/             # Rutas de Next.js
├── public/
│   └── frames/        # Secuencia de frames PNG para la animación del hero
├── styles/
│   └── globals.css    # Estilos globales y design tokens
└── utils/             # Utilidades (formatPrice…)
```

---

## Notas

- Las imágenes de la animación del hero (`/public/frames/`) son PNG transparentes numerados del 044 al 102.
- Los productos externos (Nike/Adidas) usan imágenes de Unsplash. Conexión a internet necesaria para verlas.
- El carrito y favoritos se guardan en `localStorage` del navegador.
