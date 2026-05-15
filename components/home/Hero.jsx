import { useRef, useEffect } from 'react';
import Icon from '../ui/Icon';

const FIRST = 44, LAST = 102;
const COUNT = LAST - FIRST + 1; // 59 frames, transparent PNG
const pad = (n) => String(n).padStart(3, '0');
const FRAMES = Array.from({ length: COUNT }, (_, i) =>
  `/frames/ezgif-frame-${pad(FIRST + i)}.webp`
);

const LERP = 0.2; // smoothing factor — lower = slower/smoother, higher = snappier

export default function Hero() {
  const heroRef    = useRef(null);
  const targetT    = useRef(0);   // raw scroll progress (updated on scroll)
  const currentT   = useRef(0);   // lerped progress (drives the visual)

  // Cache de imágenes precargadas — solo usamos frames que ya están listos
  const imageCache = useRef(new Array(COUNT).fill(null));
  const lastLoaded = useRef(0); // último índice confirmado como cargado

  // Refs a nodos DOM — el rAF loop los actualiza directamente sin re-renders
  const imgRef   = useRef(null);
  const shoeRef  = useRef(null);
  const titleRef = useRef(null);

  // Preload todos los frames en orden; marca cada uno cuando termina de cargar
  useEffect(() => {
    FRAMES.forEach((src, i) => {
      const img = new window.Image();
      img.onload = () => {
        imageCache.current[i] = img;
        // Actualizar lastLoaded de forma secuencial para no mostrar huecos
        if (i === 0) lastLoaded.current = 0;
        while (imageCache.current[lastLoaded.current + 1] && lastLoaded.current < COUNT - 1) {
          lastLoaded.current++;
        }
      };
      img.src = src;
    });
  }, []);

  useEffect(() => {
    let raf;

    const tick = () => {
      const prev = currentT.current;
      const next = prev + (targetT.current - prev) * LERP;
      if (Math.abs(next - prev) > 0.0001) {
        currentT.current = next;
        // Actualización directa al DOM — React no se entera, cero re-renders
        // Usar solo frames que ya están cargados — evita blancos en producción
        const ideal = Math.min(COUNT - 1, Math.round(next * (COUNT - 1)));
        const idx   = Math.min(ideal, lastLoaded.current);
        if (imgRef.current && imageCache.current[idx]) {
          imgRef.current.src = imageCache.current[idx].src;
        }
        if (shoeRef.current)  shoeRef.current.style.transform =
          `translate3d(0, ${next * -30}px, 0) scale(${1 + next * 0.04})`;
        if (titleRef.current) titleRef.current.style.transform =
          `translate3d(0, ${-next * 4}px, 0)`;
        raf = requestAnimationFrame(tick); // solo continuar si hay movimiento
      }
    };

    const onScroll = () => {
      const el = heroRef.current;
      if (!el) return;
      const r          = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      targetT.current  = scrollable > 0
        ? Math.max(0, Math.min(1, -r.top / scrollable))
        : 0;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };

    onScroll(); // calcular posición inicial y arrancar primer tick
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
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

        {/* Bottom bar: corner words + scroll indicator */}
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
