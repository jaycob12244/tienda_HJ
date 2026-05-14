# Hero Animation Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminar el lageo de la animación del zapato en el Hero sacando React del hot path del rAF loop y cambiando los frames PNG a WebP.

**Architecture:** Reemplazar los dos `useState` del rAF loop por `useRef` + escritura directa al DOM (`img.src`, `element.style.transform`). React monta el componente una sola vez y nunca vuelve a re-renderizar durante el scroll. La extensión de los FRAMES cambia de `.png` a `.webp` para reducir el costo de decode por frame.

**Tech Stack:** React 18, useRef, requestAnimationFrame, WebP

---

## Archivo modificado

| Archivo | Tipo | Qué cambia |
|---------|------|------------|
| `components/home/Hero.jsx` | Modify | Eliminar 2 `useState`, agregar 3 `useRef` DOM, actualización directa en rAF, extensión `.webp` |

---

## Task 1: Refactorizar Hero.jsx — useState → refs + DOM directo

**Files:**
- Modify: `components/home/Hero.jsx`

Este task elimina las dos fuentes de re-renders de React durante el scroll:
1. `const [t, setT]` — usado para `shoeTransform` y `titleOffset` en JSX
2. `const [frameIdx, setFrameIdx]` — usado para `FRAMES[frameIdx]` en `<img src>`

Los reemplazamos por tres refs a nodos DOM que el rAF loop actualiza directamente.

> ⚠️ Este task no tiene tests unitarios — la animación de scroll es puro DOM/rAF. La verificación es manual en el navegador (ver paso de verificación al final).

- [ ] **Step 1: Abrir `components/home/Hero.jsx` y localizar las líneas a cambiar**

Las líneas clave del archivo actual:

```jsx
// línea 1 — import
import { useRef, useState, useEffect } from 'react';

// líneas 17-18 — estado que vive en el rAF loop
const [t, setT]            = useState(0);
const [frameIdx, setFrameIdx] = useState(0);

// líneas 46-52 — tick del rAF loop (usa setT y setFrameIdx)
const tick = () => {
  const prev = currentT.current;
  const next = prev + (targetT.current - prev) * LERP;
  if (Math.abs(next - prev) > 0.0001) {
    currentT.current = next;
    setT(next);
    setFrameIdx(Math.min(COUNT - 1, Math.round(next * (COUNT - 1))));
  }
  raf = requestAnimationFrame(tick);
};

// líneas 63-64 — variables calculadas en render (usan t)
const shoeTransform = `translate3d(0, ${t * -30}px, 0) scale(${1 + t * 0.04})`;
const titleOffset   = -t * 4;

// JSX — style props calculadas con t
<div className="hero__titles" style={{ transform: `translate3d(0, ${titleOffset}px, 0)` }}>
<div className="hero__shoe"  style={{ transform: shoeTransform }}>
<img src={FRAMES[frameIdx]} ... />
```

- [ ] **Step 2: Reemplazar el contenido completo de `components/home/Hero.jsx`**

```jsx
import { useRef, useEffect } from 'react';
import Icon from '../ui/Icon';

const FIRST = 44, LAST = 102;
const COUNT = LAST - FIRST + 1; // 59 frames, transparente
const pad = (n) => String(n).padStart(3, '0');
const FRAMES = Array.from({ length: COUNT }, (_, i) =>
  `/frames/ezgif-frame-${pad(FIRST + i)}.png`
);

const LERP = 0.2;

export default function Hero({ onShop }) {
  const heroRef   = useRef(null);
  const targetT   = useRef(0);
  const currentT  = useRef(0);
  const preloaded = useRef(false);

  // Refs a nodos DOM — el rAF loop los actualiza directamente sin re-renders
  const imgRef   = useRef(null);
  const shoeRef  = useRef(null);
  const titleRef = useRef(null);

  // Precarga todos los frames al montar
  useEffect(() => {
    if (preloaded.current) return;
    preloaded.current = true;
    FRAMES.forEach(src => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = heroRef.current;
      if (!el) return;
      const r          = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      targetT.current  = scrollable > 0
        ? Math.max(0, Math.min(1, -r.top / scrollable))
        : 0;
    };

    let raf;
    const tick = () => {
      const prev = currentT.current;
      const next = prev + (targetT.current - prev) * LERP;
      if (Math.abs(next - prev) > 0.0001) {
        currentT.current = next;
        // Actualización directa al DOM — React no se entera, cero re-renders
        const idx = Math.min(COUNT - 1, Math.round(next * (COUNT - 1)));
        if (imgRef.current)   imgRef.current.src = FRAMES[idx];
        if (shoeRef.current)  shoeRef.current.style.transform =
          `translate3d(0, ${next * -30}px, 0) scale(${1 + next * 0.04})`;
        if (titleRef.current) titleRef.current.style.transform =
          `translate3d(0, ${-next * 4}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="hero" ref={heroRef} style={{ minHeight: '250vh' }}>
      <div className="hero__sticky">

        {/* Eyebrow row */}
        <div className="container container--wide hero__top">
          <div className="pill hero__pill">
            <span className="pill__dot" />
            <span>DROP 04 · MAY 2026</span>
          </div>
          <div className="hero__topright">
            <span className="mono">N° 0042 / 4000</span>
            <span className="hero__sep">·</span>
            <span className="mono">SS26</span>
          </div>
        </div>

        {/* Stage */}
        <div className="hero__stage">
          {/* ref={titleRef} — transform actualizado por rAF directamente */}
          <div className="hero__titles" ref={titleRef}>
            <div className="hero__row">
              <span>Silent</span>
              <span className="editorial editorial--em">motion</span>
            </div>
          </div>

          {/* ref={shoeRef} — transform actualizado por rAF directamente */}
          <div className="hero__shoe" ref={shoeRef}>
            <div className="hero__shoe-inner">
              {/* ref={imgRef} — src actualizado por rAF directamente */}
              <img
                ref={imgRef}
                src={FRAMES[0]}
                alt="AURIX shoe"
                className="hero__seq-img"
                draggable={false}
              />
            </div>
            <div className="hero__shoe-tags">
              <div className="hero__tag">
                <div className="eyebrow">Aero-Weave</div>
                <div className="hero__tag-val">−18% drag</div>
              </div>
              <div className="hero__tag hero__tag--r">
                <div className="eyebrow">Kinetic Core</div>
                <div className="hero__tag-val">N₂ infused</div>
              </div>
              <div className="hero__tag hero__tag--b">
                <div className="eyebrow">Drop · 04</div>
                <div className="hero__tag-val">€289</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="hero__bottom">
          <span className="hero__corner">built for</span>
          <div className="hero__scroll">
            <div className="hero__scroll-line"><span /></div>
            <div className="hero__scroll-label mono">SCROLL · descubre el chasis</div>
          </div>
          <span className="hero__corner hero__corner--r">the city</span>
        </div>

      </div>
    </section>
  );
}
```

- [ ] **Step 3: Arrancar el servidor de desarrollo**

```bash
npm run dev
```

Esperado: compilación sin errores en consola. Navegar a `http://localhost:3000`.

