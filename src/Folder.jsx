import { useState } from 'react';
import './Folder.css';

const darkenColor = (hex, percent) => {
  let color = hex.startsWith('#') ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color.split('').map(char => char + char).join('');
  }

  const num = parseInt(color.slice(0, 6), 16);
  const r = Math.max(0, Math.min(255, Math.floor(((num >> 16) & 0xff) * (1 - percent))));
  const g = Math.max(0, Math.min(255, Math.floor(((num >> 8) & 0xff) * (1 - percent))));
  const b = Math.max(0, Math.min(255, Math.floor((num & 0xff) * (1 - percent))));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
};

export default function Folder({
  color = '#00ff88',
  size = 1,
  items = [],
  className = '',
  open: controlledOpen,
  onToggle,
  label = 'Open menu'
}) {
  const maxItems = 3;
  const papers = items.slice(0, maxItems);
  while (papers.length < maxItems) papers.push(null);

  const [internalOpen, setInternalOpen] = useState(false);
  const [paperOffsets, setPaperOffsets] = useState(Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })));
  const open = controlledOpen ?? internalOpen;

  const handleClick = () => {
    if (controlledOpen === undefined) setInternalOpen(prev => !prev);
    if (open) setPaperOffsets(Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })));
    onToggle?.();
  };

  const handlePaperMouseMove = (event, index) => {
    if (!open) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (event.clientX - centerX) * 0.15;
    const offsetY = (event.clientY - centerY) * 0.15;

    setPaperOffsets(previous => {
      const next = [...previous];
      next[index] = { x: offsetX, y: offsetY };
      return next;
    });
  };

  const handlePaperMouseLeave = (_, index) => {
    setPaperOffsets(previous => {
      const next = [...previous];
      next[index] = { x: 0, y: 0 };
      return next;
    });
  };

  const folderStyle = {
    '--folder-color': color,
    '--folder-back-color': darkenColor(color, 0.18),
    '--paper-1': '#d6fff0',
    '--paper-2': '#f2fff9',
    '--paper-3': '#ffffff'
  };

  return (
    <div className={`folder-wrap ${className}`} style={{ transform: `scale(${size})` }}>
      <div
        className={`folder ${open ? 'open' : ''}`}
        style={folderStyle}
        onClick={handleClick}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleClick();
          }
        }}
        tabIndex={0}
        role="button"
        aria-expanded={open}
        aria-label={open ? 'Close menu' : label}
      >
        <div className="folder__back">
          {papers.map((item, index) => (
            <div
              key={index}
              className={`paper paper-${index + 1}`}
              onMouseMove={event => handlePaperMouseMove(event, index)}
              onMouseLeave={event => handlePaperMouseLeave(event, index)}
              style={
                open
                  ? {
                      '--magnet-x': `${paperOffsets[index]?.x || 0}px`,
                      '--magnet-y': `${paperOffsets[index]?.y || 0}px`
                    }
                  : {}
              }
            >
              {item}
            </div>
          ))}
          <div className="folder__front" />
          <div className="folder__front right" />
        </div>
      </div>
    </div>
  );
}
