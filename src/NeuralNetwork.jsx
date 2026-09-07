import { useEffect, useRef } from 'react';

// Perspective-projected neural lattice; no WebGL download or GPU requirement.
export default function NeuralNetwork({ animated }) {
  const canvas = useRef(null);
  const foreground = useRef(null);
  const phase = useRef(0);
  useEffect(() => {
    const element = canvas.current;
    const context = element.getContext('2d');
    const front = foreground.current.getContext('2d');
    if (!context || !front) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const nodes = Array.from({ length: 72 }, (_, i) => {
      const y = 1 - (i / 71) * 2;
      const radius = Math.sqrt(1 - y * y);
      const angle = i * Math.PI * (3 - Math.sqrt(5));
      return { x: Math.cos(angle) * radius, y, z: Math.sin(angle) * radius };
    });
    const edges = [];
    nodes.forEach((a, i) => nodes.slice(i + 1).forEach((b, j) => {
      if (Math.hypot(a.x-b.x, a.y-b.y, a.z-b.z) < .52) edges.push([i, i+j+1]);
    }));
    let width = 1, height = 1, frame = 0, last = 0, visible = true;
    let pointer = 0, rotation = 0;
    const draw = () => {
      context.clearRect(0, 0, width, height);
      front.clearRect(0, 0, width, height);
      const angle = phase.current * .14 + rotation;
      const radius = Math.min(width * .48, height * .46);
      const points = nodes.map(node => {
        const x = node.x * Math.cos(angle) + node.z * Math.sin(angle);
        const z = -node.x * Math.sin(angle) + node.z * Math.cos(angle);
        const scale = 3.5 / (3.5 - z);
        return { x: width/2 + x*radius*scale, y: height/2 + node.y*radius*.94*scale, z, scale };
      });
      edges.forEach(([a, b], index) => {
        const p = points[a], q = points[b];
        const depth = (p.z+q.z+2)/4;
        const context = (p.z+q.z)/2 > .25 ? front : canvas.current.getContext('2d');
        context.strokeStyle = `rgba(155, 137, 238, ${.1+depth*.28})`;
        context.lineWidth = .6 + depth*.5;
        context.beginPath(); context.moveTo(p.x,p.y); context.lineTo(q.x,q.y); context.stroke();
        if (index % 4 !== 0) return;
        const t = (phase.current*.28 + index*.137)%1;
        context.fillStyle = `rgba(126, 236, 227, ${.35+depth*.6})`;
        context.beginPath(); context.arc(p.x+(q.x-p.x)*t,p.y+(q.y-p.y)*t,1.7,0,Math.PI*2); context.fill();
      });
      points.forEach((p, i) => {
        const context = p.z > .25 ? front : canvas.current.getContext('2d');
        context.fillStyle = i%5 === 0 ? '#94eee2' : '#b8a3f4';
        context.globalAlpha = .35 + (p.z+1)*.3;
        context.shadowBlur = p.z > 0 ? 9 : 0;
        context.shadowColor = '#a389fa';
        context.beginPath(); context.arc(p.x,p.y,1.8*p.scale,0,Math.PI*2); context.fill();
      });
      context.globalAlpha=1; context.shadowBlur=0;
      front.globalAlpha=1; front.shadowBlur=0;
    };
    const tick = time => {
      phase.current += last ? Math.min((time-last)/1000, .05) : 0;
      last = time;
      rotation += (pointer-rotation)*.025;
      draw(); frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame); last = 0;
      if (animated && !reduced.matches && visible && !document.hidden) frame = requestAnimationFrame(tick);
      else draw();
    };
    const resize = new ResizeObserver(() => {
      width = element.clientWidth; height = element.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      element.width = Math.round(width*dpr); element.height = Math.round(height*dpr);
      foreground.current.width = element.width; foreground.current.height = element.height;
      context.setTransform(dpr,0,0,dpr,0,0); front.setTransform(dpr,0,0,dpr,0,0); draw();
    });
    resize.observe(element);
    const intersection = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); });
    intersection.observe(element);
    const move = event => { if (event.pointerType !== 'mouse') return; const bounds = element.getBoundingClientRect(); pointer = ((event.clientX-bounds.left)/bounds.width-.5)*.6; };
    const reset = () => { pointer=0; };
    const parent = element.parentElement;
    parent.addEventListener('pointermove', move); parent.addEventListener('pointerleave', reset);
    document.addEventListener('visibilitychange', sync); reduced.addEventListener('change', sync); sync();
    return () => { cancelAnimationFrame(frame); resize.disconnect(); intersection.disconnect(); parent.removeEventListener('pointermove', move); parent.removeEventListener('pointerleave', reset); document.removeEventListener('visibilitychange', sync); reduced.removeEventListener('change', sync); };
  }, [animated]);
  return <><canvas ref={canvas} className="neural-network" aria-hidden="true"/><canvas ref={foreground} className="neural-network neural-foreground" aria-hidden="true"/></>;
}

