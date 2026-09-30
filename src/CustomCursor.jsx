import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;
    let hovering = false;
    let clicking = false;
    let raf;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onEnter = () => { hovering = true; };
    const onLeave = () => { hovering = false; };
    const onDown = () => { clicking = true; };
    const onUp = () => { clicking = false; };

    const addHoverListeners = () => {
      document.querySelectorAll('a, button, [role="button"], .project-card, .skill-node, .cert-grid a, input, textarea').forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };

    const loop = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%) scale(${clicking ? 0.5 : 1})`;
      
      const scale = hovering ? 2.2 : clicking ? 0.6 : 1;
      const opacity = hovering ? 0.25 : 0.5;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%) scale(${scale})`;
      ring.style.opacity = opacity;
      ring.style.borderColor = hovering ? '#b7a0ff' : '#ffffff44';

      raf = requestAnimationFrame(loop);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    addHoverListeners();
    raf = requestAnimationFrame(loop);

    // Re-observe for dynamically added elements
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      observer.disconnect();
    };
  }, []);

  // Only show on non-touch devices
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;
  if (isTouch) return null;

  return <>
    <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
  </>;
}
