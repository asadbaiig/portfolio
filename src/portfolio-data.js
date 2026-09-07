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
    url: 'https://www.coursera.org/account/accomplishments/verify/OGEKL189R5L6'
  },
  {
    file: 'Screenshot 2026-07-30 031825.png',
    url: 'https://www.coursera.org/account/accomplishments/specialization/O8Q9CPTAMKU3'
  },
  {
    file: 'Screenshot 2026-07-30 031845.png',
    url: 'https://www.coursera.org/account/accomplishments/specialization/O8Q9CPTAMKU3'
  },
  {
    file: 'Screenshot 2026-07-30 031904.png',
    url: 'https://www.coursera.org/account/accomplishments/verify/OGEKL189R5L6'
  },
  {
    file: 'Screenshot 2026-07-30 031928.png'
  }
];

const skillGroups = [
  { title: 'Languages', tags: ['JavaScript', 'TypeScript', 'Java', 'Python', 'C/C++', 'SQL', 'HTML/CSS', 'Solidity'] },
  { title: 'Frontend', tags: ['React', 'React Native', 'Next.js', 'Three.js', 'Tailwind CSS', 'Responsive Design'] },
  { title: 'Backend & AI/ML', tags: ['Node.js', 'Express.js', 'FastAPI', '.NET', 'TensorFlow', 'PyTorch', 'scikit-learn', 'Pandas / NumPy'] },
  { title: 'Databases & Tools', tags: ['MongoDB', 'MySQL', 'PostgreSQL', 'Firebase', 'Pinecone', 'Git / GitHub', 'Hardhat', 'Matplotlib'] }
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


export { baseUrl, resumeUrl, certificates, skillGroups, projects };
