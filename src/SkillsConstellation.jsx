import { useEffect, useState, useMemo } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects, skillGroups } from './portfolio-data.js';

const nodes = [
  { name: 'TypeScript', x: 18, y: 18, group: 'Build', category: 'web', icon: 'TS' },
  { name: 'React', x: 12, y: 44, group: 'Build', category: 'web', icon: 'RE' },
  { name: 'Node.js', x: 29, y: 68, group: 'Build', category: 'web', icon: 'JS' },
  { name: 'Solidity', x: 16, y: 88, group: 'Build', category: 'web', icon: 'SOL' },
  { name: 'Python', x: 52, y: 12, group: 'Intelligence', category: 'ai', icon: 'PY' },
  { name: 'FastAPI', x: 72, y: 31, group: 'Intelligence', category: 'ai', icon: 'API' },
  { name: 'Pinecone', x: 86, y: 14, group: 'Intelligence', category: 'ai', icon: 'VEC' },
  { name: 'NumPy', x: 87, y: 56, group: 'Data', category: 'data', icon: 'NUM' },
  { name: 'Pandas', x: 76, y: 82, group: 'Data', category: 'data', icon: 'PD' },
  { name: 'MongoDB', x: 51, y: 90, group: 'Data', category: 'data', icon: 'DB' },
  { name: 'Firebase', x: 53, y: 65, group: 'Data', category: 'data', icon: 'FB' },
];

const categoryTabs = [
  { id: 'all', label: 'All Connected' },
  { id: 'ai', label: 'AI & Intelligence' },
  { id: 'web', label: 'Full-Stack & Web' },
  { id: 'data', label: 'Data & Analytics' },
];

function matches(project, skill) {
  const tech = project.tech.split(' - ');
  return tech.includes(skill) || (skill === 'Firebase' && tech.includes('Firebase Firestore'));
}

