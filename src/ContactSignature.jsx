import { useEffect, useRef } from 'react';

// Original vector lettering, drawn as pen strokes rather than an image or font.
const strokes = [
  'M104 140 C122 118 146 61 165 46 C180 35 170 72 165 103 L160 140 M120 112 Q149 104 181 108',
  'M183 111 C208 83 227 103 206 107 C181 111 204 123 206 127 C212 144 179 148 178 135 C180 127 215 136 226 120',
  'M257 108 C248 94 227 107 224 124 C220 144 239 142 254 115 L260 102 C250 126 249 147 271 126',
  'M300 110 C285 94 268 110 271 130 C274 150 296 132 307 103 C321 70 331 41 322 45 C309 47 295 137 312 139 Q322 138 334 122',
  'M361 144 C370 112 384 75 400 61 C413 50 415 66 396 84 M363 90 C385 77 423 75 425 91 C426 105 391 114 382 113 C429 103 438 127 415 141 C394 154 371 148 378 132',
  'M470 110 C459 96 440 108 437 126 C434 146 455 139 469 113 L475 103 C464 133 470 144 490 124',
  'M501 106 C495 123 487 148 514 127 M506 89 L507 87',
  'M549 110 C538 97 519 109 518 125 C515 147 540 137 550 110 C542 141 535 177 516 181 C496 184 505 167 530 156 Q558 143 579 120',
];

export default function ContactSignature({ animated }) {
  const rootRef = useRef(null);
  const playedRef = useRef(false);
  const highlightRef = useRef(() => {});

  useEffect(() => {
    const root = rootRef.current;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const paths = [...root.querySelectorAll('.signature-ink')];
    const signal = root.querySelector('.signature-signal');
    const flourish = root.querySelector('.signature-flourish');
    const highlights = [...root.querySelectorAll('.signature-highlight')];
    let observer;
    let animations = [];
    let highlighting = [];
    let drawing = false;
    const cancel = () => {
      observer?.disconnect();
      [...animations, ...highlighting].forEach(animation => animation.cancel());
      animations = []; highlighting = []; drawing = false;
    };
    const setup = () => {
      cancel();
      const enabled = animated && !preference.matches;
      [...paths, signal, flourish].forEach(path => { path.style.strokeDashoffset = enabled && !playedRef.current ? '1' : '0'; });
      highlightRef.current = () => {
        if (!enabled || drawing || !playedRef.current) return;
        highlighting.forEach(animation => animation.cancel());
        highlighting = highlights.map((path, index) => path.animate([
          { strokeDashoffset: 1, opacity: 0 },
          { strokeDashoffset: 0.5, opacity: 0.9, offset: 0.25 },
          { strokeDashoffset: -1, opacity: 0 },
        ], { duration: 1100, delay: index * 55, easing: 'ease-in-out' }));
      };
      if (!enabled || playedRef.current) return;
      observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        playedRef.current = true; drawing = true; observer.disconnect();
        const trace = (path, delay, duration) => {
          const animation = path.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration, delay, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' });
          animations.push(animation);
          return animation;
        };
        trace(signal, 0, 500);
        paths.forEach((path, index) => trace(path, 380 + index * 190, 440));
        trace(flourish, 2150, 550).onfinish = () => { drawing = false; };
      }, { threshold: 0.45 });
      observer.observe(root);
    };
    setup(); preference.addEventListener('change', setup);
    return () => { cancel(); highlightRef.current = () => {}; preference.removeEventListener('change', setup); };
  }, [animated]);

  return <div className="contact-signature" ref={rootRef} tabIndex={0} role="img" aria-label="Asad Baig, drawn in lavender handwriting" onPointerEnter={event => { if (event.pointerType !== 'touch') highlightRef.current(); }} onFocus={() => highlightRef.current()}>
    <svg viewBox="0 0 680 205" fill="none" aria-hidden="true">
      <path className="signature-signal" pathLength="1" d="M8 142 H55 Q67 142 72 130 L79 113 L88 154 L96 142 H110"/>
      {strokes.map((d, index) => <path key={index} className="signature-ink" pathLength="1" d={d}/>)}
      <path className="signature-flourish" pathLength="1" d="M153 167 C268 153 467 155 586 147 Q623 144 659 153"/>
      {strokes.map((d, index) => <path key={index} className="signature-highlight" pathLength="1" d={d}/>)}
    </svg>
  </div>;
}
