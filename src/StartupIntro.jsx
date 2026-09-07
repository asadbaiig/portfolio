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
  return <div className="startup-intro">
    <div className="startup-content">
      <svg className="startup-circuit" viewBox="0 0 120 120" fill="none" aria-hidden="true">
        <path className="startup-trace" d="M10 35H35V10M85 10V35H110M110 85H85V110M35 110V85H10M0 60H35M85 60H120M60 0V35M60 85V120"/>
        <rect className="startup-chip" x="35" y="35" width="50" height="50" rx="12"/>
        <path className="startup-core" d="M48 68L60 48L72 68M53 61H67"/>
        <circle cx="10" cy="35" r="3"/><circle cx="110" cy="85" r="3"/>
      </svg>
      <p className="startup-name">Asad Baig</p>
      <p className="startup-caption">IDEAS. CODE. INTELLIGENCE.</p>
      <div className="startup-line" aria-hidden="true"><span/></div>
    </div>
    <button className="startup-skip" onClick={() => onComplete(false)}>Skip intro <span aria-hidden="true">↗</span></button>
  </div>;
}
