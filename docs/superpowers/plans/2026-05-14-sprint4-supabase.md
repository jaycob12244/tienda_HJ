# Sprint 4 — Supabase Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Conectar AURIX a Supabase como backend real: productos desde DB, autenticación completa con verificación de email, carrito y favoritos sincronizados por usuario, y órdenes persistidas al completar checkout.

**Architecture:** Pure Supabase Client — singleton `lib/supabase.js` con `@supabase/supabase-js`. Auth vía Supabase Auth. Datos protegidos con RLS. AppContext gestiona el estado global e integra la sincronización al hacer login/logout. Productos se cargan async en cada página con fallback local.

**Tech Stack:** Next.js 14 (Pages Router), @supabase/supabase-js, Supabase Auth, PostgreSQL 17, MCP Supabase (project: frvakibqxowwetfdhsgb)

**Base path de trabajo:** `sprint3/.claude/worktrees/nervous-wilson-958925/sprint3/`

---

## File Map

| Archivo | Estado | Responsabilidad |
|---|---|---|
| `lib/supabase.js` | NUEVO | Singleton createClient |
| `services/authService.js` | NUEVO | login, register, logout, recover, resendVerification |
| `services/favoritesService.js` | NUEVO | CRUD favoritos en Supabase |
| `services/cartService.js` | MODIFICAR | Añadir CRUD carrito en Supabase (conservar utils) |
| `services/productService.js` | MODIFICAR | getAllProducts() async desde Supabase con fallback |
| `context/AppContext.jsx` | MODIFICAR | Integrar auth + sync favoritos/carrito al login |
| `pages/login.jsx` | MODIFICAR | Conectar a authService real |
| `pages/register.jsx` | MODIFICAR | Conectar a authService + flujo verificación email |
| `pages/recover.jsx` | MODIFICAR | Conectar a authService real |
| `pages/tienda.jsx` | MODIFICAR | Fetch async de productos, loading/error state |
| `pages/favoritos.jsx` | MODIFICAR | Fetch async de productos |
| `pages/checkout.jsx` | MODIFICAR | Guardar orden en Supabase al confirmar |
| `components/product/QuickViewModal.jsx` | MODIFICAR | Recibir allProducts como prop para getRelated |
| `data/products.js` | MODIFICAR | Eliminar PRODUCTS y EXTERNAL_PRODUCTS (solo config) |
| `.env.local` | NUEVO | Variables de entorno Supabase |

---

## Task 1: Instalar dependencia y crear .env.local + lib/supabase.js

**Files:**
- Create: `.env.local`
- Create: `lib/supabase.js`

- [ ] **Step 1: Instalar @supabase/supabase-js**

```bash
cd sprint3
npm install @supabase/supabase-js
```

Resultado esperado: `added 1 package` (o similar, sin errores).

- [ ] **Step 2: Crear .env.local**

Crear archivo `sprint3/.env.local` con este contenido exacto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://frvakibqxowwetfdhsgb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZydmFraWJxeG93d2V0ZmRoc2diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MTU2MjIsImV4cCI6MjA5NDI5MTYyMn0.uUN5SVXReMnMCvDH7kI66t2JWxtqTjYZ9O8nsLw1JZM
```

- [ ] **Step 3: Crear lib/supabase.js**

```js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

- [ ] **Step 4: Verificar que .env.local no se suba a git**

Confirmar que `.env.local` ya está en `.gitignore` (debe tener la línea `.env*`). Si no la tiene, añadirla.

- [ ] **Step 5: Commit**

```bash
git add sprint3/lib/supabase.js sprint3/package.json sprint3/package-lock.json
git commit -m "feat: add supabase client singleton"
```

---

## Task 2: Crear tablas de productos en Supabase (via MCP)

**MCP Tool:** `mcp__3ec41053-5724-4301-9187-9facb61319d4__execute_sql`
**Project ID:** `frvakibqxowwetfdhsgb`

- [ ] **Step 1: Crear tabla brands**

Ejecutar via MCP execute_sql:

```sql
create table public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz default now()
);

alter table public.brands enable row level security;

create policy "Brands son de lectura pública"
  on public.brands for select
  using (true);
```

- [ ] **Step 2: Crear tabla categories**

```sql
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  created_at timestamptz default now()
);

alter table public.categories enable row level security;

create policy "Categories son de lectura pública"
  on public.categories for select
  using (true);
```

- [ ] **Step 3: Crear tabla products**

```sql
create table public.products (
  id text primary key,
  name text not null,
  brand_id uuid references public.brands(id),
  category_id uuid references public.categories(id),
  price numeric not null,
  currency text default '€',
  badge text,
  rating numeric,
  description text,
  image text,
  colorway text,
  created_at timestamptz default now()
);

alter table public.products enable row level security;

create policy "Products son de lectura pública"
  on public.products for select
  using (true);
```

- [ ] **Step 4: Verificar tablas creadas**

Ejecutar via MCP execute_sql:

```sql
select table_name from information_schema.tables
where table_schema = 'public'
order by table_name;
```

Resultado esperado: `brands`, `categories`, `products` en la lista.

---

## Task 3: Crear tablas de usuario en Supabase (via MCP)

**MCP Tool:** `mcp__3ec41053-5724-4301-9187-9facb61319d4__execute_sql`

- [ ] **Step 1: Crear tabla favorites**

```sql
create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id text references public.products(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

alter table public.favorites enable row level security;

create policy "Usuario ve sus favoritos"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "Usuario añade sus favoritos"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "Usuario elimina sus favoritos"
  on public.favorites for delete
  using (auth.uid() = user_id);
```

- [ ] **Step 2: Crear tabla cart_items**

```sql
create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id text references public.products(id) on delete cascade not null,
  qty integer not null default 1,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

alter table public.cart_items enable row level security;

create policy "Usuario ve su carrito"
  on public.cart_items for select
  using (auth.uid() = user_id);

create policy "Usuario añade a su carrito"
  on public.cart_items for insert
  with check (auth.uid() = user_id);

create policy "Usuario actualiza su carrito"
  on public.cart_items for update
  using (auth.uid() = user_id);

create policy "Usuario elimina de su carrito"
  on public.cart_items for delete
  using (auth.uid() = user_id);
```

- [ ] **Step 3: Crear tabla orders**

