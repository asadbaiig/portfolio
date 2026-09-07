import { useState } from 'react';
import Portrait from './Portrait.jsx';
import StartupIntro from './StartupIntro.jsx';
import usePageMotion from './usePageMotion.js';
import { baseUrl, resumeUrl, certificates, skillGroups, projects } from './portfolio-data.js';

const Arrow = () => <span aria-hidden="true">↗</span>;
function ProjectCard({ project, index }) {
  return <a className={`project-card project-${index % 3}`} href={project.url} target="_blank" rel="noreferrer">
    <div className="project-art" aria-hidden="true"><span className="art-label">{['DECENTRALIZED LIVING', 'INTELLIGENCE, CONNECTED', 'DATA INTO INSIGHT'][index % 3]}</span><div className="art-object"><i/><i/><i/><i/></div><span className="art-number">0{index + 1} / BUILD</span><span className="project-open"><Arrow/></span></div>
    <div className="project-body"><p className="eyebrow">{project.badge ? 'FINAL YEAR PROJECT' : 'ENGINEERING & DEVELOPMENT'}</p><h3>{project.title}</h3><p>{project.description}</p><div className="tags">{project.tech.split(' - ').slice(0, 4).map(tag => <span key={tag}>{tag}</span>)}</div><span className="code-link">Explore repository <Arrow/></span></div>
  </a>;
}
export default function App() {
  const [expanded, setExpanded] = useState(false);
  const [menu, setMenu] = useState(false);
  const [motion, setMotion] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [intro, setIntro] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  usePageMotion(motion && !intro, expanded);
  return <>
    {intro && <StartupIntro onComplete={setIntro}/>}
    <div inert={intro} className={motion ? 'portfolio-page' : 'portfolio-page motion-paused'}>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="nav-shell"><nav className="nav wrap" aria-label="Main navigation"><a className="brand" href="#home"><span className="brand-lockup"><span className="brand-fullname">Asad Baig</span><span className="brand-profession">SOFTWARE ENGINEER</span></span></a><button className="menu-toggle" aria-expanded={menu} aria-controls="nav-links" onClick={() => setMenu(!menu)}>{menu ? 'Close' : 'Menu'}</button><div id="nav-links" className={`nav-links ${menu ? 'is-open' : ''}`}><a href="#projects" onClick={() => setMenu(false)}>Work</a><a href="#about" onClick={() => setMenu(false)}>About</a><a href="#experience" onClick={() => setMenu(false)}>Experience</a><a className="nav-contact" href="#contact" onClick={() => setMenu(false)}>Let’s talk <Arrow/></a></div></nav></header>
    <main id="main" className="wrap">
      <section className="hero" id="home"><div className="hero-content"><p className="eyebrow intro"><span/> SOFTWARE ENGINEER · FULL STACK & AI</p><h1>Engineering ideas.<br/>Creating <em>impact.</em></h1><p className="hero-description">Hi, I’m Asad. I turn complex problems into thoughtful digital experiences — from scalable web applications to intelligent, data-driven systems.</p><div className="hero-actions"><a className="button primary" href="#projects">Explore my work <span>↘</span></a><a className="button secondary" href={resumeUrl} target="_blank" rel="noreferrer">View résumé <Arrow/></a></div><div className="hero-focus" aria-label="Areas of focus"><span className="hero-focus-label">FOCUSED ON</span><div><span>Full-stack Development</span><span>AI &amp; Machine Learning</span><span>Data Engineering</span></div></div></div><div className="hero-visual portrait-visual"><div className="visual-grid"/><Portrait animated={motion}/><div className="visual-caption"><span>01 — THE CONNECTED MIND</span><button onClick={() => setMotion(!motion)} aria-pressed={motion}>{motion ? 'Pause' : 'Play'} motion</button></div></div></section>
      <div className="stack-strip"><span>MY BUILDING BLOCKS</span><div>{['React', 'Next.js', 'Python', 'Node.js', 'TensorFlow', 'PostgreSQL'].map(t => <strong key={t}>{t}</strong>)}</div></div>
      <section id="projects" className="section"><div className="section-heading"><div><p className="eyebrow">01 / SELECTED WORK</p><h2>Ideas made <em>real.</em></h2></div><p>A selection of things I’ve built.<br/>Thoughtful solutions, from front to back.</p></div><div className="projects-grid">{projects.slice(0, expanded ? projects.length : 3).map((project, index) => <ProjectCard key={project.url} project={project} index={index}/>)}</div><button className="button secondary more-button" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>{expanded ? 'Show selected projects' : `View all ${projects.length} projects`} <span>{expanded ? '−' : '+'}</span></button></section>
      <section id="about" className="section about"><div><p className="eyebrow">02 / THE PERSON BEHIND THE CODE</p><h2>Curious mind.<br/><em>Builder at heart.</em></h2><p className="about-copy">I’m a software engineer working at the intersection of full-stack development, artificial intelligence, and data. I enjoy connecting the dots between a complex challenge and an experience that feels simple.</p><a className="text-link" href={resumeUrl} target="_blank" rel="noreferrer">More about my background <Arrow/></a><div className="education"><span>↳</span><div><strong>Bachelor of Software Engineering</strong><p>Air University, Islamabad · 2022–2026</p></div></div></div><div id="skills" className="skills-grid">{skillGroups.map((group, i) => <div className="skill-card" key={group.title}><span className="skill-number">0{i+1}</span><h3>{group.title}</h3><div className="tags">{group.tags.map(t => <span key={t}>{t}</span>)}</div></div>)}</div></section>
      <section id="experience" className="section"><div className="section-heading"><div><p className="eyebrow">03 / ALONG THE WAY</p><h2>Learning. Building. <em>Growing.</em></h2></div></div><div className="experience-row"><p className="experience-date">JUL 2025 — PRESENT</p><div><h3>AI / Machine Learning Intern</h3><p className="company">WeatherWalayPK · Islamabad</p><p>Developed the Weather X forecasting and analytics portal with interactive 3D maps, district-level forecasts, and AI-generated alerts. Built asynchronous FastAPI services, PostgreSQL integrations, and spatial data pipelines.</p></div><span className="experience-tag">AI & DATA</span></div><div className="experience-row"><p className="experience-date">JUN — AUG 2024</p><div><h3>Frontend Developer Intern</h3><p className="company">Rex Technologies · Lahore</p><p>Built responsive React interfaces and reusable components, integrated REST APIs, and improved reliability through testing and debugging.</p></div><span className="experience-tag">FRONTEND</span></div></section>
      <section id="certifications" className="section certifications"><div className="section-heading"><div><p className="eyebrow">04 / CONTINUOUS LEARNING</p><h2>Always <em>evolving.</em></h2></div><p>Credentials that support the craft.</p></div><div className="cert-grid">{certificates.map((c, i) => <a key={c.file} href={c.url ?? `${baseUrl}utils/${c.file}`} target="_blank" rel="noreferrer"><img src={`${baseUrl}utils/${c.file}`} alt={`Professional certificate ${i+1}`} loading="lazy"/><span>View credential <Arrow/></span></a>)}</div></section>
      <section id="contact" className="contact section"><p className="eyebrow">HAVE SOMETHING IN MIND?</p><h2>Let’s build something<br/><em>worth putting out there.</em></h2><a className="button primary" href="mailto:asadbaig215@gmail.com">Start a conversation <Arrow/></a><a className="email-link" href="mailto:asadbaig215@gmail.com">asadbaig215@gmail.com</a></section>
    </main><footer className="wrap footer"><a className="brand" href="#home"><span className="brand-lockup"><span className="brand-fullname">Asad Baig</span><span className="brand-profession">SOFTWARE ENGINEER</span></span></a><p>© {new Date().getFullYear()} Asad Baig · Crafted with intention.</p><div><a href="https://github.com/asadbaiig" target="_blank" rel="noreferrer">GitHub <Arrow/></a><a href="https://www.linkedin.com/in/asad-baig1744/" target="_blank" rel="noreferrer">LinkedIn <Arrow/></a><a href="tel:+923365447781">Phone <Arrow/></a></div></footer>
  </div></>;
}









