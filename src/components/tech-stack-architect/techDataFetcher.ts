import { techCategories } from './techData';

export interface Technology {
  type: string;
  name: string;
  icon: string;
  description?: string;
  category: string;
  version?: string;
}

const DEVICON_BASE_URL = 'https://raw.githubusercontent.com/devicons/devicon/master/icons';

// Map of technology names to their categories
const categoryMap: Record<string, string> = {
  // Frontend
  react: 'frontend',
  vue: 'frontend',
  angular: 'frontend',
  svelte: 'frontend',
  nextjs: 'frontend',
  nuxtjs: 'frontend',
  typescript: 'frontend',
  javascript: 'frontend',
  html5: 'frontend',
  css3: 'frontend',
  sass: 'frontend',
  tailwindcss: 'frontend',
  bootstrap: 'frontend',
  materialui: 'frontend',
  webpack: 'frontend',
  babel: 'frontend',
  
  // Backend
  nodejs: 'backend',
  express: 'backend',
  python: 'backend',
  django: 'backend',
  flask: 'backend',
  fastapi: 'backend',
  java: 'backend',
  spring: 'backend',
  go: 'backend',
  rust: 'backend',
  php: 'backend',
  laravel: 'backend',
  dotnet: 'backend',
  csharp: 'backend',
  
  // Database
  postgresql: 'database',
  mysql: 'database',
  mongodb: 'database',
  redis: 'database',
  elasticsearch: 'database',
  cassandra: 'database',
  neo4j: 'database',
  sqlite: 'database',
  
  // DevOps
  docker: 'devops',
  kubernetes: 'devops',
  jenkins: 'devops',
  gitlab: 'devops',
  github: 'devops',
  ansible: 'devops',
  terraform: 'devops',
  prometheus: 'devops',
  grafana: 'devops',
  
  // Cloud
  aws: 'cloud',
  azure: 'cloud',
  googlecloud: 'cloud',
  digitalocean: 'cloud',
  heroku: 'cloud',
  vercel: 'cloud',
  netlify: 'cloud',
  
  // Testing
  jest: 'testing',
  cypress: 'testing',
  selenium: 'testing',
  mocha: 'testing',
  pytest: 'testing',
  junit: 'testing',
  
  // Mobile
  flutter: 'mobile',
  dart: 'mobile',
  kotlin: 'mobile',
  swift: 'mobile',
  reactnative: 'mobile',
  ionic: 'mobile',
  
  // AI/ML
  tensorflow: 'ai_ml',
  pytorch: 'ai_ml',
  pandas: 'ai_ml',
  numpy: 'ai_ml',
  scikitlearn: 'ai_ml',
  opencv: 'ai_ml',
};

const descriptions: Record<string, string> = {
  react: 'A JavaScript library for building user interfaces',
  vue: 'The Progressive JavaScript Framework',
  angular: 'Platform for building mobile and desktop web applications',
  nextjs: 'The React Framework for Production',
  typescript: 'Typed JavaScript at Any Scale',
  python: 'A programming language that lets you work quickly',
  nodejs: 'JavaScript runtime built on Chrome\'s V8 JavaScript engine',
  postgresql: 'The World\'s Most Advanced Open Source Relational Database',
  mongodb: 'The application data platform',
  docker: 'Develop, Ship, and Run Anywhere',
  kubernetes: 'Production-Grade Container Orchestration',
  aws: 'The Most Complete Cloud Platform',
  // Add more descriptions as needed
};

export async function fetchTechData(): Promise<Record<string, Technology[]>> {
  try {
    const response = await fetch('https://raw.githubusercontent.com/devicons/devicon/master/devicon.json');
    const data = await response.json();
    
    const technologies: Record<string, Technology[]> = {};
    
    data.forEach((tech: any) => {
      const name = tech.name;
      const category = categoryMap[name] || 'other';
      
      if (!technologies[category]) {
        technologies[category] = [];
      }
      
      technologies[category].push({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        icon: `${DEVICON_BASE_URL}/${name}/${name}-original.svg`,
        description: descriptions[name] || `${name.charAt(0).toUpperCase() + name.slice(1)} development tool`,
        category,
        type: category,
        version: tech.versions?.[0]
      });
    });
    
    return technologies;
  } catch (error) {
    console.error('Error fetching tech data:', error);
    return techCategories as unknown as Record<string, Technology[]>;
  }
}