```sql
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
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

alter table public.orders enable row level security;

create policy "Usuario ve sus órdenes"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Usuario crea sus órdenes"
  on public.orders for insert
  with check (auth.uid() = user_id);
```

- [ ] **Step 4: Crear tabla order_items**

```sql
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id text,
  product_name text not null,
  product_price numeric not null,
  qty integer not null,
  created_at timestamptz default now()
);

alter table public.order_items enable row level security;

create policy "Usuario ve sus order_items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

create policy "Usuario crea order_items"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );
```

- [ ] **Step 5: Verificar todas las tablas**

```sql
select table_name from information_schema.tables
where table_schema = 'public'
order by table_name;
```

Resultado esperado: `brands`, `cart_items`, `categories`, `favorites`, `order_items`, `orders`, `products`.

---

## Task 4: Insertar datos iniciales (brands, categories, 16 productos)

**MCP Tool:** `mcp__3ec41053-5724-4301-9187-9facb61319d4__execute_sql`

- [ ] **Step 1: Insertar brands**

```sql
insert into public.brands (name) values
  ('Nike'),
  ('Adidas'),
  ('Aurix');
```

- [ ] **Step 2: Insertar categories**

```sql
insert into public.categories (slug, label) values
  ('running',     'Running'),
  ('training',    'Training'),
  ('trail',       'Trail'),
  ('lifestyle',   'Lifestyle'),
  ('competition', 'Competition'),
  ('streetwear',  'Streetwear');
```

- [ ] **Step 3: Insertar los 8 productos externos (Nike/Adidas)**

```sql
insert into public.products (id, name, brand_id, category_id, price, currency, badge, rating, description, image) values
  ('ext-01',
   'Air Max 90',
   (select id from public.brands where name = 'Nike'),
   (select id from public.categories where slug = 'lifestyle'),
   130, '€', 'STOCK', 4.7,
   'Silueta icónica con Air visible.',
   'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=80&auto=format&fit=crop'),

  ('ext-02',
   'React Infinity',
   (select id from public.brands where name = 'Nike'),
   (select id from public.categories where slug = 'running'),
   160, '€', 'NEW', 4.6,
   'Máximo retorno de energía en cada zancada.',
   'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=700&q=80&auto=format&fit=crop'),

  ('ext-03',
   'Ultraboost 24',
   (select id from public.brands where name = 'Adidas'),
   (select id from public.categories where slug = 'running'),
   180, '€', 'DROP', 4.8,
   'Sistema Boost de máxima amortiguación.',
   'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=700&q=80&auto=format&fit=crop'),

  ('ext-04',
   'Samba OG',
   (select id from public.brands where name = 'Adidas'),
   (select id from public.categories where slug = 'streetwear'),
   110, '€', 'STOCK', 4.7,
   'El clásico que nunca pasa de moda.',
   'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=700&q=80&auto=format&fit=crop'),

  ('ext-05',
   'Air Force 1 ''07',
   (select id from public.brands where name = 'Nike'),
   (select id from public.categories where slug = 'lifestyle'),
   115, '€', 'STOCK', 4.9,
   'El blanco que lo combina todo.',
   'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=700&q=80&auto=format&fit=crop'),

  ('ext-06',
   'Pegasus Trail 5',
   (select id from public.brands where name = 'Nike'),
   (select id from public.categories where slug = 'trail'),
   140, '€', 'NEW', 4.5,
   'Tracción todo terreno, comodidad de asfalto.',
   'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=700&q=80&auto=format&fit=crop'),

  ('ext-07',
   'Gazelle Indoor',
   (select id from public.brands where name = 'Adidas'),
   (select id from public.categories where slug = 'training'),
   100, '€', 'LIMITED', 4.6,
   'Perfil retro para cualquier entorno.',
   'https://images.unsplash.com/photo-1539185441755-769473a23570?w=700&q=80&auto=format&fit=crop'),

  ('ext-08',
   'Vaporfly 3',
   (select id from public.brands where name = 'Nike'),
   (select id from public.categories where slug = 'competition'),
   270, '€', 'PRO', 5.0,
   'El zapato de los récords mundiales.',
   'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=700&q=80&auto=format&fit=crop');
```

- [ ] **Step 4: Insertar los 8 productos Aurix**

```sql
insert into public.products (id, name, brand_id, category_id, price, currency, badge, rating, description, colorway) values
  ('ax-01',
   'Aurix One Phantom',
   (select id from public.brands where name = 'Aurix'),
   (select id from public.categories where slug = 'running'),
   289, '€', 'STOCK', 4.8,
   'Edición de telemetría sigilosa.',
   'Stealth'),

  ('ax-02',
   'Aurix One Silver',
   (select id from public.brands where name = 'Aurix'),
   (select id from public.categories where slug = 'training'),
   269, '€', 'LIMITED', 4.7,
   'Acabado de chasis reflectante.',
   'Reflective'),

  ('ax-03',
   'Aurix One Volt',
   (select id from public.brands where name = 'Aurix'),
   (select id from public.categories where slug = 'running'),
   299, '€', 'DROP', 4.9,
   'Perfil cinético neón.',
   'Neon Volt'),

  ('ax-04',
   'Aurix Drift Mono',
   (select id from public.brands where name = 'Aurix'),
   (select id from public.categories where slug = 'streetwear'),
   249, '€', 'STOCK', 4.6,
   'Silueta urbana monocromo.',
   'Bone'),

  ('ax-05',
   'Aurix Trail K2',
   (select id from public.brands where name = 'Aurix'),
   (select id from public.categories where slug = 'trail'),
   329, '€', 'STOCK', 4.7,
   'Suela de tracción profunda K2.',
   'Onyx'),

  ('ax-06',
   'Aurix Court Ivory',
   (select id from public.brands where name = 'Aurix'),
   (select id from public.categories where slug = 'lifestyle'),
   219, '€', 'STOCK', 4.5,
   'Court silhouette en piel marfil.',
   'Ivory'),

  ('ax-07',
   'Aurix Loop Carbon',
   (select id from public.brands where name = 'Aurix'),
   (select id from public.categories where slug = 'competition'),
   379, '€', 'PRO', 4.9,
   'Placa de carbono — carrera.',
   'Carbon Black'),

  ('ax-08',
   'Aurix Echo Sand',
   (select id from public.brands where name = 'Aurix'),
   (select id from public.categories where slug = 'lifestyle'),
   209, '€', 'NEW', 4.4,
   'Cápsula de uso diario.',
   'Sand');
```

