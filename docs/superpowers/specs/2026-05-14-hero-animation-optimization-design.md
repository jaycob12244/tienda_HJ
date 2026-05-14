# Hero Scroll Animation Optimization Design

**Goal:** Eliminar el lageo de la animación de frames del zapato en el Hero moviendo las actualizaciones de estado fuera del hilo principal de React, y reducir el peso de los assets con WebP.

**Architecture:** Reemplazar los dos `useState` que viven dentro del rAF loop por `useRef` + manipulación directa del DOM, evitando 120 reconciliaciones React/segundo durante el scroll. Complementariamente, convertir los 59 PNG a WebP para reducir el costo de decode por frame.

**Tech Stack:** React useRef, requestAnimationFrame, WebP (lossless o lossy ≥ 90)

---

## Problema raíz

El rAF loop actual llama a `setT(next)` y `setFrameIdx(...)` en cada tick. A 60 fps eso dispara **120 ciclos de reconciliación React por segundo** en el hilo principal, bloqueando tanto la animación del zapato como el resto del scroll de la página.

---

## Parte A — Sacar React del rAF loop

### Qué cambia en `components/home/Hero.jsx`

**Eliminar:**
```js
const [t, setT]            = useState(0);
const [frameIdx, setFrameIdx] = useState(0);
```

**Agregar refs para los nodos DOM que el rAF loop necesita actualizar:**
```js
const imgRef   = useRef(null);   // <img> del frame actual
const shoeRef  = useRef(null);   // div .hero__shoe (transform parallax)
const titleRef = useRef(null);   // div .hero__titles (transform parallax)
```

**rAF loop — actualización directa, sin setState:**
```js
const tick = () => {
  const prev = currentT.current;
  const next = prev + (targetT.current - prev) * LERP;
  if (Math.abs(next - prev) > 0.0001) {
    currentT.current = next;

    // DOM directo — sin React
    const idx = Math.min(COUNT - 1, Math.round(next * (COUNT - 1)));
    if (imgRef.current)   imgRef.current.src = FRAMES[idx];
    if (shoeRef.current)  shoeRef.current.style.transform =
      `translate3d(0, ${next * -30}px, 0) scale(${1 + next * 0.04})`;
    if (titleRef.current) titleRef.current.style.transform =
      `translate3d(0, ${-next * 4}px, 0)`;
  }
  raf = requestAnimationFrame(tick);
};
```

**JSX — adjuntar refs a los nodos correspondientes:**
- `<div className="hero__shoe" ref={shoeRef}>` (quitar `style={{ transform: shoeTransform }}`)
- `<div className="hero__titles" ref={titleRef}>` (quitar `style={{ transform: ... }}`)
- `<img ref={imgRef} src={FRAMES[0]} ...>` (src inicial = frame 0)

**Resultado:** React renderiza el Hero **una sola vez** al montar. Durante el scroll, solo el DOM cambia — sin reconciliación, sin re-renders.

---

## Parte C — Convertir frames PNG a WebP

### Conversión (tarea manual del usuario)

Los 59 archivos en `public/frames/` deben convertirse a WebP. Opciones:

- **Lossless** (`cwebp -lossless`): calidad idéntica al PNG, ~30–40% más liviano.
- **Lossy ≥ 90** (`cwebp -q 90`): visualmente indistinguible, ~70–80% más liviano.

Herramientas recomendadas:
- CLI: `cwebp` (libwebp) — `for f in *.png; do cwebp -lossless "$f" -o "${f%.png}.webp"; done`
- GUI: [Squoosh](https://squoosh.app/) (arrastrar lote)

Los archivos WebP deben reemplazar los PNG en `public/frames/` **con el mismo nombre base** (ej. `ezgif-frame-044.webp`).

### Cambio en código

En `Hero.jsx`, cambiar la extensión en la constante FRAMES:

```js
// Antes
const FRAMES = Array.from({ length: COUNT }, (_, i) =>
  `/frames/ezgif-frame-${pad(FIRST + i)}.png`
);

// Después
const FRAMES = Array.from({ length: COUNT }, (_, i) =>
  `/frames/ezgif-frame-${pad(FIRST + i)}.webp`
);
```

Un solo carácter de cambio en el código. Los archivos WebP deben existir antes de que el cambio sea efectivo.

---

## Preloading — sin cambios

El preloading actual con `new window.Image()` sigue funcionando para WebP. No requiere cambios. Los `Image` objects se decodifican en el cache del navegador y el lookup por `src` seguirá siendo instantáneo.

---

## Lo que NO cambia

- Lógica LERP (`LERP = 0.2`, `targetT`, `currentT`)
- Scroll listener (`onScroll`, passive)
- Layout sticky del Hero (`minHeight: 250vh`, `.hero__sticky`)
- CSS del zapato (drop-shadow, `hero__seq-img`)
- Preloading de frames
- Tags del zapato (Aero-Weave, Kinetic Core, Drop 04)

---

## Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `components/home/Hero.jsx` | Eliminar 2 useState, agregar 3 useRef, actualización DOM directa en rAF, src inicial WebP |
| `public/frames/*.webp` | Conversión manual por el usuario (fuera del alcance del código) |
