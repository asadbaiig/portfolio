import { useEffect, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects, skillGroups } from './portfolio-data.js';

const nodes = [
  { name: 'TypeScript', x: 18, y: 16, group: 'Build' },
  { name: 'React', x: 12, y: 43, group: 'Build' },
  { name: 'Node.js', x: 29, y: 66, group: 'Build' },
  { name: 'Solidity', x: 16, y: 88, group: 'Build' },
  { name: 'Python', x: 52, y: 12, group: 'Intelligence' },
  { name: 'FastAPI', x: 72, y: 31, group: 'Intelligence' },
  { name: 'Pinecone', x: 86, y: 12, group: 'Intelligence' },
  { name: 'NumPy', x: 87, y: 56, group: 'Data' },
  { name: 'Pandas', x: 76, y: 83, group: 'Data' },
  { name: 'MongoDB', x: 51, y: 90, group: 'Data' },
  { name: 'Firebase', x: 53, y: 65, group: 'Data' },
];

function matches(project, skill) {
  const tech = project.tech.split(' - ');
  return tech.includes(skill) || (skill === 'Firebase' && tech.includes('Firebase Firestore'));
}

export default function SkillsConstellation({ onProjectSelect }) {
  const [selected, setSelected] = useState('Python');
  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [selected]);
  const matching = projects.map((project, index) => ({ project, index })).filter(({ project }) => matches(project, selected));
  const related = new Set(nodes.filter(node => matching.some(({ project }) => matches(project, node.name))).map(node => node.name));

  return <div id="skills" className="skills-constellation">
    <div className="constellation-heading"><div><p className="eyebrow">CONNECTED IN PRACTICE</p><h3>Skills that build together.</h3></div><span className="constellation-count">{nodes.length} connections</span></div>
    <p className="constellation-intro">Select a skill to explore the work behind it.</p>
    <div className="constellation-map" role="group" aria-label="Explore projects by skill">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <ellipse cx="47" cy="44" rx="34" ry="35" className="constellation-orbit"/>
        {nodes.map(node => <path key={node.name} className={related.has(node.name) ? 'is-connected' : ''} d={`M 47 44 Q ${node.x} 44 ${node.x} ${node.y}`}/>)}
      </svg>
      <span className="constellation-core" aria-hidden="true"><span>AB</span><small>BUILD / CONNECT</small></span>
      {nodes.map(node => <button type="button" key={node.name} className={`skill-node ${related.has(node.name) ? 'is-related' : ''}`} style={{ left: `${node.x}%`, top: `${node.y}%` }} aria-pressed={selected === node.name} aria-controls="skill-projects" onClick={() => setSelected(node.name)}><span aria-hidden="true"/>{node.name}</button>)}
    </div>
    <div id="skill-projects" className="skill-projects">
      <p className="skill-results-heading" aria-live="polite" aria-atomic="true"><strong>{selected}</strong><span>{matching.length} {matching.length === 1 ? 'project' : 'projects'}</span></p>
      {matching.map(({ project, index }) => <a className="skill-project-link" key={project.url} href={`#project-${index}`} onClick={event => { event.preventDefault(); onProjectSelect(index); }}><span>{project.title}</span><small>View project</small></a>)}
    </div>
    <details className="skills-directory" onToggle={() => ScrollTrigger.refresh()}><summary>Full skill set</summary><div>{skillGroups.map(group => <div key={group.title}><h4>{group.title}</h4><p>{group.tags.join(' · ')}</p></div>)}</div></details>
  </div>;
}
