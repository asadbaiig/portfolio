import { useEffect, useRef } from 'react';

const HOVER_SELECTOR = 'a, button, [role="button"], .project-card, .skill-node, input, textarea, summary';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;
    let hovering = false;
    let clicking = false;
    let raf = 0;

    const render = () => {
      raf = 0;
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%) scale(${clicking ? 0.5 : 1})`;
      const scale = hovering ? 2.2 : clicking ? 0.6 : 1;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%) scale(${scale})`;
      ring.style.opacity = hovering ? 0.25 : 0.5;
      ring.style.borderColor = hovering ? '#b7a0ff' : '#ffffff44';

      // Keep animating only while the ring is still catching up.
      if (Math.abs(mouseX - ringX) > 0.1 || Math.abs(mouseY - ringY) > 0.1) schedule();
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(render); };

    const onMove = e => { mouseX = e.clientX; mouseY = e.clientY; schedule(); };
    // Event delegation: one listener instead of re-scanning the DOM on every mutation.
    const onOver = e => {
      const next = !!e.target.closest?.(HOVER_SELECTOR);
      if (next !== hovering) { hovering = next; schedule(); }
    };
    const onDown = () => { clicking = true; schedule(); };
    const onUp = () => { clicking = false; schedule(); };

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('pointerup', onUp);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerup', onUp);
    };
  }, [isTouch]);

  // Only show on non-touch devices
  if (isTouch) return null;

  return <>
    <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
  </>;
}
