import { useRef, useCallback } from 'react';

// Pointer glow + optional 3D tilt. Updates are batched into one rAF per frame and the
// bounding box is cached on enter, so mouse movement never forces layout mid-scroll.
export default function GlowCard({ children, className = '', as: Tag = 'div', tilt = true, ...props }) {
  const ref = useRef(null);
  const rectRef = useRef(null);
  const frameRef = useRef(0);
  const pointRef = useRef({ x: 0, y: 0 });

  const apply = useCallback(() => {
    frameRef.current = 0;
    const el = ref.current;
    const rect = rectRef.current;
    if (!el || !rect) return;
    const px = (pointRef.current.x - rect.left) / rect.width;
    const py = (pointRef.current.y - rect.top) / rect.height;
    el.style.setProperty('--glow-x', `${px * 100}%`);
    el.style.setProperty('--glow-y', `${py * 100}%`);
    if (tilt) {
      el.style.transform = `perspective(800px) rotateX(${(py - 0.5) * 8}deg) rotateY(${(px - 0.5) * -8}deg) translateY(-6px)`;
    }
  }, [tilt]);

  const onEnter = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    rectRef.current = el.getBoundingClientRect();
    el.style.setProperty('--glow-opacity', '1');
  }, []);

  const onMove = useCallback((e) => {
    if (!rectRef.current) onEnter();
    pointRef.current.x = e.clientX;
    pointRef.current.y = e.clientY;
    if (!frameRef.current) frameRef.current = requestAnimationFrame(apply);
  }, [apply, onEnter]);

  const onLeave = useCallback(() => {
    const el = ref.current;
    cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;
    rectRef.current = null;
    if (!el) return;
    el.style.setProperty('--glow-opacity', '0');
    if (tilt) el.style.transform = '';
  }, [tilt]);

  // Scrolling moves the card, so drop the cached rect and re-measure on the next move.
  const onWheel = useCallback(() => { rectRef.current = null; }, []);

  return (
    <Tag
      ref={ref}
      className={`glow-card ${className}`}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onWheel={onWheel}
      {...props}
    >
      <div className="glow-card-glow" aria-hidden="true" />
      {children}
    </Tag>
  );
}
