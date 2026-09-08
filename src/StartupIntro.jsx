import { useEffect } from 'react';

export default function StartupIntro({ onComplete }) {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finish = () => onComplete(false);
    if (preference.matches) { finish(); return; }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(finish, 1650);
    const keydown = event => { if (event.key === 'Escape') finish(); };
    document.addEventListener('keydown', keydown);
    preference.addEventListener('change', finish);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', keydown);
      preference.removeEventListener('change', finish);
    };
  }, [onComplete]);
  return <div className="startup-intro" role="status" aria-label="Loading portfolio">
    <div className="startup-orbit" aria-hidden="true">
      <span className="startup-ring"/>
      <span className="startup-ring startup-ring-inner"/>
      <span className="startup-spark"/>
    </div>
    <button className="startup-skip" aria-label="Skip intro" title="Skip intro" onClick={() => onComplete(false)}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m8 5 7 7-7 7M19 5v14"/></svg></button>
  </div>;
}
