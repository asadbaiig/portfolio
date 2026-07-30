import { useCallback, useEffect, useRef } from 'react';

export default function ElectricBorder({
  children,
  color = '#7df9ff',
  speed = 1,
  chaos = 0.12,
  borderRadius = 24,
  className = '',
  style
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);
  const lastFrameTimeRef = useRef(0);

  const random = useCallback(x => (Math.sin(x * 12.9898) * 43758.5453) % 1, []);

  const noise2D = useCallback((x, y) => {
    const i = Math.floor(x);
    const j = Math.floor(y);
    const fx = x - i;
    const fy = y - j;
    const a = random(i + j * 57);
    const b = random(i + 1 + j * 57);
    const c = random(i + (j + 1) * 57);
    const d = random(i + 1 + (j + 1) * 57);
    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);
    return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
  }, [random]);

  const octavedNoise = useCallback((x, octaves, lacunarity, gain, baseAmplitude, baseFrequency, time, seed, baseFlatness) => {
    let y = 0;
    let amplitude = baseAmplitude;
    let frequency = baseFrequency;
    for (let i = 0; i < octaves; i += 1) {
      y += amplitude * (i === 0 ? baseFlatness : 1) * noise2D(frequency * x + seed * 100, time * frequency * 0.3);
      frequency *= lacunarity;
      amplitude *= gain;
    }
    return y;
  }, [noise2D]);

  const getCornerPoint = useCallback((centerX, centerY, radius, startAngle, arcLength, progress) => {
    const angle = startAngle + progress * arcLength;
    return { x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) };
  }, []);

  const getRoundedRectPoint = useCallback((t, left, top, width, height, radius) => {
    const straightWidth = width - 2 * radius;
    const straightHeight = height - 2 * radius;
    const cornerArc = (Math.PI * radius) / 2;
    const total = 2 * straightWidth + 2 * straightHeight + 4 * cornerArc;
    const distance = t * total;
    let acc = 0;

    if (distance <= acc + straightWidth) return { x: left + radius + ((distance - acc) / straightWidth) * straightWidth, y: top };
    acc += straightWidth;
    if (distance <= acc + cornerArc) return getCornerPoint(left + width - radius, top + radius, radius, -Math.PI / 2, Math.PI / 2, (distance - acc) / cornerArc);
    acc += cornerArc;
    if (distance <= acc + straightHeight) return { x: left + width, y: top + radius + ((distance - acc) / straightHeight) * straightHeight };
    acc += straightHeight;
    if (distance <= acc + cornerArc) return getCornerPoint(left + width - radius, top + height - radius, radius, 0, Math.PI / 2, (distance - acc) / cornerArc);
    acc += cornerArc;
    if (distance <= acc + straightWidth) return { x: left + width - radius - ((distance - acc) / straightWidth) * straightWidth, y: top + height };
    acc += straightWidth;
    if (distance <= acc + cornerArc) return getCornerPoint(left + radius, top + height - radius, radius, Math.PI / 2, Math.PI / 2, (distance - acc) / cornerArc);
    acc += cornerArc;
    if (distance <= acc + straightHeight) return { x: left, y: top + height - radius - ((distance - acc) / straightHeight) * straightHeight };
    acc += straightHeight;
    return getCornerPoint(left + radius, top + radius, radius, Math.PI, Math.PI / 2, (distance - acc) / cornerArc);
  }, [getCornerPoint]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const borderOffset = 42;
    const displacement = 48;
    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width + borderOffset * 2;
      const height = rect.height + borderOffset * 2;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      return { width, height, dpr };
    };

    let size = updateSize();
    const draw = currentTime => {
      const delta = (currentTime - lastFrameTimeRef.current) / 1000;
      timeRef.current += delta * speed;
      lastFrameTimeRef.current = currentTime;
      size = updateSize();

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(size.dpr, size.dpr);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.7;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = color;
      ctx.shadowBlur = 16;

      const left = borderOffset;
      const top = borderOffset;
      const width = size.width - borderOffset * 2;
      const height = size.height - borderOffset * 2;
      const radius = Math.min(borderRadius, width / 2, height / 2);
      const perimeter = 2 * (width + height) + 2 * Math.PI * radius;
      const samples = Math.max(80, Math.floor(perimeter / 2));

      ctx.beginPath();
      for (let i = 0; i <= samples; i += 1) {
        const progress = i / samples;
        const point = getRoundedRectPoint(progress, left, top, width, height, radius);
        const xNoise = octavedNoise(progress * 8, 8, 1.6, 0.7, chaos, 10, timeRef.current, 0, 0);
        const yNoise = octavedNoise(progress * 8, 8, 1.6, 0.7, chaos, 10, timeRef.current, 1, 0);
        const x = point.x + xNoise * displacement;
        const y = point.y + yNoise * displacement;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      animationRef.current = requestAnimationFrame(draw);
    };

    const resizeObserver = new ResizeObserver(() => { size = updateSize(); });
    resizeObserver.observe(container);
    animationRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
    };
  }, [borderRadius, chaos, color, getRoundedRectPoint, octavedNoise, speed]);

  return (
    <div ref={containerRef} className={`electric-border ${className}`} style={{ '--electric-border-color': color, borderRadius, ...style }}>
      <div className="eb-canvas-container"><canvas ref={canvasRef} className="eb-canvas" /></div>
      <div className="eb-layers"><div className="eb-glow-1" /><div className="eb-glow-2" /><div className="eb-background-glow" /></div>
      <div className="eb-content">{children}</div>
    </div>
  );
}
