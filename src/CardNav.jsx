import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Folder from './Folder.jsx';

function ArrowIcon() {
  return (
    <svg className="nav-card-link-icon" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M5 3h8v8" />
      <path d="M13 3 3 13" />
    </svg>
  );
}

export default function CardNav({
  brand = 'asad@portfolio',
  items = [],
  className = '',
  ease = 'power3.out',
  baseColor = 'rgba(0,0,0,0.55)',
  menuColor = '#00ff88',
  buttonBgColor = '#00ff88',
  buttonTextColor = '#050505',
  buttonHref = '',
  buttonLabel = ''
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef(null);
  const cardsRef = useRef([]);
  const tlRef = useRef(null);

  const calculateHeight = () => {
    const nav = navRef.current;
    if (!nav) return 260;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      const content = nav.querySelector('.card-nav-content');
      if (!content) return 330;
      const previous = {
        visibility: content.style.visibility,
        pointerEvents: content.style.pointerEvents,
        position: content.style.position,
        height: content.style.height
      };
      content.style.visibility = 'visible';
      content.style.pointerEvents = 'auto';
      content.style.position = 'static';
      content.style.height = 'auto';
      const height = 60 + content.scrollHeight + 16;
      Object.assign(content.style, previous);
      return height;
    }
    return 260;
  };

  const createTimeline = () => {
    const nav = navRef.current;
    if (!nav) return null;
    gsap.set(nav, { height: 60, overflow: 'hidden' });
    gsap.set(cardsRef.current, { y: 48, opacity: 0 });
    const tl = gsap.timeline({ paused: true });
    tl.to(nav, { height: calculateHeight, duration: 0.4, ease });
    tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.38, ease, stagger: 0.08 }, '-=0.1');
    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;
    return () => {
      tl?.kill();
      tlRef.current = null;
    };
  }, [ease, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;
      tlRef.current.kill();
      const next = createTimeline();
      if (next && isExpanded) {
        next.progress(1);
        gsap.set(navRef.current, { height: calculateHeight() });
      }
      tlRef.current = next;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsExpanded(true);
      tl.play(0);
    } else {
      tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const setCardRef = index => element => {
    if (element) cardsRef.current[index] = element;
  };

  return (
    <div className={`card-nav-container ${className}`}>
      <nav ref={navRef} className={`card-nav ${isExpanded ? 'open' : ''}`} style={{ backgroundColor: baseColor }}>
        <div className="card-nav-top">
          <Folder
            className="nav-folder"
            color={menuColor}
            size={0.84}
            open={isExpanded}
            onToggle={toggleMenu}
            label="Open navigation"
          />

          <a className="logo-container" href="#top" aria-label="Back to top">
            <span className="logo-mark">&gt;_</span>
            <span className="logo-text">{brand}</span>
          </a>

          {buttonLabel && (
            <a className="card-nav-cta-button" href={buttonHref} style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}>
              {buttonLabel}
            </a>
          )}
        </div>

        <div className="card-nav-content" aria-hidden={!isExpanded}>
          {items.slice(0, 3).map((item, index) => (
            <div
              key={item.label}
              className="nav-card"
              ref={setCardRef(index)}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div className="nav-card-label">{item.label}</div>
              <div className="nav-card-links">
                {item.links?.map(link => (
                  <a key={link.label} className="nav-card-link" href={link.href} aria-label={link.ariaLabel} target={link.external ? '_blank' : undefined} rel={link.external ? 'noreferrer' : undefined}>
                    <ArrowIcon />
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}


