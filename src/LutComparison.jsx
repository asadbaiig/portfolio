import { useId, useState } from 'react';
import { baseUrl } from './portfolio-data.js';

export default function LutComparison({ image }) {
  const [position, setPosition] = useState(50);
  const id = useId();
  return <div className="lut-demo">
    <div className="lut-labels" aria-hidden="true"><span>ORIGINAL</span><span>AFTER IDW LUT</span></div>
    <div className="lut-comparison" role="img" aria-label="Original color test chart compared with the output of the IDW LUT generator">
      <div className="lut-image lut-after"><img src={`${baseUrl}${image}`} alt="" loading="lazy" draggable="false"/></div>
      <div className="lut-image lut-before" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}><img src={`${baseUrl}${image}`} alt="" loading="lazy" draggable="false"/></div>
      <span className="lut-divider" style={{ left: `${position}%` }} aria-hidden="true"><span>↔</span></span>
    </div>
    <label className="lut-control" htmlFor={id}><span>Slide to compare</span><span aria-hidden="true">← →</span></label>
    <input id={id} className="lut-range" type="range" min="0" max="100" value={position} onChange={event => setPosition(Number(event.target.value))} aria-valuetext={`${position}% original, ${100 - position}% LUT output`}/>
    <p className="lut-note">Actual test output from this project.</p>
  </div>;
}
