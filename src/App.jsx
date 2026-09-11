import { useEffect, useState } from 'react';
import AsciiScroll from './AsciiScroll.jsx';
import LutComparison from './LutComparison.jsx';
import SkillsConstellation from './SkillsConstellation.jsx';
import StartupIntro from './StartupIntro.jsx';
import usePageMotion from './usePageMotion.js';
import { baseUrl, resumeUrl, certificates, projects } from './portfolio-data.js';

function ProjectCard({ project, index }) {
  const Card = project.comparison ? "article" : "a";
  const linkProps = project.comparison ? {} : { href: project.url, target: "_blank", rel: "noreferrer" };
  return <Card id={`project-${index}`} tabIndex={project.comparison ? -1 : 0} className={`project-card project-${index % 3}`} {...linkProps}>
    {project.comparison ? <LutComparison image={project.comparison}/> : project.image ? <div className="project-art project-art-image"><img src={`${baseUrl}${project.image}`} alt={project.imageAlt} loading="lazy"/></div> : <div className="project-art" aria-hidden="true"><span className="art-label">{['DECENTRALIZED LIVING', 'INTELLIGENCE, CONNECTED', 'DATA INTO INSIGHT'][index % 3]}</span><div className="art-object"><i/><i/><i/><i/></div><span className="art-number">0{index + 1} / BUILD</span></div>}
    <div className="project-body"><p className="eyebrow">{project.badge ? 'FINAL YEAR PROJECT' : 'ENGINEERING & DEVELOPMENT'}</p><h3>{project.title}</h3><p>{project.description}</p><div className="tags">{project.tech.split(' - ').slice(0, 4).map(tag => <span key={tag}>{tag}</span>)}</div>{project.comparison ? <a className="code-link" href={project.url} target="_blank" rel="noreferrer">Explore repository </a> : <span className="code-link">Explore repository </span>}</div>
  </Card>;
}
export default function App() {
  const [expanded, setExpanded] = useState(false);
  const [projectTarget, setProjectTarget] = useState(null);
  const selectProject = index => {
    if (index >= 3) setExpanded(true);
    setProjectTarget(index);
  };
  useEffect(() => {
    if (projectTarget === null) return;
    const frame = requestAnimationFrame(() => {
      const card = document.getElementById('project-' + projectTarget);
      if (card) {
        card.focus({ preventScroll: true });
        card.scrollIntoView({ behavior: 'instant', block: 'center' });
      }
      setProjectTarget(null);
    });
    return () => cancelAnimationFrame(frame);
  }, [projectTarget, expanded]);
  const [menu, setMenu] = useState(false);
  const [motion, setMotion] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [intro, setIntro] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  usePageMotion(motion && !intro, expanded);
  return <>
    {intro && <StartupIntro onComplete={setIntro}/>}
    <div inert={intro} className={motion ? 'portfolio-page' : 'portfolio-page motion-paused'}>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="nav-shell"><nav className="nav wrap" aria-label="Main navigation"><a className="brand" href="#home"><span className="brand-lockup"><span className="brand-fullname">Asad Baig</span><span className="brand-profession">SOFTWARE ENGINEER</span></span></a><button className="menu-toggle" aria-expanded={menu} aria-controls="nav-links" onClick={() => setMenu(!menu)}>{menu ? 'Close' : 'Menu'}</button><div id="nav-links" className={`nav-links ${menu ? 'is-open' : ''}`}><a href="#projects" onClick={() => setMenu(false)}>Work</a><a href="#about" onClick={() => setMenu(false)}>About</a><a href="#experience" onClick={() => setMenu(false)}>Experience</a><a className="nav-contact" href="#contact" onClick={() => setMenu(false)}>Let’s talk </a></div></nav></header>
    <main id="main" className="wrap">
      <nav className="social-banners" aria-label="Social and email links">
        <a href="https://www.linkedin.com/in/asad-baig1744/" target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="3" fill="#0A66C2"/><path fill="white" d="M5 9h3v10H5zm1.5-5a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5zM10 9h3v1.4c.6-1 1.6-1.7 3.1-1.7 3.1 0 3.9 2 3.9 4.7V19h-3v-5c0-1.4 0-2.7-1.8-2.7S13 12.7 13 14v5h-3z"/></svg></a>
        <a href="https://github.com/asadbaiig" target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297C5.37.297 0 5.67 0 12.297c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.043-1.61-4.043-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.838 1.237 1.838 1.237 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.52 11.52 0 0 1 12 6.098c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.655 1.652.243 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.597 24 12.297c0-6.627-5.373-12-12-12"/></svg></a>
        <a href="mailto:asadbaig215@gmail.com" aria-label="Gmail" title="Gmail"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M2 20h4V10L0 5.5V18a2 2 0 0 0 2 2"/><path fill="#34A853" d="M18 20h4a2 2 0 0 0 2-2V5.5L18 10"/><path fill="#EA4335" d="M6 10v-5l6 4.5L18 5v5l-6 4.5"/><path fill="#FBBC04" d="M18 5v5l6-4.5V4a2 2 0 0 0-3.2-1.6"/><path fill="#C5221F" d="M0 4v1.5L6 10V5L3.2 2.4A2 2 0 0 0 0 4"/></svg></a>
      </nav>
      <section className="hero" id="home"><div className="hero-content"><p className="eyebrow intro"><span/> SOFTWARE ENGINEER · FULL STACK & AI</p><h1>Engineering ideas.<br/>Creating <em>impact.</em></h1><p className="hero-description">Hi, I’m Asad. I turn complex problems into thoughtful digital experiences — from scalable web applications to intelligent, data-driven systems.</p><div className="hero-actions"><a className="button primary" href="#projects">Explore my work <span>↘</span></a><a className="button secondary" href={resumeUrl} target="_blank" rel="noreferrer">View résumé </a></div><div className="hero-focus" aria-label="Areas of focus"><span className="hero-focus-label">FOCUSED ON</span><div><span>Full-stack Development</span><span>AI &amp; Machine Learning</span><span>Data Engineering</span></div></div></div><div className="hero-visual ascii-hero"><div className="visual-grid"/><AsciiScroll animated={motion && !intro}/><div className="visual-caption"><span>01 — THE CONNECTED MIND</span><button onClick={() => setMotion(!motion)} aria-pressed={motion}>{motion ? 'Pause' : 'Play'} motion</button></div></div></section>
      <div className="stack-strip"><span>MY BUILDING BLOCKS</span><div>{['React', 'Next.js', 'Python', 'Node.js', 'TensorFlow', 'PostgreSQL'].map(t => <strong key={t}>{t}</strong>)}</div></div>
      <section id="projects" className="section"><div className="section-heading"><div><p className="eyebrow">01 / SELECTED WORK</p><h2>Ideas made <em>real.</em></h2></div><p>A selection of things I’ve built.<br/>Thoughtful solutions, from front to back.</p></div><div className="project-stack">{projects.slice(0, 3).map((project, index) => <div className="project-stack-item" key={project.url} style={{ "--card-index": index }}><div className="project-chapter" aria-hidden="true"><span>SELECTED WORK</span><span>0{index + 1} / 03</span></div><ProjectCard project={project} index={index}/></div>)}</div>{expanded && <div className="projects-grid additional-projects">{projects.slice(3).map((project, index) => <ProjectCard key={project.url} project={project} index={index + 3}/>)}</div>}<button className="button secondary more-button" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>{expanded ? 'Show selected projects' : `View all ${projects.length} projects`} <span>{expanded ? '−' : '+'}</span></button></section>
      <section id="about" className="section about"><div><p className="eyebrow">02 / THE PERSON BEHIND THE CODE</p><h2 className="about-reveal"><span className="reveal-word">Curious</span>{" "}<span className="reveal-word">mind.</span><br/><em><span className="reveal-word">Builder</span>{" "}<span className="reveal-word">at</span>{" "}<span className="reveal-word">heart.</span></em></h2><p className="about-copy">I’m a software engineer working at the intersection of full-stack development, artificial intelligence, and data. I enjoy connecting the dots between a complex challenge and an experience that feels simple.</p><a className="text-link" href={resumeUrl} target="_blank" rel="noreferrer">More about my background </a><div className="education"><span>↳</span><div><strong>Bachelor of Software Engineering</strong><p>Air University, Islamabad · 2022–2026</p></div></div></div><SkillsConstellation onProjectSelect={selectProject}/></section>
      <section id="experience" className="section"><div className="section-heading"><div><p className="eyebrow">03 / ALONG THE WAY</p><h2>Learning. Building. <em>Growing.</em></h2></div></div><div className="experience-timeline"><span className="timeline-track" aria-hidden="true"><span className="timeline-progress"/></span><div className="experience-row"><span className="timeline-node" aria-hidden="true"/><p className="experience-date">JUL 2025 — PRESENT</p><div><h3>AI / Machine Learning Intern</h3><p className="company">WeatherWalayPK · Islamabad</p><p>Developed the Weather X forecasting and analytics portal with interactive 3D maps, district-level forecasts, and AI-generated alerts. Built asynchronous FastAPI services, PostgreSQL integrations, and spatial data pipelines.</p></div><span className="experience-tag">AI & DATA</span></div><div className="experience-row"><span className="timeline-node" aria-hidden="true"/><p className="experience-date">JUN — AUG 2024</p><div><h3>Frontend Developer Intern</h3><p className="company">Rex Technologies · Lahore</p><p>Built responsive React interfaces and reusable components, integrated REST APIs, and improved reliability through testing and debugging.</p></div><span className="experience-tag">FRONTEND</span></div></div></section>
      <section id="certifications" className="section certifications"><div className="section-heading"><div><p className="eyebrow">04 / CONTINUOUS LEARNING</p><h2>Always <em>evolving.</em></h2></div><p>Credentials that support the craft.</p></div><div className="cert-grid">{certificates.map((c, i) => <a key={c.file} href={c.url ?? `${baseUrl}utils/${c.file}`} target="_blank" rel="noreferrer"><img src={`${baseUrl}utils/${c.file}`} alt={`Professional certificate ${i+1}`} loading="lazy"/><span>View credential </span></a>)}</div></section>
      <section id="contact" className="contact section"><p className="eyebrow">HAVE SOMETHING IN MIND?</p><h2>Let’s build something<br/><em>worth putting out there.</em></h2><a className="button primary" href="mailto:asadbaig215@gmail.com">Start a conversation </a><a className="email-link" href="mailto:asadbaig215@gmail.com">asadbaig215@gmail.com</a></section>
    </main><footer className="wrap footer"><a className="brand" href="#home"><span className="brand-lockup"><span className="brand-fullname">Asad Baig</span><span className="brand-profession">SOFTWARE ENGINEER</span></span></a><p>© {new Date().getFullYear()} Asad Baig · Crafted with intention.</p><div><a href="tel:+923365447781">Phone </a></div></footer>
  </div></>;
}