- [ ] **Step 5: Verificar datos**

```sql
select p.id, p.name, b.name as brand, c.slug as category, p.price
from public.products p
join public.brands b on b.id = p.brand_id
join public.categories c on c.id = p.category_id
order by p.id;
```

Resultado esperado: 16 filas (ext-01 a ext-08, ax-01 a ax-08).

---

## Task 5: Actualizar data/products.js (eliminar productos hardcodeados)

**Files:**
- Modify: `data/products.js`

- [ ] **Step 1: Eliminar PRODUCTS y EXTERNAL_PRODUCTS, dejar solo configuración**

Reemplazar el contenido completo de `data/products.js` con:

```js
// Configuración estática — productos viven en Supabase
// Ver: services/productService.js -> getAllProducts()

export const FILTERS = [
  { id: 'todos',       label: 'Todos' },
  { id: 'running',     label: 'Running' },
  { id: 'training',    label: 'Training' },
  { id: 'trail',       label: 'Trail' },
  { id: 'lifestyle',   label: 'Lifestyle' },
  { id: 'competition', label: 'Competition' },
  { id: 'streetwear',  label: 'Streetwear' },
];

export const NAV_LINKS = [
  { id: 'technology', label: 'Tecnología' },
  { id: 'shop',       label: 'Tienda' },
  { id: 'performance',label: 'Performance' },
];

export const CATEGORIES = [
  { id: 'running',    label: 'Running',    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=80&auto=format&fit=crop' },
  { id: 'training',   label: 'Training',   image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=700&q=80&auto=format&fit=crop' },
  { id: 'trail',      label: 'Trail',      image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=700&q=80&auto=format&fit=crop' },
  { id: 'lifestyle',  label: 'Lifestyle',  image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=700&q=80&auto=format&fit=crop' },
  { id: 'streetwear', label: 'Streetwear', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=700&q=80&auto=format&fit=crop' },
];

export const BENEFITS = [
  { icon: 'shield',   title: 'Garantía 2 años',      sub: 'Defectos de fabricación cubiertos.' },
  { icon: 'truck',    title: 'Envío en 24–48 h',     sub: 'A toda España peninsular.' },
  { icon: 'refresh',  title: 'Devoluciones 30 días', sub: 'Sin preguntas, sin coste.' },
  { icon: 'headphones', title: 'Soporte humano',     sub: 'Lunes a viernes, 9–18 h.' },
];

export const TECH_POINTS = [
  { num: '01', title: 'Aero-Weave Upper', sub: 'Tejido de filamentos cruzados de 0.3 mm.' },
  { num: '02', title: 'Kinetic Core',     sub: 'Núcleo de amortiguación reactiva.' },
  { num: '03', title: 'Adaptive Traction',sub: 'Suela que se adapta al terreno.' },
];
```

- [ ] **Step 2: Verificar que la app arranca sin errores**

```bash
npm run dev
```

Se esperan errores en tienda.jsx y favoritos.jsx porque aún importan PRODUCTS/EXTERNAL_PRODUCTS — se corregirán en las siguientes tareas.

- [ ] **Step 3: Commit**

```bash
git add sprint3/data/products.js
git commit -m "refactor: remove hardcoded products from data/products.js (moved to Supabase)"
```

---

## Task 6: Actualizar productService.js (fetch desde Supabase)

**Files:**
- Modify: `services/productService.js`

- [ ] **Step 1: Reemplazar productService.js completo**

```js
import { supabase } from '../lib/supabase';

// Normaliza un producto de Supabase al formato que usa el frontend
function normalize(p) {
  return {
    id: p.id,
    name: p.name,
    brand: p.brands?.name ?? '',
    category: p.categories?.slug ?? '',
    price: p.price,
    currency: p.currency,
    badge: p.badge,
    rating: p.rating,
    desc: p.description,
    image: p.image ?? null,
    colorway: p.colorway ?? null,
  };
}

// Fetch todos los productos desde Supabase.
// En caso de error, devuelve array vacío (tienda mostrará mensaje de error).
export async function getAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*, brands(name), categories(slug, label)')
    .order('id');

  if (error) {
    console.warn('Error fetching products from Supabase:', error.message);
    return null; // null indica error (distinto de [] que sería vacío)
  }

  return data.map(normalize);
}

// Filtra productos relacionados (misma categoría, distinto id)
export function getRelated(product, allProducts, limit = 3) {
  return allProducts
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}

// Devuelve los productos que están en favoritos
export function getFavoriteProducts(favoriteIds, allProducts) {
  return allProducts.filter(p => favoriteIds.has(p.id));
}

// Filtra por categoría
export function filterByCategory(allProducts, category) {
  if (category === 'todos') return allProducts;
  return allProducts.filter(p => p.category === category);
}
```

- [ ] **Step 2: Commit**

```bash
git add sprint3/services/productService.js
git commit -m "feat: productService fetches products from Supabase"
```

---

## Task 7: Crear authService.js

**Files:**
- Create: `services/authService.js`

- [ ] **Step 1: Crear el archivo**

```js
import { supabase } from '../lib/supabase';

// Registrar nuevo usuario. Supabase envía email de verificación automáticamente.
export async function register(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

// Iniciar sesión con email y contraseña.
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

// Cerrar sesión.
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Enviar email de recuperación de contraseña.
export async function recover(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: typeof window !== 'undefined'
      ? `${window.location.origin}/reset-password`
      : undefined,
  });
  if (error) throw error;
}

// Reenviar email de verificación.
export async function resendVerification(email) {
  const { error } = await supabase.auth.resend({ type: 'signup', email });
  if (error) throw error;
}

// Obtener sesión actual (útil para SSR).
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
```

- [ ] **Step 2: Commit**

```bash
git add sprint3/services/authService.js
git commit -m "feat: add authService (login, register, logout, recover)"
```

---

## Task 8: Crear favoritesService.js

**Files:**
- Create: `services/favoritesService.js`

- [ ] **Step 1: Crear el archivo**