export default function SkillsConstellation({ onProjectSelect }) {
  const [selected, setSelected] = useState('Python');
  const [activeTab, setActiveTab] = useState('all');
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [selected, activeTab, detailsOpen]);

  // Filter visible nodes based on active tab
  const visibleNodes = useMemo(() => {
    if (activeTab === 'all') return nodes;
    return nodes.filter(n => n.category === activeTab);
  }, [activeTab]);

  const matching = useMemo(() => {
    return projects
      .map((project, index) => ({ project, index }))
      .filter(({ project }) => matches(project, selected));
  }, [selected]);

  const related = useMemo(() => {
    return new Set(
      nodes
        .filter(node => matching.some(({ project }) => matches(project, node.name)))
        .map(node => node.name)
    );
  }, [matching]);

  return (
    <div id="skills" className="skills-constellation">
      {/* Background ambient lighting */}
      <div className="constellation-glow-mesh" aria-hidden="true" />

      {/* Heading */}
      <div className="constellation-heading">
        <div>
          <p className="eyebrow constellation-eyebrow">
            <span className="live-dot" /> INTERACTIVE ARCHITECTURE
          </p>
          <h3 className="constellation-title">Skills that build together.</h3>
        </div>
        <div className="constellation-badge">
          <span className="badge-glow" />
          <span>{nodes.length} Connected Nodes</span>
        </div>
      </div>

      <p className="constellation-intro">
        Explore how engineering disciplines interconnect across real-world systems. Click any node to reveal linked projects.
      </p>

      {/* Filter Tabs */}
      <div className="constellation-tabs" role="tablist" aria-label="Skill categories">
        {categoryTabs.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`constellation-tab ${activeTab === tab.id ? 'is-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Visual Constellation Map */}
      <div className="constellation-map" role="group" aria-label="Interactive skill graph">
        {/* SVG Laser Grid & Lines */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className="constellation-svg">
          <defs>
            <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b7a0ff" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#96d9d2" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#b7a0ff" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="activeBeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d8cbff" stopOpacity="1" />
              <stop offset="50%" stopColor="#96d9d2" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#b7a0ff" stopOpacity="0.8" />
            </linearGradient>
            <filter id="laserGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Dual celestial orbit rings */}
          <ellipse cx="47" cy="44" rx="35" ry="36" className="constellation-orbit orbit-outer" />
          <ellipse cx="47" cy="44" rx="23" ry="24" className="constellation-orbit orbit-inner" />

          {/* Connection Lines from Center Core */}
          {nodes.map(node => {
            const isSelected = selected === node.name;
            const isConnected = related.has(node.name);
            const isDimmed = activeTab !== 'all' && node.category !== activeTab;

            return (
              <g key={node.name} className={isDimmed ? 'beam-dimmed' : ''}>
                {/* Background faint path */}
                <path
                  className="beam-base"
                  d={`M 47 44 Q ${node.x} 44 ${node.x} ${node.y}`}
                />
                {/* Active energized laser path */}
                {(isSelected || isConnected) && (
                  <path
                    className={`beam-active ${isSelected ? 'beam-selected' : 'beam-related'}`}
                    d={`M 47 44 Q ${node.x} 44 ${node.x} ${node.y}`}
                    filter="url(#laserGlow)"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Center Reactor Core */}
        <div className="constellation-core" aria-hidden="true">
          <div className="core-halo" />
          <div className="core-ring" />
          <div className="core-content">
            <span className="core-initials">AB</span>
            <span className="core-tag">SYSTEM CORE</span>
          </div>
        </div>

        {/* Skill Nodes */}
        {nodes.map(node => {
          const isSelected = selected === node.name;
          const isConnected = related.has(node.name);
          const isDimmed = activeTab !== 'all' && node.category !== activeTab;

          return (
            <button
              type="button"
              key={node.name}
              className={`skill-node group-${node.group.toLowerCase()} ${isSelected ? 'is-selected' : ''} ${isConnected ? 'is-related' : ''} ${isDimmed ? 'is-dimmed' : ''}`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              aria-pressed={isSelected}
              aria-controls="skill-projects"
              onClick={() => setSelected(node.name)}
            >
              <span className="node-indicator" aria-hidden="true" />
              <span className="node-name">{node.name}</span>
              {isSelected && <span className="node-pulse" aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      {/* Project Showcase Cards */}
      <div id="skill-projects" className="skill-projects-showcase">
        <div className="skill-results-header">
          <div className="skill-results-title">
            <span className="selected-skill-pill">{selected}</span>
            <span className="results-count">
              {matching.length} {matching.length === 1 ? 'Production Project' : 'Production Projects'} Connected
            </span>
          </div>
          <span className="results-hint">Click card to inspect build details</span>
        </div>

        <div className="skill-cards-grid">
          {matching.map(({ project, index }) => (
            <div
              key={project.url}
              className="skill-project-card"
              role="button"
              tabIndex={0}
              onClick={e => {
                e.preventDefault();
                onProjectSelect(index);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onProjectSelect(index);
                }
              }}
            >
              <div className="card-ambient-glow" />
              <div className="card-top-row">
                <span className={`card-badge ${project.badge ? 'is-fyp' : ''}`}>
                  {project.badge ? '⭐ CAPSTONE FYP' : 'ENGINEERING BUILD'}
                </span>
                <span className="card-jump-arrow">Inspect ↗</span>
              </div>
              <h4 className="card-title">{project.title}</h4>
              <p className="card-summary">{project.shortDesc || project.description}</p>
              <div className="card-tags">
                {project.tech.split(' - ').slice(0, 4).map(tag => (
                  <span
                    key={tag}
                    className={`card-tag ${tag.toLowerCase().includes(selected.toLowerCase()) ? 'is-matched-tag' : ''}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Skill Matrix Drawer */}
      <details
        className="skills-matrix-details"
        open={detailsOpen}
        onToggle={e => {
          setDetailsOpen(e.currentTarget.open);
          ScrollTrigger.refresh();
        }}
      >
        <summary className="matrix-summary">
          <div className="summary-left">
            <span className="matrix-icon">⚡</span>
            <span>Comprehensive Technical Matrix</span>
          </div>
          <span className="matrix-toggle-badge">{detailsOpen ? 'Hide Matrix −' : 'View All 30+ Skills +'}</span>
        </summary>
        <div className="skills-matrix-content">
          {skillGroups.map(group => (
            <div key={group.title} className="matrix-group">
              <h5 className="matrix-group-title">{group.title}</h5>
              <div className="matrix-chips">
                {group.tags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    className={`matrix-chip ${selected === tag ? 'is-active-chip' : ''}`}
                    onClick={() => {
                      if (nodes.some(n => n.name === tag)) {
                        setSelected(tag);
                      }
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
