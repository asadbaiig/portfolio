import { useRef, useCallback } from 'react';

export default function MagneticButton({ children, className = '', href, ...props }) {
  const ref = useRef(null);

  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.3}px, ${y * 0.35}px)`;
    const inner = el.querySelector('.magnetic-inner');
    if (inner) inner.style.transform = `translate(${x * 0.1}px, ${y * 0.12}px)`;
  }, []);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = '';
    const inner = el.querySelector('.magnetic-inner');
    if (inner) inner.style.transform = '';
  }, []);

  const Tag = href ? 'a' : 'button';
  const linkProps = href ? { href } : {};

  return (
    <Tag
      ref={ref}
      className={`magnetic-wrap ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...linkProps}
      {...props}
    >
      <span className="magnetic-inner">{children}</span>
    </Tag>
  );
}
