import { useRef, useState, useEffect } from 'react';
import Icon from '../ui/Icon';

const FIRST = 44, LAST = 102;
const COUNT = LAST - FIRST + 1; // 59 frames, transparent PNG
const pad = (n) => String(n).padStart(3, '0');
const FRAMES = Array.from({ length: COUNT }, (_, i) =>
  `/frames/ezgif-frame-${pad(FIRST + i)}.png`
);

const LERP = 0.2; // smoothing factor — lower = slower/smoother, higher = snappier

export default function Hero({ onShop }) {
  const heroRef    = useRef(null);
  const targetT    = useRef(0);   // raw scroll progress (updated on scroll)
  const currentT   = useRef(0);   // lerped progress (drives the visual)
  const [t, setT]            = useState(0);
  const [frameIdx, setFrameIdx] = useState(0);
  const preloaded = useRef(false);

  // Preload all frames so scroll is instant
  useEffect(() => {
    if (preloaded.current) return;
    preloaded.current = true;
    FRAMES.forEach(src => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    // Update raw target on every scroll event
    const onScroll = () => {
      const el = heroRef.current;
      if (!el) return;
      const r          = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      targetT.current  = scrollable > 0
        ? Math.max(0, Math.min(1, -r.top / scrollable))
        : 0;
    };

    // rAF loop: lerp currentT toward targetT every frame
    let raf;
    const tick = () => {
      const prev = currentT.current;
      const next = prev + (targetT.current - prev) * LERP;
      // Only update state when there's a meaningful change
      if (Math.abs(next - prev) > 0.0001) {
        currentT.current = next;
        setT(next);
        setFrameIdx(Math.min(COUNT - 1, Math.round(next * (COUNT - 1))));
      }
      raf = requestAnimationFrame(tick);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  const shoeTransform = `translate3d(0, ${t * -30}px, 0) scale(${1 + t * 0.04})`;
  const titleOffset   = -t * 4;

  return (
    /*
      The section is 250vh tall — the extra 150vh is the "scroll runway"
      for the frame animation. The inner .hero__sticky stays pinned to the
      viewport while the user scrolls through the frames.
    */
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
          {/* Main title — large, top of stage */}
          <div
            className="hero__titles"
            style={{ transform: `translate3d(0, ${titleOffset}px, 0)` }}
          >
            <div className="hero__row">
              <span>Silent</span>
              <span className="editorial editorial--em">motion</span>
            </div>
          </div>

          {/* Frame animation shoe */}
          <div className="hero__shoe" style={{ transform: shoeTransform }}>
            <div className="hero__shoe-inner">
              <img
                src={FRAMES[frameIdx]}
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
