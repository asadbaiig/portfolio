const baseUrl = import.meta.env.BASE_URL;
const resumeUrl = `${baseUrl}Asad_Baig_AI_Air.pdf`;

const certificates = [
  {
    file: 'Screenshot 2026-07-30 031845.png',
    title: 'AI for Brainstorming and Planning',
    issuer: 'Google',
    url: 'https://coursera.org/verify/OB7GPF1N9BWP'
  },
  {
    file: 'Screenshot 2026-07-30 031904.png',
    title: 'Generative AI for Growth Marketing',
    issuer: 'IBM · Starweaver',
    url: 'https://coursera.org/verify/specialization/O8Q9CPTAMKU3'
  },
  {
    file: 'Screenshot 2026-07-30 031746.png',
    title: 'Grow with AI: Your AI-driven Growth Marketing strategy',
    issuer: 'Starweaver',
    url: 'https://coursera.org/verify/FK26QWJ5R4ZX'
  },
  {
    file: 'Screenshot 2026-07-30 031701.png',
    title: 'Generative AI: Prompt Engineering Basics',
    issuer: 'IBM',
    url: 'https://coursera.org/verify/47SKQ0720PK0'
  },
  {
    file: 'Screenshot 2026-07-30 031805.png',
    title: 'Generative AI: Introduction and Applications',
    issuer: 'IBM',
    url: 'https://coursera.org/verify/M2I0447YIER4'
  },
  {
    file: 'Screenshot 2026-07-30 031727.png',
    title: 'AI Fundamentals',
    issuer: 'Google',
    url: 'https://coursera.org/verify/AHO9R3F5OVIZ'
  },
  {
    file: 'Screenshot 2026-07-30 031825.png',
    title: 'Data Analysis and Visualization with Power BI',
    issuer: 'Microsoft',
    url: 'https://coursera.org/verify/OGEKL189R5L6'
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
    image: 'utils/1766772186301.jpeg',
    imageAlt: 'SmartRent decentralized rental platform preview',
    badge: 'FYP',
    featured: true,
    tech: 'TypeScript - React - Node.js - Solidity - MongoDB - Firebase - AI',
    shortDesc: 'Decentralized rental ecosystem combining Ethereum smart contracts with TensorFlow rent pricing.',
    highlights: [
      'Smart contracts for automated trustless leasing & escrow',
      'TensorFlow ML model for automated rental price forecasting',
      'Full-stack architecture with React, Node.js & MongoDB'
    ],
    description: 'Led development of a full-stack decentralized rental platform integrating web, backend, blockchain, and AI components. Built secure REST APIs, MongoDB data models, Firebase authentication, Solidity smart contracts, and TensorFlow rent prediction.',
    url: 'https://github.com/asadbaiig/SmartRent-Project'
  },
  {
    title: 'Sales Forecasting & Predictive Analytics',
    tech: 'Python - Pandas - NumPy - Matplotlib',
    shortDesc: 'Demand forecasting across global markets with uncertainty estimation.',
    highlights: [
      'Historical trend analytics and 2026 demand projections',
      'Confidence intervals quantifying forecast volatility',
      'Statistical time-series pipeline with Pandas & NumPy'
    ],
    description: 'Explored sales trends across countries and products, comparing historical demand with 2026 forecasts and visualizing uncertainty through confidence intervals.',
    image: 'utils/forecast_Analysis/Forecast_Visualization_Top12_2026.png',
    imageAlt: 'Historical sales and 2026 forecasts for twelve country and product combinations',
    url: 'https://github.com/asadbaiig/Sales_Forecasting'
  },
  {
    title: 'IDW-Based 3D LUT Generator',
    comparison: 'utils/lut-demo/comparison.png',
    image: 'utils/1758468196233.jpeg',
    imageAlt: '3D LUT color interpolation project preview',
    tech: 'Python - OpenCV - NumPy',
    shortDesc: 'Interactive color transformation using Inverse Distance Weighting interpolation.',
    highlights: [
      'Inverse Distance Weighting color space interpolation',
      'Real-time 3D Look-Up Table (LUT) color grading',
      'High-throughput image processing with OpenCV & NumPy'
    ],
    description: 'Built an interactive image application using IDW for 3D LUT generation, color transformation, real-time image processing, and visual inspection.',
    url: 'https://github.com/asadbaiig/IDW-Based-3D-LUT-Generator-Visualization-and-Image-Application'
  },
  {
    title: 'Spatial Weather Data Interpolation',
    image: 'utils/1756290549045.jpeg',
    imageAlt: 'Weather data interpolation project preview',
    tech: 'Python - Pandas - Matplotlib - Jupyter Notebook',
    shortDesc: 'Missing observation imputation using Kriging & IDW spatial geostatistics.',
    highlights: [
      'Geostatistical Kriging & IDW algorithms for spatial interpolation',
      'Multi-station weather imputation across Islamabad region',
      'Residual error validation and MAE metric benchmarking'
    ],
    description: 'Applied IDW and Kriging techniques to impute missing weather observations using nearby station data, then evaluated accuracy with MAE and residual analysis.',
    url: 'https://github.com/asadbaiig/Spatial-weather-interpolation-with-Kriging-IDW-for-Islamabad-weather'
  },
  {
    title: 'RAG Chatbot - NLP Microservice',
    image: 'utils/Screenshot 2026-07-29 014318.png',
    imageAlt: 'RAG chatbot project preview',
    tech: 'FastAPI - Pinecone - Groq LLM - HuggingFace - LlamaIndex',
    shortDesc: 'High-speed retrieval-augmented generation for contextual domain knowledge.',
    highlights: [
      'Ultra-fast inference via Groq LLM with LLaMA 3.1',
      'Dense vector semantic retrieval via Pinecone & HuggingFace',
      'Asynchronous FastAPI microservice with LlamaIndex orchestration'
    ],
    description: 'Built a Retrieval-Augmented Generation chatbot for context-aware question answering with semantic search, vector embeddings, and fast LLaMA 3.1 inference through Groq.',
    url: 'https://github.com/asadbaiig/NLP-Chatbot'
  },
  {
    title: 'Caliber Locksmith Platform',
    tech: 'React - Node.js - Express.js - MongoDB',
    shortDesc: 'Responsive full-stack enterprise web service with dynamic booking workflows.',
    highlights: [
      'JWT-authenticated user accounts and dynamic dispatch flows',
      'Modular RESTful API with Express.js & MongoDB database',
      'Modern accessible UI components built with React'
    ],
    description: 'Developed a responsive full-stack web app with secure authentication, REST APIs, scalable CRUD functionality, and dynamic content rendering.',
    url: 'https://github.com/asadbaiig/Caliber-Locksmith-Full-Stack-Web-Application'
  },
  {
    title: 'E-Commerce Mobile App',
    tech: 'React Native - Expo - Firebase Firestore',
    shortDesc: 'Cross-platform mobile marketplace with live cloud synchronization.',
    highlights: [
      'Native iOS and Android compatibility via Expo runtime',
      'Real-time product inventory sync with Firebase Firestore',
      'Secure customer authentication and fluid checkout UI'
    ],
    description: 'Created a mobile commerce app with Firebase Authentication, real-time product/order updates, and a cart workflow optimized for iOS and Android.',
    url: 'https://github.com/asadbaiig/Ecommerce-App'
  },
  {
    title: 'Task Manager Mobile App',
    tech: 'React Native - JavaScript - CSS',
    shortDesc: 'Clean mobile productivity suite with multi-tab state management.',
    highlights: [
      'Multi-tab dashboard navigation with reactive state updates',
      'Smooth gestures and offline task persistence',
      'Lightweight styling architecture tailored for mobile devices'
    ],
    description: 'Designed a mobile task manager with multi-tab navigation, responsive UI components, and clear React data flow patterns.',
    url: 'https://github.com/asadbaiig/Task-Manager-App-React-Native-Expo-'
  },
  {
    title: 'Simple Memory Game',
    tech: '.NET - C# - MySQL - Windows Forms',
    shortDesc: 'Desktop cognitive gaming application with persistent leaderboard analytics.',
    highlights: [
      'Event-driven game state engine developed in C# .NET',
      'Relational database integration for scores and player metrics',
      'Custom visual animations and responsive board rendering'
    ],
    description: 'Developed a memory-matching game with interactive gameplay, persistent score tracking, database connectivity, and event-driven UI logic.',
    url: 'https://github.com/asadbaiig/Memory-Game-CSharp'
  }
];

export { baseUrl, resumeUrl, certificates, skillGroups, projects };