```js
import { supabase } from '../lib/supabase';

// Obtiene Set de product_ids favoritos del usuario.
export async function getFavoritesFromDB(userId) {
  const { data, error } = await supabase
    .from('favorites')
    .select('product_id')
    .eq('user_id', userId);

  if (error) throw error;
  return new Set(data.map(f => f.product_id));
}

// Añade un producto a favoritos.
export async function addFavoriteDB(userId, productId) {
  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, product_id: productId });

  if (error) throw error;
}

// Elimina un producto de favoritos.
export async function removeFavoriteDB(userId, productId) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) throw error;
}
```

- [ ] **Step 2: Commit**

```bash
git add sprint3/services/favoritesService.js
git commit -m "feat: add favoritesService (Supabase CRUD)"
```

---

## Task 9: Actualizar cartService.js (añadir Supabase CRUD)

**Files:**
- Modify: `services/cartService.js`

- [ ] **Step 1: Añadir funciones Supabase al final del archivo existente**

Añadir al final de `services/cartService.js` (después de las funciones existentes):

```js
import { supabase } from '../lib/supabase';

// Obtiene el carrito del usuario desde Supabase.
// Devuelve array de { product, qty } igual que el estado local.
export async function getCartFromDB(userId) {
  const { data, error } = await supabase
    .from('cart_items')
    .select('qty, products(id, name, price, currency, badge, rating, description, image, colorway, brands(name), categories(slug))')
    .eq('user_id', userId);

  if (error) throw error;

  return data.map(item => ({
    product: {
      id: item.products.id,
      name: item.products.name,
      brand: item.products.brands?.name ?? '',
      category: item.products.categories?.slug ?? '',
      price: item.products.price,
      currency: item.products.currency,
      badge: item.products.badge,
      rating: item.products.rating,
      desc: item.products.description,
      image: item.products.image ?? null,
      colorway: item.products.colorway ?? null,
    },
    qty: item.qty,
  }));
}

// Crea o actualiza un item del carrito.
export async function upsertCartItemDB(userId, productId, qty) {
  const { error } = await supabase
    .from('cart_items')
    .upsert(
      { user_id: userId, product_id: productId, qty },
      { onConflict: 'user_id,product_id' }
    );

  if (error) throw error;
}

// Elimina un item del carrito.
export async function removeCartItemDB(userId, productId) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) throw error;
}

// Vacía el carrito completo del usuario.
export async function clearCartDB(userId) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId);

  if (error) throw error;
}

// Migra el carrito local (localStorage) a Supabase al hacer login.
// No sobreescribe items existentes en DB (onConflict ignora duplicados).
export async function migrateLocalCartToDB(userId, localCart) {
  if (!localCart || localCart.length === 0) return;

  const items = localCart.map(line => ({
    user_id: userId,
    product_id: line.product.id,
    qty: line.qty,
  }));

  const { error } = await supabase
    .from('cart_items')
    .upsert(items, { onConflict: 'user_id,product_id', ignoreDuplicates: true });

  if (error) throw error;
}
```

- [ ] **Step 2: Verificar que el import de supabase no está duplicado**

Si `cartService.js` ya tenía imports al inicio, mover el `import { supabase }` arriba de todo junto a los demás imports.

- [ ] **Step 3: Commit**

```bash
git add sprint3/services/cartService.js
git commit -m "feat: add Supabase cart CRUD to cartService"
```

---

## Task 10: Actualizar AppContext (auth + sync)

**Files:**
- Modify: `context/AppContext.jsx`

- [ ] **Step 1: Reemplazar AppContext.jsx completo**

```jsx
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { getFavoritesFromDB, addFavoriteDB, removeFavoriteDB } from '../services/favoritesService';
import {
  getCartFromDB,
  upsertCartItemDB,
  removeCartItemDB,
  clearCartDB,
  migrateLocalCartToDB,
} from '../services/cartService';

const AppContext = createContext(null);

function loadLocalState() {
  try {
    const stored = JSON.parse(localStorage.getItem('aurix_state') || 'null');
    return {
      cart: Array.isArray(stored?.cart) ? stored.cart : [],
      favs: new Set(Array.isArray(stored?.favs) ? stored.favs : []),
    };
  } catch {
    return { cart: [], favs: new Set() };
  }
}

function saveLocalState(cart, favorites) {
  try {
    localStorage.setItem('aurix_state', JSON.stringify({
      cart,
      favs: Array.from(favorites),
    }));
  } catch {}
}

export function AppProvider({ children }) {
  const [user,       setUser]       = useState(null);
  const [cart,       setCart]       = useState([]);
  const [favorites,  setFavorites]  = useState(new Set());
  const [cartOpen,   setCartOpen]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const cartRef = useRef(cart);

  // Mantener ref actualizada para usarla en callbacks async
  useEffect(() => { cartRef.current = cart; }, [cart]);

  // Cargar estado local al inicio
  useEffect(() => {
    const { cart: c, favs } = loadLocalState();
    setCart(c);
    setFavorites(favs);
  }, []);

  // Escuchar cambios de auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        syncUserData(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          await syncUserData(currentUser.id);
        } else {
          // Logout: restaurar localStorage
          const { cart: c, favs } = loadLocalState();
          setCart(c);
          setFavorites(favs);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Sincronizar datos del usuario desde DB al hacer login
  async function syncUserData(userId) {
    try {
      const localCart = cartRef.current;
      if (localCart.length > 0) {
        await migrateLocalCartToDB(userId, localCart);
      }
      const [dbFavs, dbCart] = await Promise.all([
        getFavoritesFromDB(userId),
        getCartFromDB(userId),
      ]);
      setFavorites(dbFavs);
      setCart(dbCart);
    } catch (e) {
      console.warn('Error sincronizando datos de usuario:', e);
    }
  }

  // Persistir a localStorage cuando no hay usuario
  useEffect(() => {
    if (!user) saveLocalState(cart, favorites);
  }, [cart, favorites, user]);

  // ── Cart actions ──

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(l => l.product.id === product.id);
      const updated = exists
        ? prev.map(l => l.product.id === product.id ? { ...l, qty: l.qty + 1 } : l)
        : [...prev, { product, qty: 1 }];

      if (user) {
        const newQty = exists ? exists.qty + 1 : 1;
        upsertCartItemDB(user.id, product.id, newQty).catch(console.warn);
      }

      return updated;
    });
    setCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(l => l.product.id !== id));
    if (user) removeCartItemDB(user.id, id).catch(console.warn);
  };

  const changeQty = (id, delta) => {
    setCart(prev => {
      const updated = prev.flatMap(l => {
        if (l.product.id !== id) return [l];
        const q = l.qty + delta;
        if (q <= 0) return [];
        return [{ ...l, qty: q }];
      });

      if (user) {
        const item = updated.find(l => l.product.id === id);
        if (item) upsertCartItemDB(user.id, id, item.qty).catch(console.warn);
        else      removeCartItemDB(user.id, id).catch(console.warn);
      }

      return updated;
    });
  };

  const clearCart = async () => {
    setCart([]);
    if (user) {
      await clearCartDB(user.id);
    } else {
      saveLocalState([], favorites);
    }
  };

  // ── Favorites actions ──

  const toggleFav = (id) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        if (user) removeFavoriteDB(user.id, id).catch(console.warn);
      } else {
        next.add(id);
        if (user) addFavoriteDB(user.id, id).catch(console.warn);
      }
      return next;
    });
  };

  return (
    <AppContext.Provider value={{
      user,
      cart, addToCart, removeFromCart, changeQty, clearCart,
      favorites, toggleFav,
      cartOpen,   setCartOpen,
      searchOpen, setSearchOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
```

