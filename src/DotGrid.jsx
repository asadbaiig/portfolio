import { useCallback, useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';

const throttle = (func, limit) => {
  let lastCall = 0;
  return (...args) => {
    const now = performance.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func(...args);
    }
  };
};

function hexToRgb(hex) {
  const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!match) return { r: 0, g: 255, b: 136 };
  return {
    r: parseInt(match[1], 16),
    g: parseInt(match[2], 16),
    b: parseInt(match[3], 16)
  };
}

export default function DotGrid({
  dotSize = 4,
  gap = 18,
  baseColor = '#164d36',
  activeColor = '#a2e33f',
  proximity = 150,
  speedTrigger = 90,
  shockRadius = 260,
  shockStrength = 4,
  maxSpeed = 5000,
  resistance = 750,
  returnDuration = 1.35,
  className = '',
  style
}) {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  const pointerRef = useRef({ x: -9999, y: -9999, vx: 0, vy: 0, speed: 0, lastTime: 0, lastX: 0, lastY: 0 });

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const { width, height } = wrap.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const cell = dotSize + gap;
    const cols = Math.ceil((width + gap) / cell);
    const rows = Math.ceil((height + gap) / cell);
    const gridW = cell * cols - gap;
    const gridH = cell * rows - gap;
    const startX = (width - gridW) / 2 + dotSize / 2;
    const startY = (height - gridH) / 2 + dotSize / 2;

    const dots = [];
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        dots.push({ cx: startX + x * cell, cy: startY + y * cell, xOffset: 0, yOffset: 0, scale: 1, active: false });
      }
    }
    dotsRef.current = dots;
  }, [dotSize, gap]);

  useEffect(() => {
    buildGrid();
    const observer = new ResizeObserver(buildGrid);
    if (wrapperRef.current) observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [buildGrid]);

  useEffect(() => {
    let rafId = 0;
    const proxSq = proximity * proximity;

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const { x: px, y: py } = pointerRef.current;
      for (const dot of dotsRef.current) {
        const ox = dot.cx + dot.xOffset;
        const oy = dot.cy + dot.yOffset;
        const dx = dot.cx - px;
        const dy = dot.cy - py;
        const dsq = dx * dx + dy * dy;

        let r = baseRgb.r;
        let g = baseRgb.g;
        let b = baseRgb.b;
        let alpha = 0.56;
        if (dsq <= proxSq) {
          const t = 1 - Math.sqrt(dsq) / proximity;
          r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
          g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
          b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
          alpha = 0.58 + t * 0.42;
        }

        ctx.beginPath();
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.shadowColor = `rgba(${activeRgb.r},${activeRgb.g},${activeRgb.b},0.18)`;
        ctx.shadowBlur = dsq <= proxSq ? 12 : 0;
        ctx.arc(ox, oy, (dotSize / 2) * dot.scale, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafId);
  }, [activeRgb, baseRgb, dotSize, proximity]);

  useEffect(() => {
    const onMove = e => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const now = performance.now();
      const pointer = pointerRef.current;
      const dt = pointer.lastTime ? now - pointer.lastTime : 16;
      const dx = e.clientX - pointer.lastX;
      const dy = e.clientY - pointer.lastY;
      let vx = (dx / dt) * 1000;
      let vy = (dy / dt) * 1000;
      let speed = Math.hypot(vx, vy);
      if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        vx *= scale;
        vy *= scale;
        speed = maxSpeed;
      }

      pointer.lastTime = now;
      pointer.lastX = e.clientX;
      pointer.lastY = e.clientY;
      pointer.vx = vx;
      pointer.vy = vy;
      pointer.speed = speed;
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;

      if (speed <= speedTrigger) return;
      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - pointer.x, dot.cy - pointer.y);
        if (dist < proximity && !dot.active) {
          dot.active = true;
          gsap.killTweensOf(dot);
          const falloff = 1 - dist / proximity;
          const pushX = (dot.cx - pointer.x) * 0.12 * falloff + vx * 0.006 * falloff;
          const pushY = (dot.cy - pointer.y) * 0.12 * falloff + vy * 0.006 * falloff;
          gsap.to(dot, {
            xOffset: pushX,
            yOffset: pushY,
            scale: 1 + falloff * 0.7,
            duration: Math.max(0.18, resistance / 3000),
            ease: 'power3.out',
            onComplete: () => {
              gsap.to(dot, {
                xOffset: 0,
                yOffset: 0,
                scale: 1,
                duration: returnDuration,
                ease: 'elastic.out(1, 0.75)',
                onComplete: () => { dot.active = false; }
              });
            }
          });
        }
      }
    };

    const onClick = e => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - cx, dot.cy - cy);
        if (dist < shockRadius && !dot.active) {
          dot.active = true;
          gsap.killTweensOf(dot);
          const falloff = Math.max(0, 1 - dist / shockRadius);
          gsap.to(dot, {
            xOffset: (dot.cx - cx) * shockStrength * 0.18 * falloff,
            yOffset: (dot.cy - cy) * shockStrength * 0.18 * falloff,
            scale: 1 + falloff,
            duration: 0.22,
            ease: 'power3.out',
            onComplete: () => {
              gsap.to(dot, {
                xOffset: 0,
                yOffset: 0,
                scale: 1,
                duration: returnDuration,
                ease: 'elastic.out(1, 0.75)',
                onComplete: () => { dot.active = false; }
              });
            }
          });
        }
      }
    };

    const throttledMove = throttle(onMove, 32);
    window.addEventListener('mousemove', throttledMove, { passive: true });
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('mousemove', throttledMove);
      window.removeEventListener('click', onClick);
    };
  }, [maxSpeed, proximity, resistance, returnDuration, shockRadius, shockStrength, speedTrigger]);

  return (
    <section ref={wrapperRef} className={`dot-grid-background ${className}`} style={style} aria-hidden="true">
      <canvas ref={canvasRef} className="dot-grid-canvas" />
    </section>
  );
}
