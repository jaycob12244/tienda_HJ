import { useEffect, useMemo, useRef, useState } from "react";

const FIRST_FRAME = 30;
const LAST_FRAME = 110;
const FRAME_COUNT = LAST_FRAME - FIRST_FRAME + 1;

function framePath(index) {
  return `/imagenes_scroll/ezgif-frame-${String(FIRST_FRAME + index).padStart(3, "0")}.jpg`;
}

export default function ScrollShoeSequence() {
  const sectionRef = useRef(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const frames = useMemo(() => Array.from({ length: FRAME_COUNT }, (_, index) => framePath(index)), []);
  const activeFrameIndex = Math.min(FRAME_COUNT - 1, Math.max(0, frameIndex));

  useEffect(() => {
    frames.forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }, [frames]);

  useEffect(() => {
    let ticking = false;

    function updateFrame() {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollable = Math.max(1, rect.height - window.innerHeight);
      const nextProgress = Math.min(1, Math.max(0, -rect.top / scrollable));
      setProgress(nextProgress);
      setFrameIndex(Math.round(nextProgress * (FRAME_COUNT - 1)));
      ticking = false;
    }

    function handleScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateFrame);
    }

    updateFrame();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[170vh] bg-white" id="showcase" aria-label="Animación de despiece del zapato AURIX">
      <div className="sticky top-0 grid h-screen place-items-center overflow-hidden bg-white px-5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_58%,rgba(0,0,0,0.055),transparent_42%)]" />
        <span className="sr-only">Secuencia animada del zapato AURIX desarmándose con el scroll</span>
        <div
          className="relative z-10 aspect-[16/9] w-[min(1120px,92vw)] max-w-none select-none"
          style={{
            transform: `translate3d(${(progress - 0.5) * 56}px, ${18 - progress * 36}px, 0) scale(${0.9 - progress * 0.035})`,
            opacity: 1 - progress * 0.04,
          }}
        >
          {frames.map((src, index) => (
            <img
              key={src}
              className="absolute inset-0 h-full w-full object-contain mix-blend-multiply"
              src={src}
              alt=""
              draggable="false"
              aria-hidden="true"
              style={{ opacity: index === activeFrameIndex ? 1 : index === 0 ? 0.03 : 0 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
