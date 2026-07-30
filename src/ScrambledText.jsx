import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';

export default function ScrambledText({
  radius = 100,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = '.:',
  className = '',
  style = {},
  children
}) {
  const rootRef = useRef(null);
  const text = useMemo(() => String(children ?? ''), [children]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const chars = Array.from(root.querySelectorAll('.char'));
    const running = new WeakSet();

    const scrambleChar = char => {
      if (running.has(char)) return;
      running.add(char);
      const original = char.dataset.content || '';
      if (!original.trim()) {
        running.delete(char);
        return;
      }

      const steps = Math.max(3, Math.round(duration / Math.max(0.03, speed * 0.08)));
      const state = { progress: 0 };
      gsap.to(state, {
        progress: steps,
        duration,
        ease: 'none',
        overwrite: true,
        onUpdate: () => {
          const done = Math.floor(state.progress);
          char.textContent = done >= steps
            ? original
            : scrambleChars[Math.floor(Math.random() * scrambleChars.length)] || original;
        },
        onComplete: () => {
          char.textContent = original;
          running.delete(char);
        }
      });
    };

    const handleMove = event => {
      chars.forEach(char => {
        const { left, top, width, height } = char.getBoundingClientRect();
        const dx = event.clientX - (left + width / 2);
        const dy = event.clientY - (top + height / 2);
        const dist = Math.hypot(dx, dy);
        if (dist < radius) scrambleChar(char);
      });
    };

    root.addEventListener('pointermove', handleMove, { passive: true });
    return () => {
      root.removeEventListener('pointermove', handleMove);
      chars.forEach(char => gsap.killTweensOf(char));
    };
  }, [duration, radius, scrambleChars, speed, text]);

  return (
    <span ref={rootRef} className={`scrambled-text ${className}`} style={style}>
      {Array.from(text).map((char, index) => (
        <span className="char" data-content={char} key={`${char}-${index}`}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}
