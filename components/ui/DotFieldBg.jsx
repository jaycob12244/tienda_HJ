import { useRef, useEffect } from 'react';

/* Section-local dot field for light backgrounds.
   Renders as position:absolute filling the parent section,
   so it always stays behind section content. */
export default function DotFieldBg({
  spacing = 28,
  hoverRadius = 160,
  maxLength = 20,
  baseColor = 'rgba(10,10,10,0.07)',
  activeColor = 'rgba(10,10,10,0.85)',
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
    let raf = 0;
    let frame = 0;

    const setSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = parent.offsetWidth;
      h = parent.offsetHeight;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width  = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const lx = e.clientX - rect.left;
      const ly = e.clientY - rect.top;
      // Only activate when mouse is within this section's bounds
      if (lx >= 0 && lx <= rect.width && ly >= 0 && ly <= rect.height) {
        target.x = lx;
        target.y = ly;
        active = true;
      } else {
        active = false;
      }
    };
    const onLeave = () => { active = false; };

    const parse = (rgba) => {
      const m = rgba.match(/rgba?\(([^)]+)\)/);
      if (!m) return [10, 10, 10, 0.07];
      const parts = m[1].split(',').map(s => parseFloat(s.trim()));
      while (parts.length < 4) parts.push(1);
      return parts;
    };
    const [br, bg, bb, ba] = parse(baseColor);
    const [ar, ag, ab, aa] = parse(activeColor);

    const tick = () => {
      cur.x += (target.x - cur.x) * 0.18;
      cur.y += (target.y - cur.y) * 0.18;
      ctx.clearRect(0, 0, w, h);

      const offX = ((w % spacing) / 2);
      const offY = ((h % spacing) / 2);
      const r2   = hoverRadius * hoverRadius;

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

    // Resize observer keeps canvas matched to section size
    const ro = new ResizeObserver(setSize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, [spacing, hoverRadius, maxLength, baseColor, activeColor]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
