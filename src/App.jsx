import { useEffect, useRef, useState } from 'react';
import DotGrid from './DotGrid.jsx';
import AnimatedList from './AnimatedList.jsx';
import ScrambledText from './ScrambledText.jsx';
import PixelTransition from './PixelTransition.jsx';
import ProfileCard from './ProfileCard.jsx';
import CardNav from './CardNav.jsx';
import LogoLoop from './LogoLoop.jsx';
import DecryptedText from './DecryptedText.jsx';
import BorderGlow from './BorderGlow.jsx';
import SpotlightCard from './SpotlightCard.jsx';

const baseUrl = import.meta.env.BASE_URL;
const resumeUrl = `${baseUrl}Asad_Baig_AI_Air.pdf`;

const certificates = [
  {
    file: 'Screenshot 2026-07-30 031701.png',
    url: 'https://www.coursera.org/account/accomplishments/verify/47SKQ0720PK0'
  },
  {
    file: 'Screenshot 2026-07-30 031727.png',
    url: 'https://www.coursera.org/account/accomplishments/verify/AHO9R3F5OVIZ'
  },
  {
    file: 'Screenshot 2026-07-30 031746.png',
    url: 'https://www.coursera.org/account/accomplishments/verify/FK26QWJ5R4ZX'
  },
  {
    file: 'Screenshot 2026-07-30 031805.png',
    url: 'https://www.coursera.org/account/accomplishments/verify/M2I0447YIER4'
  },
  {
    file: 'Screenshot 2026-07-30 031825.png',
    url: 'https://www.coursera.org/account/accomplishments/specialization/O8Q9CPTAMKU3'
  },
  {
    file: 'Screenshot 2026-07-30 031845.png',
    url: 'https://www.coursera.org/account/accomplishments/verify/OB7GPF1N9BWP'
  },
  {
    file: 'Screenshot 2026-07-30 031904.png',
    url: 'https://www.coursera.org/account/accomplishments/verify/OGEKL189R5L6'
  },
  {
    file: 'Screenshot 2026-07-30 031928.png'
  }
];

const navItems = [
  {
    label: 'Explore',
    bgColor: '#10251c',
    textColor: '#f5fff9',
    links: [
      { label: 'Skills', href: '#skills', ariaLabel: 'Go to skills section' },
      { label: 'Journey', href: '#experience', ariaLabel: 'Go to professional journey section' },
      { label: 'Education', href: '#education', ariaLabel: 'Go to education section' }
    ]
  },
  {
    label: 'Builds',
    bgColor: '#162b35',
    textColor: '#f5fff9',
    links: [
      { label: 'Projects', href: '#projects', ariaLabel: 'Go to featured projects' },
      { label: 'Certificates', href: '#certifications', ariaLabel: 'Go to certifications' },
      { label: 'Resume', href: resumeUrl, ariaLabel: 'Open resume', external: true }
    ]
  },
  {
    label: 'Contact',
    bgColor: '#291827',
    textColor: '#f5fff9',
    links: [
      { label: 'Email', href: 'mailto:asadbaig215@gmail.com', ariaLabel: 'Email Asad Baig' },
      { label: 'GitHub', href: 'https://github.com/asadbaiig', ariaLabel: 'Open GitHub profile', external: true },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/asad-baig1744/', ariaLabel: 'Open LinkedIn profile', external: true }
    ]
  }
];
const skillGroups = [
  { title: 'Languages', tags: ['JavaScript', 'TypeScript', 'Java', 'Python', 'C/C++', 'SQL', 'HTML/CSS', 'Solidity'] },
  { title: 'Frontend', tags: ['React', 'React Native', 'Next.js', 'Three.js', 'Tailwind CSS', 'Responsive Design'] },
  { title: 'Backend & AI/ML', tags: ['Node.js', 'Express.js', 'FastAPI', '.NET', 'TensorFlow', 'PyTorch', 'scikit-learn', 'Pandas / NumPy'] },
  { title: 'Databases & Tools', tags: ['MongoDB', 'MySQL', 'PostgreSQL', 'Firebase', 'Pinecone', 'Git / GitHub', 'Hardhat', 'Matplotlib'] }
];


