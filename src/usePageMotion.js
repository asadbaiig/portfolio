import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function usePageMotion(enabled, expanded) {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Set();
    let observer;
    let scrollMotion;
    const stop = () => {
      observer?.disconnect();
      animations.forEach(animation => animation.cancel());
      animations.clear();
      scrollMotion?.revert();
      scrollMotion = undefined;
    };
    const start = () => {
      stop();
      if (!enabled || preference.matches) return;
      scrollMotion = gsap.matchMedia();
      scrollMotion.add('(min-width: 1000px) and (min-height: 720px)', () => {
        const stack = document.querySelector('.project-stack');
        stack.classList.add('is-stacking');
        const cards = gsap.utils.toArray('.project-stack-item');
        cards.forEach((item, index) => {
          if (!cards[index + 1]) return;
          gsap.to(item.querySelector('.project-card'), {
            scale: 0.94, y: -12, ease: 'none',
            scrollTrigger: {
              trigger: cards[index + 1], start: 'top 85%', end: 'top 150px', scrub: true,
              invalidateOnRefresh: true,
            },
          });
        });
        const heroScroll = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
        gsap.to('.hero-content', { y: -65, ease: 'none', scrollTrigger: heroScroll });
        gsap.to('.visual-grid', { y: 85, ease: 'none', scrollTrigger: heroScroll });
        return () => stack.classList.remove('is-stacking');
      });
      scrollMotion.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo('.about-reveal .reveal-word', { color: '#9290a5' }, {
          color: '#b7a0ff', stagger: 0.22, duration: 0.5, ease: 'none',
          scrollTrigger: { trigger: '.about-reveal', start: 'top 85%', end: 'bottom 45%', scrub: true },
        });
        const rows = gsap.utils.toArray('.experience-timeline .experience-row');
        // Measure the stationary rows so the line reaches each node as it crosses the viewport.
        gsap.fromTo('.timeline-progress', { scaleY: 0 }, {
          scaleY: 1, ease: 'none',
          scrollTrigger: {
            trigger: '.experience-timeline', start: 'top+=35 65%',
            end: 'bottom 65%', scrub: true, invalidateOnRefresh: true,
          },
        });
        rows.forEach(row => {
          gsap.fromTo(row.querySelector('.timeline-node'), {
            backgroundColor: '#181923', borderColor: '#696575', boxShadow: '0 0 0 0px #b7a0ff00',
          }, {
            backgroundColor: '#b7a0ff', borderColor: '#dacaff', boxShadow: '0 0 0 6px #b7a0ff15',
            ease: 'none', scrollTrigger: { trigger: row, start: 'top+=35 72%', end: 'top+=35 65%', scrub: true },
          });
        });
      });
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
      document.querySelectorAll('.section-heading, .projects-grid .project-card, .skills-constellation, .cert-grid > a, .contact > *').forEach(element => {
        if (!element.dataset.entered) observer.observe(element);
      });
    };
    start(); preference.addEventListener('change', start);
    return () => { stop(); preference.removeEventListener('change', start); };
  }, [enabled, expanded]);
}
