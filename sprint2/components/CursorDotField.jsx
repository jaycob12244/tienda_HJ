import { useEffect, useMemo, useState } from "react";

export default function CursorDotField() {
  const [position, setPosition] = useState({ x: 0, y: 0, active: false });

  const dots = useMemo(
    () =>
      Array.from({ length: 56 }, (_, index) => {
        const angle = index * 0.74;
        const radius = 34 + (index % 9) * 18;
        return {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          size: 2 + (index % 4),
          opacity: 0.1 + (index % 7) * 0.045,
          delay: `${(index % 8) * 18}ms`,
        };
      }),
    []
  );

  useEffect(() => {
    function handlePointerMove(event) {
      setPosition({ x: event.clientX, y: event.clientY, active: true });
    }

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {dots.map((dot, index) => (
        <span
          key={index}
          className="absolute rounded-full bg-black transition-transform duration-500 ease-out"
          style={{
            width: dot.size,
            height: dot.size,
            opacity: position.active ? dot.opacity : 0,
            transform: `translate3d(${position.x + dot.x}px, ${position.y + dot.y}px, 0)`,
            transitionDelay: dot.delay,
          }}
        />
      ))}
    </div>
  );
}
