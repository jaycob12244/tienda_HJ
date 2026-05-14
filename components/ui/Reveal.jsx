import { useRef, useState, useEffect } from 'react';

function useReveal({ threshold = 0.12, once = true, rootMargin = '0px 0px -8% 0px' } = {}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { setShown(true); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { setShown(true); if (once) io.disconnect(); }
        else if (!once) setShown(false);
      }),
      { threshold, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once, rootMargin]);

  return [ref, shown];
}

export default function Reveal({
  as: Tag = 'div',
  variant = 'rise',
  delay = 0,
  duration = 900,
  className = '',
  children,
  once = true,
  ...rest
}) {
  const [ref, shown] = useReveal({ once });

  return (
    <Tag
      ref={ref}
      data-reveal={variant}
      className={`reveal ${shown ? 'is-in ' : ''}${className}`}
      style={{ '--reveal-delay': `${delay}ms`, '--reveal-duration': `${duration}ms`, ...rest.style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