- [ ] **Step 2: Commit**

```bash
git add sprint3/context/AppContext.jsx
git commit -m "feat: integrate Supabase auth and cart/favorites sync in AppContext"
```

---

## Task 11: Actualizar login.jsx

**Files:**
- Modify: `pages/login.jsx`

- [ ] **Step 1: Reemplazar login.jsx**

```jsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AuthShell from '../components/auth/AuthShell';
import FloatField from '../components/auth/FloatField';
import Icon from '../components/ui/Icon';
import { login } from '../services/authService';

export default function LoginPage() {
  const router = useRouter();
  const [email,      setEmail]      = useState('');
  const [pwd,        setPwd]        = useState('');
  const [remember,   setRemember]   = useState(true);
  const [loading,    setLoading]    = useState(false);
  const [serverErr,  setServerErr]  = useState(null);
  const [submitted,  setSubmitted]  = useState(false);
  const [needVerify, setNeedVerify] = useState(false);

  const emailError = submitted && !email.includes('@') ? 'Email inválido' : null;
  const pwdError   = submitted && pwd.length < 6 ? 'Mínimo 6 caracteres' : null;

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setServerErr(null);
    if (!email.includes('@') || pwd.length < 6) return;

    setLoading(true);
    try {
      await login(email, pwd);
      router.push('/');
    } catch (err) {
      if (err.message?.toLowerCase().includes('email not confirmed')) {
        setNeedVerify(true);
      } else {
        setServerErr('Email o contraseña incorrectos.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (needVerify) return (
    <>
      <Head><title>Verifica tu email — AURIX</title></Head>
      <AuthShell view="login">
        <div className="auth__sent">
          <div className="auth__sentMark"><Icon name="check" size={22} /></div>
          <h3>Verifica tu email.</h3>
          <p>Revisa la bandeja de <span style={{ fontFamily: 'var(--font-mono)' }}>{email}</span> y haz clic en el enlace de confirmación.</p>
          <button className="btn btn--primary" onClick={() => setNeedVerify(false)}>
            Intentar de nuevo
          </button>
        </div>
      </AuthShell>
    </>
  );

  return (
    <>
      <Head><title>Iniciar sesión — AURIX</title></Head>
      <AuthShell view="login">
        <div>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Bienvenida de vuelta</div>
          <h1 className="auth__title">Iniciar sesión<span className="auth__dot">.</span></h1>
          <p className="auth__sub">Accede a tu archivo, pedidos y drops privados.</p>
        </div>

        <form onSubmit={onSubmit} className="auth__form">
          <FloatField label="Email" type="email" value={email} onChange={setEmail} error={emailError} autoComplete="email" />
          <FloatField label="Contraseña" type="password" value={pwd} onChange={setPwd} error={pwdError} autoComplete="current-password" />

          {serverErr && (
            <div className="auth__serverErr">
              <Icon name="close" size={11} /> {serverErr}
            </div>
          )}

          <div className="auth__row">
            <label className="auth__check">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
              <span className="auth__checkbox"><Icon name="check" size={11} /></span>
              <span>Recordarme</span>
            </label>
            <button type="button" className="ulink" onClick={() => router.push('/recover')}>
              ¿Olvidaste la contraseña?
            </button>
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--lg btn--icon"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Entrando…' : 'Entrar al sistema'}
            {!loading && <span className="btn__icon"><Icon name="arrow-right" size={14} /></span>}
          </button>

          <div className="auth__foot">
            ¿No tienes cuenta?{' '}
            <button type="button" className="ulink" onClick={() => router.push('/register')}>Crear una</button>
          </div>
        </form>
      </AuthShell>
    </>
  );
}
```

- [ ] **Step 2: Añadir estilo auth__serverErr a globals.css**

Buscar el bloque `.auth__termsErr` en `styles/globals.css` y añadir justo debajo:

```css
.auth__serverErr {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #e05c5c;
  padding: 8px 12px;
  background: rgba(224, 92, 92, 0.08);
  border-radius: var(--radius-sm);
}
```

- [ ] **Step 3: Commit**

```bash
git add sprint3/pages/login.jsx sprint3/styles/globals.css
git commit -m "feat: connect login page to Supabase auth"
```

---

## Task 12: Actualizar register.jsx

**Files:**
- Modify: `pages/register.jsx`

- [ ] **Step 1: Reemplazar register.jsx**

```jsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AuthShell from '../components/auth/AuthShell';
import FloatField from '../components/auth/FloatField';
import { PwdMeter, scorePwd } from '../components/auth/PwdMeter';
import Icon from '../components/ui/Icon';
import { register, resendVerification } from '../services/authService';

export default function RegisterPage() {
  const router = useRouter();
  const [name,      setName]      = useState('');
  const [email,     setEmail]     = useState('');
  const [pwd,       setPwd]       = useState('');
  const [terms,     setTerms]     = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [serverErr, setServerErr] = useState(null);
  const [done,      setDone]      = useState(false);
  const [resending, setResending] = useState(false);

  const nameError  = submitted && name.trim().length < 2 ? 'Indica tu nombre' : null;
  const emailError = submitted && !email.includes('@') ? 'Email inválido' : null;
  const pwdScore   = scorePwd(pwd);
  const pwdError   = submitted && pwd.length < 8 ? 'Mínimo 8 caracteres' : null;
  const termsError = submitted && !terms ? 'Acepta los términos para continuar' : null;

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setServerErr(null);
    if (name.trim().length < 2 || !email.includes('@') || pwd.length < 8 || !terms) return;

    setLoading(true);
    try {
      await register(email, pwd);
      setDone(true);
    } catch (err) {
      if (err.message?.toLowerCase().includes('already registered')) {
        setServerErr('Este email ya tiene una cuenta. ¿Quieres iniciar sesión?');
      } else {
        setServerErr('Error al crear la cuenta. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendVerification(email);
    } catch {}
    setResending(false);
  };

  if (done) return (
    <>
      <Head><title>Verifica tu email — AURIX</title></Head>
      <AuthShell view="register">
        <div className="auth__sent">
          <div className="auth__sentMark"><Icon name="check" size={22} /></div>
          <h3>Cuenta creada.</h3>
          <p>
            Te hemos enviado un enlace de verificación a{' '}
            <span style={{ fontFamily: 'var(--font-mono)' }}>{email}</span>.
            Haz clic en él para activar tu cuenta.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn btn--ghost" onClick={handleResend} disabled={resending}>
              {resending ? 'Enviando…' : 'Reenviar email'}
            </button>
            <button className="btn btn--primary" onClick={() => router.push('/login')}>
              Ir al login
            </button>
          </div>
        </div>
      </AuthShell>
    </>
  );

  return (
    <>
      <Head><title>Crear cuenta — AURIX</title></Head>
      <AuthShell view="register">
        <div>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Únete a AURIX</div>
          <h1 className="auth__title">Crear cuenta<span className="auth__dot">.</span></h1>
          <p className="auth__sub">Drops privados, soporte humano y archivo completo.</p>
        </div>

        <form onSubmit={onSubmit} className="auth__form">
          <div className="auth__split">
            <FloatField label="Nombre" value={name} onChange={setName} error={nameError} autoComplete="given-name" />
            <FloatField label="Email" type="email" value={email} onChange={setEmail} error={emailError} autoComplete="email" />
          </div>

          <FloatField
            label="Contraseña"
            type="password"
            value={pwd}
            onChange={setPwd}
            error={pwdError}
            hint={pwd ? <PwdMeter score={pwdScore} /> : '8+ caracteres, una mayúscula y un número.'}
            autoComplete="new-password"
          />

          <label className="auth__terms">
            <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} />
            <span className={`auth__checkbox${termsError ? ' is-error' : ''}`}><Icon name="check" size={11} /></span>
            <span>
              Acepto los <a className="ulink" href="#">Términos</a> y la <a className="ulink" href="#">Política de privacidad</a>.
            </span>
          </label>
          {termsError && (
            <div className="auth__termsErr"><Icon name="close" size={11} /> {termsError}</div>
          )}

          {serverErr && (
            <div className="auth__serverErr">
              <Icon name="close" size={11} /> {serverErr}{' '}
              {serverErr.includes('ya tiene') && (
                <button type="button" className="ulink" onClick={() => router.push('/login')}>Iniciar sesión</button>
              )}
            </div>
          )}

          <button
            type="submit"
            className="btn btn--primary btn--lg btn--icon"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Creando cuenta…' : 'Crear cuenta AURIX'}
            {!loading && <span className="btn__icon"><Icon name="arrow-right" size={14} /></span>}
          </button>

          <div className="auth__foot">
            ¿Ya estás dentro?{' '}
            <button type="button" className="ulink" onClick={() => router.push('/login')}>Iniciar sesión</button>
          </div>
        </form>
      </AuthShell>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add sprint3/pages/register.jsx
git commit -m "feat: connect register page to Supabase auth with email verification"
```

---

## Task 13: Actualizar recover.jsx

**Files:**
- Modify: `pages/recover.jsx`

- [ ] **Step 1: Reemplazar recover.jsx**

```jsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AuthShell from '../components/auth/AuthShell';
import FloatField from '../components/auth/FloatField';
import Icon from '../components/ui/Icon';
import { recover } from '../services/authService';

export default function RecoverPage() {
  const router = useRouter();
  const [email,     setEmail]     = useState('');
  const [sent,      setSent]      = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [serverErr, setServerErr] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const emailError = submitted && !email.includes('@') ? 'Email inválido' : null;

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setServerErr(null);
    if (!email.includes('@')) return;

    setLoading(true);
    try {
      await recover(email);
      setSent(true);
    } catch (err) {
      setServerErr('Error al enviar el enlace. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>Recuperar acceso — AURIX</title></Head>
      <AuthShell view="recover">
        <div>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Recuperar acceso</div>
          <h1 className="auth__title">Restaurar contraseña<span className="auth__dot">.</span></h1>
          <p className="auth__sub">Te enviamos un enlace de un solo uso. Sin contraseñas temporales.</p>
        </div>

        {!sent ? (
          <form onSubmit={onSubmit} className="auth__form">
            <FloatField
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              error={emailError}
              autoComplete="email"
            />

            {serverErr && (
              <div className="auth__serverErr">
                <Icon name="close" size={11} /> {serverErr}
              </div>
            )}

            <button
              type="submit"
              className="btn btn--primary btn--lg btn--icon"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Enviando…' : 'Enviar enlace de acceso'}
              {!loading && <span className="btn__icon"><Icon name="arrow-right" size={14} /></span>}
            </button>

            <div className="auth__foot">
              ¿Recordaste tu contraseña?{' '}
              <button type="button" className="ulink" onClick={() => router.push('/login')}>
                Volver a iniciar sesión
              </button>
            </div>
          </form>
        ) : (
          <div className="auth__sent">
            <div className="auth__sentMark"><Icon name="check" size={22} /></div>
            <h3>Enlace enviado.</h3>
            <p>
              Revisa la bandeja de{' '}
              <span style={{ fontFamily: 'var(--font-mono)' }}>{email}</span>.
              El enlace caduca en 15 minutos.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn--ghost" onClick={() => { setSent(false); setEmail(''); setSubmitted(false); }}>
                Enviar a otro email
              </button>
              <button className="btn btn--primary" onClick={() => router.push('/login')}>
                Ir al login
              </button>
            </div>
          </div>
        )}
      </AuthShell>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add sprint3/pages/recover.jsx
git commit -m "feat: connect recover page to Supabase auth"
```

