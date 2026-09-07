import { useEffect } from 'react';

export default function usePageMotion(enabled, expanded) {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Set();
    let observer;
    const stop = () => { observer?.disconnect(); animations.forEach(animation => animation.cancel()); animations.clear(); };
    const start = () => {
      stop();
      if (!enabled || preference.matches) return;
      const play = (element, delay = 0, distance = 22) => {
        const animation = element.animate([
          { opacity: 0, transform: `translateY(${distance}px)` },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 700, delay, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      };
      if (!document.documentElement.dataset.heroEntered) {
        document.querySelectorAll('.hero-content > *').forEach((element, index) => play(element, index * 85));
        play(document.querySelector('.hero-visual'), 140, 12);
        document.documentElement.dataset.heroEntered = 'true';
      }
      observer = new IntersectionObserver(entries => {
        const entering = entries.filter(entry => entry.isIntersecting);
        entering.forEach((entry, index) => {
          const element = entry.target;
          observer.unobserve(element);
          if (element.dataset.entered) return;
          element.dataset.entered = 'true';
          play(element, Math.min(index * 65, 195));
        });
      }, { threshold: .12 });
      document.querySelectorAll('.section-heading, .project-card, .about > div, .experience-row, .cert-grid > a, .contact > *').forEach(element => {
        if (!element.dataset.entered) observer.observe(element);
      });
    };
    start(); preference.addEventListener('change', start);
    return () => { stop(); preference.removeEventListener('change', start); };
  }, [enabled, expanded]);
}
