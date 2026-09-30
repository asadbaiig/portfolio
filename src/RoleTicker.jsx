import { useEffect, useRef, useState } from 'react';

const roles = [
  'Full-Stack Developer',
  'AI Engineer',
  'Data Alchemist',
  'Problem Solver',
  'Creative Builder',
];

export default function RoleTicker() {
  const [current, setCurrent] = useState(0);
  const [phase, setPhase] = useState('in'); // 'in' | 'out'
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setPhase('out');
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % roles.length);
        setPhase('in');
      }, 400);
    }, 2800);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <span className={`role-ticker role-ticker-${phase}`} aria-label={roles[current]}>
      {roles[current].split('').map((char, i) => (
        <span
          key={`${current}-${i}`}
          className="role-char"
          style={{ '--char-index': i, animationDelay: `${i * 25}ms` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}
