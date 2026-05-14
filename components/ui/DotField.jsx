import { useRef, useEffect } from 'react';

export default function DotField({
  spacing = 28,
  hoverRadius = 180,
  maxLength = 22,
  baseColor = 'rgba(250,249,246,0.18)',
  activeColor = 'rgba(201,184,161,1)',
  zIndex = 0,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0, h = 0;
    const target = { x: -9999, y: -9999 };
    const cur    = { x: -9999, y: -9999 };
    let active = false;
    let scrollY = window.scrollY || 0;
    let raf = 0;

    const setSize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width  = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();

    const onMove   = (e) => { target.x = e.clientX; target.y = e.clientY; active = true; };
    const onLeave  = () => { active = false; };
    const onTouch  = (e) => { if (e.touches?.[0]) { target.x = e.touches[0].clientX; target.y = e.touches[0].clientY; active = true; } };
    const onScroll = () => { scrollY = window.scrollY; };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('touchstart', onTouch, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', setSize);

    const parse = (rgba) => {
      const m = rgba.match(/rgba?\(([^)]+)\)/);
      if (!m) return [250, 249, 246, 1];
      const parts = m[1].split(',').map(s => parseFloat(s.trim()));
      while (parts.length < 4) parts.push(1);
      return parts;
    };
    const [br, bg, bb, ba] = parse(baseColor);
    const [ar, ag, ab, aa] = parse(activeColor);

    let frame = 0;
    const tick = () => {
      cur.x += (target.x - cur.x) * 0.18;
      cur.y += (target.y - cur.y) * 0.18;
      ctx.clearRect(0, 0, w, h);

      const drift = (scrollY * 0.06) % spacing;
      const offX  = ((w % spacing) / 2 + (spacing - drift)) % spacing;
      const offY  = ((h % spacing) / 2) % spacing;
      const r2    = hoverRadius * hoverRadius;

      for (let y = offY; y < h + spacing; y += spacing) {
        for (let x = offX; x < w + spacing; x += spacing) {
          const wob = Math.sin((x + y) * 0.012 + frame * 0.012) * 0.5;
          const dx  = cur.x - x;
          const dy  = cur.y - y;
          const dsq = dx * dx + dy * dy;

          if (active && dsq < r2) {
            const d    = Math.sqrt(dsq);
            const t    = 1 - d / hoverRadius;
            const tt   = t * t;
            const ang  = Math.atan2(dy, dx);
            const len  = maxLength * tt + 2;
            const rr   = 1.0 + tt * 1.6;
            const alpha = ba + (aa - ba) * tt;
            const cr = Math.round(br + (ar - br) * tt);
            const cg = Math.round(bg + (ag - bg) * tt);
            const cb = Math.round(bb + (ab - bb) * tt);

            ctx.save();
            ctx.translate(x + wob, y + wob);
            ctx.rotate(ang);
            ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
            ctx.beginPath();
            if (ctx.roundRect) {
              ctx.roundRect(-len / 2, -rr, len, rr * 2, rr);
            } else {
              ctx.ellipse(0, 0, len / 2, rr, 0, 0, Math.PI * 2);
            }
            ctx.fill();
            ctx.restore();
          } else {
            ctx.fillStyle = `rgba(${br},${bg},${bb},${ba})`;
            ctx.beginPath();
            ctx.arc(x + wob, y + wob, 1.1, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      frame++;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', setSize);
    };
  }, [spacing, hoverRadius, maxLength, baseColor, activeColor]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex }}
    />
  );
}
