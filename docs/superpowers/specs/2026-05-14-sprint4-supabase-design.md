# Sprint 4 — Integración Supabase: Diseño

**Fecha:** 2026-05-14  
**Proyecto:** AURIX Tienda de Zapatos  
**Enfoque:** Pure Supabase Client (Option A)  
**Supabase Project ID:** `frvakibqxowwetfdhsgb`

---

## Objetivo

Conectar el frontend Next.js de AURIX a Supabase como backend real: productos desde DB, autenticación completa con verificación de email, carrito y favoritos sincronizados por usuario, y órdenes persistidas al completar checkout.

---

## Sección 1: Base de Datos

### Tablas

| Tabla | Descripción |
|---|---|
| `brands` | Nike, Adidas, Aurix |
| `categories` | running, trail, lifestyle, streetwear, training, competition |
| `products` | 16 productos con FK a brands y categories |
| `favorites` | Relación usuario ↔ producto |
| `cart_items` | Carrito persistido por usuario |
| `orders` | Cabecera del pedido (dirección, método de pago, total) |
| `order_items` | Líneas de cada orden (producto, qty, precio snapshot) |

### Schema detallado

```sql
-- brands
create table brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz default now()
);

-- categories
create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  created_at timestamptz default now()
);

-- products
create table products (
  id text primary key,
  name text not null,
  brand_id uuid references brands(id),
  category_id uuid references categories(id),
  price numeric not null,
  currency text default '€',
  badge text,
  rating numeric,
  desc text,
  image text,
  colorway text,
  created_at timestamptz default now()
);

-- favorites
create table favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  product_id text references products(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- cart_items
create table cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  product_id text references products(id) on delete cascade,
  qty integer not null default 1,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

-- orders
create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  total numeric not null,
  currency text default '€',
  status text default 'pending',
  delivery_method text,
  full_name text,
  address text,
  city text,
  postal_code text,
  payment_method text,
  created_at timestamptz default now()
);

-- order_items
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id text references products(id),
  product_name text not null,
  product_price numeric not null,
  qty integer not null,
  created_at timestamptz default now()
);
```

### Seguridad (RLS)

| Tabla | Lectura | Escritura |
|---|---|---|
| `brands` | Pública | Solo admin |
| `categories` | Pública | Solo admin |
| `products` | Pública | Solo admin |
| `favorites` | Solo dueño (`auth.uid() = user_id`) | Solo dueño |
| `cart_items` | Solo dueño | Solo dueño |
| `orders` | Solo dueño | Solo dueño |
| `order_items` | Solo dueño vía order | Solo dueño vía order |

Auth de usuarios gestionado por Supabase Auth — no se necesita tabla `users` propia. Se usa `auth.uid()` en todas las políticas RLS.

---

## Sección 2: Arquitectura del Código

### Archivos nuevos

```
sprint3/
├── lib/
│   └── supabase.js           ← singleton createClient con env vars
├── hooks/
│   └── useAuth.js            ← hook: session, user, loading state
├── services/
│   ├── authService.js        ← login, register, recover, logout
│   ├── favoritesService.js   ← getFavorites, addFavorite, removeFavorite (Supabase)
│   └── cartService.js        ← getCart, upsertCartItem, removeCartItem (Supabase)
```

### Archivos modificados

| Archivo | Cambio |
|---|---|
| `lib/supabase.js` | Nuevo — singleton del cliente |
| `context/AppContext.jsx` | Integra useAuth, sync favoritos/carrito al login |
| `services/productService.js` | Lee productos de Supabase en vez de mock data |
| `services/cartService.js` | Reescrito para Supabase (conserva lógica de cálculo) |
| `pages/login.jsx` | Conectado a authService real |
| `pages/register.jsx` | Conectado a authService + flujo verificación email |
| `pages/recover.jsx` | Conectado a authService |
| `pages/checkout.jsx` | Guarda orden en Supabase al confirmar |
| `data/products.js` | Solo queda FILTERS, NAV_LINKS, CATEGORIES (sin productos hardcodeados) |

### Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=https://frvakibqxowwetfdhsgb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key del dashboard>
```

### Flujo auth + sync

1. Usuario se registra → Supabase envía email de verificación
2. Usuario hace login → `AppContext` carga favoritos y carrito desde DB, reemplaza localStorage
3. Usuario sin sesión → localStorage como antes (sin cambios visibles)
4. Al cerrar sesión → estado limpio, vuelve a localStorage vacío

---

## Sección 3: Manejo de Errores y Edge Cases

### Auth

| Situación | Comportamiento |
|---|---|
| Email ya registrado | Mensaje: "Este email ya tiene una cuenta" |
| Contraseña incorrecta | "Email o contraseña incorrectos" (sin revelar cuál falla) |
| Email no verificado | Redirige a pantalla "Revisa tu correo" con opción de reenviar |
| Token de recuperación expirado | Página de error con botón para solicitar uno nuevo |

### Productos

| Situación | Comportamiento |
|---|---|
| Error al cargar de Supabase | Estado de error con botón "Reintentar" en /tienda |
| Supabase offline | Fallback a productos del `products.js` local |

### Carrito y Favoritos

| Situación | Comportamiento |
|---|---|
| Error de sync al login | Mantiene localStorage, reintenta en background |
| Conflicto localStorage vs DB | DB gana — datos del servidor sobrescriben locales |

### Órdenes

| Situación | Comportamiento |
|---|---|
| Error al guardar orden | Mensaje de error en checkout, carrito NO se limpia |
| Orden exitosa | Limpia carrito (DB + localStorage), muestra confirmación |

---

## Criterio de Éxito

- [ ] Usuario puede registrarse, verificar email e iniciar sesión
- [ ] Productos se cargan desde Supabase en /tienda
- [ ] Favoritos y carrito persisten entre sesiones cuando logueado
- [ ] Al hacer checkout, la orden queda guardada en DB
- [ ] RLS correctamente configurado (usuario solo ve sus datos)
- [ ] Variables de entorno en `.env.local`, nunca en el código
