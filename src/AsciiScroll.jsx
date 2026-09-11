import { useEffect, useRef } from 'react';
import { baseUrl } from './portfolio-data.js';
import { createAsciiRenderer } from './asciiRenderer.js';

export default function AsciiScroll({ animated }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const photoRef = useRef(null);
  const phaseRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const photo = photoRef.current;
    const renderer = createAsciiRenderer(canvas);
    if (!renderer) { section.dataset.fallback = 'true'; return; }
    delete section.dataset.fallback;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, lastTime = 0, progress = 0;
    let visible = true, ready = false, hovered = false, focused = false, tapped = false, lost = false;
    const draw = time => {
      frame = 0;
      if (!visible || document.hidden || lost) { lastTime = 0; return; }
      const moving = animated && !preference.matches;
      const delta = lastTime ? Math.min((time-lastTime)/1000, .05) : 1/60;
      lastTime = time;
      const target = !moving || hovered || focused || tapped ? 1 : 0;
      // Complete the motion in a bounded time instead of slowly chasing the target.
      progress = !moving ? 1 : target > progress ? Math.min(target,progress+delta/.65) : Math.max(target,progress-delta/.65);
      if (moving) phaseRef.current += delta*.38*(1-progress);
      renderer.draw(ready ? progress : 0, phaseRef.current);
      if (moving && (progress < 1 || progress !== target)) schedule();
    };
    const schedule = () => {
      if (!frame && visible && !document.hidden && !lost) frame = requestAnimationFrame(draw);
    };
    const suspend = () => { cancelAnimationFrame(frame); frame = 0; lastTime = 0; };
    const enter = event => { if(event.pointerType !== 'touch') { hovered = true; schedule(); } };
    const leave = () => { hovered = false; schedule(); };
    const focus = () => { focused = section.matches(':focus-visible'); schedule(); };
    const blur = () => { focused = false; tapped = false; schedule(); };
    const tap = event => { if(event.pointerType === 'touch') { tapped = !tapped; schedule(); } };
    const visibility = () => { if(document.hidden) suspend(); else schedule(); };
    const load = () => { if(photo.naturalWidth && !lost) { renderer.setPhoto(photo); ready = true; schedule(); } };
    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if(width && height && !lost) { renderer.resize(width,height); schedule(); }
    };
    const contextLost = event => {
      event.preventDefault(); lost = true; suspend(); section.dataset.fallback = 'true';
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if(visible) schedule(); else suspend();
    });
    const resizeObserver = new ResizeObserver(resize);
    observer.observe(section); resizeObserver.observe(canvas);
    const events = { pointerenter: enter, pointerleave: leave, pointerup: tap, focus, blur };
    Object.entries(events).forEach(([name,listener]) => section.addEventListener(name,listener));
    photo.addEventListener('load',load);
    canvas.addEventListener('webglcontextlost',contextLost);
    preference.addEventListener('change',schedule);
    document.addEventListener('visibilitychange',visibility);
    resize(); if(photo.complete) load();
    return () => {
      suspend(); observer.disconnect(); resizeObserver.disconnect(); renderer.dispose();
      Object.entries(events).forEach(([name,listener]) => section.removeEventListener(name,listener));
      photo.removeEventListener('load',load);
      canvas.removeEventListener('webglcontextlost',contextLost);
      preference.removeEventListener('change',schedule);
      document.removeEventListener('visibilitychange',visibility);
      delete section.dataset.fallback;
    };
  }, [animated]);

  return <div className="ascii-art" ref={sectionRef} tabIndex={0} role="img" aria-label="Asad Baig's interactive portrait. Hover, focus, or tap to assemble the photo from ASCII particles.">
    <span className="ascii-bracket ascii-bracket-top" aria-hidden="true">+</span>
    <canvas ref={canvasRef} aria-hidden="true"/>
    <img className="ascii-fallback" ref={photoRef} src={`${baseUrl}asad-mountains.jpeg`} alt="" fetchPriority="high"/>
    <span className="ascii-bracket ascii-bracket-bottom" aria-hidden="true">+</span>
    <span className="ascii-caption" aria-hidden="true">[ <span className="ascii-hover-hint">HOVER TO REVEAL</span><span className="ascii-touch-hint">TAP TO REVEAL</span> ]</span>
  </div>;
}