const loopLogos = [
  { title: 'React', node: <span className="tech-logo">React</span>, href: 'https://react.dev' },
  { title: 'Next.js', node: <span className="tech-logo">Next.js</span>, href: 'https://nextjs.org' },
  { title: 'Three.js', node: <span className="tech-logo">Three.js</span>, href: 'https://threejs.org' },
  { title: 'Node.js', node: <span className="tech-logo">Node.js</span>, href: 'https://nodejs.org' },
  { title: 'FastAPI', node: <span className="tech-logo">FastAPI</span>, href: 'https://fastapi.tiangolo.com' },
  { title: 'TensorFlow', node: <span className="tech-logo">TensorFlow</span>, href: 'https://www.tensorflow.org' },
  { title: 'PyTorch', node: <span className="tech-logo">PyTorch</span>, href: 'https://pytorch.org' },
  { title: 'PostgreSQL', node: <span className="tech-logo">PostgreSQL</span>, href: 'https://www.postgresql.org' },
  { title: 'MongoDB', node: <span className="tech-logo">MongoDB</span>, href: 'https://www.mongodb.com' },
  { title: 'Firebase', node: <span className="tech-logo">Firebase</span>, href: 'https://firebase.google.com' },
  { title: 'Python', node: <span className="tech-logo">Python</span>, href: 'https://www.python.org' },
  { title: 'Solidity', node: <span className="tech-logo">Solidity</span>, href: 'https://soliditylang.org' }
];
const projects = [
  {
    title: 'SmartRent - Decentralized Rental Platform',
    badge: 'FYP',
    tech: 'TypeScript - React - Node.js - Solidity - MongoDB - Firebase - AI',
    description: 'Led development of a full-stack decentralized rental platform integrating web, backend, blockchain, and AI components. Built secure REST APIs, MongoDB data models, Firebase authentication, Solidity smart contracts, and TensorFlow rent prediction.',
    url: 'https://github.com/asadbaiig/SmartRent-Project'
  },
  {
    title: 'RAG Chatbot - NLP',
    tech: 'FastAPI - Pinecone - Groq LLM - HuggingFace - LlamaIndex',
    description: 'Built a Retrieval-Augmented Generation chatbot for context-aware question answering with semantic search, vector embeddings, and fast LLaMA 3.1 inference through Groq.',
    url: 'https://github.com/asadbaiig/NLP-Chatbot'
  },
  {
    title: 'Weather Data Interpolation',
    tech: 'Python - Pandas - Matplotlib - Jupyter Notebook',
    description: 'Applied IDW and Kriging techniques to impute missing weather observations using nearby station data, then evaluated accuracy with MAE and residual analysis.',
    url: 'https://github.com/asadbaiig/Spatial-weather-interpolation-with-Kriging-IDW-for-Islamabad-weather'
  },
  {
    title: 'IDW-Based 3D LUT Generator',
    tech: 'Python - OpenCV - NumPy',
    description: 'Built an interactive image application using IDW for 3D LUT generation, color transformation, real-time image processing, and visual inspection.',
    url: 'https://github.com/asadbaiig/IDW-Based-3D-LUT-Generator-Visualization-and-Image-Application'
  },
  {
    title: 'Caliber Locksmith Platform',
    tech: 'React - Node.js - Express.js - MongoDB',
    description: 'Developed a responsive full-stack web app with secure authentication, REST APIs, scalable CRUD functionality, and dynamic content rendering.',
    url: 'https://github.com/asadbaiig/Caliber-Locksmith-Full-Stack-Web-Application'
  },
  {
    title: 'E-Commerce Mobile App',
    tech: 'React Native - Expo - Firebase Firestore',
    description: 'Created a mobile commerce app with Firebase Authentication, real-time product/order updates, and a cart workflow optimized for iOS and Android.',
    url: 'https://github.com/asadbaiig/Ecommerce-App'
  },
  {
    title: 'Task Manager Mobile App',
    tech: 'React Native - JavaScript - CSS',
    description: 'Designed a mobile task manager with multi-tab navigation, responsive UI components, and clear React data flow patterns.',
    url: 'https://github.com/asadbaiig/Task-Manager-App-React-Native-Expo-'
  },
  {
    title: 'Simple Memory Game',
    tech: '.NET - C# - MySQL - Windows Forms',
    description: 'Developed a memory-matching game with interactive gameplay, persistent score tracking, database connectivity, and event-driven UI logic.',
    url: 'https://github.com/asadbaiig/Memory-Game-CSharp'
  }
];

