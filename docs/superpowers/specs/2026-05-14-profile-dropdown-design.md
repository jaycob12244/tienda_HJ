# Profile Dropdown — Diseño

**Fecha:** 2026-05-14
**Proyecto:** AURIX Tienda de Zapatos

---

## Objetivo

Cuando el usuario está logueado, hacer click en el ícono de perfil del NavBar abre un dropdown flotante con su información resumida y botón de cerrar sesión. Cuando no está logueado, el comportamiento actual se mantiene (redirige a /login).

---

## Archivos

| Archivo | Estado |
|---|---|
| `components/ui/ProfileDropdown.jsx` | NUEVO |
| `components/layout/NavBar.jsx` | MODIFICAR |

---

## Sección 1: Arquitectura

`ProfileDropdown` es un componente autocontenido que recibe `user`, `favoritesCount` y `onClose`. NavBar mantiene el estado `profileOpen` localmente y lo abre/cierra al hacer click en el ícono de perfil.

El ícono de perfil en NavBar tiene este comportamiento:
- Usuario logueado → toggle `profileOpen`
- Usuario no logueado → `router.push('/login')` (sin cambios)

---

## Sección 2: ProfileDropdown UI

```
┌─────────────────────────────┐
│  ● J  Jacobo Rivera         │  ← inicial + nombre derivado del email
│      riverajacobo29@gmail   │  ← email truncado con ellipsis
├─────────────────────────────┤
│  ♥ Favoritos        12      │  ← app.favorites.size (en memoria)
│  📦 Compras          3      │  ← COUNT(*) desde tabla orders en Supabase
├─────────────────────────────┤
│  [ Cerrar sesión ]          │  ← llama logout() + cierra dropdown
└─────────────────────────────┘
```

**Nombre:** parte antes del `@` del email, capitalizada. Ej: `riverajacobo29@gmail.com` → `Riverajacobo29` → mejor: split por puntos/números y capitalizar primer token → `Rivera`.

**Posición:** `position: absolute`, alineado al borde derecho del ícono de perfil, con `top: calc(100% + 8px)`.

**Cierre:** click fuera del dropdown via `useEffect` con listener en `document`.

---

## Sección 3: Flujo de datos

- `user` → de `app.user` (Supabase Auth user object)
- `favoritesCount` → `app.favorites.size`
- `ordersCount` → fetch al montar: `supabase.from('orders').select('*', { count: 'exact', head: true }).eq('user_id', user.id)`
- Mientras carga órdenes → muestra `—`
- Error en fetch → muestra `—` sin crash

---

## Sección 4: Edge Cases

| Situación | Comportamiento |
|---|---|
| Error fetch órdenes | Muestra `—` |
| Email muy largo | CSS `text-overflow: ellipsis` |
| Click fuera del panel | Cierra dropdown |
| Click en ícono con dropdown abierto | Cierra dropdown |
| Logout falla | Cierra dropdown igual, error en consola |
| Sin display_name | Usa parte del email antes del `@` capitalizada |
| Usuario no logueado | Redirige a /login (sin dropdown) |

---

## Criterios de éxito

- [ ] Usuario logueado ve dropdown al hacer click en ícono de perfil
- [ ] Dropdown muestra email, nombre derivado, nº favoritos y nº órdenes reales
- [ ] Cerrar sesión funciona y limpia el estado
- [ ] Click fuera cierra el dropdown
- [ ] Usuario no logueado sigue siendo redirigido a /login