---

## Task 14: Actualizar tienda.jsx (fetch async de productos)

**Files:**
- Modify: `pages/tienda.jsx`

- [ ] **Step 1: Reemplazar tienda.jsx**

```jsx
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import NavBar         from '../components/layout/NavBar';
import Footer         from '../components/layout/Footer';
import Icon           from '../components/ui/Icon';
import SneakerStage   from '../components/ui/SneakerStage';
import QuickViewModal from '../components/product/QuickViewModal';
import CartDrawer     from '../components/cart/CartDrawer';
import SearchOverlay  from '../components/cart/SearchOverlay';

import { useApp }                          from '../context/AppContext';
import { FILTERS }                         from '../data/products';
import { getAllProducts, filterByCategory } from '../services/productService';

export default function Tienda() {
  const router = useRouter();
  const app    = useApp();

  const [allProducts,   setAllProducts]   = useState([]);
  const [activeFilter,  setActiveFilter]  = useState('todos');
  const [quickView,     setQuickView]     = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(false);

  // Cargar productos desde Supabase al montar
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(false);
      const data = await getAllProducts();
      if (data === null) {
        setError(true);
      } else {
        setAllProducts(data);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // Leer filtro de query param
  useEffect(() => {
    const cat = router.query.categoria;
    if (cat) setActiveFilter(cat);
  }, [router.query.categoria]);

  const filtered = filterByCategory(allProducts, activeFilter);

  return (
    <>
      <Head><title>Tienda — AURIX</title></Head>
      <div className="app-shell">
        <NavBar />
        <main>
          <section className="shop-hero">
            <div className="container container--wide shop-hero__inner">
              <div className="eyebrow shop-hero__eyebrow">Colección SS26 · Drop 04</div>
              <h1 className="shop-hero__title">La <span className="editorial">Tienda</span></h1>
              <p className="shop-hero__sub">Nike · Adidas · Aurix — todo en un solo lugar.</p>
            </div>
          </section>

          <div className="shop-filters-bar">
            <div className="container container--wide shop-filters">
              {FILTERS.map(f => (
                <button
                  key={f.id}
                  className={`shop-filter${activeFilter === f.id ? ' is-on' : ''}`}
                  onClick={() => setActiveFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="shop-grid-wrap">
            <div className="container container--wide">
              {loading && (
                <div className="shop-empty">
                  <span className="mono">Cargando productos…</span>
                </div>
              )}

              {!loading && error && (
                <div className="shop-empty">
                  <span className="mono">Error al cargar productos.</span>
                  <button
                    className="btn btn--ghost"
                    style={{ marginTop: 16 }}
                    onClick={() => window.location.reload()}
                  >
                    Reintentar
                  </button>
                </div>
              )}

              {!loading && !error && filtered.length === 0 && (
                <div className="shop-empty">
                  <span className="mono">Sin productos en esta categoría</span>
                </div>
              )}

              {!loading && !error && filtered.length > 0 && (
                <div className="shop-grid">
                  {filtered.map(p => (
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
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>

      {quickView && (
        <QuickViewModal
          product={quickView}
          allProducts={allProducts}
          onClose={() => setQuickView(null)}
        />
      )}
      <CartDrawer />
      <SearchOverlay />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add sprint3/pages/tienda.jsx
git commit -m "feat: tienda fetches products from Supabase with loading/error states"
```

---

## Task 15: Actualizar favoritos.jsx (fetch async)

**Files:**
- Modify: `pages/favoritos.jsx`

- [ ] **Step 1: Reemplazar favoritos.jsx**

```jsx
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Icon           from '../components/ui/Icon';
import SneakerStage   from '../components/ui/SneakerStage';
import NavBar         from '../components/layout/NavBar';
import Footer         from '../components/layout/Footer';
import CartDrawer     from '../components/cart/CartDrawer';
import SearchOverlay  from '../components/cart/SearchOverlay';
import QuickViewModal from '../components/product/QuickViewModal';
import { useApp }                              from '../context/AppContext';
import { getAllProducts, getFavoriteProducts } from '../services/productService';

export default function Favoritos() {
  const app    = useApp();
  const router = useRouter();

  const [allProducts, setAllProducts] = useState([]);
  const [quickView,   setQuickView]   = useState(null);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    getAllProducts().then(data => {
      if (data) setAllProducts(data);
      setLoading(false);
    });
  }, []);

  const products = getFavoriteProducts(app.favorites, allProducts);

  return (
    <>
      <Head><title>Favoritos — AURIX</title></Head>
      <div className="app-shell">
        <NavBar />
        <main>
          <section className="shop-hero">
            <div className="container container--wide shop-hero__inner">
              <div className="eyebrow shop-hero__eyebrow">Tu wishlist</div>
              <h1 className="shop-hero__title"><span className="editorial">Favoritos</span></h1>
              <p className="shop-hero__sub">
                {loading
                  ? 'Cargando…'
                  : products.length === 0
                    ? 'Aún no tienes modelos guardados.'
                    : `${products.length} modelo${products.length > 1 ? 's' : ''} guardado${products.length > 1 ? 's' : ''}.`
                }
              </p>
            </div>
          </section>

          <div className="shop-grid-wrap">
            <div className="container container--wide">
              {!loading && products.length === 0 ? (
                <div className="fav-empty">
                  <div className="fav-empty__icon"><Icon name="heart" size={28} /></div>
                  <h2 className="fav-empty__title">Tu wishlist está vacía</h2>
                  <p className="fav-empty__sub">
                    Guarda los modelos que más te gusten desde la tienda o el visor de producto.
                  </p>
                  <button className="btn btn--primary" onClick={() => router.push('/tienda')}>
                    Explorar tienda
                  </button>
                </div>
              ) : (
                <div className="shop-grid">
                  {products.map(p => (
                    <article key={p.id} className="sh-card" onClick={() => setQuickView(p)}>
                      <div className="sh-card__media">
                        {p.image
                          ? <img src={p.image} alt={p.name} className="sh-card__img" />
                          : <SneakerStage label={p.name} />
                        }
                        <span className="sh-card__badge mono">{p.badge}</span>
                        <button
                          className="sh-card__fav is-on"
                          onClick={e => { e.stopPropagation(); app.toggleFav(p.id); }}
                          aria-label="Quitar de favoritos"
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
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>

      {quickView && (
        <QuickViewModal
          product={quickView}
          allProducts={allProducts}
          onClose={() => setQuickView(null)}
        />
      )}
      <CartDrawer />
      <SearchOverlay />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add sprint3/pages/favoritos.jsx
git commit -m "feat: favoritos fetches products from Supabase"
```