function Icon({ name }) {
  const common = { className: 'social-icon', viewBox: '0 0 24 24', 'aria-hidden': 'true' };
  if (name === 'email') {
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  }
  if (name === 'github') {
    return (
      <svg {...common} fill="currentColor">
        <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.05c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.49 5.92.43.37.82 1.1.82 2.22v3.3c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
      </svg>
    );
  }
  if (name === 'linkedin') {
    return (
      <svg {...common} fill="currentColor">
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.6h4v11.9H3V9.6Zm6.35 0h3.83v1.63h.05c.53-.96 1.83-1.98 3.77-1.98 4.03 0 4.77 2.65 4.77 6.1v6.15h-4v-5.45c0-1.3-.02-2.97-1.81-2.97-1.82 0-2.1 1.42-2.1 2.88v5.54h-4V9.6Z" />
      </svg>
    );
  }
  return (
    <svg {...common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
      <path d="M9 9h1" />
    </svg>
  );
}
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.section, .cert-card').forEach(item => observer.observe(item));
    return () => observer.disconnect();
  }, []);
}

function ScrollProgress() {
  const ref = useRef(null);

  useEffect(() => {
    const update = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      ref.current.style.width = `${(window.scrollY / docHeight) * 100}%`;
    };
    window.addEventListener('scroll', update);
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  return <div ref={ref} className="scroll-progress" />;
}


function FooterLogoLoop() {
  return (
    <footer className="logo-loop-footer" aria-label="Technology stack loop">
      <LogoLoop
        logos={loopLogos}
        speed={72}
        direction="left"
        logoHeight={34}
        gap={24}
        hoverSpeed={12}
        scaleOnHover
        fadeOut
        fadeOutColor="#050505"
        ariaLabel="Technologies used by Asad Baig"
      />
    </footer>
  );
}
function Header() {
  const roles = ['Software Engineer', 'Full Stack Developer', 'AI/ML Engineer', 'Problem Solver', 'Data Analyst'];
  const [role, setRole] = useState('Software Engineer');

  useEffect(() => {
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer = 0;

    const tick = () => {
      const current = roles[roleIndex];
      setRole(deleting ? current.substring(0, charIndex - 1) : current.substring(0, charIndex + 1));
      charIndex += deleting ? -1 : 1;
      let speed = deleting ? 50 : 100;
      if (!deleting && charIndex === current.length) {
        deleting = true;
        speed = 1800;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        speed = 220;
      }
      timer = window.setTimeout(tick, speed);
    };

    timer = window.setTimeout(tick, 800);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <header className="header">
      <div className="profile-container">
        <ProfileCard
          avatarUrl={`${baseUrl}12.jpg`}
          name="Asad Baig"
          title="Software Engineer"
          className="hero-profile-card"
          behindGlowEnabled
          behindGlowColor="rgba(0, 255, 136, 0.58)"
          innerGradient="linear-gradient(145deg, rgba(0, 255, 136, 0.2) 0%, rgba(0, 102, 255, 0.18) 58%, rgba(255, 0, 102, 0.14) 100%)"
        />
      </div>
      <h1 className="name">Asad Baig</h1>
      <p className="role typing-text">{role}</p>
      <p className="hero-copy">I build polished web apps, AI-enabled systems, and data-heavy interfaces with a practical full-stack mindset.</p>

      <div className="contact-info">
        <span className="contact-item">tel: <a href="tel:+923365447781">+92 336 544 7781</a></span>
      </div>

      <div className="social-links">
        <a href="mailto:asadbaig215@gmail.com" className="social-link" aria-label="Email" data-label="Email"><Icon name="email" /></a>
        <a href="https://github.com/asadbaiig" target="_blank" rel="noreferrer" className="social-link" aria-label="GitHub" data-label="GitHub"><Icon name="github" /></a>
        <a href="https://www.linkedin.com/in/asad-baig1744/" target="_blank" rel="noreferrer" className="social-link" aria-label="LinkedIn" data-label="LinkedIn"><Icon name="linkedin" /></a>
        <a href={resumeUrl} target="_blank" rel="noreferrer" className="social-link" aria-label="Resume" data-label="Resume"><Icon name="resume" /></a>
      </div>

      <div className="hero-stats">
        <BorderGlow className="stat-glow-card" edgeSensitivity={24} glowColor="150 100 55" borderRadius={8} glowRadius={22} glowIntensity={1.15} coneSpread={28} animated colors={["#00ff88", "#0066ff", "#ff0066"]}>
          <div className="stat-chip"><strong>AI/ML</strong><span>TensorFlow, PyTorch, scikit-learn, forecasting</span></div>
        </BorderGlow>
        <BorderGlow className="stat-glow-card" edgeSensitivity={24} glowColor="190 100 55" borderRadius={8} glowRadius={22} glowIntensity={1.15} coneSpread={28} animated colors={["#00ff88", "#38bdf8", "#0066ff"]}>
          <div className="stat-chip"><strong>Data Analysis</strong><span>Pandas, NumPy, visualization, model evaluation</span></div>
        </BorderGlow>
        <BorderGlow className="stat-glow-card" edgeSensitivity={24} glowColor="330 100 60" borderRadius={8} glowRadius={22} glowIntensity={1.15} coneSpread={28} animated colors={["#00ff88", "#ff0066", "#0066ff"]}>
          <div className="stat-chip"><strong>Full Stack</strong><span>Frontend, backend, blockchain, mobile</span></div>
        </BorderGlow>
      </div>
    </header>
  );
}

function Section({ id, title, command, children }) {
  return (
    <section className="section" id={id}>
      <h2 className="section-title">{title}</h2>
      {command && <p className="command-line"><span>$</span> {command}</p>}
      {children}
    </section>
  );
}

function App() {
  useReveal();

  return (
    <>
      <DotGrid
        dotSize={4}
        gap={18}
        baseColor="#164d36"
        activeColor="#a2e33f"
        proximity={140}
        shockRadius={260}
        shockStrength={5}
        resistance={650}
        returnDuration={1.35}
      />
      <ScrollProgress />

      <div className="terminal">
        <CardNav
          brand="asad@portfolio"
          items={navItems}
          baseColor="rgba(0, 0, 0, 0.58)"
          menuColor="#00ff88"
        />

        <div className="container">
          <Header />
          <main className="content">
            <Section id="skills" title="Technical Arsenal">
              <div className="skills-grid">
                {skillGroups.map(group => (
                  <SpotlightCard key={group.title} className="skill-category" spotlightColor="rgba(0, 255, 136, 0.16)">
                    <h4>{group.title}</h4>
                    <div className="skill-tags">
                      {group.tags.map(tag => <span className="skill-tag" key={tag}>{tag}</span>)}
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            </Section>

            <Section id="experience" title="Professional Journey">
              <p className="hover-note">Hover over the journey text to scramble it.</p>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-title">AI / Machine Learning Intern</div>
                  <div className="timeline-period">WeatherWalayPK, Islamabad - July 2025 - Present</div>
                  <div className="timeline-description">
                    <p><ScrambledText>- Developed the Weather X portal, a scalable multimodel weather forecasting and analytics platform for Pakistan.</ScrambledText></p>
                    <p><ScrambledText>- Built interactive visualizations including 3D globe maps, district-level forecast grids, evaluation dashboards, and real-time AI-generated alerts.</ScrambledText></p>
                    <p><ScrambledText>- Designed a high-performance FastAPI backend integrated with PostgreSQL using asynchronous connection pooling.</ScrambledText></p>
                    <p><ScrambledText>- Engineered spatial interpolation, GeoTIFF caching, and satellite-data fusion pipelines for climate datasets.</ScrambledText></p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-title">Frontend Developer Intern</div>
                  <div className="timeline-period">Rex Technologies, Lahore - June 2024 - August 2024</div>
                  <div className="timeline-description">
                    <p><ScrambledText>- Developed responsive React components to enhance UI/UX and cross-browser compatibility.</ScrambledText></p>
                    <p><ScrambledText>- Built reusable UI components, managed state with hooks and context, integrated REST APIs, and improved reliability through testing and debugging.</ScrambledText></p>
                  </div>
                </div>
              </div>
            </Section>

            <Section id="projects" title="Featured Projects">
              <AnimatedList
                items={projects}
                className="projects-scroll-list"
                itemClassName="project-list-item"
                showGradients
                enableArrowNavigation
                displayScrollbar
                renderItem={project => (
                  <div className="project-card">
                    <div className="project-title">{project.title} {project.badge && <span className="badge">{project.badge}</span>}</div>
                    <div className="project-tech">{project.tech}</div>
                    <div className="project-description">{project.description}</div>
                    <div className="project-links">
                      <a href={project.url} target="_blank" rel="noreferrer" className="project-link">View Code -&gt;</a>
                    </div>
                  </div>
                )}
              />
            </Section>

            <Section id="education" title="Academic Background">
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-title"><DecryptedText text="Bachelor of Software Engineering" animateOn="hover" sequential revealDirection="center" speed={26} className="decrypt-revealed" encryptedClassName="decrypt-encrypted" /></div>
                  <div className="timeline-period"><DecryptedText text="Air University Islamabad - 2022 - 2026" animateOn="hover" sequential revealDirection="start" speed={22} className="decrypt-revealed" encryptedClassName="decrypt-encrypted" /></div>
                  <div className="timeline-description">
                    <p><DecryptedText text="Focused on modern software development practices, algorithm design, and system architecture." animateOn="hover" sequential revealDirection="start" speed={18} characters="01<>[]{}#/AI-ML" className="decrypt-revealed" encryptedClassName="decrypt-encrypted" /></p>
                    <p><DecryptedText text="Relevant coursework: Data Structures, Object-Oriented Programming, Database Systems, Web Technologies, AI/ML." animateOn="hover" sequential revealDirection="start" speed={16} characters="01<>[]{}#/AI-ML" className="decrypt-revealed" encryptedClassName="decrypt-encrypted" /></p>
                  </div>
                </div>
              </div>
            </Section>

            <Section id="certifications" title="Certifications">
              <p className="hover-note">Hover over a certificate for a pixel reveal, then click to open the full image.</p>
              <div className="cert-grid">
                {certificates.map((certificate, index) => {
                  const imageUrl = `${baseUrl}utils/${certificate.file}`;
                  return (
                    <a className="cert-card" href={certificate.url ?? imageUrl} target="_blank" rel="noreferrer" key={certificate.file} aria-label={`Open certificate ${index + 1}`}>
                      <PixelTransition
                        gridSize={10}
                        pixelColor="#00ff88"
                        animationStepDuration={0.32}
                        aspectRatio="75%"
                        className="certificate-pixel-transition"
                        firstContent={<img className="cert-thumb" src={imageUrl} alt={`Certificate ${index + 1}`} loading="lazy" />}
                        secondContent={
                          <div className="cert-reveal">
                            <span>View</span>
                            <strong>Certificate</strong>
                          </div>
                        }
                      />
                    </a>
                  );
                })}
              </div>
            </Section>
          </main>
          <FooterLogoLoop />
        </div>
      </div>
    </>
  );
}

export default App;












