import { Node, Edge, Position } from 'reactflow';
import { TechStack } from './stackUtils';

const DEVICON_BASE_URL = 'https://raw.githubusercontent.com/devicons/devicon/master/icons';

export interface StackTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: Node[];
  edges: Edge[];
}

const calculateNodePosition = (index: number, total: number, row: number): { x: number; y: number } => {
  const spacing = 200;
  const rowHeight = 150;
  const startX = -(total * spacing) / 2;
  return {
    x: startX + index * spacing,
    y: row * rowHeight
  };
};

export const stackTemplates: StackTemplate[] = [
  {
    id: 'mern',
    name: 'MERN Stack',
    description: 'MongoDB, Express.js, React, and Node.js stack for full-stack JavaScript applications',
    category: 'fullstack',
    nodes: [
      {
        id: 'frontend',
        type: 'techNode',
        position: calculateNodePosition(1, 3, 0),
        data: { 
          name: 'React',
          icon: `${DEVICON_BASE_URL}/react/react-original.svg`,
          type: 'frontend'
        }
      },
      {
        id: 'backend',
        type: 'techNode',
        position: calculateNodePosition(1, 3, 1),
        data: {
          name: 'Express.js',
          icon: `${DEVICON_BASE_URL}/express/express-original.svg`,
          type: 'backend'
        }
      },
      {
        id: 'database',
        type: 'techNode',
        position: calculateNodePosition(0, 3, 1),
        data: {
          name: 'MongoDB',
          icon: `${DEVICON_BASE_URL}/mongodb/mongodb-original.svg`,
          type: 'database'
        }
      },
      {
        id: 'runtime',
        type: 'techNode',
        position: calculateNodePosition(2, 3, 1),
        data: {
          name: 'Node.js',
          icon: `${DEVICON_BASE_URL}/nodejs/nodejs-original.svg`,
          type: 'backend'
        }
      }
    ],
    edges: [
      {
        id: 'frontend-backend',
        source: 'frontend',
        target: 'backend',
        type: 'smoothstep',
        animated: true
      },
      {
        id: 'backend-database',
        source: 'backend',
        target: 'database',
        type: 'smoothstep',
        animated: true
      },
      {
        id: 'backend-runtime',
        source: 'backend',
        target: 'runtime',
        type: 'smoothstep',
        animated: true
      }
    ]
  },
  {
    id: 'jamstack',
    name: 'JAMstack',
    description: 'Modern web architecture with JavaScript, APIs, and Markup',
    category: 'frontend',
    nodes: [
      {
        id: 'frontend-framework',
        type: 'techNode',
        position: calculateNodePosition(1, 3, 0),
        data: {
          name: 'Next.js',
          icon: `${DEVICON_BASE_URL}/nextjs/nextjs-original.svg`,
          type: 'frontend'
        }
      },
      {
        id: 'cms',
        type: 'techNode',
        position: calculateNodePosition(0, 3, 1),
        data: {
          name: 'Strapi',
          icon: `${DEVICON_BASE_URL}/strapi/strapi-original.svg`,
          type: 'cms'
        }
      },
      {
        id: 'deployment',
        type: 'techNode',
        position: calculateNodePosition(2, 3, 1),
        data: {
          name: 'Vercel',
          icon: `${DEVICON_BASE_URL}/vercel/vercel-original.svg`,
          type: 'deployment'
        }
      }
    ],
    edges: [
      {
        id: 'frontend-cms',
        source: 'frontend-framework',
        target: 'cms',
        type: 'smoothstep',
        animated: true
      },
      {
        id: 'frontend-deployment',
        source: 'frontend-framework',
        target: 'deployment',
        type: 'smoothstep',
        animated: true
      }
    ]
  },
  {
    id: 'modern-data',
    name: 'Modern Data Stack',
    description: 'Modern data pipeline with data warehouse and visualization',
    category: 'data',
    nodes: [
      {
        id: 'ingestion',
        type: 'techNode',
        position: calculateNodePosition(0, 4, 0),
        data: {
          name: 'Python',
          icon: `${DEVICON_BASE_URL}/python/python-original.svg`,
          type: 'data'
        }
      },
      {
        id: 'warehouse',
        type: 'techNode',
        position: calculateNodePosition(1, 4, 0),
        data: {
          name: 'PostgreSQL',
          icon: `${DEVICON_BASE_URL}/postgresql/postgresql-original.svg`,
          type: 'database'
        }
      },
      {
        id: 'transformation',
        type: 'techNode',
        position: calculateNodePosition(2, 4, 0),
        data: {
          name: 'Python',
          icon: `${DEVICON_BASE_URL}/python/python-original.svg`,
          type: 'data'
        }
      },
      {
        id: 'visualization',
        type: 'techNode',
        position: calculateNodePosition(3, 4, 0),
        data: {
          name: 'Grafana',
          icon: `${DEVICON_BASE_URL}/grafana/grafana-original.svg`,
          type: 'visualization'
        }
      }
    ],
    edges: [
      {
        id: 'ingestion-warehouse',
        source: 'ingestion',
        target: 'warehouse',
        type: 'smoothstep',
        animated: true
      },
      {
        id: 'warehouse-transformation',
        source: 'warehouse',
        target: 'transformation',
        type: 'smoothstep',
        animated: true
      },
      {
        id: 'transformation-visualization',
        source: 'transformation',
        target: 'visualization',
        type: 'smoothstep',
        animated: true
      }
    ]
  },
  {
    id: 'modern-frontend',
    name: 'Modern Frontend Stack',
    description: 'Next.js with TypeScript, Tailwind CSS, and modern tooling',
    category: 'frontend',
    nodes: [
      {
        id: 'framework',
        type: 'techNode',
        position: calculateNodePosition(1, 3, 0),
        data: {
          name: 'Next.js',
          icon: `${DEVICON_BASE_URL}/nextjs/nextjs-original.svg`,
          type: 'frontend'
        }
      },
      {
        id: 'language',
        type: 'techNode',
        position: calculateNodePosition(0, 3, 1),
        data: {
          name: 'TypeScript',
          icon: `${DEVICON_BASE_URL}/typescript/typescript-original.svg`,
          type: 'frontend'
        }
      },
      {
        id: 'styling',
        type: 'techNode',
        position: calculateNodePosition(2, 3, 1),
        data: {
          name: 'Tailwind CSS',
          icon: `${DEVICON_BASE_URL}/tailwindcss/tailwindcss-plain.svg`,
          type: 'frontend'
        }
      }
    ],
    edges: [
      {
        id: 'framework-language',
        source: 'framework',
        target: 'language',
        type: 'smoothstep',
        animated: true
      },
      {
        id: 'framework-styling',
        source: 'framework',
        target: 'styling',
        type: 'smoothstep',
        animated: true
      }
    ]
  },
  {
    id: 'python-ml',
    name: 'Python ML Stack',
    description: 'Machine Learning stack with Python, PyTorch, and FastAPI',
    category: 'ml',
    nodes: [
      {
        id: 'ml-framework',
        type: 'techNode',
        position: calculateNodePosition(1, 4, 0),
        data: {
          name: 'PyTorch',
          icon: `${DEVICON_BASE_URL}/pytorch/pytorch-original.svg`,
          type: 'ml'
        }
      },
      {
        id: 'api',
        type: 'techNode',
        position: calculateNodePosition(2, 4, 0),
        data: {
          name: 'FastAPI',
          icon: `${DEVICON_BASE_URL}/fastapi/fastapi-original.svg`,
          type: 'backend'
        }
      },
      {
        id: 'language',
        type: 'techNode',
        position: calculateNodePosition(0, 4, 0),
        data: {
          name: 'Python',
          icon: `${DEVICON_BASE_URL}/python/python-original.svg`,
          type: 'language'
        }
      },
      {
        id: 'database',
        type: 'techNode',
        position: calculateNodePosition(3, 4, 0),
        data: {
          name: 'MongoDB',
          icon: `${DEVICON_BASE_URL}/mongodb/mongodb-original.svg`,
          type: 'database'
        }
      }
    ],
    edges: [
      {
        id: 'language-ml',
        source: 'language',
        target: 'ml-framework',
        type: 'smoothstep',
        animated: true
      },
      {
        id: 'ml-api',
        source: 'ml-framework',
        target: 'api',
        type: 'smoothstep',
        animated: true
      },
      {
        id: 'api-db',
        source: 'api',
        target: 'database',
        type: 'smoothstep',
        animated: true
      }
    ]
  },
  {
    id: 'devops',
    name: 'DevOps Pipeline',
    description: 'Modern DevOps pipeline with Docker, Kubernetes, and monitoring',
    category: 'devops',
    nodes: [
      {
        id: 'container',
        type: 'techNode',
        position: calculateNodePosition(0, 4, 0),
        data: {
          name: 'Docker',
          icon: `${DEVICON_BASE_URL}/docker/docker-original.svg`,
          type: 'devops'
        }
      },
      {
        id: 'orchestration',
        type: 'techNode',
        position: calculateNodePosition(1, 4, 0),
        data: {
          name: 'Kubernetes',
          icon: `${DEVICON_BASE_URL}/kubernetes/kubernetes-plain.svg`,
          type: 'devops'
        }
      },
      {
        id: 'ci',
        type: 'techNode',
        position: calculateNodePosition(2, 4, 0),
        data: {
          name: 'Jenkins',
          icon: `${DEVICON_BASE_URL}/jenkins/jenkins-original.svg`,
          type: 'devops'
        }
      },
      {
        id: 'monitoring',
        type: 'techNode',
        position: calculateNodePosition(3, 4, 0),
        data: {
          name: 'Grafana',
          icon: `${DEVICON_BASE_URL}/grafana/grafana-original.svg`,
          type: 'monitoring'
        }
      }
    ],
    edges: [
      {
        id: 'container-orchestration',
        source: 'container',
        target: 'orchestration',
        type: 'smoothstep',
        animated: true
      },
      {
        id: 'orchestration-ci',
        source: 'orchestration',
        target: 'ci',
        type: 'smoothstep',
        animated: true
      },
      {
        id: 'ci-monitoring',
        source: 'ci',
        target: 'monitoring',
        type: 'smoothstep',
        animated: true
      }
    ]
  }
];

export const getTemplateById = (id: string): StackTemplate | undefined => {
  return stackTemplates.find(template => template.id === id);
};

export const templateToStack = (template: StackTemplate): TechStack => {
  return {
    id: `${template.id}-${Date.now()}`,
    name: `${template.name} Stack`,
    description: template.description,
    nodes: template.nodes,
    edges: template.edges,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};
