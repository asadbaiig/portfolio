import { useEffect, useState } from 'react';

const NAME = 'Asad Baig';
const STEPS = ['Compiling projects', 'Linking skill graph', 'Rendering portrait', 'Ready'];
const DURATION = 2100;

export default function StartupIntro({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finish = () => onComplete(false);
    if (preference.matches) { finish(); return; }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let raf;
    const start = performance.now();
    const tick = now => {
      const t = Math.min((now - start) / DURATION, 1);
      setProgress(Math.round((1 - Math.pow(1 - t, 2.4)) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const leaveTimer = window.setTimeout(() => setLeaving(true), DURATION + 150);
    const doneTimer = window.setTimeout(finish, DURATION + 900);
    const keydown = event => { if (event.key === 'Escape') finish(); };
    document.addEventListener('keydown', keydown);
    preference.addEventListener('change', finish);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(leaveTimer);
      window.clearTimeout(doneTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', keydown);
      preference.removeEventListener('change', finish);
    };
  }, [onComplete]);

  const step = STEPS[Math.min(Math.floor(progress / 26), STEPS.length - 1)];

  return <div className={`startup-intro ${leaving ? 'is-leaving' : ''}`} role="status" aria-label="Loading portfolio">
    <div className="startup-curtain startup-curtain-top" aria-hidden="true" />
    <div className="startup-curtain startup-curtain-bottom" aria-hidden="true" />
    <div className="startup-aurora" aria-hidden="true" />
    <div className="startup-grid" aria-hidden="true" />

    <div className="startup-center" aria-hidden="true">
      <div className="startup-orbit">
        <span className="startup-ring" />
        <span className="startup-ring startup-ring-inner" />
        <span className="startup-monogram">AB</span>
      </div>
      <h2 className="startup-name">
        {NAME.split('').map((ch, i) => (
          <span key={i} style={{ '--i': i }}>{ch === ' ' ? '\u00A0' : ch}</span>
        ))}
      </h2>
      <p className="startup-role">Software Engineer · Full-stack · AI · Data</p>
    </div>

    <div className="startup-footer" aria-hidden="true">
      <div className="startup-meta">
        <span className="startup-step"><i />{step}</span>
        <span className="startup-count">{String(progress).padStart(3, '0')}%</span>
      </div>
      <div className="startup-bar"><span style={{ transform: `scaleX(${progress / 100})` }} /></div>
    </div>

    <button className="startup-skip" aria-label="Skip intro" title="Skip intro (Esc)" onClick={() => onComplete(false)}>Skip</button>
  </div>;
}
