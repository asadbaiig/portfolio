
import NeuralNetwork from './NeuralNetwork.jsx';
import { baseUrl } from './portfolio-data.js';

export default function Portrait({ animated }) {
  return <div className="portrait-stage">
    <NeuralNetwork animated={animated}/>
    <div className="portrait-stack">
      <figure className="portrait-frame">
        <img src={`${baseUrl}asad-mountains.jpeg`} width="900" height="1600" alt="Asad Baig standing in sunlight with forested mountains behind him" fetchPriority="high"/>

      </figure>
    </div>
    <span className="portrait-side-note" aria-hidden="true">INPUT → LEARN → CONNECT → CREATE</span>
  </div>;
}