- [ ] **Step 4: Verificar manualmente la animación**

Checklist en el navegador:
- [ ] Al cargar la página, el zapato aparece en el frame inicial (frame 44)
- [ ] Al hacer scroll hacia abajo dentro del hero, el zapato cambia de frame fluidamente
- [ ] El título "Silent motion" hace parallax sutil mientras se scrollea
- [ ] El zapato escala ligeramente al llegar al final del hero
- [ ] El resto de la página (fondo, otras secciones) no lagea durante el scroll del hero
- [ ] Abrir DevTools → Performance → grabar 3 segundos de scroll → confirmar que no hay "Long Tasks" de React en el flame chart

- [ ] **Step 5: Commit**

```bash
git add components/home/Hero.jsx
git commit -m "perf: eliminate React re-renders from hero rAF loop

Replace useState(t) and useState(frameIdx) with direct DOM refs.
rAF loop now writes img.src and style.transform without triggering
React reconciliation — drops from 120 re-renders/sec to 0 during scroll."
```

---

## Task 2: Cambiar extensión de frames a WebP

**Files:**
- Modify: `components/home/Hero.jsx` (una línea)

> ⚠️ **Pre-condición obligatoria:** Los archivos WebP deben existir en `public/frames/` **antes** de aplicar este cambio. Si cambias la extensión en el código sin tener los `.webp`, el navegador mostrará imágenes rotas.

**Cómo convertir los archivos (tarea del usuario, no del código):**

Opción A — CLI con `cwebp` (recomendada para lote):
```bash
# Instalar libwebp si no está: brew install webp / choco install webp
cd public/frames
for f in *.png; do cwebp -lossless "$f" -o "${f%.png}.webp"; done
```

Opción B — GUI: arrastrar todos los PNG a [squoosh.app](https://squoosh.app), seleccionar WebP lossless, descargar lote.

Los `.webp` resultantes deben quedar en `public/frames/` con el mismo nombre base:
- `ezgif-frame-044.png` → `ezgif-frame-044.webp`
- `ezgif-frame-045.png` → `ezgif-frame-045.webp`
- … (los 59 frames)

- [ ] **Step 1: Verificar que los archivos WebP existen**

```bash
ls public/frames/*.webp | wc -l
```

Esperado: `59`

Si el resultado es menor a 59, detener — completar la conversión antes de continuar.

- [ ] **Step 2: Cambiar la extensión en `components/home/Hero.jsx` línea 9**

Antes:
```js
const FRAMES = Array.from({ length: COUNT }, (_, i) =>
  `/frames/ezgif-frame-${pad(FIRST + i)}.png`
);
```

Después:
```js
const FRAMES = Array.from({ length: COUNT }, (_, i) =>
  `/frames/ezgif-frame-${pad(FIRST + i)}.webp`
);
```

- [ ] **Step 3: Verificar en el navegador**

Con `npm run dev` corriendo, navegar a `http://localhost:3000`. El zapato debe verse igual que antes. Abrir DevTools → Network → filtrar por `webp` → confirmar que los frames se sirven como WebP (status 200).

- [ ] **Step 4: Commit**

```bash
git add components/home/Hero.jsx
git commit -m "perf: switch hero frames from PNG to WebP

Reduces per-frame decode cost from ~360 KB to ~60-220 KB depending
on lossless/lossy mode. Complements the rAF ref refactor."
```