---

## Task 16: Actualizar QuickViewModal (recibir allProducts como prop)

**Files:**
- Modify: `components/product/QuickViewModal.jsx`

- [ ] **Step 1: Modificar la firma del componente y el uso de getRelated**

Cambiar la línea de importación y la firma del componente:

```jsx
// Añadir a los imports existentes:
import { getRelated } from '../../services/productService';
```

Cambiar la firma de la función:

```jsx
// De:
export default function QuickViewModal({ product: initialProduct, onClose }) {

// A:
export default function QuickViewModal({ product: initialProduct, allProducts = [], onClose }) {
```

Cambiar la línea que llama a getRelated:

```jsx
// De:
const related = getRelated(product);

// A:
const related = getRelated(product, allProducts);
```

- [ ] **Step 2: Eliminar el import de getRelated del archivo si ya existía con firma distinta**

Verificar que solo existe un import de getRelated y que apunta a `../../services/productService`.

- [ ] **Step 3: Commit**

```bash
git add sprint3/components/product/QuickViewModal.jsx
git commit -m "refactor: QuickViewModal receives allProducts as prop for getRelated"
```

---

## Task 17: Actualizar checkout.jsx (guardar orden en Supabase)

**Files:**
- Modify: `pages/checkout.jsx`

- [ ] **Step 1: Modificar la función submit en checkout.jsx**

Cambiar los imports al inicio:

```jsx
// Añadir a los imports existentes:
import { supabase } from '../lib/supabase';
```

Reemplazar la función `submit`:

```jsx
const [orderErr, setOrderErr] = useState(null);
const [saving,   setSaving]   = useState(false);

const submit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  setSaving(true);
  setOrderErr(null);

  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      // Guardar orden en Supabase
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id:         session.user.id,
          total:           total,
          currency:        '€',
          status:          'pending',
          delivery_method: delivery,
          full_name:       form.name,
          address:         form.address,
          city:            form.city,
          postal_code:     form.postal,
          payment_method:  payment,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Guardar líneas de la orden
      const orderItems = app.cart.map(line => ({
        order_id:      order.id,
        product_id:    line.product.id,
        product_name:  line.product.name,
        product_price: line.product.price,
        qty:           line.qty,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;
    }

    // Limpiar carrito y mostrar confirmación
    await app.clearCart();
    setDone(true);

  } catch (err) {
    console.error('Error guardando orden:', err);
    setOrderErr('Error al procesar el pedido. Inténtalo de nuevo.');
  } finally {
    setSaving(false);
  }
};
```

- [ ] **Step 2: Añadir el estado orderErr y saving al componente**

Añadir junto a los otros useState al inicio del componente:

```jsx
const [orderErr, setOrderErr] = useState(null);
const [saving,   setSaving]   = useState(false);
```

- [ ] **Step 3: Mostrar error de orden y estado de carga en el botón submit**

Localizar el botón de submit en el formulario de checkout y reemplazarlo:

```jsx
{orderErr && (
  <div className="auth__serverErr" style={{ marginBottom: 12 }}>
    {orderErr}
  </div>
)}
<button
  type="submit"
  className="btn btn--primary btn--lg btn--icon"
  style={{ width: '100%' }}
  disabled={saving}
>
  {saving ? 'Procesando…' : 'Confirmar pedido'}
  {!saving && <span className="btn__icon"><Icon name="arrow-right" size={14} /></span>}
</button>
```

- [ ] **Step 4: Commit**

```bash
git add sprint3/pages/checkout.jsx
git commit -m "feat: checkout saves orders to Supabase"
```

---

## Task 18: Verificación final

- [ ] **Step 1: Arrancar el servidor de desarrollo**

```bash
cd sprint3
npm run dev
```

- [ ] **Step 2: Verificar /tienda**

Abrir `http://localhost:3000/tienda`. Los 16 productos deben cargarse desde Supabase (Nike, Adidas y Aurix). Los filtros deben funcionar.

- [ ] **Step 3: Verificar registro**

Ir a `/register`, crear cuenta con email real. Debe mostrar pantalla "Cuenta creada" y llegar el email de verificación.

- [ ] **Step 4: Verificar login**

Tras verificar el email, ir a `/login` e iniciar sesión. La app debe redirigir a `/`.

- [ ] **Step 5: Verificar favoritos y carrito sincronizados**

Añadir productos a favoritos y al carrito, cerrar sesión, volver a iniciar sesión. Los datos deben persistir.

- [ ] **Step 6: Verificar checkout con orden**

Completar una compra. Verificar en el dashboard de Supabase (tabla `orders` y `order_items`) que la orden se guardó.

- [ ] **Step 7: Verificar recuperación de contraseña**

Ir a `/recover`, ingresar email. Debe llegar el email de recuperación.

- [ ] **Step 8: Commit final**

```bash
git add -A
git commit -m "feat: Sprint 4 complete — Supabase integration (auth, products, cart, favorites, orders)"
```

---

## Criterios de Éxito

- [ ] Productos cargados desde Supabase en /tienda
- [ ] Auth completo: registro → verificación email → login → logout → recuperación
- [ ] Favoritos y carrito persisten en Supabase cuando el usuario está logueado
- [ ] Órdenes guardadas en DB al completar checkout
- [ ] RLS correctamente configurado (usuario solo ve sus datos)
- [ ] Variables de entorno en `.env.local`, nunca en código
- [ ] App funciona sin errores con `npm run dev`
