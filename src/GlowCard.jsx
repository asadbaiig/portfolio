import { useRef, useCallback } from 'react';

export default function GlowCard({ children, className = '', as: Tag = 'div', ...props }) {
  const ref = useRef(null);

  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty('--glow-x', `${x}%`);
    el.style.setProperty('--glow-y', `${y}%`);
    el.style.setProperty('--glow-opacity', '1');
    
    // 3D tilt effect
    const tiltX = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
    const tiltY = ((e.clientX - rect.left) / rect.width - 0.5) * -8;
    el.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
  }, []);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--glow-opacity', '0');
    el.style.transform = '';
  }, []);

  return (
    <Tag
      ref={ref}
      className={`glow-card ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...props}
    >
      <div className="glow-card-glow" aria-hidden="true" />
      {children}
    </Tag>
  );
}
