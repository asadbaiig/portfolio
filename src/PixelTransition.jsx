import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function PixelTransition({
  firstContent,
  secondContent,
  gridSize = 7,
  pixelColor = 'currentColor',
  animationStepDuration = 0.3,
  once = false,
  aspectRatio = '100%',
  className = '',
  style = {}
}) {
  const pixelGridRef = useRef(null);
  const activeRef = useRef(null);
  const delayedCallRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const isTouchDevice = typeof window !== 'undefined' && (
    'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches
  );

  useEffect(() => {
    const pixelGrid = pixelGridRef.current;
    if (!pixelGrid) return;
    pixelGrid.innerHTML = '';
    for (let row = 0; row < gridSize; row += 1) {
      for (let col = 0; col < gridSize; col += 1) {
        const pixel = document.createElement('div');
        pixel.className = 'pixelated-image-card__pixel';
        pixel.style.backgroundColor = pixelColor;
        const size = 100 / gridSize;
        pixel.style.width = `${size}%`;
        pixel.style.height = `${size}%`;
        pixel.style.left = `${col * size}%`;
        pixel.style.top = `${row * size}%`;
        pixelGrid.appendChild(pixel);
      }
    }
  }, [gridSize, pixelColor]);

  const animatePixels = activate => {
    setIsActive(activate);
    const pixelGrid = pixelGridRef.current;
    const active = activeRef.current;
    if (!pixelGrid || !active) return;
    const pixels = pixelGrid.querySelectorAll('.pixelated-image-card__pixel');
    if (!pixels.length) return;

    gsap.killTweensOf(pixels);
    delayedCallRef.current?.kill();
    gsap.set(pixels, { display: 'none' });
    const staggerDuration = animationStepDuration / pixels.length;

    gsap.to(pixels, {
      display: 'block',
      duration: 0,
      stagger: { each: staggerDuration, from: 'random' }
    });

    delayedCallRef.current = gsap.delayedCall(animationStepDuration, () => {
      active.style.display = activate ? 'block' : 'none';
      active.style.pointerEvents = activate ? 'none' : '';
    });

    gsap.to(pixels, {
      display: 'none',
      duration: 0,
      delay: animationStepDuration,
      stagger: { each: staggerDuration, from: 'random' }
    });
  };

  const handleEnter = () => { if (!isActive) animatePixels(true); };
  const handleLeave = () => { if (isActive && !once) animatePixels(false); };
  const handleClick = () => {
    if (!isActive) animatePixels(true);
    else if (!once) animatePixels(false);
  };

  return (
    <div
      className={`pixelated-image-card ${className}`}
      style={style}
      onMouseEnter={!isTouchDevice ? handleEnter : undefined}
      onMouseLeave={!isTouchDevice ? handleLeave : undefined}
      onClick={isTouchDevice ? handleClick : undefined}
      onFocus={!isTouchDevice ? handleEnter : undefined}
      onBlur={!isTouchDevice ? handleLeave : undefined}
      tabIndex={0}
    >
      <div style={{ paddingTop: aspectRatio }} />
      <div className="pixelated-image-card__default" aria-hidden={isActive}>{firstContent}</div>
      <div className="pixelated-image-card__active" ref={activeRef} aria-hidden={!isActive}>{secondContent}</div>
      <div className="pixelated-image-card__pixels" ref={pixelGridRef} />
    </div>
  );
}
